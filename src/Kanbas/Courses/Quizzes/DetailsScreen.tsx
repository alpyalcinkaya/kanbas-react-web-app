
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import React from 'react';
import * as quizClient from "./client";
import { addQuiz, updateQuiz, deleteQuizAction, setQuizzes } from "./reducer";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css'; // Import styles for ReactQuill


export default function DestailsScreen() {

     // get quiz ids
  const { cid, aid } = useParams<{ cid: string; aid?: string }>();
  console.log("QuizEditor Params - cid:", cid, ", aid:", aid);  // Debugging params

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const fetchQuiz = async () => {
  const quiz = await quizClient.findQuizById(cid, aid, "preview");
  }
    


 // Quiz state
 const [quiz, setQuiz] = useState<any>({
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
 
  });

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      if (aid) {
        console.log("Fetching quiz data for aid:", aid);
        const fetchedQuiz = await quizClient.findQuizById(cid, aid, "preview");

        if (fetchedQuiz) {
          // Update state with fetched data
          setQuiz(fetchedQuiz);
        }
      }
    };
    fetchQuiz();
  }, [cid, aid]);
  return (


  
    <div className="container mt-5" >
        
        <div className="text-center mb-4 me-3">
            
        <Button variant="secondary" className="me-3">
        Preview
        
        </Button>
        <Button variant="secondary" className="me-3 " onClick={() => {navigate(
        `/Kanbas/Courses/${cid}/Quizzes/${quiz._id}/edit`
             ); }}> Edit </Button>
        </div>
        <br /> <br />
         <h2 className="text-center mb-4">{quiz.title}</h2>
            
            
            <div className="text-center mb-3 me-3" style ={{margin: '2px'}}>
            <label htmlFor="wd-quiz-type" className="me-2"><strong>Quiz Type : </strong></label>
                {quiz.quizType}
            </div>

            <div className="text-center mb-3 me-3" style ={{margin: '2px'}}>
            <label htmlFor="wd-points" className="me-2"><strong>Points : </strong></label>
                {quiz.points}
            </div>

            <div className="text-center mb-3 me-3" style ={{margin: '2px'}}>
            <label htmlFor="wd-assignment-group" className="me-2"><strong>Assignment Group : </strong></label>
                {quiz.assignmentGroup}
            </div>
            
            <div className="text-center mb-3 me-3" style ={{margin: '2px'}}>
            <label htmlFor="wd-shuffle-answers" className="me-2"><strong>Shuffle Answers : </strong></label>
                 {quiz.shuffleAnswers ? "Yes" : "No"}
            </div>
            
            <div className="text-center mb-3 me-3" style ={{margin: '2px'}}>
            <label htmlFor="wd-time-limit" className="me-2">
                <strong>Time Limit : </strong></label>
                 {quiz.timeLimit ? `{quiz.time} minutes` : "No"}
            </div>

            <div className="text-center mb-3 me-3" style ={{margin: '2px'}}>
            <label htmlFor="wd-multiple-attempts" className="me-2">
                <strong>Multiple Attemps : </strong></label>
                 {quiz.timeLimit ? `{quiz.multipleAttempts} attempts` : "No"}
            </div>

            <div className="text-center mb-3 me-3" style ={{margin: '2px'}}>
            <label htmlFor="wd-show-answers" className="me-2">
                <strong>Show Correct Answers Right away : </strong></label>
                 {quiz.timeLimit ? "Yes" : "No"}
            </div>

            <div className="text-center mb-3 me-3" style ={{margin: '2px'}}>
            <label htmlFor="wd-access-code" className="me-2">
                <strong>Access Code : </strong></label>
                 {quiz.accessCode}
            </div>

            <div className="text-center mb-3 me-3" style ={{margin: '2px'}}>
            <label htmlFor="wd-one-question-at-a-time" className="me-2">
                <strong>One Question At A Time : </strong></label>
                 {quiz.oneAtATime ? "Yes" : "No"}
            </div>

            <div className="text-center mb-3 me-3" style ={{margin: '2px'}}>
            <label htmlFor="wd-web-cam-required" className="me-2">
                <strong>Webcam Requied : </strong></label>
                 {quiz.webCam ? "Yes" : "No"}
            </div>

            <div className="text-center mb-3 me-3" style ={{margin: '2px'}}>
            <label htmlFor="wd-lock-questions-after-answering" className="me-2">
                <strong>Lock Questions After Answering : </strong></label>
                 {quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}
            </div>







</div>

            
    
       


  

  
  )
} 