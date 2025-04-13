import axios from "axios";
import { useEffect, useState } from "react";
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
import SignUp from "./SignUpPage";
import { format } from 'date-fns';
import { Container, Typography, Box, CircularProgress, Divider, Card, CardContent, Button } from "@mui/material";
import { usePostAuthenticated } from "../api/tanstack-get-post";
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
const AdminDashboard = () => {
    const authHeader = useAuthHeader();
    const [metrics, setMetrics] = useState([]);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [userAdded, setUserAdded]= useState(false)
    const { isPending: deletingUser, mutateAsync: deleteUser } = usePostAuthenticated();
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
        labels: metrics.map(item => item.date),  // Use the grouped date labels
        datasets: [
            {
                label: 'Model Usage',
                data: metrics.map(item => item.count), // The count of calls per date
                fill: true,
                borderColor: '#36A2EB',
                backgroundColor: 'rgb(19, 27, 49)',
                tension: 0.3,
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
    useEffect(() => {
        const fetchMetrics = async () => {
            setLoading(true);
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/users/get_usage", {
                    headers: {
                        Authorization: "Bearer <Your_Token_Here>",
                    },
                });
                console.log(response)
                const groupedData = groupByDate(response.data.data);
                setMetrics(groupedData);
            } catch (err) {
                console.error("Error fetching metrics:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
        fetchMetrics();

    }, []);

    // Function to group data by date and count occurrences
    const groupByDate = (data) => {
        const grouped = {};

        data.forEach(item => {
            const date = item.latest_created_at; // Already formatted as YYYY-MM-DD from backend
            if (!grouped[date]) {
                grouped[date] = 0;
            }
            grouped[date]++;
        });

        return Object.entries(grouped).map(([date, count]) => ({
            date: format(new Date(date), 'MMM dd, yyyy'), // Optional: pretty format
            count,
        }));
    };
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
            {loading ? (
                <CircularProgress />
            ) : (
                <Line data={data} options={options} />
            )}
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
                )} </Box>
            <Divider sx={{ my: 4 }} />
            <SignUp isCreatingUser={true} />
        </Container>
    );
};

export default AdminDashboard;
