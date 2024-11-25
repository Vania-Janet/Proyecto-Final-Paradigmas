"use client";

import { Box, Container, Grid2, Typography, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Image from "next/image";
import MovieIcon from "@mui/icons-material/Movie";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import GroupIcon from "@mui/icons-material/Group";
import StarIcon from "@mui/icons-material/Star";
import PublicIcon from "@mui/icons-material/Public";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

export default function About() {
  const theme = useTheme();
  return (
    <Container maxWidth="xl">
      <Grid container spacing={4} alignItems="center">
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            padding: { xs: 0, ms: "0 0 0 100px" },
          }}
        >
          <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold" }}>
            Our Story
          </Typography>
          <Box sx={{ borderBottom: "4px solid #ff5722", width: "50px" }} />
          <Typography
            variant="body1"
            sx={{ color: theme.palette.text.secondary, fontSize: "1.1rem" }}
            paragraph
          >
            Welcome to Cinema Paradiso, your ultimate destination for personalized movie recommendations. Our journey started with a mission to help movie enthusiasts find their next favorite film, no matter their taste or preferences.
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: theme.palette.text.secondary, fontSize: "1.1rem" }}
            paragraph
          >
            With cutting-edge AI algorithms, a global database of films, and a passionate team of cinephiles, Cinema Paradiso connects viewers with stories that inspire, entertain, and captivate. Join us as we redefine how you discover movies.
          </Typography>
        </Grid>
        <Grid
          size={{ xs: 12, md: 6 }}
          display="flex"
          alignItems="center" // vertical
          justifyContent="center" // horizontal
        >
          <Image
            src="/wp7990157.jpg"
            alt="Cinema Paradiso Image"
            width={500}
            height={300}
            priority
          />
        </Grid>
      </Grid>

      <Box
        sx={{
          mt: 6,
          mb: 8,
          background: "linear-gradient(to right, #ffff, #b5b5b5)",
          py: 8,
          width: "100%",
        }}
      >
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Our Impact
        </Typography>
        <Typography
          variant="body1"
          align="center"
          sx={{ color: theme.palette.text.secondary, fontSize: "1.1rem" }}
          paragraph
        >
          At Cinema Paradiso, we bring together technology and passion to create unforgettable movie experiences. Here's what makes us unique:
        </Typography>
        <Box
          sx={{
            borderBottom: "4px solid #ff5722",
            width: "50px",
            mb: 4,
            mx: "auto",
          }}
        />

        <Grid container spacing={4} justifyContent="center">
          <Grid size={{ xs: 12, sm: 4, md: 2 }} sx={{ textAlign: "center" }}>
            <MovieIcon sx={{ fontSize: 40, color: theme.palette.text.secondary, mb: 1 }} />
            <Typography variant="h4" align="center">
              100k+
            </Typography>
            <Typography
              variant="subtitle1"
              align="center"
              sx={{ color: theme.palette.text.secondary }}
            >
              Movies Recommended
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4, md: 2 }} sx={{ textAlign: "center" }}>
            <ThumbUpIcon sx={{ fontSize: 40, color: theme.palette.text.secondary, mb: 1 }} />
            <Typography variant="h4" align="center">
              95%
            </Typography>
            <Typography
              variant="subtitle1"
              align="center"
              sx={{ color: theme.palette.text.secondary }}
            >
              Positive Feedback
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4, md: 2 }} sx={{ textAlign: "center" }}>
            <GroupIcon sx={{ fontSize: 40, color: theme.palette.text.secondary, mb: 1 }} />
            <Typography variant="h4" align="center">
              50k
            </Typography>
            <Typography
              variant="subtitle1"
              align="center"
              sx={{ color: theme.palette.text.secondary }}
            >
              Happy Users
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4, md: 2 }} sx={{ textAlign: "center" }}>
            <StarIcon sx={{ fontSize: 40, color: theme.palette.text.secondary, mb: 1 }} />
            <Typography variant="h4" align="center">
              4.9/5
            </Typography>
            <Typography
              variant="subtitle1"
              align="center"
              sx={{ color: theme.palette.text.secondary }}
            >
              Average Rating
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4, md: 2 }} sx={{ textAlign: "center" }}>
            <PublicIcon sx={{ fontSize: 40, color: theme.palette.text.secondary, mb: 1 }} />
            <Typography variant="h4" align="center">
              150+
            </Typography>
            <Typography
              variant="subtitle1"
              align="center"
              sx={{ color: theme.palette.text.secondary }}
            >
              Countries Reached
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4, md: 2 }} sx={{ textAlign: "center" }}>
            <TrendingUpIcon sx={{ fontSize: 40, color: theme.palette.text.secondary, mb: 1 }} />
            <Typography variant="h4" align="center">
              Top Rated
            </Typography>
            <Typography
              variant="subtitle1"
              align="center"
              sx={{ color: theme.palette.text.secondary }}
            >
              Recommendation System
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
