import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        bgcolor: "black",
      }}
    >
      <Typography variant="h2" fontWeight="bold" color="error" mb={2}>
        404 - Page Not Found
      </Typography>
      <Typography variant="h6" mb={3}>
        Oops! The page you're looking for doesn't exist.
      </Typography>
      <img
        src="https://http.cat/404"
        alt="Not Found"
        width="600px"
        style={{ borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}
      />
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        onClick={() => navigate("/")}
      >
        Go to Home
      </Button>
    </Box>
  );
};

export default NotFound;
