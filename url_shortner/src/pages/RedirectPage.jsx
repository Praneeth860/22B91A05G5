import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import { UrlService } from "../services/urlService.js";

const RedirectPage = () => {
  const { shortCode } = useParams();
  const [status, setStatus] = useState("loading"); // loading, redirecting, error
  const [error, setError] = useState("");

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const urlData = UrlService.getUrlByShortCode(shortCode);

        if (!urlData) {
          setStatus("error");
          setError("Short URL not found or has expired");
          return;
        }

        if (urlData.expiresAt <= Date.now()) {
          setStatus("error");
          setError("This short URL has expired");
          return;
        }

        // Record the click
        UrlService.recordClick(shortCode);

        // Set status to redirecting
        setStatus("redirecting");

        // Small delay to show the redirecting message
        setTimeout(() => {
          window.location.href = urlData.originalUrl;
        }, 1000);
      } catch (error) {
        console.error("Redirect error:", error);
        setStatus("error");
        setError("An error occurred while processing the redirect");
      }
    };

    if (shortCode) {
      handleRedirect();
    } else {
      setStatus("error");
      setError("Invalid short URL");
    }
  }, [shortCode]);

  return (
    <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
      {status === "loading" && (
        <Box>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="h6">Processing your request...</Typography>
        </Box>
      )}

      {status === "redirecting" && (
        <Box>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Redirecting...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You will be redirected shortly. If nothing happens, your browser may
            be blocking the redirect.
          </Typography>
        </Box>
      )}

      {status === "error" && (
        <Box>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Typography variant="body2" color="text.secondary">
            Please check the URL and try again, or contact the person who shared
            this link.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default RedirectPage;
