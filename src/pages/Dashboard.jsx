import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import { useUserContext } from "../contexts/UserContext";
import CustomNavBar from "../components/CustomNavbar";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Button } from "../components/ui/button";

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
        <div className="dashboard-container">
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
                                variant={chartType === "line" ? "default" : "secondary"}
                                onClick={() => setChartType("line")}
                                className="chart-type-btn"
                            >
                                Line Chart
                            </Button>
                            <Button
                                variant={chartType === "bar" ? "default" : "secondary"}
                                onClick={() => setChartType("bar")}
                                className="chart-type-btn"
                            >
                                Bar Chart
                            </Button>
                        </div>

                        <div className="time-range-buttons">
                            <Button
                                variant={timeRange === "week" ? "default" : "secondary"}
                                onClick={() => setTimeRange("week")}
                                className="time-range-btn"
                            >
                                Past Week
                            </Button>
                            <Button
                                variant={timeRange === "month" ? "default" : "secondary"}
                                onClick={() => setTimeRange("month")}
                                className="time-range-btn"
                            >
                                Past Month
                            </Button>
                            <Button
                                variant={timeRange === "year" ? "default" : "secondary"}
                                onClick={() => setTimeRange("year")}
                                className="time-range-btn"
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
                                variant="default"
                                onClick={() => navigate("/learn")}
                                className="dashboard-btn"
                                size="lg"
                            >
                                Continue Learning 📚
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => navigate("/edit-profile")}
                                className="dashboard-btn"
                                size="lg"
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
