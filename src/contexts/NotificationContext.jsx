import React, { useState, useEffect, createContext, useContext } from 'react'
import { useUserContext } from './UserContext'
import { db } from '../firebase'
import { doc, setDoc, getDoc, getDocs, collection, query, updateDoc, where } from 'firebase/firestore'

const NotificationContext = createContext();

export function useNotificationContext() {
    return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
    const { userData } = useUserContext();
    const [loading, setLoading] = useState(false);
    const [notificationsData, setNotificationsData] = useState({notifications: [], notificationStatus: false});

    async function fetchNotifications() {
        setLoading(true);
        const notificationsRef = doc(db, 'notifications', userData.uid);
        const notificationsSnap = await getDoc(notificationsRef);

        setNotificationsData(notificationsSnap.data());
        setLoading(false);
    }

    useEffect(() => {
        if (userData) {
            fetchNotifications();
        }
    }, [userData?.uid])

    async function updateNotificationData(updates) {
        const notificationsRef = doc(db, 'notifications', userData.uid);
        await updateDoc(notificationsRef, updates);

        fetchNotifications();
    }

    async function deleteNotification(notification) {
        const confirm = window.confirm("Are you sure you want to delete this notification?");
        if (confirm) {
            const newNotifications = notificationsData.notifications.filter(
                (n) => JSON.stringify(n) !== JSON.stringify(notification)
            );
            updateNotificationData({ notifications: newNotifications });
        }
    }

    async function applicationToPosting(employerId, postingId) {
        const notificationsRef = doc(db, 'notifications', employerId);
        const notificationsSnap = await getDoc(notificationsRef);

        const postingRef = doc(db, 'postings', postingId);
        const postingSnap = await getDoc(postingRef);

        const notificationData = {
            studentId: userData.uid,
            studentName: userData.userName,
            postingId: postingSnap.data().id,
            postingTitle: postingSnap.data().title,
            time: new Date().toISOString(),
            type: "New Applicant"
        }

        let notifications = notificationsSnap.data().notifications;
        notifications = notifications.filter((n) => 
            n.studentId !== notificationData.studentId || n.postingId !== notificationData.postingId
        );
        notifications.push(notificationData);
        
        await updateDoc(notificationsRef, { notifications, notificationStatus: true });
    }
    
    async function studentApplicationStatus(studentId, postingId, newStatus) {
        const notificationsRef = doc(db, 'notifications', studentId);
        const notificationsSnap = await getDoc(notificationsRef);

        const postingRef = doc(db, 'postings', postingId);
        const postingSnap = await getDoc(postingRef);

        const notificationData = {
            employerName: userData.companyName,
            postingId: postingId,
            postingTitle: postingSnap.data().title,
            status: newStatus,
            time: new Date().toISOString(),
            type: "Student Application Status"
        }
        
        let notifications = notificationsSnap.data().notifications;
        notifications = notifications.filter((n) => 
            n.postingId !== notificationData.postingId || n.status !== notificationData.status 
        );
        notifications.push(notificationData);

        await updateDoc(notificationsRef, { notifications, notificationStatus: true });
    }

    async function updatePostingStatus(employerId, postingId, newStatus) {
        const notificationsRef = doc(db, 'notifications', employerId);
        const notificationsSnap = await getDoc(notificationsRef);

        const postingRef = doc(db, 'postings', postingId);
        const postingSnap = await getDoc(postingRef);

        const notificationData = {
            postingId,
            postingTitle: postingSnap.data().title,
            status: newStatus,
            time: new Date().toISOString(),
            type: "Posting Status"
        }

        let notifications = notificationsSnap.data().notifications;
        notifications = notifications.filter((n) => 
            n.postingId !== notificationData.postingId || n.status !== notificationData.status
        );
        notifications.push(notificationData);

        await updateDoc(notificationsRef, { notifications, notificationStatus: true });
    }

    async function requestPostingApproval(postingId) {
        try {
            // Step 1: Query 'users' collection to get all admins
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('role', '==', 'admin'));
            const userSnaps = await getDocs(q);
    
            if (userSnaps.empty) {
                console.log("No admin users found.");
                return;
            }
    
            // Step 2: Extract admin UIDs (or document IDs)
            const adminIds = userSnaps.docs.map(doc => doc.id);
            console.log("Admin IDs:", adminIds);
    
            // Step 3: Get the posting details
            const postingRef = doc(db, 'postings', postingId);
            const postingSnap = await getDoc(postingRef);
    
            if (!postingSnap.exists()) {
                console.error("Posting not found!");
                return;
            }
    
            console.log("Posting Data:", postingSnap.data());
    
            // Step 4: Create notification data
            const notificationData = {
                employerName: userData.companyName,
                postingId,
                postingTitle: postingSnap.data().title,
                time: new Date().toISOString(),
                type: "Request Posting Approval"
            };
    
            // Step 5: Update notifications for each admin
            const updatePromises = adminIds.map(async (adminId) => {
                const notifRef = doc(db, 'notifications', adminId);
                const notifSnap = await getDoc(notifRef);
    
                let notifications = notifSnap.exists() ? notifSnap.data().notifications || [] : [];
    
                // Remove any existing notification of the same type for the same posting
                notifications = notifications.filter(n => !(n.type === 'Request Posting Approval' && n.postingId === postingId));
                
                // Add the new notification
                notifications.push(notificationData);
    
                return setDoc(notifRef, { notifications, notificationStatus: true }, { merge: true });
            });
    
            await Promise.all(updatePromises);
            console.log("Notifications updated for all admins!");
        } catch (error) {
            console.error("Error in requestPostingApproval:", error);
        }
    }
    const value = {
        notificationsData,
        loading,
        fetchNotifications,
        updateNotificationData,
        deleteNotification,
        applicationToPosting,
        studentApplicationStatus,
        updatePostingStatus,
        requestPostingApproval,
    }

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    )
}