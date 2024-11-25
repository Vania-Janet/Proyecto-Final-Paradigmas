"use client";

import { createTheme } from "@mui/material/styles"; // Es necesario importar los estilos de MUI

export const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#dc004e",
    },
    text: {
      light: "#566573",
    },
  },
  typography: {
    fontFamily: "Arial, Sans-serif",
  },
});
