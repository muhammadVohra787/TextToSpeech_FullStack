import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Link,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { usePost } from "../api/tanstack-get-post";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { useNavigate, useLocation } from "react-router-dom";


const SignInPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const signInContext = useSignIn();
  const [signIn, setSignIn] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: "", success: false });
  const { isPending, mutateAsync } = usePost();

  // Handle input change
  const handleChange = (e) => {
    setSignIn({ ...signIn, [e.target.name]: e.target.value });

    // Remove error message when user starts typing
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  // Validate inputs
  const validate = () => {
    let newErrors = {};
    if (!signIn.email) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(signIn.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!signIn.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission (optionally with provided credentials)
  const signInSubmit = async (creds) => {
    const isCreds =
      !!creds &&
      typeof creds === "object" &&
      "email" in creds &&
      "password" in creds;
    const data = isCreds ? creds : signIn;
    console.log(data);
    // Validate provided data
    let newErrors = {};
    if (!data.email) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!data.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length !== 0) return;

    try {
      const res = await mutateAsync({ postData: data, url: "users/sign_in" });
      setMessage({
        text: res.data.message,
        success: res.data.success,
      });

      if (res.data.success) {
        signInContext({
          expireIn: res.data.expires,
          userState: {
            user_id: res.data?.user_id,
            admin: res.data?.admin,
            email: res.data?.email
          },
          auth: {
            token: res.data.token,
            type: "Bearer",
          },
        });

        const redirectTo =
          location.state?.from?.pathname ||
          (res.data?.admin ? "/dashboard/admin" : "/dashboard/user");
        navigate(redirectTo, { replace: true });
      }
    } catch (error) {
      setMessage({ text: "An error occurred. Please try again.", success: false });
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom data-testid="signInTitle">
          Sign In
        </Typography>
        <Stack spacing={2}>
          {/* Fields using map */}
          {[
            { name: "email", label: "Email", type: "email" },
            { name: "password", label: "Password", type: "password" },
          ].map((field, index) => (
            <TextField
              key={index}
              label={field.label}
              variant="outlined"
              type={field.type}
              name={field.name}
              value={signIn[field.name]}
              onChange={handleChange}
              autoComplete={field.name === "email" ? "email" : "current-password"}
              fullWidth
              InputProps={{ style: { color: "black" } }}
              error={!!errors[field.name]}
              helperText={errors[field.name]}
            />
          ))}

          <Button
            variant="contained"
            onClick={() => signInSubmit()}
            disabled={isPending}
            fullWidth
          >
            {isPending ? <CircularProgress size={24} /> : "Sign In"}
          </Button>

          {message.text && (
            <Typography color={message.success ? "success.main" : "error.main"}>
              {message.text}
            </Typography>
          )}
        </Stack>

        {/* Quick demo sign-in buttons */}
        <Stack spacing={1} sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => signInSubmit({ email: "admin@g.com", password: "admin123" })}
            disabled={isPending}
            fullWidth
          >
            Use Demo Admin Creds
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => signInSubmit({ email: "demo@g.com", password: "demo123" })}
            disabled={isPending}
            fullWidth
          >
            Use Demo User Creds
          </Button>
        </Stack>

        <Typography sx={{ mt: 2 }}>
          Don't have an account?{" "}
          <Link href="/signUp" underline="hover" sx={{ color: "white" }}>
            Register here
          </Link>
        </Typography>

        <Typography
          onClick={() => navigate(`/forgotPassword`)}
          sx={{
            mt: 2,
            textDecoration: "underline",
            cursor: "pointer",
            color: "white"
          }}
        >
          Forgot Password?
        </Typography>

      </Paper>
    </Container>
  );
};

export default SignInPage;
