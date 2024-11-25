"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Box, Typography, Chip, TextField, Button } from "@mui/material";
import { useState } from "react";

export default function RatePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const title = searchParams.get("title");
  const overview = searchParams.get("overview");
  const poster_url = searchParams.get("poster_url");
  const release_date = searchParams.get("release_date");
  const genres = JSON.parse(searchParams.get("genres") || "[]");
  
  const [review, setReview] = useState("");

  const handleReviewSubmit = async () => {
    if (!review.trim()) {
      alert("Please add a review before submitting!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/submit_review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          review,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        alert(data.message);

        // Verifica el sentimiento del análisis
        if (data.sentiment === "positive") {
          // Redirigir a la página de recomendaciones con el ID de la película
          router.push(`/recommend?id=${id}`);
        } else if (data.sentiment === "negative") {
          // Redirigir a la página principal
          router.push(`/`);
        } else {
          alert("Unable to determine sentiment. Please try again.");
        }
      } else {
        const error = await response.json();
        alert(error.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  return (
    <Box
      p={4}
      display="flex"
      flexDirection="column"
      alignItems="center"
      maxWidth="600px"
      margin="auto"
      boxShadow={3}
      borderRadius={4}
    >
      <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
        {title}
      </Typography>

      {poster_url && (
        <Box mb={3}>
          <img
            src={poster_url}
            alt={title}
            style={{ width: "300px", borderRadius: "8px" }}
          />
        </Box>
      )}

      <Box display="flex" flexWrap="wrap" justifyContent="center" mb={2}>
        {genres.map((genre, index) => (
          <Chip key={index} label={genre} color="primary" sx={{ mr: 1, mb: 1 }} />
        ))}
      </Box>

      <Typography variant="body1" textAlign="justify" mb={2}>
        {overview}
      </Typography>

      <Typography variant="body2" color="textSecondary" mb={3}>
        Release Date: {release_date}
      </Typography>

      <TextField
        label="Write your review"
        variant="outlined"
        multiline
        rows={4}
        fullWidth
        value={review}
        onChange={(e) => setReview(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleReviewSubmit}
        sx={{ alignSelf: "center" }}
      >
        Submit Review
      </Button>
    </Box>
  );
}
