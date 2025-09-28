import React, { useRef, useEffect, useState } from 'react';
import CustomNavbar from '../components/CustomNavbar';
import './Learn.css';
import cloudImg from '../components/images/cloud.png';
import { useNavigate } from "react-router-dom";
import { useUserContext } from '../contexts/UserContext';
import { getDoc, doc } from 'firebase/firestore';
import { db } from "../firebase"; // adjust paths

// Import your lesson images
import letter from '../components/images/letter.png';
import camera from '../components/images/camera.png';
import crown from '../components/images/crown.png';
import color from '../components/images/colors.png';
import family from '../components/images/family.png';
import emotion from '../components/images/emotion.png';
import questions from '../components/images/questions.png';
import responses from '../components/images/responses.png';
import { useUserContext } from '../contexts/UserContext';
export default function Learn() {
  const containerRef = useRef(null);
  const spacerRef = useRef(null);
  const navigate = useNavigate();
  const { userData } = useUserContext();
  const [friendsData, setFriendsData] = useState([]);

  useEffect(() => {
    const fetchFriendsData = async () => {
      if (!userData) return;

      const results = [];

      // --- Include current user
      const userLastLesson =
        userData.lessonsCompleted?.slice(-1)[0] || null;
      results.push({
        id: userData.uid,
        lastLessonId: userLastLesson,
        displayName: userData.userName || userData.email || userData.uid,
      });

      // --- Include friends
      if (userData.friends && userData.friends.length > 0) {
        for (const uid of userData.friends) {
          try {
            const snap = await getDoc(doc(db, "users", uid));
            if (snap.exists()) {
              const data = snap.data();
              const lessonsCompleted = data.lessonsCompleted || [];
              const lastLessonId = lessonsCompleted.slice(-1)[0] || null;
              const displayName = data.userName || data.email || uid;

              results.push({
                id: uid,
                lastLessonId,
                displayName,
              });
            }
          } catch (err) {
            console.error("Error fetching friend data for UID:", uid, err);
          }
        }
      }

      // --- Sort hierarchy
      const lessonOrder = [
        "1-7", "1-6", "1-5", "1-4", "1-3", "1-2", "1-1",
        "2-9", "2-8", "2-7", "2-6", "2-5", "2-4", "2-3", "2-2", "2-1",
        "3-5", "3-4", "3-3", "3-2", "3-1"
      ];

      results.sort((a, b) => {
        const idxA = lessonOrder.indexOf(a.lastLessonId);
        const idxB = lessonOrder.indexOf(b.lastLessonId);
        // If lesson not in order, put at the end
        return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
      });

      setFriendsData(results);
    };

    fetchFriendsData();
  }, [userData]);


  const [selectedLesson, setSelectedLesson] = useState(null);

  const handleNodeClick = (node) => {
    const availableLessons = userData?.lessonsAvailable || [];
    const isUnlocked = availableLessons.includes(node.id);

    if (!isUnlocked) return;

    if (selectedLesson && selectedLesson.id === node.id) {
      setSelectedLesson(null);
    } else {
      setSelectedLesson(node);
    }
  };

  const handleClick = (unit, lesson) => {
    navigate("/lesson", {
      state: { unit, lesson }
    });
  };

  // Lessons array
  const lessons = [
    { unit: 1, lesson: 7, icon: crown, title: "Letter Mastery", description: "Test your proficiency of ASL Letters" },
    { unit: 1, lesson: 6, icon: camera, title: "Practice Letters 3", description: "Practice what you learned in the previous lesson." },
    { unit: 1, lesson: 5, icon: letter, title: "Last Letters", description: "Learn all of the ASL Letters" },
    { unit: 1, lesson: 4, icon: camera, title: "Practice Letters 2", description: "Practice what you learned in the previous lesson." },
    { unit: 1, lesson: 3, icon: letter, title: "Middle Alphabet", description: "Learn some more ASL Letters." },
    { unit: 1, lesson: 2, icon: camera, title: "Practice Letters 1", description: "Practice what you learned in the previous lesson." },
    { unit: 1, lesson: 1, icon: letter, title: "First Letters", description: "Learn your first ASL Letters." },
    { unit: 2, lesson: 9, icon: crown, title: "Simple Word Mastery", description: "Practice your ability to sign simple words" },
    { unit: 2, lesson: 8, icon: camera, title: "Practice Requests", description: "Practice asking for needs." },
    { unit: 2, lesson: 7, icon: questions, title: "Requests", description: "Learn how to ask for basic needs." },
    { unit: 2, lesson: 6, icon: camera, title: "Practice Emotions", description: "Practice expressing how you feel." },
    { unit: 2, lesson: 5, icon: emotion, title: "Emotions", description: "Learn signs to express feelings and moods." },
    { unit: 2, lesson: 4, icon: camera, title: "Practice Family", description: "Practice talking about members of your family" },
    { unit: 2, lesson: 3, icon: family, title: "Family", description: "Introduce family-related signs like mother, father, and siblings." },
    { unit: 2, lesson: 2, icon: camera, title: "Practice Colors", description: "Practice signing basic colors" },
    { unit: 2, lesson: 1, icon: color, title: "Colors", description: "Learn the ASL signs for different colors." },
    { unit: 3, lesson: 5, icon: crown, title: "Simple Sentence Mastery", description: "Master questions and responses." },
    { unit: 3, lesson: 4, icon: camera, title: "Practice Responding", description: "Practice simple question responses" },
    { unit: 3, lesson: 3, icon: responses, title: "Responses", description: "Practice common replies such as yes, no, maybe." },
    { unit: 3, lesson: 2, icon: camera, title: "Practice Questions", description: "Revise how to ask simple questions" },
    { unit: 3, lesson: 1, icon: questions, title: "Questions", description: "Practice WH-questions: who, what, when, where, why." }
  ];

  const groupSizes = [7, 9, 5];

  let start = 0;
  const groups = groupSizes.map((size) => {
    const nodes = lessons.slice(start, start + size).map((lesson) => ({
      id: `${lesson.unit}-${lesson.lesson}`,
      ...lesson,
    }));
    start += size;
    return { nodes };
  });

  // Map lessons to pixel heights in spacer
  let currentHeight = 0;

  // Scroll to bottom on mount
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);

  // Match spacer height to node container
  useEffect(() => {
    const updateSpacerHeight = () => {
      if (containerRef.current && spacerRef.current) {
        spacerRef.current.style.height = `${containerRef.current.scrollHeight}px`;
      }
    };
    updateSpacerHeight();
    window.addEventListener("resize", updateSpacerHeight);
    return () => window.removeEventListener("resize", updateSpacerHeight);
  }, []);

  const lessonPositions = {
    '1-1': 110,
    '1-2': 220,
    '1-3': 330,
    '1-4': 440,
    '1-5': 550,
    '1-6': 660,
    '1-7': 770,
    '2-1': 1530,
    '2-2': 1640,
    '2-3': 1750,
    '2-4': 1860,
    '2-5': 1970,
    '2-6': 2080,
    '2-7': 2190,
    '2-8': 2300,
    '2-9': 2410,
    '3-1': 3170,
    '3-2': 3280,
    '3-3': 3390,
    '3-4': 3500,
    '3-5': 3610,
  };

  return (
    <div className="learn">
      <CustomNavbar />

      {/* Unit notification card */}
      <div className="unit-notification">
        <div className="unit-icon">📚</div>
        <div className="unit-info">
          <div className="unit-title">Unit 1: ASL Alphabet</div>
          <div className="unit-progress">7 lessons • 1 unlocked</div>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="right-sidebar">
        <div className="leaderboard">
          <h3 className="leaderboard-header">Friend Leaderboard</h3>
          {friendsData.map((friend) => (
            <div key={friend.id} className="friend-entry">
              <div>{friend.displayName}</div>
              <div>{friend.lastLessonId}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Lessons */}
      <div className="learn-node-container" ref={containerRef}>
        {groups.map((group, groupIdx) => (
          <div key={groupIdx} className="group">
            <img src={cloudImg} alt="Cloud" className="cloud" />
            {group.nodes.map((node, idx) => {
              const isUnlocked = userData?.lessonsAvailable?.includes(node.id);
              return (
                <div
                  key={node.id}
                  className={`lesson-node s-shape-${idx % 2} ${isUnlocked ? 'unlocked' : 'locked'}`}
                  onClick={() => handleNodeClick(node)}
                >
                  <img src={node.icon} alt={node.title} className="lesson-icon" />
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Floor panel */}
      {selectedLesson && (
        <div className="learn-floor active">
          <button className="floor-close-btn" onClick={() => setSelectedLesson(null)}>
            ✕
          </button>

          <h3>{selectedLesson.title}</h3>
          <p>{selectedLesson.description}</p>

          <div className="practice-btn-wrapper">
            <button
              className="practice-btn"
              onClick={() => handleClick(selectedLesson.unit, selectedLesson.lesson)}
            >
              Practice It!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
