import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import * as quizClient from "./client";
import { addQuiz, updateQuiz, deleteQuizAction, setQuizzes } from "./reducer";
import { scheduler } from "timers/promises";
import { BiSolidPhoneOutgoing } from "react-icons/bi";


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
  const [timeLimit, setTimeLimit] = useState("20");
  const [accesCode, setAccesCode] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [availableDate, setAvailableFromDate] = useState("");
  const [untilDate, setUntilDate] = useState("");

  // check box
  const [multipleAttempts, setAttempts] = useState(false);
  const [numberAttempts, setNumberOfAttempts] = useState("1");
  const [shuffleAnswers, setShuffle] = useState(true);
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
          // set state with fetched data if any exists, else is blank as if new
          // if the quiz is set with null values then set to blank/default state
          setTitle(quiz.title || "");
          setDescription(quiz.description || "");
          setPoints(quiz.points?.toString() || "");
          setDueDate(quiz.dueDate || "");
          setAvailableFromDate(quiz.availableDate || "");
          setUntilDate(quiz.untilDate || "");
          setTimeLimit(quiz.timeLimit || "20");
          setAccesCode(quiz.accesCode || "");

          setAttempts(quiz.multipleAttempts || false);
          setNumberOfAttempts(quiz.numberAttempts || "1");
          setShuffle(quiz.shuffleAnswers || true);
          setShowAnswer(quiz.showCorrectAnswers || false);
          setOneAtATime(quiz.oneAtATime || true);
          setWebCam(quiz.webCam || false);
          setLockQuestions(quiz.lockQuestionsAfterAnswering || false);

          setAssignmentGroup(quiz.assignmentGroup || "QUIZZES");
          setDisplayGradeAs(quiz.displayGradeAs || "PERCENTAGE");
          setSubmissionType(quiz.submissionType || "ONLINE");
          setQuizType(quiz.quizType || "Graded Quiz");
        }
      }
    };
    fetchAssignment();
  }, [cid, aid]);

  const handleSave = async () => {
    const updatedQuiz = {
      _id: isEditing ? aid! : new Date().getTime().toString(),
      title, 
      course: cid, // might need to be string 
      description,
      points: parseInt(points),
      dueDate,
      availableDate,
      untilDate, 
      timeLimit,
      accesCode,
      multipleAttempts,
      numberAttempts,
      shuffleAnswers,
      showCorrectAnswers,
      oneAtATime,
      webCam,
      lockQuestionsAfterAnswering,
      assignmentGroup,
      displayGradeAs,
      submissionType,
      quizType,

    };

    if (isEditing) {
      await quizClient.updateQuiz( updatedQuiz);
      dispatch(updateQuiz(updatedQuiz));
    } else {
      const newQuiz = await quizClient.createQuizForCourse(cid!, updatedQuiz);
      dispatch(addQuiz(newQuiz));

    }

    navigate(`/Kanbas/Courses/${cid}/Quizzes`);
  }



    // Handle Cancel Button Click
  const handleCancel = () => {
    navigate(`/Kanbas/Courses/${cid}/Quizzes`);
  };
}