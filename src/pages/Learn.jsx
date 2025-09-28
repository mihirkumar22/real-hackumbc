import React, { useRef, useEffect, useState } from 'react';
import CustomNavbar from '../components/CustomNavbar';
import './Learn.css';
import cloudImg from '../components/images/cloud.png';

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

  // State for selected lesson
  const [selectedLesson, setSelectedLesson] = useState(null);

  // Toggle handler
  const handleNodeClick = (node) => {
    if (selectedLesson && selectedLesson.id === node.id) {
      setSelectedLesson(null); // hide if same node clicked again
    } else {
      setSelectedLesson(node);
    }
  };

  // Array of lessons (icon + title + description)
  const lessons = [
    { icon: crown, title: "Letter Mastery", description: "Test your proficiency of ASL Letters" },
    { icon: camera, title: "Practice Letters 3", description: "Practice what you learned in the previous lesson." },
    { icon: letter, title: "Last Letters", description: "Learn all of the ASL Letters" },
    { icon: camera, title: "Practice Letters 2", description: "Practice what you learned in the previous lesson." },
    { icon: letter, title: "Middle Alphabet", description: "Learn some more ASL Letters." },
    { icon: camera, title: "Practice Letters 1", description: "Practice what you learned in the previous lesson." },
    { icon: letter, title: "First Letters", description: "Learn your first ASL Letters." },

    { icon: crown, title: "Simple Word Mastery", description: "Practice your ability to sign simple words" },
    { icon: camera, title: "Practice Requests", description: "Practice asking for needs." },
    { icon: questions, title: "Requests", description: "Learn how to ask for basic needs." },
    { icon: camera, title: "Practice Emotions", description: "Practice expressing how you feel." },
    { icon: emotion, title: "Emotions", description: "Learn signs to express feelings and moods." },
    { icon: camera, title: "Practice Family", description: "Practice talking about members of your family" },
    { icon: family, title: "Family", description: "Introduce family-related signs like mother, father, and siblings." },
    { icon: camera, title: "Practice Colors", description: "Practice signing basic colors" },
    { icon: color, title: "Colors", description: "Learn the ASL signs for different colors." },

    { icon: crown, title: "Simple Sentence Mastery", description: "Master questions and responses." },
    { icon: camera, title: "Practice Responding", description: "Practice simple question responses" },
    { icon: responses, title: "Responses", description: "Practice common replies such as yes, no, maybe." },
    { icon: camera, title: "Practice Questions", description: "Revise how to ask simple questions" },
    { icon: questions, title: "Questions", description: "Practice WH-questions: who, what, when, where, why." }
  ];

  // Group sizes for 7, 5, 3
  const groupSizes = [7, 9, 5];

  // Split into groups
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
      <div className="learn-node-container" ref={containerRef}>
        {groups.map((group, groupIdx) => (
          <div key={groupIdx} className="group">
            <img src={cloudImg} alt="Cloud" className="cloud" />
            {group.nodes.map((node, idx) => (
              <div
                key={node.id}
                className={`lesson-node s-shape-${idx % 2}`}
                onClick={() => handleNodeClick(node)}
              >
                <img src={node.icon} alt={node.title} className="lesson-icon" />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Floor panel */}
      <div className={`learn-floor ${selectedLesson ? "active" : ""}`}>
        {selectedLesson && (
          <>
            {/* Close (X) button */}
            <button className="floor-close-btn" onClick={() => setSelectedLesson(null)}>✕</button>

            <h3>{selectedLesson.title}</h3>
            <p>{selectedLesson.description}</p>

            {/* Practice button on the right */}
            <div className="practice-btn-wrapper">
              <button className="practice-btn">Practice</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
