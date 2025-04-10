import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Typography, Box, Card, CardContent } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const UserDashboard = () => {
  return (
    <Container sx={{ minHeight: '100vh' }}>
      <Box
        sx={{
          marginTop: 5,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center', // Centers vertically
          alignItems: 'center',      // Centers horizontally
          minHeight: '80vh',         // Take up most of the viewport height
        }}
      >
        <Typography variant="h3" gutterBottom>
          Welcome to the Future of Speech! 🎤
        </Typography>
        <Typography variant="h6" paragraph sx={{ color: '#666' }}>
          Transform text and images into speech with ease. Select an option below to get started!
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Link to="/textToSpeech" style={{ textDecoration: 'none' }}>
            <Card
              sx={{
                minWidth: 450,
                minHeight: 250,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.3s ease',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                borderRadius: '15px',
                '&:hover': { transform: 'scale(1.05)', boxShadow: '0 6px 30px rgba(0, 0, 0, 0.3)' },
                backgroundColor: '#1e1e1e',
              }}
            >
              <CardContent>
                <Typography variant="h5" align="center" sx={{ marginBottom: 2, color: '#fff' }}>
                  Text-to-Speech
                </Typography>
                <VolumeUpIcon sx={{ fontSize: 60, color: '#fff', marginBottom: 2 }} />
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    width: '100%',
                    padding: '12px 0',
                    fontSize: '16px',
                    textTransform: 'none',
                    visibility: 'hidden',
                  }}
                >
                  Go
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/imageToSpeech" style={{ textDecoration: 'none' }}>
            <Card
              sx={{
                minWidth: 450,
                minHeight: 250,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.3s ease',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                borderRadius: '15px',
                '&:hover': { transform: 'scale(1.05)', boxShadow: '0 6px 30px rgba(0, 0, 0, 0.3)' },
                backgroundColor: '#1e1e1e',
              }}
            >
              <CardContent>
                <Typography variant="h5" align="center" sx={{ marginBottom: 2, color: '#fff' }}>
                  Image-to-Speech
                </Typography>
                <CameraAltIcon sx={{ fontSize: 60, color: '#fff', marginBottom: 2 }} />
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    width: '100%',
                    padding: '12px 0',
                    fontSize: '16px',
                    textTransform: 'none',
                    visibility: 'hidden',
                  }}
                >
                  Go
                </Button>
              </CardContent>
            </Card>
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default UserDashboard;
