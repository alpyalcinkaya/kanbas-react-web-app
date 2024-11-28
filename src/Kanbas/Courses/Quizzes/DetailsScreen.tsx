
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

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
    
  // textual input fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState(100);
  const [time, setTime] = useState(20);
  const [accessCode, setAccessCode] = useState(12345);
  const [dueDate, setDueDate] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [untilDate, setUntilDate] = useState("");
  // check box
  const [multipleAttempts, setAttempts] = useState(false);
  const [numberAttempts, setNumberAttempts] = useState(1);
  const [shuffleAnswers, setShuffle] = useState(true);
  const [showCorrectAnswers, setShowAnswer] = useState(false);
  const [oneAtATime, setOneAtATime] = useState(true);
  const [webCam, setWebCam] = useState(false);
  const [lockQuestionsAfterAnswering, setLockQuestions] = useState(false);
  const [timeLimit, setTimeLimit] = useState(false);

  // drop down 
  const [assignmentGroup, setAssignmentGroup] = useState("QUIZZES");
  const [submissionType, setSubmissionType] = useState("ONLINE");
  const [quizType, setQuizType] = useState("Graded Quiz");

 // Quiz state
 const [quiz, setQuiz] = useState<any>({
    title: "",
    description: "",
    points: 100,
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
    timeLimit: false,
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

    <Button variant="secondary" className="me-3" onClick={() => {navigate(
        `/Kanbas/Courses/${cid}/Quizzes/${quiz._id}/edit`
      ); }}>
        Go to edit
  </Button>
  )
} 