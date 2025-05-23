import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
const Navbar = () => {
  const isAuthenticated = useIsAuthenticated();
  const signOut = useSignOut();
  const navigate = useNavigate();
  const authUser = useAuthUser()
  const handleLogout = () => {
    signOut();
    navigate("/login");
  };
  const nav_url = authUser?.admin  ? "admin" : "user"
  console.log(`/dashboard/${nav_url}`)
  return (
    <AppBar position="static" sx={{ bgcolor: "black" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: "none", color: "white" }}>
            MyApp
          </Link>
        </Typography>

        <Box>
          {isAuthenticated ? (
            <>
              <Button color="inherit" component={Link} to={`/dashboard/${nav_url}`}>
                Dashboard
              </Button>
              <Button color="inherit" component={Link} to="/profile">
                Profile
              </Button>
              <Button color="inherit" component={Link} to="/textToSpeech">
                Text To Speech
              </Button>
              <Button color="inherit" component={Link} to="/imageToSpeech">
                Image To Speech
              </Button>

              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/forgotPassword">
                Forgot Password
              </Button>
              <Button color="inherit" component={Link} to="/login">
                Sign In
              </Button></>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
