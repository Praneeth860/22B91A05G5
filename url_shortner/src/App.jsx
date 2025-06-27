import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Box } from "@mui/material";
import Navigation from "./components/Navigation.jsx";
import UrlShortenerPage from "./pages/UrlShortenerPage.jsx";
import StatisticsPage from "./pages/StatisticsPage.jsx";
import RedirectPage from "./pages/RedirectPage.jsx";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
          <Routes>
            {/* Routes that need navigation */}
            <Route
              path="/"
              element={
                <>
                  <Navigation />
                  <UrlShortenerPage />
                </>
              }
            />
            <Route
              path="/statistics"
              element={
                <>
                  <Navigation />
                  <StatisticsPage />
                </>
              }
            />

            {/* Redirect route without navigation */}
            <Route path="/:shortCode" element={<RedirectPage />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
