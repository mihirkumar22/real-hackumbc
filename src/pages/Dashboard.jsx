import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useUserContext } from "../contexts/UserContext";
import CustomNavBar from "../components/CustomNavbar";
import backgroundImage from "../components/images/tree-bg.png";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

import "./Dashboard.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
    const { userData } = useUserContext();
    const navigate = useNavigate();
    const [mobileView, setMobileView] = useState(false);
    const [timeRange, setTimeRange] = useState("week");
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [chartType, setChartType] = useState("line");

    // Responsive check
    useEffect(() => {
        const handleViewCheck = () => setMobileView(window.innerWidth <= 600);
        window.addEventListener("resize", handleViewCheck);
        handleViewCheck();
        return () => window.removeEventListener("resize", handleViewCheck);
    }, []);

    // Prepare chart data based on dailyTimeSpent
    useEffect(() => {
        if (!userData || !userData.dailyTimeSpent) return;

        const today = new Date();
        let labels = [];
        let data = [];

        if (timeRange === "week") {
            for (let i = 6; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(today.getDate() - i);
                const key = d.toISOString().split("T")[0];
                labels.push(`${d.getMonth() + 1}/${d.getDate()}`);
                data.push(userData.dailyTimeSpent[key] || 0);
            }
        } else if (timeRange === "month") {
            for (let i = 29; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(today.getDate() - i);
                const key = d.toISOString().split("T")[0];
                labels.push(`${d.getMonth() + 1}/${d.getDate()}`);
                data.push(userData.dailyTimeSpent[key] || 0);
            }
        } else if (timeRange === "year") {
            for (let i = 11; i >= 0; i--) {
                const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
                const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
                labels.push(`${d.getMonth() + 1}/${d.getFullYear()}`);
                let monthSum = 0;
                Object.keys(userData.dailyTimeSpent).forEach(dateKey => {
                    if (dateKey.startsWith(monthKey)) {
                        monthSum += userData.dailyTimeSpent[dateKey];
                    }
                });
                data.push(monthSum);
            }
        }

        setChartData({
            labels,
            datasets: [
                {
                    label: "Time Spent (minutes)",
                    data,
                    borderColor: "rgba(34, 197, 94, 1)", // Green theme
                    backgroundColor: "rgba(34, 197, 94, 0.2)",
                    fill: true,
                    tension: 0.3,
                    pointBackgroundColor: "rgba(34, 197, 94, 1)",
                    pointBorderColor: "rgba(255, 255, 255, 1)",
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }
            ]
        });
    }, [timeRange, userData]);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { 
                position: "top",
                labels: {
                    color: "#374151",
                    font: {
                        size: 14,
                        weight: "bold"
                    }
                }
            },
            title: { 
                display: true, 
                text: "Learning Progress Dashboard",
                color: "#374151",
                font: {
                    size: 18,
                    weight: "bold"
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: "rgba(156, 163, 175, 0.3)"
                },
                ticks: {
                    color: "#374151"
                }
            },
            x: {
                grid: {
                    color: "rgba(156, 163, 175, 0.3)"
                },
                ticks: {
                    color: "#374151"
                }
            }
        }
    };

    return (
        <div className="dashboard-container" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh' }}>
            <CustomNavBar />

            <div className="dashboard-content">
                {/* Welcome Section with Streak Animation */}
                <div className="welcome-section">
                    <div className="welcome-info">
                        <h2 className="dashboard-welcome">
                            Welcome back, {userData?.userName || userData?.email}! 🌱
                        </h2>
                        <div className="streak-info">
                            <span className="streak-text">Current Streak: {userData?.currentStreak || 0} days</span>
                            {userData?.currentStreak > 0 && (
                                <div className="fire-animation">
                                    <DotLottieReact
                                        src="https://lottie.host/52cd968e-d260-4e19-85d6-2b5a20fb82f4/fQg9uc6mtQ.lottie"
                                        loop
                                        autoplay
                                        style={{ width: '40px', height: '40px' }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <Card className={`dashboard-card ${mobileView ? "mobile" : ""}`} style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', border: 'none', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' }}>
                    <Card.Body>
                        {/* Chart Type Toggle */}
                        <div className="chart-type-buttons">
                            <Button
                                className={`chart-type-btn ${chartType === "line" ? "active" : ""}`}
                                onClick={() => setChartType("line")}
                                style={{ backgroundColor: chartType === "line" ? '#22c55e' : '#6b7280', border: 'none' }}
                            >
                                Line Chart
                            </Button>
                            <Button
                                className={`chart-type-btn ${chartType === "bar" ? "active" : ""}`}
                                onClick={() => setChartType("bar")}
                                style={{ backgroundColor: chartType === "bar" ? '#22c55e' : '#6b7280', border: 'none' }}
                            >
                                Bar Chart
                            </Button>
                        </div>

                        <div className="time-range-buttons">
                            <Button
                                className={`time-range-btn ${timeRange === "week" ? "active" : ""}`}
                                onClick={() => setTimeRange("week")}
                                style={{ backgroundColor: timeRange === "week" ? '#22c55e' : '#6b7280', border: 'none' }}
                            >
                                Past Week
                            </Button>
                            <Button
                                className={`time-range-btn ${timeRange === "month" ? "active" : ""}`}
                                onClick={() => setTimeRange("month")}
                                style={{ backgroundColor: timeRange === "month" ? '#22c55e' : '#6b7280', border: 'none' }}
                            >
                                Past Month
                            </Button>
                            <Button
                                className={`time-range-btn ${timeRange === "year" ? "active" : ""}`}
                                onClick={() => setTimeRange("year")}
                                style={{ backgroundColor: timeRange === "year" ? '#22c55e' : '#6b7280', border: 'none' }}
                            >
                                Past Year
                            </Button>
                        </div>

                        <div className="chart-container" style={{ backgroundColor: 'white', borderRadius: '15px', padding: '20px', margin: '20px 0', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.05)' }}>
                            {chartType === "line" ? (
                                <Line data={chartData} options={chartOptions} />
                            ) : (
                                <Bar data={chartData} options={chartOptions} />
                            )}
                        </div>

                        <div className="dashboard-buttons">
                            <Button
                                className="dashboard-btn"
                                onClick={() => navigate("/learn")}
                                style={{ backgroundColor: '#22c55e', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: 'bold' }}
                            >
                                Continue Learning 📚
                            </Button>
                            <Button
                                className="dashboard-btn"
                                onClick={() => navigate("/edit-profile")}
                                style={{ backgroundColor: '#6b7280', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: 'bold' }}
                            >
                                Edit Profile 👤
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
}
