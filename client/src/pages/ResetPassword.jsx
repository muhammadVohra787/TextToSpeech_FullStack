import { Button, CircularProgress, Container, TextField,Box, Alert} from "@mui/material"
import { useEffect, useState } from "react"
import useAuthUser from "react-auth-kit/hooks/useAuthUser"
import { useNavigate } from "react-router-dom"
import { usePostAuthenticated } from "../api/tanstack-get-post"
const ResetPassword = () => {
    const navigate = useNavigate()
    const useAuth = useAuthUser()
    const email = useAuth?.email
    const userId = useAuth?.user_id
    const [passwords, setPasswords] = useState({ old_password: "", new_password: "" })
    const [errors, setErrors] = useState({});
    const [response, setResponse] = useState({type: "", msg:""})
    const { isPending, mutateAsync } = usePostAuthenticated()
    useEffect(() => {
        if (!userId || !email) {
            navigate("/unauth")
            console.log("unauthorized Entry")
        }
    }, [userId, email])

    const handleInput = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    }
    const handleSubmit = async () => {
        const newErrors = {}; // Initialize an object to collect errors
        if (passwords?.old_password?.length < 3) {
            newErrors.old_password = "Old password should be bigger than 3 characters";
        }
        if (passwords?.new_password?.length < 3) {
            newErrors.new_password = "New password should be bigger than 3 characters";
        }

        // If there are errors, update the state
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return; // Prevent form submission if there are errors
        }
        try{
            const res = await mutateAsync({postData: {...passwords, email, userId}, url:"users/reset_password"})
            console.log(res)
            if(res?.data?.success){
                console.log(res)                
                setResponse({type:"success", msg:"Redirecting: Password was changed"})
                setErrors({})
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            }else{
                setResponse({type:"error", msg:`${res?.data?.message}`})
            }
        }catch(e){
            setResponse({type:"error", msg:"internal server error"})
            console.log("error came", e)
            console.error(e);
        }
        
        // Proceed with the form submission logic here
    };
    return (

        <>
            {isPending ? <Box sx={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', display: 'flex' }}>

                <CircularProgress color='secondary' sx={{ mt: 10 }} size={60} />
            </Box> :
                
                <Container>
                    {response?.msg && <Alert sx={{mt:1, mb:2}} severity={response?.type}>{response?.msg}</Alert>}
                    <TextField
                        label="Enter old password"
                        variant="filled"
                        value={passwords.old_password}
                        errors={errors.old_password}
                        onChange={handleInput}
                        name="old_password"
                        fullWidth
                        type="password"
                        error={!!errors.old_password}
                        helperText={errors.old_password}
                        
                    />

                    <TextField
                        label="Enter new password"
                        variant="filled"
                        value={passwords.new_password}
                        errors={errors.new_password}
                        onChange={handleInput}
                        name="new_password"
                        type="password"
                        fullWidth
                        error={!!errors.new_password}
                        helperText={errors.new_password}
                        sx={{mt:2, mb:2}}
                    />
                    <Button onClick={() => handleSubmit()} variant="contained" fullWidth sx={{ mt: 1 }}>
                        Submit
                    </Button>

                </Container>
            }
        </>

    )
}

export default ResetPassword