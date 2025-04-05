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
            to="/login"
            sx={{ marginBottom: 2 }}
          >
            Login First
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default TempHome;
