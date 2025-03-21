import { useEffect, useState } from "react";
import { usePost, usePostAuthenticated } from "../api/tanstack-get-post";
import { TextField, Box, Button, Container, Typography, Alert, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
const ForgotPassword = () => {
    const authUser = useAuthUser()
    console.log(authUser)

    const [email, setEmail] = useState("");
    const { isPending: gettingQuestions, mutateAsync: getUserQuestions } = usePost();
    const { isPending: gettingForgotPassword, mutateAsync: forgotPasswordMutation } = usePost();
    const [userQuestions, setUserQuestions] = useState(null);
    const [answers, setAnswers] = useState({ sa1: "", sa2: "", password: "" });
    const [error, setError] = useState("");
    const [response, setResponse] = useState({ type: "", msg: "" })
    const navigate = useNavigate();
    // Email validation regex
    const isValidEmail = (email) => {
        return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
    };

    const handleGetQuestions = async () => {
        if (!email) {
            setError("Email is required");
            return;
        }
        if (!isValidEmail(email)) {
            setError("Invalid email format");
            return;
        }
        setError(""); // Clear errors before API call

        try {
            const res = await getUserQuestions({ postData: { email }, url: "users/get_questions_by_email" });
            if (res?.data?.sq1) {
                setUserQuestions(res.data);
                setResponse({ type: "success", msg: "Questions Recieved" })
            } else {
                setResponse({ type: "error", msg: `${res?.data?.message}` })
                setError(res?.data?.message);
            }
        } catch (e) {
            console.error(e);
            setError("An error occurred while fetching questions.");
        }
    };

    const handleAnswerChange = (e) => {
        setAnswers({ ...answers, [e.target.name]: e.target.value });
    };

    const handleQuestionsAnswers = async () => {
        if (answers?.sal?.length < 3 || answers?.sa2?.length < 3 || answers?.password.length < 3) {
            setError("Everything should be atleast 3 letters");
            return
        }
        let variables = {
            ...userQuestions,
            email: email,
            ...answers
        }
        setError("")

        const res = await forgotPasswordMutation({ postData: variables, url: "users/forgot_password" })
        if (res?.data?.success) {
            console.log(res)
            setResponse({ type: "success", msg: "Redirecting: Password Changed, you can use your new password from now on" })
            setTimeout(() => {
                navigate("/");
            }, 2000);
        } else {
            setResponse({ type: "error", msg: "One or Both question's answer do not match, try again." })
        }
    }

    return (
        <Container>
            {response?.msg && <Alert
                severity={response?.type}
                sx={{ mt: 2, mb: 2 }}
            >
                {response?.msg}

            </Alert>}
            {gettingQuestions || gettingForgotPassword ? (<Box sx={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', display: 'flex' }}>

                <CircularProgress color='secondary' sx={{ mt: 10 }} size={60} />
            </Box>) : (<>
                <br></br>
                {!userQuestions?.sq1 && !userQuestions?.sq2 ? (
                    <Container>
                        <TextField
                            label="Email"
                            variant="filled"
                            name="email"
                            value={email}
                            fullWidth
                            onChange={(e) => setEmail(e.target.value)}
                            error={!!error}
                            helperText={error}
                            sx={{mb:2}}
                        />
                        <Button
                            variant="contained"
                            onClick={handleGetQuestions}
                            fullWidth
                            disabled={gettingQuestions}
                        >
                            Submit
                        </Button>
                    </Container>
                ) : (
                    <>
                        <Typography variant="h6">Answer Security Questions</Typography>
                        <Typography
                            color="warning"
                            sx={{ mt: 2, mb: 2 }}
                        >
                            If answers are correct this will be your new password.

                        </Typography>

                        <TextField
                            label="Enter New Password"
                            variant="filled"
                            name="password"
                            type="password"
                            value={answers.password}
                            fullWidth
                            error={!!error}
                            helperText={error}
                            onChange={handleAnswerChange}
                        />
                        <Typography sx={{ mt: 4, mb: 1 }}>{userQuestions.sq1}</Typography>
                        <TextField
                            label="Security Question 1"
                            variant="filled"
                            name="sa1"
                            value={answers.sa1}
                            fullWidth
                            error={!!error}
                            helperText={error}
                            onChange={handleAnswerChange}
                        />
                        <Typography sx={{ mt: 4, mb: 1 }}>{userQuestions.sq2}</Typography>
                        <TextField
                            label="Security Question 2"
                            variant="filled"
                            name="sa2"
                            value={answers.sa2}
                            fullWidth
                            error={!!error}
                            helperText={error}
                            onChange={handleAnswerChange}
                        />

                        <Button
                            variant="contained"
                            fullWidth
                            disabled={!answers.sa1 || !answers.sa2}
                            sx={{ mt: 2 }}
                            onClick={handleQuestionsAnswers}
                        >
                            Submit Answers
                        </Button>
                    </>
                )}</>)}

        </Container>
    );
};

export default ForgotPassword;
