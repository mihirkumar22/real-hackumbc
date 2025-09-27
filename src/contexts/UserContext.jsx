import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
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
                    unsubscribe = onSnapshot(userDocRef, (snapshot) => {
                        if (snapshot.exists()) {
                            setUserData(snapshot.data());
                        } else {
                            console.error('no user document found');
                            setUserData(null);
                        }
                        setLoading(false);
                    })
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
    }, [currentUser])

    async function updateUserData(updates) {
        try {
            const userDocRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userDocRef, updates);
        } catch (error) {
            console.error("failed to update user data", error);
            throw new Error('Could not update user data. Please try again later')
        }
    }

    const value = {
        userData,
        loading,
        updateUserData,
    }

    return (
        <UserContext.Provider value={value}>
            {!loading && children}
        </UserContext.Provider>
    )
}