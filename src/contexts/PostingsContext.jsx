import React, { useState, useEffect, useContext, createContext } from 'react'
import { parseISO, isAfter, format } from 'date-fns'
import { db } from '../firebase'
import { collection, getDocs, query, addDoc, deleteDoc, doc, getDoc, updateDoc, where, arrayUnion } from 'firebase/firestore'
import { useUserContext } from './UserContext'
import { useAuth } from './AuthContext'
import { useNotificationContext } from './NotificationContext'

const PostingsContext = createContext();

export function usePostingsContext() {
    return useContext(PostingsContext);
}

export function PostingsProvider({ children }) {
    const [postings, setPostings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filteredPostings, setFilteredPostings] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState({ tags: [], status: ['approved', 'pending', 'rejected', 'draft'] });
    const { userData } = useUserContext();
    const { currentUser } = useAuth();
    const { applicationToPosting, updatePostingStatus, requestPostingApproval } = useNotificationContext();

    const tags = ["Retail", "Fast Food", "Tech", "Volunteer", "Full-time", "Part-time", "Internship", "Afterschool"]


    //moderate postings and returns APPROVED or REJECTED
    async function moderatePosting(text) {
        try {
            console.log("Text to be sent for moderation:", text);

            const response = await fetch("http://localhost:5000/moderate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                throw new Error(`Moderation API failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.result) {
                throw new Error("Unexpected response from moderation API");
            }

            return data.result; // Returns "APPROVED" or "REJECTED"
        } catch (error) {
            console.error("Error moderating posting:", error);
            return "REJECTED"; // Default to rejection on error
        }
    }


    async function createPosting(newPosting) {
        // Moderation check BEFORE adding to Firestore
        const moderationResult = await moderatePosting(
            "Job Posting Title: " + newPosting.title + " Job Posting Description: " + newPosting.jobDescription
        );

        if (moderationResult === "REJECTED") {
            const postingsRef = collection(db, "postings");
            const docRef = await addDoc(postingsRef, { ...newPosting, status: "rejected" }); // Default to pending
            await updateDoc(docRef, { id: docRef.id });

            fetchPostings(userData.role);


            window.alert("Your Posting has failed our automatic moderation protocol and will now be rejected. Please make sure to abstain from using: inappropriate words and phrases, discrimination, etc.");

        }
        else if (moderationResult === "APPROVED") {
            // If approved, add to Firestore
            const postingsRef = collection(db, "postings");
            const docRef = await addDoc(postingsRef, { ...newPosting, status: "pending" }); // Default to pending
            await updateDoc(docRef, { id: docRef.id });

            fetchPostings(userData.role);

            window.alert("Your Posting has passed our automatic moderation protocol and will now be reviewed by a site admin.");
        }
    }

    async function deletePosting(postingId) {
        const confirmDelete = window.confirm("Are you sure you want to delete this posting?");
        if (!confirmDelete) { return; }

        const postingRef = doc(db, 'postings', postingId);
        const postingSnapshot = await getDoc(postingRef);

        const applicants = postingSnapshot.data().applicants;
        for (const applicant of applicants) {
            const applicantPostingsRef = doc(db, 'applied-postings', applicant);
            const applicantPostingsSnap = await getDoc(applicantPostingsRef);

            const appliedPostings = applicantPostingsSnap.data().appliedPostings;
            const newAppliedPostings = appliedPostings.filter((posting) => posting.postingId !== postingId);

            await updateDoc(applicantPostingsRef, { appliedPostings: newAppliedPostings });
        }

        await deleteDoc(postingRef);
        fetchPostings(userData.role);
    }

    async function handlePostingStatus(postingId, newStatus, source) {
        const postingRef = doc(db, 'postings', postingId);
        const postingSnap = await getDoc(postingRef);
        await updateDoc(postingRef, { status: newStatus });

        fetchPostings(userData.role);

        if (source == 'admin') {
            updatePostingStatus(postingSnap.data().uid, postingId, newStatus);
        }

        if (source == 'employer' && newStatus == 'pending') {
            const moderationResult = await moderatePosting("Job Posting Title: " + postingSnap.data().title + " Job Posting Description: " + postingSnap.data().jobDescription);
            if (moderationResult === "APPROVED") {
                
                await updateDoc(postingRef, { status: 'pending' });
                await requestPostingApproval(postingId);
                window.alert("Your Posting has passed our automatic moderation protocol and will now be reviewed by a site admin.");
            }
            else if (moderationResult === "REJECTED") {
                await updateDoc(postingRef, { status: 'rejected' });
                window.alert("Your Posting has failed our automatic moderation protocol and will now be rejected. Please make sure to abstain from using: innapropriate words and phrases, discrimination, etc.");

            }
        }
    }

    function checkExpiration(expirationDate, expirationTime) {
        if (expirationDate && expirationTime) {
            const today = new Date();

            const newExpirationDate = parseISO(expirationDate);
            const [hours, minutes] = expirationTime.split(':').map(Number);

            newExpirationDate.setHours(hours, minutes, 59, 0);

            if (isAfter(today, newExpirationDate)) {
                return false;
            }
        }
        return true;
    }

    // Following function handles all associated tasks for when a student applies to a posting:
    // - Add/remove the user to the applicants list of the posting
    // - Add/remove the posting from the user's applied postings list
    // - Send a new notification to the employer when a student applies to a posting,
    //   clears existing notification if it is for the same student + posting
    async function handlePostingApplication(postingId, userUID) {
        // Fetch reference and snapshot documents to the posting, student ("user"), and employer
        const postingRef = doc(db, 'postings', postingId);
        const postingSnapshot = await getDoc(postingRef);

        const appliedPostingsRef = doc(db, 'applied-postings', userUID);
        const appliedPostingsSnapshot = await getDoc(appliedPostingsRef);

        // Fetch all current applicants, as well as accepted and rejected applicants, from the posting
        let applicants = postingSnapshot.data().applicants;
        let acceptedApplicants = postingSnapshot.data().acceptedApplicants;
        let rejectedApplicants = postingSnapshot.data().rejectedApplicants;
        // Fetch all of the current user's applied postings
        let appliedPostings = appliedPostingsSnapshot.data().appliedPostings;

        // Create new posting data object, to be passed to the user's current postings
        const postingData = {
            postingId,
            employerId: postingSnapshot.data().uid,
            title: postingSnapshot.data().title,
            status: '',
        };

        // If the use has already applied to a posting, then remove that user from the applicants list
        // and clear the posting from the user's applied postings list. Also, if they have been accepted
        // or rejected, clear them from those lists.
        // Else, push the user to the applicants list and add the posting to the user's applied postings list.
        if (applicants.includes(userUID)) {
            applicants = applicants.filter((a) => a !== userUID);
            acceptedApplicants = acceptedApplicants.filter((a) => a !== userUID);
            rejectedApplicants = rejectedApplicants.filter((a) => a !== userUID);
            appliedPostings = appliedPostings.filter((p) => p.postingId !== postingId);
        } else {
            applicants.push(userUID);
            appliedPostings.push(postingData);
            await applicationToPosting(postingData.employerId, postingData.postingId);
        }

        // Pass new entities to Firebase
        await updateDoc(postingRef, { applicants, acceptedApplicants, rejectedApplicants });
        await updateDoc(appliedPostingsRef, { appliedPostings });

        // Refresh all postings, obtain newly updated data
        fetchPostings(userData.role);
    }

    function mapPostings(querySnapshot) {
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }))
    }

    async function fetchPostings(role) {
        setLoading(true);
        const postingsRef = collection(db, 'postings');
        let querySnapshot;

        if (role == 'admin') {
            const approvedQuery = query(postingsRef, where('status', '==', 'approved'));
            const approvedSnapshot = await getDocs(approvedQuery);
            const approvedPostings = mapPostings(approvedSnapshot);

            const pendingQuery = query(postingsRef, where('status', '==', 'pending'));
            const pendingSnapshot = await getDocs(pendingQuery);
            const pendingPostings = mapPostings(pendingSnapshot);

            const allPostings = [
                ...approvedPostings,
                ...pendingPostings
            ]

            setPostings(allPostings);
            setLoading(false);
        } else if (role == 'student') {
            const q = query(postingsRef, where('status', '==', 'approved'));
            querySnapshot = await getDocs(q);
            const postingsData = mapPostings(querySnapshot);

            setPostings(postingsData);
            setLoading(false);
        } else if (role == 'employer') {
            const approvedQuery = query(postingsRef, where('status', '==', 'approved'));
            const approvedSnapshot = await getDocs(approvedQuery);
            const approvedPostings = mapPostings(approvedSnapshot);

            const employerQuery = query(postingsRef, where('uid', '==', currentUser.uid), where('status', 'in', ['pending', 'draft', 'rejected']));
            const employerSnapshot = await getDocs(employerQuery);
            const employerPostings = mapPostings(employerSnapshot);

            const allPostings = [
                ...approvedPostings,
                ...employerPostings
            ]

            setPostings(allPostings);
            setLoading(false);
        }
    }

    useEffect(() => {
        if (userData?.role && currentUser) {
            fetchPostings(userData.role);
        }
    }, [userData?.uid])

    function fetchFilteredPostings() {
        const filteredPostings = postings.filter(posting => {
            console.log(selectedFilters);
            const matchesStatus = selectedFilters.status.includes(posting.status);
            const matchesTags =
                selectedFilters.tags.length === 0 ||
                selectedFilters.tags.every(tag => posting.selectedTags.includes(tag));
            return matchesStatus && matchesTags;
        })

        setFilteredPostings(filteredPostings);
        
    }

    useEffect(() => {
        fetchFilteredPostings();
    }, [postings, selectedFilters])

    const value = {
        postings,
        filteredPostings,
        tags,
        selectedFilters,
        loading,
        createPosting,
        deletePosting,
        handlePostingStatus,
        handlePostingApplication,
        checkExpiration,
        fetchPostings,
        setSelectedFilters
    }

    return (
        <PostingsContext.Provider value={value}>
            {children}
        </PostingsContext.Provider>
    )
}