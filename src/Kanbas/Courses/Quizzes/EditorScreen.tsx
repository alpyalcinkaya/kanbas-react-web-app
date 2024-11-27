import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import * as quizClient from "./client";
import { addQuiz, updateQuiz, deleteQuizAction, setQuizzes } from "./reducer";


export default function QuizEdirot() {
  // get quiz ids
  const { cid, aid } = useParams<{ cid: string; aid?: string }>();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // check if the quiz is being edited currently
  const isEditing = Boolean(aid);

  // get fields that need to be changed for the quiz.  Use state to manage the input fields
  
  // textual input fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState("100");
  const [shuffleAnswers, setShuffle] = useState("Yes");
  const [timeLimit, setTimeLimit] = useState("20");
  const [accesCode, setAccesCode] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [availableDate, setAvailableFromDate] = useState("");
  const [untilDate, setUntilDate] = useState("");

  // check box
  const [multipleAttempts, setAttempts] = useState(false);
  const [numberAttempts, setNumberOfAttempts] = useState("1");
  const [showCorrectAnswers, setShowAnswer] = useState(false);
  const [oneAtATime, setOneAtATime] = useState(true);
  const [webCam, setWebCam] = useState(false);
  const [lockQuestionsAfterAnswering, setLockQuestions] = useState(false);

  // drop down 
  const [assignmentGroup, setAssignmentGroup] = useState("QUIZZES");
  const [displayGradeAs, setDisplayGradeAs] = useState("PERCENTAGE");
  const [submissionType, setSubmissionType] = useState("ONLINE");
  const [quizType, setQuizType] = useState("Graded Quiz");


  // Fetch quiz data (in edit mode)
  useEffect(() => {
    const fetchAssignment = async () => {
      if (isEditing && aid) {
        const quiz = await quizClient.findQuizzesForCourse(cid!);
        if (quiz) {
          setTitle(quiz.title);
          setDescription(quiz.description);
          setPoints(quiz.points);
          setShuffle(quiz.shuffleAnswers);
          setDueDate(quiz.dueDate);
          setAvailableFromDate(quiz.availableDate);
          setUntilDate(quiz.untilDate);
          setTimeLimit(quiz.timeLimit);
          setAccesCode(quiz.accesCode);

          setAttempts(quiz.multipleAttempts);
          setNumberOfAttempts(quiz.numberAttempts);
          setShowAnswer(quiz.showCorrectAnswers);
          setOneAtATime(quiz.oneAtATime);
          setWebCam(quiz.webCam);
          setLockQuestions(quiz.lockQuestionsAfterAnswering);

          setAssignmentGroup(quiz.assignmentGroup);
          setDisplayGradeAs(quiz.displayGradeAs);
          setSubmissionType(quiz.submissionType);
          setQuizType(quiz.quizType);
        }
      }
    };
    fetchAssignment();
  }, [cid, aid]);




    // Handle Cancel Button Click
  const handleCancel = () => {
    navigate(`/Kanbas/Courses/${cid}/Quizzes`);
  };
}