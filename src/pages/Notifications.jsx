import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import CustomNavbar from '../components/CustomNavbar'
import NotificationCard from '../components/NotificationCard'
import { format } from 'date-fns'
import { useNotificationContext } from '../contexts/NotificationContext'
import BG from '../components/images/regbg.jpg';


function Notifications() {
    const { notificationsData, updateNotificationData, deleteNotification } = useNotificationContext();
    const [localNotifications, setLocalNotifications] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        updateNotificationData({ notificationStatus: false });
    }, [])

    // Fetch notifications
    useEffect(() => {
        setLocalNotifications(notificationsData.notifications.slice().reverse());
    }, [notificationsData])

    function handleDelete(notification) {
        deleteNotification(notification);
    }

    function handlePostingClick(postingId, role) {
        if (role == 'admin') {
            navigate('/postings', { state: postingId });
        } else if (role == 'employer') {
            navigate('/your-postings', { state: postingId });
        } else if (role == 'student') {
            navigate('/your-applications', { state: postingId });
        }
    }

    function handleDate(datePublished) {
        if (datePublished) {
            const date = new Date(datePublished);
            return format(date, "EEE, MMM dd, yyyy h:mm a");
        }
        return "Date could not be formatted."
    }

    return (
        <>
            <CustomNavbar />

            <div
                style={{
                    background: `url(${BG}) center/cover no-repeat`,
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Card
                    style={{
                        width: '90%',
                        padding: '20px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.7)',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.8)',
                        border: 'none',
                        height: 'auto'
                    }}>
                    <Card.Body>
                        <Card.Title>Notifications</Card.Title>
                        {localNotifications?.map((n, index) => (
                            <NotificationCard
                                key={index}
                                notification={n}
                                handlePostingClick={handlePostingClick}
                                handleDelete={handleDelete}
                                handleDate={handleDate}
                            />
                        ))}
                    </Card.Body>
                </Card>
            </div>
        </>

    )
}

export default Notifications;