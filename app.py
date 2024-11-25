from flask import Flask, jsonify, request
from flask_cors import CORS
from tmdbv3api import TMDb, Movie,Genre,Search
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)  # Habilita CORS para permitir solicitudes desde el frontend

# Configura tu clave de API de TMDB
tmdb = TMDb()
tmdb.api_key = 'aqui va tu api key'
tmdb.language = 'en-US'  # Configura el idioma
movie = Movie()
genre = Genre()

pipeline_lr = joblib.load('modelos/pipeline_lr_model.joblib')
knn_model = joblib.load('modelos/knn_model.joblib')
tfidf_vectorizer = joblib.load('modelos/vectorizador.joblib')
movies = pd.read_csv('movies.csv')
matriz_caracteristicas = joblib.load('modelos/matriz_caracteristicas.joblib')

movies['combined_features'] = (
    movies['genres'].fillna('') + ' ' +
    movies['keywords'].fillna('') + ' ' +
    movies['overview'].fillna('')
)


def get_genres():
    genre_list = genre.movie_list()
    # Crear un diccionario {id: nombre}
    return {g['id']: g['name'] for g in genre_list}

# Almacenar los géneros como un diccionario
genres_dict = get_genres()


def find_similar_movies(movie_id, num_recommendations=10):
    try:
        # Convertir `movie_id` al tipo adecuado
        movie_id = int(movie_id)  # Asegúrate de que sea entero

        # Buscar la película de referencia
        pelicula_referencia = movies[movies['id'] == movie_id]
        if pelicula_referencia.empty:
            return {"error": "Movie not found"}

        # Verificar que `combined_features` exista
        if 'combined_features' not in movies.columns:
            raise ValueError("`combined_features` column is missing in movies dataset. Please generate it first.")

        # Extraer características combinadas de la película
        combined_features = pelicula_referencia['combined_features'].iloc[0]

        # Transformar las características con el vectorizador previamente cargado
        vector_features = tfidf_vectorizer.transform([combined_features])

        # Buscar vecinos más cercanos utilizando el modelo KNN
        distancias, indices = knn_model.kneighbors(vector_features, n_neighbors=num_recommendations + 1)

        # Obtener películas similares (excluyendo la película misma)
        similares_indices = indices.flatten()[1:]
        peliculas_similares = movies.iloc[similares_indices]

        # Formatear los resultados
        results = []
        for _, pelicula in peliculas_similares.iterrows():
            # Obtener video asociado desde TMDB
            video_url = None
            videos = movie.videos(pelicula['id'])  
            if videos:
                for video in videos['results']:
                    if video.get('site') == 'YouTube':  
                        video_url = f"https://www.youtube.com/watch?v={video['key']}"
                        break

            # Agregar los detalles al resultado
            results.append({
                "movie_id": pelicula['id'],
                "title": pelicula['title'],
                "release_date": pelicula['release_date'],
                "overview": pelicula['overview'],
                "rating": pelicula['vote_average'],
                "vote_average": pelicula['vote_average'],
                "backdrop_url": f"https://image.tmdb.org/t/p/w500{pelicula.get('backdrop_path')}" if pelicula.get('backdrop_path') else None,
                "poster_url": f"https://image.tmdb.org/t/p/w500{pelicula.get('poster_path')}" if pelicula.get('poster_path') else None,
                "genres": pelicula['genres'].split(', ') if isinstance(pelicula['genres'], str) else [],
                "keywords": pelicula.get('keywords', ''),
                "video_url": video_url  # Incluir el URL del video
            })

        return results

    except Exception as e:
        print(f"Error while fetching similar movies: {e}")
        return []











@app.route('/search_movie', methods=['GET'])
def search_movie():
    query = request.args.get('query', '').strip()
    if not query:
        return jsonify({"error": "El parámetro 'query' es obligatorio"}), 400

    try:
        # Realizar la búsqueda con el término
        search_results = movie.search(query)

        results = []

        for m in search_results:
            if m.adult:
                continue  # Saltar las películas donde 'adult' es True
            # Filtrar películas que tengan overview, poster_path, y backdrop_path no nulos
            if m.overview and m.poster_path and m.backdrop_path:
                # Obtener los géneros si están disponibles
                movie_genres = [genres_dict.get(genre_id) for genre_id in getattr(m, 'genre_ids', [])]

                video_url = None
                videos = movie.videos(m.id)
                if videos:
                    for video in videos['results']:
                        if video.get('site') == 'YouTube':  # Solo considerar videos de YouTube
                            video_url = f"https://www.youtube.com/watch?v={video['key']}"
                            break


                # Crear el diccionario de resultados
                results.append({
                    "movie_id": m.id,
                    'title': m.title,
                    "release_date": m.release_date,
                    "overview": m.overview,
                    "rating": m.vote_average,
                    "vote_average": m.vote_average,
                    "backdrop_url": f"https://image.tmdb.org/t/p/w500{m.backdrop_path}" if m.backdrop_path else None,
                    "poster_url": f"https://image.tmdb.org/t/p/w500{m.poster_path}" if m.poster_path else None,
                    "genres": movie_genres,
                    "video_url": video_url
                })

        # Filtrar por calificación mínima (opcional: pasar por query params)
        min_rating = float(request.args.get('min_rating', 5))
        results = [r for r in results if r['rating'] >= min_rating]
        
        # Ordenar por popularidad (vote_average) o por fecha de lanzamiento (release_date)
        sort_by = request.args.get('sort_by', 'popularity')  # 'popularity' o 'release_date'
        reverse_sort = request.args.get('sort_order', 'desc') == 'desc'

        if sort_by == 'release_date':
            results.sort(key=lambda x: x['release_date'] or '', reverse=reverse_sort)
        elif sort_by == 'popularity':
            results.sort(key=lambda x: x['rating'], reverse=reverse_sort)


        return jsonify(results), 200

    except Exception as e:
        return jsonify({"error": "Error al procesar la solicitud", "details": str(e)}), 500
    


@app.route('/submit_review', methods=['POST'])
def submit_review():
    data = request.get_json()
    review = data.get('review')
    movie_id = data.get('id')  # ID de la película

    if not review or not movie_id:
        return jsonify({'error': 'Review and movie ID are required'}), 400

    try:
        # Clasificar la reseña
        sentiment = pipeline_lr.predict([review])[0]  
        print(sentiment)

        if sentiment == 0:  # Si es positiva
            # Obtener recomendaciones si es positiva

            return jsonify({
                'sentiment': 'positive',
                'message': 'Thank you for your positive review!',
            }), 200
        else:
            return jsonify({
                'sentiment': 'negative',
                'message': 'We are sorry to hear that you had a negative experience.'
            }), 200

    except Exception as e:
        print(f"Error during review processing: {e}")
        return jsonify({'error': 'An error occurred while processing the review.'}), 500
    


@app.route('/get_recommendations', methods=['GET'])
def get_recommendations():
    movie_id = request.args.get('id')
    if not movie_id:
        return jsonify({'error': 'Movie ID is required'}), 400

    try:
        # Obtener películas similares usando el método de TMDb
        similar_movies = find_similar_movies(movie_id)
        return jsonify({'similar_movies': similar_movies}), 200
    except Exception as e:
        print(f"Error fetching recommendations: {e}")
        return jsonify({'error': 'Failed to fetch recommendations'}), 500





if __name__ == '__main__':
    app.run(debug=True)