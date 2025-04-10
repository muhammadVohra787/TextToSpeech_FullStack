import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Typography, Box, Grid, Paper } from '@mui/material';

const TempHome = () => {
  return (
    <Container maxWidth="md">
      {/* Hero Section */}
      <Paper
        elevation={3}
        sx={{
          padding: 6,
          marginTop: 8,
          textAlign: 'center',
          borderRadius: 4,
          background: 'linear-gradient(135deg, #1f1c2c, #928dab)',
          color: 'white',
        }}
      >
        <Typography variant="h3" gutterBottom>
          TextToSpeech_FullStack
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#ddd', marginBottom: 4 }}>
          A modern solution built to solve real-world problems with simplicity and power.
        </Typography>

        <Button
          variant="contained"
          color="secondary"
          component={Link}
          to="/login"
          sx={{
            paddingX: 4,
            paddingY: 1.5,
            fontSize: '1rem',
            fontWeight: 500,
            borderRadius: 2,
          }}
        >
          Get Started
        </Button>
      </Paper>

      {/* About Section */}
      <Box sx={{ marginTop: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          About the Project
        </Typography>
        <Typography variant="body1" sx={{ color: '#444', maxWidth: 700, margin: '0 auto' }}>
          This project is designed to streamline your workflow and improve productivity.
          With a focus on usability and performance, it brings together the best practices in
          modern development to help users accomplish their tasks faster and smarter.
        </Typography>
      </Box>

      {/* Features Section */}
      <Box sx={{ marginTop: 6 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Key Features
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <Paper elevation={2} sx={{ padding: 3, borderRadius: 2 }}>
              <Typography variant="h6">🎙️ Speech Synthesis</Typography>
              <Typography variant="body2" sx={{ color: '#555' }}>
                Convert written text into natural-sounding speech instantly.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper elevation={2} sx={{ padding: 3, borderRadius: 2 }}>
              <Typography variant="h6">🧠 Full Stack Integration</Typography>
              <Typography variant="body2" sx={{ color: '#555' }}>
                Built with a modern tech stack from frontend to backend.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper elevation={2} sx={{ padding: 3, borderRadius: 2 }}>
              <Typography variant="h6">🌐 User-Friendly Interface</Typography>
              <Typography variant="body2" sx={{ color: '#555' }}>
                Clean and intuitive UI designed for accessibility and ease.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default TempHome;

