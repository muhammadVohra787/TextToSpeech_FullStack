import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Typography, Box } from '@mui/material';

const TempHome = () => {
  return (
    <Container>
      <Box sx={{ marginTop: 5 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Welcome to the Home Page
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/textToSpeech"
            sx={{ marginBottom: 2 }}
          >
            Go to Text-to-Speech
          </Button>

          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/imageToSpeech"
            sx={{ marginBottom: 2 }}
          >
            Go to Image-to-Speech
          </Button>

          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/forgotPassword"
            sx={{ marginBottom: 2 }}
          >
            Forgot Password
          </Button>

          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/resetPassword"
            sx={{ marginBottom: 2 }}
          >
            Reset Password
          </Button>

          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/profile"
            sx={{ marginBottom: 2 }}
          >
            Profile
          </Button>

          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/unauth"
            sx={{ marginBottom: 2 }}
          >
            Unauthorized Page
          </Button>

          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/login"
            sx={{ marginBottom: 2 }}
          >
            Go to Sign In
          </Button>

          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="*"
            sx={{ marginBottom: 2 }}
          >
            Go to Not Found
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default TempHome;
