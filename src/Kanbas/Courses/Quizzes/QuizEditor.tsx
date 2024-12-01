import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as quizClient from './client';
import { addQuiz, updateQuiz } from './reducer';
import DetailsEditor from './DetailsScreen';
import EditorScreen from './EditorScreen';
import { Button } from "react-bootstrap";

function QuizEditor() {
    const [activeTab, setActiveTab] = useState('details');
    const { cid, aid } = useParams();
    const location = useLocation(); // Access location state
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isEditing = Boolean(aid && aid !== "New");

    // Default quiz template for new quizzes
    const defaultQuizTemplate = {
        title: "",
        description: "",
        points: 100,
        timeLimit: false,
        time: 20,
        accessCode: 12345,
        dueDate: "",
        availableFrom: "",
        untilDate: "",
        multipleAttempts: false,
        numberAttempts: 1,
        shuffleAnswers: true,
        showCorrectAnswers: false,
        oneAtATime: true,
        webCam: false,
        lockQuestionsAfterAnswering: false,
        assignmentGroup: "QUIZZES",
        submissionType: "ONLINE",
        quizType: "Graded Quiz",
    };

    // Initialize the quiz state
    const [quiz, setQuiz] = useState<any>(isEditing ? null : defaultQuizTemplate);

    useEffect(() => {
        if (!isEditing) {
            return; // Don't fetch quiz if creating a new one
        }

        const fetchQuiz = async () => {
            try {
                console.log("Attempting to fetch quiz for editing with id:", aid);
                const fetchedQuiz = await quizClient.findQuizById(cid, aid, "edit");
                if (fetchedQuiz) {
                    setQuiz(fetchedQuiz);
                    console.log("Quiz successfully set:", fetchedQuiz);
                } else {
                    console.warn("No quiz found with the provided id.");
                }
            } catch (error) {
                console.error("Error fetching quiz:", error);
            }
        };
        fetchQuiz();
    }, [cid, aid, isEditing]);

    if (!quiz) {
        return <div>Loading...</div>;
    }

    const handleSave = async () => {
        try {
            if (isEditing) {
                await quizClient.updateQuiz(quiz);
                dispatch(updateQuiz(quiz));
                navigate(`/Kanbas/Courses/${cid}/Quizzes/${quiz._id}/preview`);
            } else {
                const newQuiz = await quizClient.createQuizForCourse(cid, quiz);
                dispatch(addQuiz(newQuiz));
                navigate(`/Kanbas/Courses/${cid}/Quizzes/${newQuiz._id}/preview`);
            }
        } catch (error) {
            console.error("Error saving quiz:", error);
            alert("Failed to save quiz. Please try again.");
        }
    };

    const handleCancel = () => {
        if (isEditing) {
            navigate(`/Kanbas/Courses/${cid}/Quizzes/${aid}/preview`);
        } else {
            navigate(`/Kanbas/Courses/${cid}/Quizzes`);
        }
    };

    return (
        <div className="quiz-editor">
            <div className="tabs">
                <button 
                    className={activeTab === 'details' ? 'tab active' : 'tab'}
                    onClick={() => setActiveTab('details')}
                >
                    Details
                </button>
                <button 
                    className={activeTab === 'questions' ? 'tab active' : 'tab'}
                    onClick={() => setActiveTab('questions')}
                >
                    Questions
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'details' && (
                    <EditorScreen quiz={quiz} setQuiz={setQuiz} handleSave={handleSave} handleCancel={handleCancel} />
                )}
            </div>
        </div>
    );
}

export default QuizEditor;
