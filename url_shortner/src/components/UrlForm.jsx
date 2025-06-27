import { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Typography,
  Alert,
  Box,
  IconButton,
} from "@mui/material";
import { Add, Clear } from "@mui/icons-material";

const UrlForm = ({ onUrlCreated, urlCount, maxUrls = 5 }) => {
  const [urls, setUrls] = useState([
    { originalUrl: "", validityMinutes: 30, customShortCode: "" },
  ]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const addUrlField = () => {
    if (urls.length < maxUrls) {
      setUrls([
        ...urls,
        { originalUrl: "", validityMinutes: 30, customShortCode: "" },
      ]);
    }
  };

  const removeUrlField = (index) => {
    if (urls.length > 1) {
      const newUrls = urls.filter((_, i) => i !== index);
      setUrls(newUrls);
      // Clear errors for removed field
      const newErrors = { ...errors };
      delete newErrors[index];
      setErrors(newErrors);
    }
  };

  const updateUrl = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);

    // Clear error for this field
    if (errors[index]) {
      const newErrors = { ...errors };
      delete newErrors[index];
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    urls.forEach((url, index) => {
      if (!url.originalUrl.trim()) {
        newErrors[index] = "URL is required";
        isValid = false;
      } else if (!/^https?:\/\/.+/.test(url.originalUrl.trim())) {
        newErrors[index] =
          "Please enter a valid URL starting with http:// or https://";
        isValid = false;
      } else if (url.validityMinutes < 1 || url.validityMinutes > 10080) {
        newErrors[index] =
          "Validity period must be between 1 minute and 1 week (10080 minutes)";
        isValid = false;
      } else if (
        url.customShortCode &&
        !/^[a-zA-Z0-9]{3,20}$/.test(url.customShortCode)
      ) {
        newErrors[index] =
          "Custom shortcode must be alphanumeric and 3-20 characters long";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const results = [];
    const newErrors = {};

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      try {
        const result = await onUrlCreated(
          url.originalUrl.trim(),
          parseInt(url.validityMinutes),
          url.customShortCode.trim() || null
        );
        results.push(result);
      } catch (error) {
        newErrors[i] = error.message;
      }
    }

    if (Object.keys(newErrors).length === 0) {
      // Reset form on success
      setUrls([{ originalUrl: "", validityMinutes: 30, customShortCode: "" }]);
    }

    setErrors(newErrors);
    setLoading(false);
  };

  const canAddMore = urls.length < maxUrls && urlCount + urls.length < maxUrls;

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Create Shortened URLs
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          You can create up to {maxUrls} URLs. Currently active: {urlCount}
        </Typography>

        <form onSubmit={handleSubmit}>
          {urls.map((url, index) => (
            <Box
              key={index}
              sx={{ mb: 3, p: 2, border: "1px solid #e0e0e0", borderRadius: 1 }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="subtitle2">
                      URL #{index + 1}
                    </Typography>
                    {urls.length > 1 && (
                      <IconButton
                        size="small"
                        onClick={() => removeUrlField(index)}
                      >
                        <Clear />
                      </IconButton>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Original URL"
                    placeholder="https://example.com/very-long-url"
                    value={url.originalUrl}
                    onChange={(e) =>
                      updateUrl(index, "originalUrl", e.target.value)
                    }
                    error={!!errors[index]}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Validity (minutes)"
                    type="number"
                    value={url.validityMinutes}
                    onChange={(e) =>
                      updateUrl(index, "validityMinutes", e.target.value)
                    }
                    inputProps={{ min: 1, max: 10080 }}
                    helperText="Default: 30 minutes, Max: 1 week"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Custom Shortcode (optional)"
                    placeholder="mycode123"
                    value={url.customShortCode}
                    onChange={(e) =>
                      updateUrl(index, "customShortCode", e.target.value)
                    }
                    helperText="Alphanumeric, 3-20 characters"
                  />
                </Grid>

                {errors[index] && (
                  <Grid item xs={12}>
                    <Alert severity="error">{errors[index]}</Alert>
                  </Grid>
                )}
              </Grid>
            </Box>
          ))}

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            {canAddMore && (
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={addUrlField}
              >
                Add Another URL
              </Button>
            )}

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ ml: "auto" }}
            >
              {loading
                ? "Creating..."
                : `Create ${urls.length} URL${urls.length > 1 ? "s" : ""}`}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default UrlForm;
