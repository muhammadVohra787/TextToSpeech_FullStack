import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

const Unauthorized = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 5000); // Redirect after 5 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        bgcolor: "#f8f9fa",
        backgroundColor:'black'
      }}
    >
      <Typography variant="h3" fontWeight="bold" color="error" mb={2}>
        Unauthorized Access
      </Typography>
      <Typography variant="h6" mb={3}>
        You do not have permission to view this page. Redirecting to login...
      </Typography>
      <img
        src="https://http.cat/401"
        alt="Unauthorized"
        width="400px"
        style={{ borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}
      />
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        onClick={() => navigate("/")}
      >
        Go to Login Now
      </Button>
    </Box>
  );
};

export default Unauthorized;
