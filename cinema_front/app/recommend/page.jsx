"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Dialog,
  Button,
  Chip,
  Rating,
  Pagination,
} from "@mui/material";
import Image from "next/image";
import Grid from '@mui/material/Grid2';

export default function RecommendPage() {
  const searchParams = useSearchParams();
  const movieId = searchParams.get("id");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(`http://localhost:5000/get_recommendations?id=${movieId}`);
        if (response.ok) {
          const data = await response.json();
          setRecommendations(Array.isArray(data.similar_movies) ? data.similar_movies : []);
        } else {
          console.error("Failed to fetch recommendations");
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchRecommendations();
    }
  }, [movieId]);

  const openDialog = (movie) => {
    setSelectedMovie(movie);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedMovie(null);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const paginatedMovies = Array.isArray(recommendations)
    ? recommendations.slice((page - 1) * itemsPerPage, page * itemsPerPage)
    : [];

  if (loading) {
    return (
      <Box p={4} textAlign="center">
        <Typography variant="h6">Loading recommendations...</Typography>
      </Box>
    );
  }

  return (
    <Box p={4} sx={{ textAlign: "center", width: "100%" }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
        Recommended Movies
      </Typography>
  
      {paginatedMovies.length > 0 ? (
        <Grid container spacing={3} justifyContent="center" sx={{ml:4}}>
          {paginatedMovies.map((movie, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper
                elevation={3}
                    sx={{
                      p: 2,
                      textAlign: "center",
                      height: 450,
                      width: 400,
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
                onClick={() => openDialog(movie)}
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
                  {movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}
                </Typography>
                <Box display="flex" alignItems="center">
                  <Rating
                    name="movie-rating"
                    value={movie.vote_average ? movie.vote_average / 2 : 0}
                    precision={0.5}
                    readOnly
                  />
                  <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                    {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>No recommendations available.</Typography>
      )}
  
      {recommendations.length > itemsPerPage && (
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination
            count={Math.ceil(recommendations.length / itemsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
  
      {selectedMovie && (
        <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="md">
          <Box display="flex" flexDirection="column" p={3}>
            <Box display="flex" mt={2}>
              <Box flex="1" mr={2}>
                <Image
                  src={selectedMovie.poster_url}
                  alt={selectedMovie.title}
                  width={300}
                  height={450}
                  style={{ borderRadius: 8 }}
                />
              </Box>
              <Box flex="2">
                <Typography variant="h4" gutterBottom>
                  {selectedMovie.title}
                </Typography>
                <Box mb={2} display="flex" flexWrap="wrap">
                  {selectedMovie.genres?.map((genre, index) => (
                    <Chip key={index} label={genre} color="primary" sx={{ mr: 1, mb: 1 }} />
                  ))}
                </Box>
                <Typography variant="body1" gutterBottom>
                  {selectedMovie.overview || "No overview available."}
                </Typography>
                {selectedMovie.video_url && (
                  <Box mt={3}>
                    <Typography variant="h6" gutterBottom>
                      Trailer
                    </Typography>
                    <Box
                      sx={{
                        position: "relative",
                        paddingBottom: "56.25%",
                        height: 0,
                        overflow: "hidden",
                      }}
                    >
                      <iframe
                        src={selectedMovie.video_url.replace("watch?v=", "embed/")}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                        }}
                      ></iframe>
                    </Box>
                  </Box>
                )}
                <Box display="flex" justifyContent="flex-end" sx={{ mt: 5 }} gap={2}>
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
  );
  
}
