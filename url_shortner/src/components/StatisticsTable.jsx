import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Collapse,
  Box,
  List,
  ListItem,
  ListItemText,
  Alert,
  TableSortLabel,
} from "@mui/material";
import {
  ExpandMore,
  ExpandLess,
  Schedule,
  Visibility,
} from "@mui/icons-material";

const StatisticsTable = ({ urlsWithAnalytics }) => {
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const toggleRowExpansion = (shortCode) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(shortCode)) {
      newExpanded.delete(shortCode);
    } else {
      newExpanded.add(shortCode);
    }
    setExpandedRows(newExpanded);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const formatDateTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getTimeRemaining = (expiresAt) => {
    const now = Date.now();
    const remaining = expiresAt - now;

    if (remaining <= 0) return "Expired";

    const minutes = Math.floor(remaining / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  const isExpired = (expiresAt) => expiresAt <= Date.now();

  const sortedUrls = [...urlsWithAnalytics].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case "totalClicks":
        aValue = a.analytics.totalClicks;
        bValue = b.analytics.totalClicks;
        break;
      case "expiresAt":
        aValue = a.expiresAt;
        bValue = b.expiresAt;
        break;
      default:
        aValue = a.createdAt;
        bValue = b.createdAt;
    }

    if (sortOrder === "asc") {
      return aValue - bValue;
    }
    return bValue - aValue;
  });

  if (urlsWithAnalytics.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            URL Statistics
          </Typography>
          <Alert severity="info">
            No URLs found. Create some shortened URLs to see statistics here!
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          URL Statistics ({urlsWithAnalytics.length} URLs)
        </Typography>

        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Short URL</TableCell>
                <TableCell>Original URL</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === "totalClicks"}
                    direction={sortBy === "totalClicks" ? sortOrder : "desc"}
                    onClick={() => handleSort("totalClicks")}
                  >
                    Clicks
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === "createdAt"}
                    direction={sortBy === "createdAt" ? sortOrder : "desc"}
                    onClick={() => handleSort("createdAt")}
                  >
                    Created
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === "expiresAt"}
                    direction={sortBy === "expiresAt" ? sortOrder : "desc"}
                    onClick={() => handleSort("expiresAt")}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedUrls.map((url) => (
                <React.Fragment key={url.shortCode}>
                  <TableRow
                    sx={{ opacity: isExpired(url.expiresAt) ? 0.6 : 1 }}
                  >
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: "monospace" }}
                      >
                        /{url.shortCode}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: 300,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={url.originalUrl}
                      >
                        {url.originalUrl}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={url.analytics.totalClicks}
                        size="small"
                        icon={<Visibility />}
                        color={
                          url.analytics.totalClicks > 0 ? "primary" : "default"
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDateTime(url.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getTimeRemaining(url.expiresAt)}
                        size="small"
                        color={isExpired(url.expiresAt) ? "error" : "success"}
                        icon={<Schedule />}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => toggleRowExpansion(url.shortCode)}
                        disabled={url.analytics.totalClicks === 0}
                      >
                        {expandedRows.has(url.shortCode) ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </IconButton>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={6} sx={{ py: 0 }}>
                      <Collapse
                        in={expandedRows.has(url.shortCode)}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ py: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Click Details ({url.analytics.clicks.length} clicks)
                          </Typography>

                          {url.analytics.clicks.length > 0 ? (
                            <List dense>
                              {url.analytics.clicks
                                .slice(0, 10)
                                .map((click, index) => (
                                  <ListItem key={index} sx={{ py: 0.5 }}>
                                    <ListItemText
                                      primary={formatDateTime(click.timestamp)}
                                      secondary={
                                        <Box
                                          sx={{
                                            display: "flex",
                                            gap: 2,
                                            flexWrap: "wrap",
                                          }}
                                        >
                                          <Typography variant="caption">
                                            Referrer: {click.referrer}
                                          </Typography>
                                          <Typography variant="caption">
                                            Location: {click.location}
                                          </Typography>
                                        </Box>
                                      }
                                    />
                                  </ListItem>
                                ))}
                              {url.analytics.clicks.length > 10 && (
                                <ListItem>
                                  <ListItemText
                                    primary={
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                      >
                                        ... and{" "}
                                        {url.analytics.clicks.length - 10} more
                                        clicks
                                      </Typography>
                                    }
                                  />
                                </ListItem>
                              )}
                            </List>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No clicks recorded yet
                            </Typography>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default StatisticsTable;
