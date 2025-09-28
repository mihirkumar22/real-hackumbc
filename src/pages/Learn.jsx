import React, { useRef, useEffect, useState } from 'react';
import CustomNavbar from '../components/CustomNavbar';
import cloudImg from '../components/images/cloud.png';
import { useUserContext } from '../contexts/UserContext';
import './Learn.css';

// Original icons
import letter from '../components/images/letter.png';
import camera from '../components/images/camera.png';
import crown from '../components/images/crown.png';
import color from '../components/images/colors.png';
import family from '../components/images/family.png';
import emotion from '../components/images/emotion.png';
import questions from '../components/images/questions.png';
import responses from '../components/images/responses.png';

// Yellow icons for available state
import letterYellow from '../components/images/letter-yellow.png';
import cameraYellow from '../components/images/camera-yellow.png';
import crownYellow from '../components/images/crown-yellow.png';
import colorYellow from '../components/images/colors-yellow.png';
import familyYellow from '../components/images/family-yellow.png';
import emotionYellow from '../components/images/emotion-yellow.png';
import questionsYellow from '../components/images/questions-yellow.png';
import responsesYellow from '../components/images/responses-yellow.png';

export default function Learn() {
  const containerRef = useRef(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonsCompleted, setLessonsCompleted] = useState([]);
  const [lessonsAvailable, setLessonsAvailable] = useState([]);
  const { userData } = useUserContext();

  // Update lessons state when userData changes
  useEffect(() => {
    if (userData) {
      setLessonsCompleted(userData.lessonsCompleted || []);
      setLessonsAvailable(userData.lessonsAvailable || []);
    }
  }, [userData]);

  // Scroll to bottom on mount
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);

  // Floor opens for all nodes
  const handleNodeClick = (node) => {
    if (selectedLesson && selectedLesson.id === node.id) {
      setSelectedLesson(null);
    } else {
      setSelectedLesson(node);
    }
  };

  const handleClick = (unit, lesson) => {
    console.log(`Navigate to Unit ${unit}, Lesson ${lesson}`);
  };

  const lessons = [
    { unit: 1, lesson: 7, icon: crown, iconAvailable: crownYellow, title: "Letter Mastery", description: "Test your proficiency of ASL Letters" },
    { unit: 1, lesson: 6, icon: camera, iconAvailable: cameraYellow, title: "Practice Letters 3", description: "Practice what you learned in the previous lesson." },
    { unit: 1, lesson: 5, icon: letter, iconAvailable: letterYellow, title: "Last Letters", description: "Learn all of the ASL Letters" },
    { unit: 1, lesson: 4, icon: camera, iconAvailable: cameraYellow, title: "Practice Letters 2", description: "Practice what you learned in the previous lesson." },
    { unit: 1, lesson: 3, icon: letter, iconAvailable: letterYellow, title: "Middle Alphabet", description: "Learn some more ASL Letters." },
    { unit: 1, lesson: 2, icon: camera, iconAvailable: cameraYellow, title: "Practice Letters 1", description: "Practice what you learned in the previous lesson." },
    { unit: 1, lesson: 1, icon: letter, iconAvailable: letterYellow, title: "First Letters", description: "Learn your first ASL Letters." },
    { unit: 2, lesson: 9, icon: crown, iconAvailable: crownYellow, title: "Simple Word Mastery", description: "Practice your ability to sign simple words" },
    { unit: 2, lesson: 8, icon: camera, iconAvailable: cameraYellow, title: "Practice Requests", description: "Practice asking for needs." },
    { unit: 2, lesson: 7, icon: questions, iconAvailable: questionsYellow, title: "Requests", description: "Learn how to ask for basic needs." },
    { unit: 2, lesson: 6, icon: camera, iconAvailable: cameraYellow, title: "Practice Emotions", description: "Practice expressing how you feel." },
    { unit: 2, lesson: 5, icon: emotion, iconAvailable: emotionYellow, title: "Emotions", description: "Learn signs to express feelings and moods." },
    { unit: 2, lesson: 4, icon: camera, iconAvailable: cameraYellow, title: "Practice Family", description: "Practice talking about members of your family" },
    { unit: 2, lesson: 3, icon: family, iconAvailable: familyYellow, title: "Family", description: "Introduce family-related signs like mother, father, and siblings." },
    { unit: 2, lesson: 2, icon: camera, iconAvailable: cameraYellow, title: "Practice Colors", description: "Practice signing basic colors" },
    { unit: 2, lesson: 1, icon: color, iconAvailable: colorYellow, title: "Colors", description: "Learn the ASL signs for different colors." },
    { unit: 3, lesson: 5, icon: crown, iconAvailable: crownYellow, title: "Simple Sentence Mastery", description: "Master questions and responses." },
    { unit: 3, lesson: 4, icon: camera, iconAvailable: cameraYellow, title: "Practice Responding", description: "Practice simple question responses" },
    { unit: 3, lesson: 3, icon: responses, iconAvailable: responsesYellow, title: "Responses", description: "Practice common replies such as yes, no, maybe." },
    { unit: 3, lesson: 2, icon: camera, iconAvailable: cameraYellow, title: "Practice Questions", description: "Revise how to ask simple questions" },
    { unit: 3, lesson: 1, icon: questions, iconAvailable: questionsYellow, title: "Questions", description: "Practice WH-questions: who, what, when, where, why." }
  ];

  const groupSizes = [7, 9, 4]; // matches total lessons
  let start = 0;
  const groups = groupSizes.map((size) => {
    const nodes = lessons.slice(start, start + size).map((lesson, i) => ({
      id: `${lesson.unit}-${lesson.lesson}`,
      ...lesson,
    }));
    start += size;
    return { nodes };
  });

  return (
    <div className="learn">
      <CustomNavbar />
      <div className="learn-node-container" ref={containerRef}>
        {groups.map((group, groupIdx) => (
          <div key={groupIdx} className="group">
            <img src={cloudImg} alt="Cloud" className="cloud" />
            {group.nodes.map((node, idx) => {
              const nodeId = `${node.unit}-${node.lesson}`;
              const isComplete = lessonsCompleted.includes(nodeId);
              const isAvailable = lessonsAvailable.includes(nodeId);

              const nodeClass = isComplete
                ? "lesson-node complete"
                : isAvailable
                  ? "lesson-node available"
                  : "lesson-node locked";

              const iconSrc = isComplete
                ? node.icon
                : isAvailable
                  ? node.iconAvailable
                  : node.icon;

              const iconClass = nodeClass.replace("lesson-node", "lesson-icon");

              return (
                <div
                  key={node.id}
                  className={`${nodeClass} s-shape-${idx % 2}`}
                  onClick={() => handleNodeClick(node)}
                >
                  <img src={iconSrc} alt={node.title} className={iconClass} />
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className={`learn-floor ${selectedLesson ? "active" : ""}`}>
        {selectedLesson && (
          <>
            <button
              className="floor-close-btn"
              onClick={() => setSelectedLesson(null)}
            >
              ✕
            </button>
            <h3>{selectedLesson.title}</h3>
            <p>{selectedLesson.description}</p>

            {/* Practice button only shows if available or complete */}
            {lessonsAvailable.includes(`${selectedLesson.unit}-${selectedLesson.lesson}`) ||
             lessonsCompleted.includes(`${selectedLesson.unit}-${selectedLesson.lesson}`) ? (
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
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
