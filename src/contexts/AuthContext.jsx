import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

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
        })

        return unsubscribe;
    }, [])

    async function register(email, password, role) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            const user = userCredential.user;

            const userDocRef = doc(db, 'users', user.uid)
            const userData = {
                uid: user.uid,
                email: user.email,
                createdAt: new Date().toISOString(),
                role: role,
            }
            
            if (role == 'employer') {
                userData.savedStudents = [];
            }
            
            if (role == 'student') {
                const appliedPostingsRef = doc(db, 'applied-postings', user.uid);
                await setDoc(appliedPostingsRef, { appliedPostings: []});
            }

            const notificationDocRef = doc(db, 'notifications', user.uid);
            const notificationData = {
                notifications: [],
                notificationStatus: false,
            }

            await setDoc(userDocRef, userData);
            await setDoc(notificationDocRef, notificationData);

            return userCredential;
        } catch (error) {
            console.error(error);  // Log the entire error object for debugging
            let errorMessage = "An unknown error occurred. Please try again later.";
        
            // Firebase error codes may be like 'auth/email-already-in-use'
            if (error && error.code) {
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        errorMessage = 'This email is already in use. Please use a different one.';
                        break;
                    case 'auth/weak-password':
                        errorMessage = 'Password should be at least 6 characters long.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Please enter a valid email address.';
                        break;
                    default:
                        errorMessage = 'An unknown error occurred. Please try again later.';
                        break;
                }
            }
        
            // Display the error message to the user or throw it
            throw new Error(errorMessage);
        }
    }

    async function login(email, password) {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            let errorMessage = "An unknown error occurred. Please try again."
            
            if (error.code === "auth/user-not-found") {
                errorMessage = "No account found with this email. Please check your email or sign up.";
            } else if (error.code === "auth/wrong-password") {
                errorMessage = "Incorrect password. Please try again.";
            } else if (error.code === "auth/invalid-email") {
                errorMessage = "The email address is invalid. Please check and try again.";
            } else if (error.code === "auth/too-many-requests") {
                errorMessage = "Too many failed login attempts. Please try again later or reset your password.";
            }

            throw new Error(errorMessage);
        }
    }

    function logout() {
        return signOut(auth);
    }

    const value = {
        currentUser,
        register,
        login,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}