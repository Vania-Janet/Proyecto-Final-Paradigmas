"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { Container, Button, Typography, Paper, Pagination, Rating, Dialog, Chip, CircularProgress} from '@mui/material';
import Grid from '@mui/material/Grid2';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation'

export default function SearchBar() {
  // Estados para manejar la entrada de búsqueda, los resultados y la paginación
  const [inputValue, setInputValue] = React.useState('');
  const [results, setResults] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [selectedMovie, setSelectedMovie] = React.useState(null); // Estado para la película seleccionada
  const [dialogOpen, setDialogOpen] = React.useState(false); // Estado para controlar el diálogo
  const itemsPerPage = 6;
  const [minYear, setMinYear] = React.useState(null); // Año mínimo
  const [maxYear, setMaxYear] = React.useState(null); // Año máximo
  const [minRating, setMinRating] = React.useState(0); // Calificación mínima
  const [sortOrder, setSortOrder] = React.useState('recent'); // Orden: 'recent' o 'rating'
  const raterouter = useRouter();
  const recommendrouter = useRouter();
  const [loading, setLoading] = useState(false); // Estado para la animación de carga


  // Función para realizar la solicitud al backend
  const searchMovies = async () => {
    if (inputValue.trim() === '') {
      alert('Por favor, ingrese un término de búsqueda.');
      return;
    }
    setLoading(true); // Activa la animación de carga
    try {
      const response = await fetch(`http://localhost:5000/search_movie?query=${inputValue}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
        setPage(1);
      } else {
        console.error('Error al realizar la búsqueda');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }finally {
      setLoading(false); // Asegúrate de desactivar la animación al finalizar
    }
  };
  const filterAndSortMovies = () => {
    let filteredMovies = results;
  
    // Filtro por año
    if (minYear) {
      filteredMovies = filteredMovies.filter(
        (movie) => new Date(movie.release_date).getFullYear() >= minYear
      );
    }
    if (maxYear) {
      filteredMovies = filteredMovies.filter(
        (movie) => new Date(movie.release_date).getFullYear() <= maxYear
      );
    }
  
    // Filtro por calificación
    filteredMovies = filteredMovies.filter(
      (movie) => movie.vote_average >= minRating
    );
  
    // Ordenamiento
    if (sortOrder === 'rating') {
      filteredMovies.sort((a, b) => b.vote_average - a.vote_average);
    }
     
    else if (sortOrder === 'recent') {
      filteredMovies.sort(
        (a, b) => new Date(b.release_date) - new Date(a.release_date)
      );
    } 

  
    return filteredMovies;
  };
  

  // Función para manejar el cambio de página
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Función para abrir el diálogo
  const openDialog = (movie) => {
    setSelectedMovie(movie);
    setDialogOpen(true);
  };

  // Función para cerrar el diálogo
  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedMovie(null);
  };

  // Obtener los elementos de la página actual
  const paginatedResults = filterAndSortMovies().slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Navegación con datos de la película seleccionada
  const handleNavigate = (pa, movie) => {
    if (pa === "rate" && movie) {
      const url = `/rate?id=${encodeURIComponent(movie.movie_id)}&title=${encodeURIComponent(movie.title)}&overview=${encodeURIComponent(
        movie.overview
      )}&poster_url=${encodeURIComponent(movie.poster_url)}&release_date=${encodeURIComponent(
        movie.release_date
      )}&genres=${encodeURIComponent(JSON.stringify(movie.genres))}`;
      raterouter.push(url);
    }
  };
  

  return (
    <Container sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Box display="flex" flexDirection="column" alignItems="center" minHeight="100vh">
        <Autocomplete
          freeSolo
          id="search-bar"
          options={inputValue.length >= 1 ? results.map((movie) => `${movie.title} (${new Date(movie.release_date).getFullYear()})`) : []}
          onInputChange={(event, value) => setInputValue(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search for a movie"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                style: { borderRadius: 20 },
              }}
              sx={{ width: 400 }}
            />
          )}
        />

<Button
        variant="contained"
        onClick={searchMovies}
        disabled={loading} // Desactiva el botón mientras está cargando
        sx={{ position: 'relative', mt:3}}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" sx={{ position: 'absolute', mt:3}} />
        ) : (
          'Search'
        )}
      </Button>

        {results.length > 0 && (
  <Box display="flex" justifyContent="center" gap={2} mt={3}>
    {/* Filtros de año */}
    <TextField
      label="Min Year"
      type="number"
      onChange={(e) => setMinYear(Number(e.target.value))}
      sx={{ width: 150 }}
    />
    <TextField
      label="Max Year"
      type="number"
      onChange={(e) => setMaxYear(Number(e.target.value))}
      sx={{ width: 150 }}
    />

    {/* Filtro por calificación */}
    <TextField
      label="Lowest Rating"
      type="number"
      onChange={(e) => setMinRating(Number(e.target.value))}
      sx={{ width: 150 }}
    />

    {/* Orden */}
    <TextField
      select
      label="Sort by"
      value={sortOrder}
      onChange={(e) => setSortOrder(e.target.value)}
      SelectProps={{ native: true }}
      sx={{ width: 200 }}
    >
      <option value="recent">Latesr</option>
      <option value="rating">Best Rated</option>
    </TextField>
  </Box>
)}




        {/* Mostrar resultados */}
        {results.length > 0 && (
          <Box mt={4} sx={{ textAlign: 'center', width: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Search Results:
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              {paginatedResults.map((movie, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 2,
                      textAlign: "center",
                      height: 450,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "space-between",
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                        transform: "scale(1.05)",
                        transition: "transform 0.4s ease-in-out",
                        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
                      },
                    }}
                    onClick={() => openDialog(movie)} // Abre el diálogo al hacer clic
                  >
                    {movie.poster_url && (
                      <Box sx={{ mb: 2 }}>
                        <Image
                          src={movie.poster_url}
                          alt={movie.title}
                          width={200}
                          height={300}
                          style={{ borderRadius: 8 }}
                        />
                      </Box>
                    )}
                    <Typography variant="subtitle1">{movie.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {new Date(movie.release_date).getFullYear()}
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <Rating
                        name="movie-rating"
                        value={movie.vote_average / 2}
                        precision={0.5}
                        readOnly
                      />
                      <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                        {movie.vote_average.toFixed(1)}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Paginación */}
            <Box mt={4}>
              <Pagination
                count={Math.ceil(results.length / itemsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </Box>
        )}

{selectedMovie && (
  <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="md">
    <Box display="flex" flexDirection="column" p={3}>
      {/* Contenido del diálogo */}
      <Box display="flex" mt={2}>
        {/* Sección de la imagen */}
        <Box flex="1" mr={2}>
          <Image
            src={selectedMovie.poster_url}
            alt={selectedMovie.title}
            width={300}
            height={450}
            style={{ borderRadius: 8 }}
          />
        </Box>

        {/* Sección de contenido */}
        <Box flex="2">
          <Typography variant="h4" gutterBottom>
            {selectedMovie.title}
          </Typography>
          <Box mb={2} display="flex" flexWrap="wrap">
            {selectedMovie.genres.map((genre, index) => (
              <Chip key={index} label={genre} color="primary" sx={{ mr: 1, mb: 1 }} />
            ))}
          </Box>

          <Typography variant="body1" gutterBottom>
            {selectedMovie.overview}
          </Typography>

          

          {/* Mostrar video si se hace clic en "Ver Video" */}
          {selectedMovie.video_url && (
            <Box mt={3}>
              <Typography variant="h6" gutterBottom>
                Trailer
              </Typography>
              <Box
                sx={{
                  position: 'relative',
                  paddingBottom: '56.25%', // Aspect ratio 16:9
                  height: 0,
                  overflow: 'hidden',
                }}
              >
                <iframe
                  src={selectedMovie.video_url.replace('watch?v=', 'embed/')}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                  }}
                ></iframe>
              </Box>
            </Box>
          )}

          {/* Botones de acción */}
          <Box display="flex" justifyContent="flex-end" sx={{ mt: 5 }} gap={2}>
            <Button
            variant="contained"
              color="primary"
              onClick={() => handleNavigate("rate", selectedMovie)}
            >
              Rate movie
            </Button>
            

            {/* Botón de cierre */}
            <Button variant="contained" color="error" onClick={closeDialog}>
              Close
            </Button>
          </Box>



        </Box>
      </Box>
    </Box>
  </Dialog>
)}





      </Box>
    </Container>
  );
}
