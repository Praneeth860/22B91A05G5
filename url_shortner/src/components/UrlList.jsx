import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Chip,
  Box,
  Alert,
  Snackbar,
  Divider
} from '@mui/material';
import { ContentCopy, Launch, Schedule } from '@mui/icons-material';

const UrlList = ({ urls }) => {
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setSnackbar({ open: true, message: 'Copied to clipboard!' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to copy to clipboard' });
    }
  };

  const formatDateTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getTimeRemaining = (expiresAt) => {
    const now = Date.now();
    const remaining = expiresAt - now;
    
    if (remaining <= 0) return 'Expired';
    
    const minutes = Math.floor(remaining / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h remaining`;
    if (hours > 0) return `${hours}h ${minutes % 60}m remaining`;
    return `${minutes}m remaining`;
  };

  const isExpired = (expiresAt) => expiresAt <= Date.now();

  if (urls.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Your Shortened URLs
          </Typography>
          <Alert severity="info">
            No URLs created yet. Create your first shortened URL above!
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Your Shortened URLs ({urls.length})
          </Typography>
          
          <List>
            {urls.map((url, index) => (
              <React.Fragment key={url.shortCode}>
                <ListItem
                  sx={{
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    py: 2,
                    opacity: isExpired(url.expiresAt) ? 0.6 : 1
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%', mb: 1 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="subtitle1" component="span">
                            {`${window.location.origin}/${url.shortCode}`}
                          </Typography>
                          <Chip
                            label={getTimeRemaining(url.expiresAt)}
                            size="small"
                            color={isExpired(url.expiresAt) ? 'error' : 'success'}
                            icon={<Schedule />}
                          />
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                          {url.originalUrl}
                        </Typography>
                      }
                    />
                    
                    <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                      <IconButton
                        size="small"
                        onClick={() => copyToClipboard(`${window.location.origin}/${url.shortCode}`)}
                        title="Copy shortened URL"
                      >
                        <ContentCopy />
                      </IconButton>
                      
                      {!isExpired(url.expiresAt) && (
                        <IconButton
                          size="small"
                          onClick={() => window.open(url.originalUrl, '_blank')}
                          title="Open original URL"
                        >
                          <Launch />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 2, fontSize: '0.875rem', color: 'text.secondary' }}>
                    <Typography variant="caption">
                      Created: {formatDateTime(url.createdAt)}
                    </Typography>
                    <Typography variant="caption">
                      Expires: {formatDateTime(url.expiresAt)}
                    </Typography>
                  </Box>
                </ListItem>
                
                {index < urls.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      />
    </>
  );
};

export default UrlList;