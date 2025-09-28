import React, { createContext, useContext, useState, useEffect } from "react";
import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    // Register a new user
    async function register(email, password) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userDocRef = doc(db, "users", user.uid);
            const userData = {
                uid: user.uid,
                email: user.email,
                createdAt: new Date().toISOString(),
                lessonsCompleted: [],
                lessonsAvailable: ["1-1"],
                userName: "",
                profilePic: "",
                dailyTimeSpent: {}, // initialize daily time tracking
                currentStreak: 0,
                maxStreak: 0,
                lastLogin: null
            };
            await setDoc(userDocRef, userData);

            return userCredential;
        } catch (error) {
            console.error(error);
            let message = "An unknown error occurred. Please try again.";
            if (error.code) {
                switch (error.code) {
                    case "auth/email-already-in-use":
                        message = "This email is already in use.";
                        break;
                    case "auth/weak-password":
                        message = "Password should be at least 6 characters long.";
                        break;
                    case "auth/invalid-email":
                        message = "Please enter a valid email address.";
                        break;
                }
            }
            throw new Error(message);
        }
    }

    // Update streaks on login
    async function updateLoginStreak(userId) {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) return;

        const data = userSnap.data();
        const today = new Date();
        const todayStr = today.toISOString().split("T")[0]; // YYYY-MM-DD
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        let currentStreak = data.currentStreak || 0;
        let maxStreak = data.maxStreak || 0;
        const lastLogin = data.lastLogin || null;

        if (lastLogin === todayStr) {
            // Already logged in today, do nothing
            return;
        }

        if (lastLogin === yesterdayStr) {
            // Consecutive login
            currentStreak += 1;
        } else {
            // Missed a day
            currentStreak = 1;
        }

        if (currentStreak > maxStreak) {
            maxStreak = currentStreak;
        }

        await updateDoc(userRef, {
            currentStreak,
            maxStreak,
            lastLogin: todayStr
        });
    }

    // Login
    async function login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            // Update streak after login
            await updateLoginStreak(userCredential.user.uid);
        } catch (error) {
            let message = "An unknown error occurred. Please try again.";
            if (error.code === "auth/user-not-found") message = "No account found with this email.";
            else if (error.code === "auth/wrong-password") message = "Incorrect password.";
            else if (error.code === "auth/too-many-requests")
                message = "Too many login attempts. Try later.";
            throw new Error(message);
        }
    }

    // Logout
    function logout() {
        return signOut(auth);
    }

    // Update user data and optionally upload profile pic
    async function updateUserProfile(userId, data, file) {
        try {
            let profilePicUrl = data.profilePic || "";

            if (file) {
                const storageRef = ref(storage, `profilePics/${userId}_${file.name}`);
                await uploadBytes(storageRef, file);
                profilePicUrl = await getDownloadURL(storageRef);
            }

            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, { ...data, profilePic: profilePicUrl });

            return profilePicUrl;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    // Record daily time spent on site (minutes)
    async function recordDailyTime(userId, minutes) {
        try {
            const userRef = doc(db, "users", userId);
            const docSnap = await getDoc(userRef);
            if (!docSnap.exists()) return;

            const data = docSnap.data();
            const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
            const dailyTime = data.dailyTimeSpent || {};
            const currentMinutes = dailyTime[today] || 0;

            dailyTime[today] = currentMinutes + minutes;

            await updateDoc(userRef, { dailyTimeSpent: dailyTime });
        } catch (err) {
            console.error("Failed to record daily time:", err);
        }
    }

    const value = {
        currentUser,
        register,
        login,
        logout,
        updateUserProfile,
        recordDailyTime
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
