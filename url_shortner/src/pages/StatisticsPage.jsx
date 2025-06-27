import { useState, useEffect } from "react";
import { Container, Alert, Snackbar } from "@mui/material";
import StatisticsTable from "../components/StatisticsTable.jsx";
import { UrlService } from "../services/urlService.js";

const StatisticsPage = () => {
  const [urlsWithAnalytics, setUrlsWithAnalytics] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = () => {
    try {
      const analytics = UrlService.getAllAnalytics();
      setUrlsWithAnalytics(analytics);
    } catch (error) {
      console.error("Error loading statistics:", error);
      setSnackbar({
        open: true,
        message: "Error loading statistics",
        severity: "error",
      });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <StatisticsTable urlsWithAnalytics={urlsWithAnalytics} />

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

export default StatisticsPage;
