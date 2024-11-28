import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import * as quizClient from "./client";
import { addQuiz, updateQuiz, deleteQuizAction, setQuizzes } from "./reducer";
import { scheduler } from "timers/promises";
import { BiSolidPhoneOutgoing } from "react-icons/bi";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css'; // Import styles for ReactQuill


export default function QuizEditor() {
  // get quiz ids
  const { cid, aid } = useParams<{ cid: string; aid?: string }>();
  console.log("QuizEditor Params - cid:", cid, ", aid:", aid);  // Debugging params

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // check if the quiz is being edited currently
  const isEditing = Boolean(aid);
  
  console.log("Is Editing:", isEditing);  // Debugging edit mode

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
      if (isEditing && aid || aid === "New") {
        console.log("Fetching quiz data for aid:", aid);
        const quiz = await quizClient.findQuizById(aid);
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
      course: cid,
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
  
    try {
      if (isEditing) {
        await quizClient.updateQuiz(updatedQuiz);
        dispatch(updateQuiz(updatedQuiz));
      } else {
        const newQuiz = await quizClient.createQuizForCourse(cid!, updatedQuiz);
        dispatch(addQuiz(newQuiz));
      }
      // Navigate only after successful update or creation
      navigate(`/Kanbas/Courses/${cid}/Quizzes`);
    } catch (error) {
      console.error("Error saving quiz:", error);
    }
  };
  

    // Handle Cancel Button Click
  const handleCancel = () => {
    navigate(`/Kanbas/Courses/${cid}/Quizzes`);
  };

  return (
    <div id="wd-quizzes-editor" className="container mt-5">
      <h2 className="text-center mb-4"> {aid === "New" ? "Add New Quiz" : "Edit Quiz"}</h2>

      <div className="mb-4">
        <label className="fw-bold" style={{ fontSize: "1.1rem" }}>Quiz Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-control"
          placeholder="Enter the quiz title"
        />
      </div>

      <div className="mb-4">
        <label className="fw-bold" style={{ fontSize: "1.1rem" }}>Quiz Instructions</label>
        <ReactQuill
          value={description}
          onChange={setDescription}
          placeholder="Write description here..."
          className="quill-editor"
        />
      </div>

      <div className="mb-4">
        <label className="fw-bold" style={{ fontSize: "1.1rem" }}>Quiz Type</label>
        <select
          value={quizType}
          onChange={(e) => setQuizType(e.target.value)}
          className="form-select"
        >
          <option value="Graded Quiz">Graded Quiz</option>
          <option value="Practice Quiz">Practice Quiz</option>
          <option value="Ungraded Survey">Ungraded Survey</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="fw-bold" style={{ fontSize: "1.1rem" }}>Assignment Group</label>
        <select
          value={assignmentGroup}
          onChange={(e) => setAssignmentGroup(e.target.value)}
          className="form-select"
        >
          <option value="ASSIGNMENTS">Assignments</option>
          <option value="EXAMS">Exams</option>
          <option value="PROJECT">Project</option>
        </select>
      </div>

      <label className="fw-bold" style={{ fontSize: "1.1rem" }}>Options</label>

      <div className="mb-3 d-flex align-items-center">
        <input
          type="checkbox"
          id="wd-time-limit"
          checked={timeLimit}
          onChange={(e) => setTimeLimit(e.target.checked)}
          className="me-2"
        />
        <label htmlFor="wd-time-limit" className="me-3">Time Limit</label>
        <input
          type="number"
          value={time}
          onChange={(e) => setTime(Number(e.target.value))}
          disabled={!timeLimit}
          placeholder="Minutes"
          className="form-control"
          style={{ width: "80px" }}
        />
        <span className="ms-2">Minutes</span>
      </div>

      <div className="mb-3 d-flex align-items-center">
        <input
          type="checkbox"
          id="wd-allow-multiple-attempts"
          checked={multipleAttempts}
          onChange={(e) => setAttempts(e.target.checked)}
          className="me-2"
        />
        <label htmlFor="wd-allow-multiple-attempts">Allow Multiple Attempts</label>
      </div>

      <div className="mb-3 d-flex align-items-center">
        <input
          type="checkbox"
          id="wd-show-correct-answers"
          checked={showCorrectAnswers}
          onChange={(e) => setShowAnswer(e.target.checked)}
          className="me-2 "
        />
        <label htmlFor="wd-show-correct-answers">Show Correct Answers</label>
      </div>

      <div className="mb-4">
        <label className="fw-bold" style={{ fontSize: "1.1rem" }}>Access Code</label>
        <input
          type="text"
          id="wd-access-code"
          value={accesCode}
          onChange={(e) => setAccesCode(e.target.value)}
          className="form-control"
          placeholder=""
        />
      </div>

      <div className="mb-3 d-flex align-items-center">
        <input
          type="checkbox"
          id="wd-one-question-at-a-time"
          checked={oneAtATime}
          onChange={(e) => setOneAtATime(e.target.checked)}
          className="me-2 "
        />
        <label htmlFor="wd-show-correct-answers">One Question at a time</label>
      </div>

      <div className="mb-3 d-flex align-items-center">
        <input
          type="checkbox"
          id="wd-web-cam-required"
          checked={webCam}
          onChange={(e) => setWebCam(e.target.checked)}
          className="me-2 "
        />
        <label htmlFor="wd-show-correct-answers">Webcam Required</label>
      </div>

      <div className="mb-3 d-flex align-items-center">
        <input
          type="checkbox"
          id="wd-lock-questions-after-answering"
          checked={lockQuestionsAfterAnswering}
          onChange={(e) => setLockQuestions(e.target.checked)}
          className="me-2 "
        />
        <label htmlFor="wd-show-correct-answers">Lock Questions After Answering</label>
      </div>



      <div className="container mt-5">
      <Card className="p-4 mb-4">
        <Card.Title className="fw-bold mb-4">Assign</Card.Title>

        {/* Assign To Field */}
        <Form.Group controlId="assignTo" className="mb-3">
          <Form.Label>Assign to</Form.Label>
          <Form.Control
            type="text"
            value={assignmentGroup}
            onChange={(e) => setAssignmentGroup(e.target.value)}
            placeholder="Enter who to assign"
          />
        </Form.Group>

        {/* Due Date Field */}
        <Form.Group controlId="dueDate" className="mb-3">
          <Form.Label>Due</Form.Label>
          <Form.Control
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            placeholder="Select due date"
          />
        </Form.Group>

        {/* Available From and Until Fields */}
        
        {/* Using the form.group here can help put stuff on the same row but on its own column. */}
        <Row> 
          <Col>
            <Form.Group controlId="availableFrom" className="mb-3">
              <Form.Label>Available from</Form.Label>
              <Form.Control
                type="date"
                value={availableDate}
                onChange={(e) => setAvailableFromDate(e.target.value)}
                placeholder="Select start date"
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="untilDate" className="mb-3">
              <Form.Label>Until</Form.Label>
              <Form.Control
                type="date"
                value={untilDate}
                onChange={(e) => setUntilDate(e.target.value)}
                placeholder="Select end date"
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Add Button */}
        <Button variant="light" className="w-100 text-center border mb-3">
          + Add
        </Button>

        {/* Action Buttons */}
        <div className="text-end">
          <Button variant="secondary" className="me-3" onClick={() => console.log("Cancel")}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleSave}>
            Save
          </Button>
        </div>
      </Card>
    </div>


      <div className="text-end">
        <Button variant="secondary" className="me-3" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
}