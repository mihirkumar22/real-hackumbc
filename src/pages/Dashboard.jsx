import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useUserContext } from "../contexts/UserContext";
import CustomNavBar from "../components/CustomNavbar";
import backgroundImage from "../components/images/tree-bg.png";
import { useNavigate } from "react-router-dom";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

import "./Dashboard.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard() {
    const { userData } = useUserContext();
    const navigate = useNavigate();
    const [mobileView, setMobileView] = useState(false);
    const [timeRange, setTimeRange] = useState("week");
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

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
                    borderColor: "rgba(75, 192, 192, 1)",
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    fill: true,
                    tension: 0.3
                }
            ]
        });
    }, [timeRange, userData]);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Activity Dashboard" }
        }
    };

    return (
        <div className="dashboard-container">
            <CustomNavBar />

            <Card className={`dashboard-card ${mobileView ? "mobile" : ""}`}>
                <Card.Body>
                    <h2 className="dashboard-welcome">
                        Welcome, {userData?.userName || userData?.email}
                    </h2>

                    <div className="time-range-buttons">
                        <Button
                            className={`time-range-btn ${timeRange === "week" ? "active" : ""}`}
                            onClick={() => setTimeRange("week")}
                        >
                            Past Week
                        </Button>
                        <Button
                            className={`time-range-btn ${timeRange === "month" ? "active" : ""}`}
                            onClick={() => setTimeRange("month")}
                        >
                            Past Month
                        </Button>
                        <Button
                            className={`time-range-btn ${timeRange === "year" ? "active" : ""}`}
                            onClick={() => setTimeRange("year")}
                        >
                            Past Year
                        </Button>
                    </div>

                    <div className="chart-container">
                        <Line data={chartData} options={chartOptions} />
                    </div>

                    <div className="dashboard-buttons">
                        <Button
                            className="dashboard-btn"
                            onClick={() => navigate("/your-applications")}
                        >
                            View Your Applications
                        </Button>
                        <Button
                            className="dashboard-btn"
                            onClick={() => navigate("/postings")}
                        >
                            View New Opportunities
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}
