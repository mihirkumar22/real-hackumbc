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
                dailyTimeSpent: {} // <-- initialize daily time tracking
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

    // Login
    async function login(email, password) {
        try {
            await signInWithEmailAndPassword(auth, email, password);
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
