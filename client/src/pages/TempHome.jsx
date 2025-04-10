import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Typography, Box, Grid, Paper, Avatar } from '@mui/material';
import { PlayCircleOutline, Accessibility, Devices, Info } from '@mui/icons-material';

const TempHome = () => {
  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Paper
        elevation={3}
        sx={{
          padding: 6,

          textAlign: 'center',
          borderRadius: 4,
          
          color: 'white',
        }}
      >
        <Typography variant="h3" gutterBottom>
          TextToSpeech
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#ddd', marginBottom: 4 }}>
          Empowering communication through seamless text-to-speech solutions.
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
          TextToSpeech_FullStack is designed to empower everyone with the ability to
          turn text and images into lifelike speech instantly. Built with modern technology
          and a user-first approach, it helps streamline workflows, enhance accessibility,
          and make digital content more interactive.
        </Typography>
      </Box>

      {/* Key Features Section */}
      <Box sx={{ marginTop: 6 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Key Features
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={2} sx={{ padding: 3, borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <PlayCircleOutline sx={{ fontSize: 50, color: '#3f51b5', marginBottom: 2 }} />
              <Typography variant="h6">🎙️ Speech Synthesis</Typography>
              <Typography variant="body2" sx={{ color: '#555' }}>
                Convert text into natural-sounding speech in real-time.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={2} sx={{ padding: 3, borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Accessibility sx={{ fontSize: 50, color: '#3f51b5', marginBottom: 2 }} />
              <Typography variant="h6">🧠 Full Stack Integration</Typography>
              <Typography variant="body2" sx={{ color: '#555' }}>
                Seamlessly integrated front-end and back-end technologies for scalability.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={2} sx={{ padding: 3, borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Devices sx={{ fontSize: 50, color: '#3f51b5', marginBottom: 2 }} />
              <Typography variant="h6">🌐 User-Friendly Interface</Typography>
              <Typography variant="body2" sx={{ color: '#555' }}>
                Simple, intuitive, and accessible design for all users.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ marginTop: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          What Our Users Say
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
              <Avatar sx={{ width: 60, height: 60, margin: '0 auto', marginBottom: 2 }} src="https://randomuser.me/api/portraits/men/32.jpg" />
              <Typography variant="h6">John Doe</Typography>
              <Typography variant="body2" sx={{ color: '#555', marginBottom: 2 }}>
                "This platform made it incredibly easy to integrate speech synthesis into our app. It's been a game-changer!"
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
              <Avatar sx={{ width: 60, height: 60, margin: '0 auto', marginBottom: 2 }} src="https://randomuser.me/api/portraits/women/44.jpg" />
              <Typography variant="h6">Jane Smith</Typography>
              <Typography variant="body2" sx={{ color: '#555', marginBottom: 2 }}>
                "A fantastic tool with a sleek interface. It helps our team communicate effectively and increases productivity."
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
              <Avatar sx={{ width: 60, height: 60, margin: '0 auto', marginBottom: 2 }} src="https://randomuser.me/api/portraits/women/42.jpg" />
              <Typography variant="h6">Lara Smith</Typography>
              <Typography variant="body2" sx={{ color: '#555', marginBottom: 2 }}>
                "A fantastic tool with a sleek interface. It helps our team communicate effectively and increases productivity."
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Call to Action Section */}
      <Box sx={{ marginTop: 8, textAlign: 'center', padding: 6, borderRadius: 4 }}>
        <Typography variant="h4" color="white" gutterBottom>
          Ready to Try It Out?
        </Typography>
        <Typography variant="body1" color="white" sx={{ marginBottom: 3 }}>
          Join thousands of users who are already transforming their content with TextToSpeech_FullStack.
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
      </Box>
    </Container>
  );
};

export default TempHome;
