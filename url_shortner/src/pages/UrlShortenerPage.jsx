import { useState, useEffect } from "react";
import { Container, Grid, Alert, Snackbar } from "@mui/material";
import UrlForm from "../components/UrlForm.jsx";
import UrlList from "../components/UrlList.jsx";
import { UrlService } from "../services/urlService.js";

const UrlShortenerPage = () => {
  const [urls, setUrls] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    loadUrls();
  }, []);

  const loadUrls = () => {
    try {
      const allUrls = UrlService.getAllUrls();
      setUrls(allUrls);
    } catch (error) {
      console.error("Error loading URLs:", error);
      setSnackbar({
        open: true,
        message: "Error loading URLs",
        severity: "error",
      });
    }
  };

  const handleUrlCreated = async (
    originalUrl,
    validityMinutes,
    customShortCode
  ) => {
    try {
      const result = UrlService.createShortUrl(
        originalUrl,
        validityMinutes,
        customShortCode
      );
      loadUrls(); // Refresh the list
      setSnackbar({
        open: true,
        message: `Short URL created: ${result.shortUrl}`,
        severity: "success",
      });
      return result;
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: "error",
      });
      throw error; // Re-throw to let the form handle it
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <UrlForm
            onUrlCreated={handleUrlCreated}
            urlCount={urls.length}
            maxUrls={5}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <UrlList urls={urls} />
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UrlShortenerPage;
