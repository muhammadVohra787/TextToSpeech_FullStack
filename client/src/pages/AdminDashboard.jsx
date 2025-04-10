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

import { format } from 'date-fns';
import { Container, Typography, Box, CircularProgress } from "@mui/material";

const AdminDashboard = () => {
    const [metrics, setMetrics] = useState([]);
    const [loading, setLoading] = useState(false);

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
        </Container>
    );
};

export default AdminDashboard;
