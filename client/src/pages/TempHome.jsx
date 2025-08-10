import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Typography, Box, Grid, Paper, Avatar, Stack, Divider } from '@mui/material';
import { PlayCircleOutline, Accessibility, Devices } from '@mui/icons-material';

const TempHome = () => {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 4,
          px: { xs: 3, md: 8 },
          py: { xs: 6, md: 10 },
          textAlign: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
          color: 'white',
        }}
     >
        <Typography variant="h2" sx={{ fontWeight: 700, letterSpacing: 0.5 }} gutterBottom>
          TextToSpeech
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 800, mx: 'auto', mb: 4 }}>
          Convert text and images into lifelike speech. Fast. Accessible. Developer-friendly.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            to="/login"
            sx={{ px: 4, py: 1.5, fontWeight: 600, borderRadius: 2 }}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            component={Link}
            to="/docs"
            sx={{ px: 4, py: 1.5, borderRadius: 2, color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}
          >
            Learn More
          </Button>
        </Stack>
      </Box>

      {/* About Section */}
      <Box sx={{ mt: { xs: 6, md: 10 }, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          About the Project
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 800, mx: 'auto' }}>
          TextToSpeech_FullStack is designed to empower everyone with the ability to
          turn text and images into lifelike speech instantly. Built with modern technology
          and a user-first approach, it helps streamline workflows, enhance accessibility,
          and make digital content more interactive.
        </Typography>
      </Box>

      {/* Key Features Section */}
      <Box sx={{ mt: { xs: 6, md: 8 } }}>
        <Typography variant="h4" align="center" gutterBottom>
          Key Features
        </Typography>
        <Grid container spacing={4} justifyContent="center" sx={{ flexWrap: 'nowrap', overflowX: 'auto' }}>
          {[{
            icon: <PlayCircleOutline sx={{ fontSize: 40, color: 'primary.main' }} />,
            title: 'Speech Synthesis',
          }, {
            icon: <Accessibility sx={{ fontSize: 40, color: 'primary.main' }} />,
            title: 'Full-Stack Integration',
          }, {
            icon: <Devices sx={{ fontSize: 40, color: 'primary.main' }} />,
            title: 'User-Friendly Interface',
          }].map((f, i) => (
            <Grid key={i} item xs={4} sm={4} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  textAlign: 'left',
                  height: '100%',
                  transition: 'transform 180ms ease, box-shadow 180ms ease',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                  {f.icon}
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{f.title}</Typography>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ mt: { xs: 6, md: 10 }, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          What Our Users Say
        </Typography>
        <Grid container spacing={3} justifyContent="center" sx={{ flexWrap: 'nowrap' }}>
          {[
            { name: 'John Doe', img: 'https://randomuser.me/api/portraits/men/32.jpg', quote: 'Integrating speech synthesis into our app was effortless and impactful.' },
            { name: 'Jane Smith', img: 'https://randomuser.me/api/portraits/women/44.jpg', quote: 'Sleek interface and reliable performance. It boosted our team productivity.' },
            { name: 'Lara Smith', img: 'https://randomuser.me/api/portraits/women/42.jpg', quote: 'Simple to use and powerful under the hood — highly recommended.' },
          ].map((t, i) => (
            <Grid key={i} item xs={4} sm={4} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  height: '100%'
                }}
              >
                <Avatar src={t.img} alt={t.name} sx={{ width: 56, height: 56, mx: 'auto', mb: 2 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{t.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  “{t.quote}”
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Call to Action Section */}
      <Box
        sx={{
          mt: { xs: 6, md: 10 },
          textAlign: 'center',
          p: { xs: 4, md: 6 },
          borderRadius: 4,
          background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
          color: 'white'
        }}
      >
        <Typography variant="h4" gutterBottom>
          Ready to Try It Out?
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9, mb: 3 }}>
          Join teams already transforming their content with TextToSpeech_FullStack.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            to="/login"
            sx={{ px: 4, py: 1.5, fontWeight: 600, borderRadius: 2 }}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            component={Link}
            to="/signup"
            sx={{ px: 4, py: 1.5, borderRadius: 2, color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}
          >
            Create Account
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default TempHome;
