// themes.js

import { createTheme } from "@mui/material/styles";

// General theme used for the main SenecAtlas homepage
export const generalTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: "#f9f9f9",
      paper: "#ffffff",
    },
    primary: {
      main: "#1976d2",
      contrastText: "#ffffff",
      light: "#e3f2fd",
    },
    secondary: {
      main: "#9c27b0",
      contrastText: "#ffffff",
    },
    text: {
      primary: "#000000",
      secondary: "#666666",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    button: {
      textTransform: "none",
    },
  },
});

// Theme used for the Biomass section
export const biomassTheme = createTheme({
  palette: {
    primary: {
      main: "#388E3C",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#E3B444",
      contrastText: "#000000",
    },
  },
});

// Theme used for the Solar section
export const solarTheme = createTheme({
  palette: {
    primary: {
      main: "#f39f18",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#176096",
      contrastText: "#ffffff",
    },
  },
});

// Theme used for the Integral section
export const integralTheme = createTheme({
  palette: {
    primary: {
      main: "#5C9EAD",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#EEEEEE",
      contrastText: "#000000",
    },
  },
});
