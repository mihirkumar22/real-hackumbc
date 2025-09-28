import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

function ActivityTracker() {
    const { currentUser, recordDailyTime } = useAuth();

    useEffect(() => {
        if (!currentUser) return;

        // Add 1 minute every 60 seconds
        const interval = setInterval(() => {
            recordDailyTime(currentUser.uid, 1);
        }, 60 * 1000); // 60,000 ms = 1 minute

        // Optional: add time when the user leaves or closes the page
        const handleBeforeUnload = () => {
            recordDailyTime(currentUser.uid, 1);
        };
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            clearInterval(interval);
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [currentUser, recordDailyTime]);

    return null; // no UI
}

export default ActivityTracker;
