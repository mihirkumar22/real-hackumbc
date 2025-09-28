import React, { useRef, useEffect, useState } from 'react';
import CustomNavbar from '../components/CustomNavbar';
import './Learn.css';
import cloudImg from '../components/images/cloud.png';
import { useNavigate } from "react-router-dom";

// Import your lesson images
import letter from '../components/images/letter.png';
import camera from '../components/images/camera.png';
import crown from '../components/images/crown.png';
import color from '../components/images/colors.png';
import family from '../components/images/family.png';
import emotion from '../components/images/emotion.png';
import questions from '../components/images/questions.png';
import responses from '../components/images/responses.png';

export default function Learn() {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // State for selected lesson
  const [selectedLesson, setSelectedLesson] = useState(null);

  // Handle node click to toggle floor
  const handleNodeClick = (node) => {
    // For now, all lessons are locked except the last one (bottom AA button)
    const isUnlocked = node.id === '0-6'; // Only last lesson (bottom AA) is unlocked
    
    if (!isUnlocked) {
      return; // Don't allow clicking locked lessons
    }
    
    if (selectedLesson && selectedLesson.id === node.id) {
      setSelectedLesson(null);
    } else {
      setSelectedLesson(node);
    }
  };

  // Handle practice navigation
  const handleClick = (unit, lesson) => {
    navigate("/lesson", {
      state: { unit, lesson }
    });
  };

  // Array of lessons with unit + lesson
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

  // Group sizes for 7, 9, 5
  const groupSizes = [7, 9, 5];

  // Split lessons into groups
  let start = 0;
  const groups = groupSizes.map((size, g) => {
    const nodes = lessons.slice(start, start + size).map((lesson, i) => ({
      id: `${g}-${i}`,
      ...lesson,
    }));
    start += size;
    return { nodes };
  });

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);

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
      <div className="right-sidebar"></div>
      
      <div className="learn-node-container" ref={containerRef}>
        {groups.map((group, groupIdx) => (
          <div key={groupIdx} className="group">
            <img src={cloudImg} alt="Cloud" className="cloud" />
            {group.nodes.map((node, idx) => {
              const isUnlocked = node.id === '0-6'; // Only last lesson (bottom AA) is unlocked
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
          {/* Close (X) button */}
          <button
            className="floor-close-btn"
            onClick={() => setSelectedLesson(null)}
          >
            ✕
          </button>

          <h3>{selectedLesson.title}</h3>
          <p>{selectedLesson.description}</p>

          {/* Practice button */}
          <div className="practice-btn-wrapper">
            <button
              className="practice-btn"
              onClick={() =>
                handleClick(selectedLesson.unit, selectedLesson.lesson)
              }
            >
              Practice It!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
