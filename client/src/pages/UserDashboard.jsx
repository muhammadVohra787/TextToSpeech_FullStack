import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Typography, Box, Card, CardContent } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const UserDashboard = () => {
  return (
    <Container sx={{ backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
      <Box sx={{ marginTop: 5, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Welcome to the Future of Speech! 🎤
        </Typography>
        <Typography variant="h6" paragraph sx={{ color: '#666' }}>
          Transform text and images into speech with ease. Select an option below to get started!
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
          <Card sx={{ maxWidth: 300, cursor: 'pointer', transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.05)' } }}>
            <CardContent>
              <Typography variant="h6" align="center" sx={{ marginBottom: 2 }}>
                Text-to-Speech
              </Typography>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/textToSpeech"
                sx={{ width: '100%' }}
                startIcon={<VolumeUpIcon />}
              >
                Go
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ maxWidth: 300, cursor: 'pointer', transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.05)' } }}>
            <CardContent>
              <Typography variant="h6" align="center" sx={{ marginBottom: 2 }}>
                Image-to-Speech
              </Typography>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/imageToSpeech"
                sx={{ width: '100%' }}
                startIcon={<CameraAltIcon />}
              >
                Go
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default UserDashboard;
