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
  const [points, setPoints] = useState(100);
  const [time, setTime] = useState(20);
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
  const [timeLimit, setTimeLimit] = useState(false);

  // drop down 
  const [assignmentGroup, setAssignmentGroup] = useState("QUIZZES");
  
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
          setPoints(quiz.points || 100);
          setDueDate(quiz.dueDate || "");
          setAvailableFromDate(quiz.availableDate || "");
          setUntilDate(quiz.untilDate || "");
          setTimeLimit(quiz.timeLimit || false);
          setTime(quiz.timeLimit || 20);
          setAccesCode(quiz.accesCode || "");

          setAttempts(quiz.multipleAttempts || false);
          setNumberOfAttempts(quiz.numberAttempts || "1");
          setShuffle(quiz.shuffleAnswers || true);
          setShowAnswer(quiz.showCorrectAnswers || false);
          setOneAtATime(quiz.oneAtATime || true);
          setWebCam(quiz.webCam || false);
          setLockQuestions(quiz.lockQuestionsAfterAnswering || false);

          setAssignmentGroup(quiz.assignmentGroup || "QUIZZES");
         
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
      points,
      dueDate,
      availableDate,
      untilDate, 
      timeLimit,
      time,
      accesCode,
      multipleAttempts,
      numberAttempts,
      shuffleAnswers,
      showCorrectAnswers,
      oneAtATime,
      webCam,
      lockQuestionsAfterAnswering,
      assignmentGroup,
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

  return (
    <div id="wd-quizzes-editor" className="container mt-4">
      <h2>{aid === "New" ? "Add New Assignment" : "Edit Assignment"}</h2>

        {/* Quiz Title */}
        <div className="row mb-3">
        <label htmlFor="wd-title" className="col-md-2 col-form-label">
          Quiz Title
        </label>
        <div className="col-md-12">
          <input
            id="wd-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
      </div>

       {/* Quiz Description */}
       <div className="row mb-3">
        <div className="col-md-12">
          <textarea
            id="wd-description"
            rows={5}
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      {/* Points */}
      <div className="row mb-3">
        <label htmlFor="wd-points" className="col-md-2 col-form-label text-end">
          Points
        </label>
        <div className="col-md-10">
          <input
            id="wd-points"
            type="number"
            value={points}
            // might need to edit type
            onChange={(e) => setPoints(Number(e.target.value))}
            className="form-control"
          />
        </div>
      </div>

      {/* <p></p> */}

  <div className="row mb-3">
        <label htmlFor="wd-timelimit" className="col-md-2 col-form-label text-end">
          Time Limit
        </label>
        <div className="col-md-10">
          <input
            id="wd-timelimit"
            type="number"
            checked={timeLimit}
            // might need to edit type
            onChange={(e) => setTime(Number(e.target.value))}
            className="form-control"
          />
        </div>
      </div>

  {/* <p></p> */}

      {/* Assignment Group Drop Down Menu*/} 
          
          
      <tr>
        
        <label htmlFor="wd-assign-to">Assignment Group</label> <br />
        
      <select id="wd-assign-to" value={assignmentGroup} 
      onChange={(e) => setAssignmentGroup(e.target.value)}>
            <option selected value="QUIZZES"> Quizzes</option>
            <option value="ASSIGNMENTS">Assignments</option>
            <option value="EXAMS">Exams</option>
            <option value="PROJECT">Project</option>
      </select>
      </tr>
     
      {/* <p></p> */}
 
  {/* Shuffle answers */}
  <label htmlFor="wd-shuffle-answers">Options</label> <br />

  <input
        type="checkbox"
        id="wd-shuffle-answers"
        checked={shuffleAnswers}
        onChange={(e) => setShuffle(e.target.checked)}
      />
      <label htmlFor="wd-shuffle-answers" style={{ margin: "2px" }}>Shuffle Answers</label>
      <br />

    <input
      type="checkbox"
      id="wd-time-limit"
      checked={timeLimit}
      onChange={(e) => setTimeLimit(e.target.checked)}
    />
    <label htmlFor="wd-time-limit" style={{ margin: "2px" }}>Website URL</label>
    <br />

    </div>
  )
}