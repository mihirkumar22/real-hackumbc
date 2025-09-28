import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useUserContext } from "../contexts/UserContext";

import aImg from "../components/images/a.png";
import bImg from "../components/images/b.png";
import cImg from "../components/images/c.png";
import dImg from "../components/images/d.png";
import eImg from "../components/images/e.png";
import fImg from "../components/images/f.png";
import gImg from "../components/images/g.png";
import hImg from "../components/images/h.png";

const imageCache = { a: aImg, b: bImg, c: cImg, d: dImg, e: eImg, f: fImg, g: gImg, h: hImg };

function preloadImages(images) {
    Object.values(images).forEach((imgSrc) => {
        const img = new Image();
        img.src = imgSrc; // browser will load and cache
    });
}

// Shuffle function
function shuffleArray(array) {
    return array
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
}

async function fetchLesson(unit, lesson) {
    const docId = `unit_${unit}_lesson_${lesson}`;
    const docRef = doc(db, "lessons", docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
}

export default function Lesson() {
    const location = useLocation();
    const navigate = useNavigate();
    const { unit , lesson } = location.state || {};
    const [lessonData, setLessonData] = useState(null);
    const [questionOrder, setQuestionOrder] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answerOptions, setAnswerOptions] = useState([]);

    const { userData, updateUserData } = useUserContext();
    const existingCompleted = userData?.lessonsCompleted || [];
    const existingAvailable = userData?.lessonsAvailable || [];

    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState({}); // track which questions were correct

    const totalQuestions = questionOrder.length;
    const correctCount = Object.values(correctAnswers).filter(Boolean).length;
    const quizComplete = currentQuestionIndex === totalQuestions - 1 && submitted;

    useEffect(() => {
        if (!unit || !lesson) {
            // redirect to /learn if either is missing
            navigate("/learn", { replace: true });
        }
    }, [unit, lesson, navigate]);

    useEffect(() => {
        preloadImages(imageCache);
    }, []);

    useEffect(() => {
        if (quizComplete) {
            // check if all questions were correct
            if (correctCount === totalQuestions) {
                // user mastered the topic, call your update function
                if (userData) {
                    updateUserData({
                        lessonsCompleted: existingCompleted.includes(`${unit}-${lesson}`)
                            ? existingCompleted
                            : [...existingCompleted, `${unit}-${lesson}`],

                        lessonsAvailable: existingAvailable.includes(`${unit}-${lesson + 1}`)
                            ? existingAvailable
                            : [...existingAvailable, `${unit}-${lesson + 1}`],
                    });

                }
            }
        }
    }, [quizComplete, correctCount, totalQuestions, userData, updateUserData, unit, lesson]);

    useEffect(() => {
        async function loadLesson() {
            const data = await fetchLesson(unit, lesson);
            setLessonData(data);

            if (data) {
                const keys = Object.keys(data)
                    .filter((k) => !isNaN(Number(k)))
                    .sort((a, b) => Number(a) - Number(b));
                const shuffled = shuffleArray(keys);
                setQuestionOrder(shuffled);
            }
        }
        loadLesson();
    }, [unit, lesson]);

    useEffect(() => {
        if (!lessonData) return;

        const currentKey = questionOrder[currentQuestionIndex];
        const correctAnswer = lessonData[currentKey];
        const allOptions = Object.keys(lessonData)
            .filter((k) => !isNaN(Number(k)))
            .map((k) => lessonData[k]);

        const wrongAnswers = shuffleArray(allOptions.filter((a) => a !== correctAnswer)).slice(0, 3);
        const options = shuffleArray([correctAnswer, ...wrongAnswers]);

        setAnswerOptions(options);
        setSelectedAnswer(null);
        setSubmitted(false);
    }, [lessonData, currentQuestionIndex, questionOrder]);

    if (!lessonData || questionOrder.length === 0) {
        return <p>Loading lesson...</p>;
    }

    const currentKey = questionOrder[currentQuestionIndex];
    const correctAnswer = lessonData[currentKey];

    const handleSubmit = () => {
        const isCorrect = selectedAnswer === correctAnswer;
        setCorrectAnswers((prev) => ({
            ...prev,
            [currentQuestionIndex]: isCorrect,
        }));
        setSubmitted(true);
    };

    const handleNext = () => {
        setSelectedAnswer(null);
        setSubmitted(false);
        setCurrentQuestionIndex((i) => i + 1);
    };

    // Determine top bar colors
    const topBarColors = Array.from({ length: totalQuestions }).map((_, i) => {
        if (i === currentQuestionIndex) return "blue"; // current question
        if (correctAnswers[i] === true) return "green"; // answered correct
        if (correctAnswers[i] === false) return "red"; // answered wrong
        return "lightgray"; // unanswered
    });

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            {/* Top: Progress bars */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "32px",
                    marginLeft: "12.5%",
                    marginRight: "12.5%",
                }}
            >
                {topBarColors.map((color, i) => (
                    <div
                        key={i}
                        style={{
                            height: "16px",
                            flex: 1,
                            borderRadius: "8px",
                            border: i === currentQuestionIndex ? "2px solid black" : "none",
                            backgroundColor: color,
                        }}
                    />
                ))}
            </div>

            {/* Middle: Question and sign */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {lessonData.questionType == 'multipleChoice' ? (
                    <>
                        {/* Question type */}
                        <h2 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "32px" }}>
                            Choose the correct answer.
                        </h2>

                        {/* Sign image placeholder */}
                        <img
                            src={imageCache[correctAnswer]}
                            alt={`Sign for ${correctAnswer}`}
                            style={{ height: "200px", marginBottom: "32px" }}
                        />

                        {/* Answer options */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                gap: "12px",
                                width: "600px",
                                justifyContent: "center",
                            }}
                        >
                            {answerOptions.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => !submitted && setSelectedAnswer(option)}
                                    style={{
                                        padding: "12px 20px",
                                        fontSize: "18px",
                                        fontWeight: "bold",
                                        color: "blue",
                                        backgroundColor: "white",
                                        border: "2px solid blue", // thin outline on sides/top
                                        borderBottomWidth: "6px", // thick bottom border
                                        borderRadius: "12px", // rounded corners
                                        cursor: submitted ? "default" : "pointer",
                                        transition: "all 0.2s ease",
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.backgroundColor = "#f0f8ff")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.backgroundColor = "white")
                                    }
                                >
                                    {option.toUpperCase()}
                                </button>
                            ))}
                        </div>

                    </>
                ) : (
                    <>

                    </>
                )}

            </div>

            {/* Bottom bar */}
            {/* Bottom bar */}
            <div
                style={{
                    padding: "16px",
                    borderTop: "1px solid #ddd",
                    backgroundColor:
                        submitted && selectedAnswer === correctAnswer
                            ? "green"
                            : submitted && selectedAnswer !== correctAnswer
                                ? "red"
                                : "#ffffff",
                    display: "flex",
                    justifyContent: "center",
                    gap: "16px",
                }}
            >
                {!submitted ? (
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedAnswer}
                        style={{
                            padding: "12px 24px",
                            backgroundColor: selectedAnswer ? "blue" : "gray",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: selectedAnswer ? "pointer" : "not-allowed",
                        }}
                    >
                        Submit
                    </button>
                ) : currentQuestionIndex < totalQuestions - 1 ? (
                    <button
                        onClick={handleNext}
                        style={{
                            padding: "12px 24px",
                            backgroundColor: "blue",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                        }}
                    >
                        Next
                    </button>
                ) : (
                    <>
                        <button
                            onClick={() => navigate("/learn")}
                            style={{
                                padding: "12px 24px",
                                backgroundColor: "blue",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                            }}
                        >
                            Go to Learn
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                padding: "12px 24px",
                                backgroundColor: "gray",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                            }}
                        >
                            Retry Lesson
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
