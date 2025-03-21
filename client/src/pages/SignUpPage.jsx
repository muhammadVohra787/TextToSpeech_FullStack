import { useState } from 'react';
import { TextField, Container, Stack, Paper, Button, Modal, Box, Typography, MenuItem, CircularProgress, LinearProgress, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import { usePost } from '../api/tanstack-get-post.js';
import { useNavigate } from 'react-router-dom';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
}));

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const securityQuestions = [
  "What is your pet's name?",
  "What city were you born in?",
  "What is your mother's maiden name?",
  "What was your first car?"
];

const SignUp = () => {
  const navigate = useNavigate();
  const { isPending, mutateAsync } = usePost();
  const [step, setStep] = useState(1);
  const [signUp, setSignUp] = useState({
    fullName: '',
    email: '',
    password: '',
    sq1: '',
    sa1: '',
    sq2: '',
    sa2: '',
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setSignUp({ ...signUp, [e.target.name]: e.target.value });
  };

  const validateStepOne = () => {
    let newErrors = {};
    if (!signUp.fullName.trim()) newErrors.fullName = 'This field is required';
    if (!signUp.email.trim()) newErrors.email = 'This field is required';
    if (signUp.email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(signUp.email)) {
      newErrors.email = 'Invalid email format (e.g. a@b.com)';
    }
    if (!signUp.password.trim()) newErrors.password = 'This field is required';
    if (signUp.password.length < 4) newErrors.password = 'Password must be at least 4 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStepTwo = () => {
    let newErrors = {};
    if (!signUp.sq1 || !signUp.sa1.trim()) newErrors.sq1 = 'Question and answer required';
    if (!signUp.sq2 || !signUp.sa2.trim()) newErrors.sq2 = 'Question and answer required';
    if (signUp.sq1 === signUp.sq2) newErrors.sq2 = 'Questions must be different';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStepOne()) setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async () => {
    if (!validateStepTwo()) return;

    try {
      await mutateAsync({ postData: signUp, url: 'users/create_user' }).then((res) => {
        console.log(res)
        setModalMessage(res.data.message);
        setModalOpen(true);

        if (res.data.success) navigate('/login');
      });
    } catch (error) {
      setModalMessage('Sign-up failed. Please try again.');
      setModalOpen(true);
    }
  };

  return (
    <Container>
      <Typography variant="h6" textAlign="center" gutterBottom>
        Sign Up
      </Typography>

      <LinearProgress
        variant="determinate"
        value={step === 1 ? 50 : 100}
        sx={{
          height: 8,
          borderRadius: 5,
          marginBottom: 2,
          backgroundColor: "#f0f0f0",
          "& .MuiLinearProgress-bar": {
            backgroundColor: "#969693",
          },
        }}
      />

      {step === 1 ? (
        <Stack spacing={2}>
          <Item>
            <TextField
              label="Full Name"
              variant="filled"
              name="fullName"
              value={signUp.fullName}
              onChange={handleChange}
              fullWidth
              error={!!errors.fullName}
              helperText={errors.fullName}
              sx={{ input: { color: 'black' } }}
            />
          </Item>
          <Item>
            <TextField
              label="Email"
              variant="filled"
              name="email"
              value={signUp.email}
              onChange={handleChange}
              fullWidth
              error={!!errors.email}
              helperText={errors.email}
              sx={{ input: { color: 'black' } }}
            />
          </Item>
          <Item>
            <TextField
              label="Password"
              variant="filled"
              type="password"
              name="password"
              value={signUp.password}
              onChange={handleChange}
              fullWidth
              error={!!errors.password}
              helperText={errors.password}
              sx={{ input: { color: 'black' } }}
            />
          </Item>
          <Button variant="contained" onClick={handleNext} sx={{ width: '100%' }}>
            Next
          </Button>
        </Stack>
      ) : (
        <Stack spacing={5}>
          <Item>
            <TextField
              select
              label="Security Question 1"
              variant="filled"
              name="sq1"
              value={signUp.sq1}
              onChange={handleChange}
              fullWidth
              error={!!errors.sq1}
              helperText={errors.sq1}
              sx={{
                backgroundColor: '#f0f0f0',
                '& .MuiInputBase-input.MuiSelect-select': {
                  color: 'black',
                  textAlign: 'left',
                },
              }}

            >
              {securityQuestions.map((q, index) => (
                <MenuItem key={index} value={q} sx={{ textAlign: 'left', color: 'black' }}>
                  {q}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Answer"
              variant="filled"
              name="sa1"
              value={signUp.sa1}
              onChange={handleChange}
              fullWidth
              error={!!errors.sa1}
              helperText={errors.sa1}
              sx={{
                backgroundColor: '#f0f0f0',
                '& .MuiInputBase-input': { color: 'black' },
              }}
            />
          </Item>
          <Item>
            <TextField
              select
              label="Security Question 2"
              variant="filled"
              name="sq2"
              value={signUp.sq2}
              onChange={handleChange}
              fullWidth
              error={!!errors.sq2}
              helperText={errors.sq2}
              sx={{
                '& .MuiInputBase-input.MuiSelect-select': {
                  color: 'black',
                  textAlign: 'left',
                },
              }}
            >
              {securityQuestions.map((q, index) => (
                <MenuItem key={index} value={q} sx={{ textAlign: 'left', color: 'black' }}>
                  {q}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Answer"
              variant="filled"
              name="sa2"
              value={signUp.sa2}
              onChange={handleChange}
              fullWidth
              error={!!errors.sa2}
              helperText={errors.sa2}
              sx={{
                '& .MuiInputBase-input': { color: 'black' },
              }}
            />
          </Item>


          {/* Go Back Button */}
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={handleBack} sx={{ flex: 1 }}>
              Go Back
            </Button>
            <Button variant="contained" onClick={handleSubmit} disabled={isPending} sx={{ flex: 1 }}>
              {isPending ? <CircularProgress size={24} /> : 'Submit'}
            </Button>
          </Stack>
        </Stack>
      )}
      <Typography sx={{ mt: 2 }}>
        Already have an account?{" "}
        <Link href="/" underline="hover" sx={{ color: "white" }}>
          Login here
        </Link>
      </Typography>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6">{modalMessage}</Typography>
          <Button onClick={() => setModalOpen(false)} sx={{ mt: 2 }} variant="contained">
            Close
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default SignUp;
