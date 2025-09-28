import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

const UserContext = createContext();

export function useUserContext() {
    return useContext(UserContext);
}

export function UserProvider({ children }) {
    const { currentUser } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribe;

        async function setupListener() {
            if (currentUser) {
                const userDocRef = doc(db, 'users', currentUser.uid);

                const docSnapshot = await getDoc(userDocRef);

                if (docSnapshot.exists()) {
                    // Initialize streak fields if they don't exist
                    const data = docSnapshot.data();
                    const initializedData = {
                        ...data,
                        maxStreak: data.maxStreak ?? 0,
                        currentStreak: data.currentStreak ?? 0
                    };

                    unsubscribe = onSnapshot(userDocRef, (snapshot) => {
                        if (snapshot.exists()) {
                            const snapshotData = snapshot.data();
                            setUserData({
                                ...snapshotData,
                                maxStreak: snapshotData.maxStreak ?? 0,
                                currentStreak: snapshotData.currentStreak ?? 0
                            });
                        } else {
                            console.error('No user document found');
                            setUserData(null);
                        }
                        setLoading(false);
                    });

                    // Optionally write initial streak values to Firestore if they were missing
                    if (data.maxStreak === undefined || data.currentStreak === undefined) {
                        await updateDoc(userDocRef, {
                            maxStreak: initializedData.maxStreak,
                            currentStreak: initializedData.currentStreak
                        });
                    }

                } else {
                    setUserData(null);
                    setLoading(false);
                }

            } else {
                setUserData(null);
                setLoading(false);
            }
        }

        setupListener();

        return () => unsubscribe && unsubscribe();
    }, [currentUser]);

    async function updateUserData(updates) {
        try {
            const userDocRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userDocRef, updates);
        } catch (error) {
            console.error("Failed to update user data", error);
            throw new Error('Could not update user data. Please try again later');
        }
    }

    const value = {
        userData,
        loading,
        updateUserData,
    };

    return (
        <UserContext.Provider value={value}>
            {!loading && children}
        </UserContext.Provider>
    );
}
