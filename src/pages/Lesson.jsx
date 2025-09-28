import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useUserContext } from "../contexts/UserContext";
import { Button } from "../components/ui/button";
// Using dotlottie web component instead

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
    //webcam variables
    const videoRef = useRef(null);
    const [prediction, setPrediction] = useState("");

    useEffect(() => {
        // Access webcam
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                if (videoRef.current) videoRef.current.srcObject = stream;
            });
    }, []);

    //create predictions func
    const captureAndPredict = async () => {
        const video = videoRef.current;
        if (!video) return;

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageBase64 = canvas.toDataURL("image/jpeg");

        const response = await fetch("http://localhost:5000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: imageBase64 })
        });
        const result = await response.json();
        setPrediction(result.prediction || "");

        setSelectedAnswer(result.prediction.toLowerCase())
    };

    const location = useLocation();
    const navigate = useNavigate();
    const { unit, lesson } = location.state || {};
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
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

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
        console.log('Answer submitted:', { selectedAnswer, correctAnswer, isCorrect });
        setCorrectAnswers((prev) => ({
            ...prev,
            [currentQuestionIndex]: isCorrect,
        }));
        setSubmitted(true);

        // Show success animation if answer is correct
        if (isCorrect) {
            console.log('Correct answer! Showing animation...');
            setShowSuccessAnimation(true);
            // Hide animation after 2 seconds
            setTimeout(() => {
                console.log('Hiding animation...');
                setShowSuccessAnimation(false);
            }, 2000);
        }
    };

    const handleNext = () => {
        setSelectedAnswer(null);
        setSubmitted(false);
        setCurrentQuestionIndex((i) => i + 1);
    };

    // Determine top bar colors
    const topBarColors = Array.from({ length: totalQuestions }).map((_, i) => {
        if (i === currentQuestionIndex) return "#22c55e"; // current question - green
        if (correctAnswers[i] === true) return "#16a34a"; // answered correct - darker green
        if (correctAnswers[i] === false) return "#ef4444"; // answered wrong - red
        return "#e5e7eb"; // unanswered - light gray
    });

    return (
        <div className="min-h-screen bg-white relative">
            {/* Success Animation Overlay */}
            {showSuccessAnimation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                    <div className="relative">
                        <dotlottie-wc
                            src="/hackumbccorrect.lottie"
                            style={{ width: "300px", height: "300px" }}
                            autoplay
                        ></dotlottie-wc>
                    </div>
                </div>
            )}

            {/* Close button */}
            <button
                onClick={() => navigate("/learn")}
                className="absolute top-4 right-4 bg-red-500 text-white border-2 border-red-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm cursor-pointer transition-all duration-200 shadow-[0_3px_0_rgb(220,38,38)] hover:bg-red-600 hover:translate-y-[1px] hover:shadow-[0_2px_0_rgb(185,28,28)] active:translate-y-[2px] active:shadow-[0_1px_0_rgb(185,28,28)] z-10"
            >
                ✕
            </button>

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
                                border: i === currentQuestionIndex ? "2px solid #16a34a" : "none",
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
                            <h2 className="text-3xl font-bold mb-8 text-gray-800">
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
                                    <Button
                                        key={option}
                                        onClick={() => !submitted && setSelectedAnswer(option)}
                                        disabled={submitted}
                                        variant={selectedAnswer === option ? "default" : "outline"}
                                        className="text-lg font-bold px-6 py-3 min-w-[80px]"
                                    >
                                        {option.toUpperCase()}
                                    </Button>
                                ))}
                            </div>

                        </>
                    ) : (
                        <>
                            <h2
                                style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "32px" }}
                            >
                                Sign the following letter: {correctAnswer}
                            </h2>

                            <div className="flex gap-6 p-4">
                                <div className="flex-1 flex flex-col">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        className="w-full rounded-lg shadow"
                                    />
                                    <Button
                                        onClick={captureAndPredict}
                                        variant="default"
                                        size="lg"
                                        className="mt-2 w-full"
                                    >
                                        Predict
                                    </Button>
                                </div>

                                <div className="flex-1 flex flex-col">
                                    <div className="text-center text-4xl font-bold text-gray-800 mb-4">
                                        {prediction ? `Prediction: ${prediction}` : "No Prediction"}
                                    </div>
                                </div>
                            </div>

                        </>
                    )}

                </div>

                {/* Bottom bar */}
                <div
                    className={`p-4 border-t border-gray-200 flex justify-center gap-4 ${submitted && selectedAnswer === correctAnswer
                        ? "bg-green-50"
                        : submitted && selectedAnswer !== correctAnswer
                            ? "bg-red-50"
                            : "bg-white"
                        }`}
                >
                    {!submitted ? (
                        <Button
                            onClick={handleSubmit}
                            disabled={!selectedAnswer}
                            variant={selectedAnswer ? "default" : "secondary"}
                            size="lg"
                        >
                            Submit
                        </Button>
                    ) : currentQuestionIndex < totalQuestions - 1 ? (
                        <Button
                            onClick={handleNext}
                            variant="default"
                            size="lg"
                        >
                            Next
                        </Button>
                    ) : (
                        <>
                            <Button
                                onClick={() => navigate("/learn")}
                                variant="default"
                                size="lg"
                            >
                                Go to Learn
                            </Button>
                            <Button
                                onClick={() => window.location.reload()}
                                variant="secondary"
                                size="lg"
                            >
                                Retry Lesson
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
