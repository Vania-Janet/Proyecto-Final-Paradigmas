import { AppBar, Box, Button, Link, Toolbar, Typography } from "@mui/material";
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import Image from "next/image";

const navitems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
];
export default function AppbarGlobal() {
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
      <LocalMoviesIcon sx={{mr: 2}}/>
        <Typography
          variant="h6"
          noWrap
          component={Link}
          href="/"
          sx={{
            display: { xs: "none", md: "flex" },
            fontFamily: "monospace",
            fontWeight: 700,
            color: "inherit",
            letterSpacing: ".2rem",
          }}
        >
          Cinema Paradiso
        </Typography>
        <Box sx={{ ml: "auto", display: { xs: "block" } }}>
          {navitems.map((item) => (
            <Button
              key={item.label}
              component={Link}
              href={item.href}
              color="inherit"
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
