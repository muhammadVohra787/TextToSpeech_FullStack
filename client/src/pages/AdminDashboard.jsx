import axios from "axios";
import { usePostAuthenticated } from "../api/tanstack-get-post";
import { useEffect, useState } from "react";
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import SignUp from "./SignUpPage";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

import { format } from 'date-fns';
// ✅ MUI Imports
import { Container, Typography, Card, CardContent, Button, Box, Divider, CircularProgress } from "@mui/material";

const AdminDashboard = () => {
    const authHeader = useAuthHeader();
    const { isPending: deletingUser, mutateAsync: deleteUser } = usePostAuthenticated();
    const [users, setUsers] = useState([]);
    const [userAdded, setUserAdded]= useState(false)
    const [metrics , setMetrics] = useState({})
    ChartJS.register(
        LineElement,
        PointElement,
        CategoryScale,
        LinearScale,
        Title,
        Tooltip,
        Legend,
        Filler
    );

    const data = {
        labels: metrics.length > 0 ? metrics : null,
        datasets: [
        {
            label: 'Model Usage',
            data: Array.from({ length: metrics.length }, (_, i) => i + 1),
            fill: true, // This makes the area under the line be filled
            borderColor: '#36A2EB', // Line color
            backgroundColor: 'rgb(19, 27, 49)', // Fill color with transparency (adjust alpha as needed)
            tension: 0.3, // Smoothing of the line
        },
        ],
    };
    
    const options = {
        responsive: true,
        plugins: {
        legend: { position: 'top' },
        },
        scales: {
        x: {
            title: {
            display: true,
            text: 'Date',
            },
        },
        y: {
            title: {
            display: true,
            text: 'Visits',
            },
        },
        },
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/users/get_all_users', {
                    headers: {
                        Authorization: authHeader,
                    },
                });
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        const fetchMetrics= async()=>{
            try{
                const response = await axios.get("http://127.0.0.1:8000/api/users/get_usage",{
                    headers: {
                        Authorization: authHeader,
                    },
                })
                console.log(response)
                let x = response?.data?.data.map(item => {
                    const date = new Date(item.created_at);  // Convert string to Date object
                    return format(date, 'MMM dd, yyyy hh:mm a');
                  });
                  
                  setMetrics(x);
                console.log(typeof(x))
            } catch(err){
                console.log(err)
            }
        }
        fetchUsers();
        fetchMetrics();
    }, [userAdded]);

    const handleDelete = async (userId) => {
        try {
            const res = await deleteUser({ postData: { userId }, url: "users/delete_user" });
            setUsers(users.filter(user => user._id !== userId));
            console.log(res);
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Admin Dashboard
            </Typography>
            <Line data={data} options={options} />
            {/* <Doughnut data={metrics}/> */}
            <Box sx={{ my: 4 }}>
                {users && users.length > 0 ? (
                    users.map((user) => (
                        <Card key={user._id} variant="outlined" sx={{ mb: 2 }}>
                            <CardContent
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Box>
                                    <Typography variant="subtitle1">{user.fullName}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {user.email}
                                    </Typography>
                                </Box>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleDelete(user._id)}
                                    disabled={deletingUser}
                                >
                                    {deletingUser ? <CircularProgress size={20} color="inherit" /> : "Delete"}
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Typography variant="body1" color="text.secondary" align="center">
                        No users found.
                    </Typography>
                )}
            </Box>

            <Divider sx={{ my: 4 }} />
            <SignUp isCreatingUser={true} setUserAdded={setUserAdded}/>
        </Container>
    );
};

export default AdminDashboard;
