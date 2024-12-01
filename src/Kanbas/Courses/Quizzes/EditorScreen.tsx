import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as quizClient from "./client";
import { addQuiz, updateQuiz, deleteQuizAction, setQuizzes } from "./reducer";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import styles for ReactQuill

export default function EditorScreen({ quiz, setQuiz, handleSave, handleCancel }: any) {
  console.log("Quiz to be edited", quiz);
  const { cid, aid } = useParams<{ cid: string; aid?: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // check if the quiz is being edited currently
  const isEditing = Boolean(aid && aid !== "New");
  console.log("Is Editing:", isEditing); // Debugging edit mode

  if (!quiz && isEditing) {
    return <div>Loading...</div>;
  }
  return (
    <div id="wd-quizzes-editor" className="container mt-5">
      <h2 className="text-center mb-4">
        {aid === "New" ? "Add New Quiz" : "Edit Quiz"}
      </h2>

      <div className="mb-4">
        <label className="fw-bold" style={{ fontSize: "1.1rem" }}>
          Quiz Title
        </label>
        <input
          type="text"
          value={quiz.title}
          onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
          className="form-control"
          placeholder="Enter the quiz title"
        />
      </div>

      <div className="mb-4">
        <label className="fw-bold" style={{ fontSize: "1.1rem" }}>
          Quiz Instructions
        </label>
        <ReactQuill
          value={quiz.description}
          onChange={(value) => setQuiz({ ...quiz, description: value })}
          placeholder="Write description here..."
          className="quill-editor"
        />
      </div>

      <div className="mb-4">
        <label className="fw-bold" style={{ fontSize: "1.1rem" }}>
          Quiz Type
        </label>
        <select
          value={quiz.quizType}
          onChange={(e) => setQuiz({ ...quiz, quizType: e.target.value })}
          className="form-select"
        >
          <option value="Graded Quiz">Graded Quiz</option>
          <option value="Practice Quiz">Practice Quiz</option>
          <option value="Ungraded Survey">Ungraded Survey</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="fw-bold" style={{ fontSize: "1.1rem" }}>
          Assignment Group
        </label>
        <select
          value={quiz.assignmentGroup}
          onChange={(e) => setQuiz({ ...quiz, assignmentGroup: e.target.value })}
          className="form-select"
        >
          <option value="ASSIGNMENTS">Assignments</option>
          <option value="EXAMS">Exams</option>
          <option value="PROJECT">Project</option>
          <option value="QUIZZES">Quizzes</option>
        </select>
      </div>

      <label className="fw-bold" style={{ fontSize: "1.1rem" }}>
        Options
      </label>

      <div className="mb-3 d-flex align-items-center">
        <input
          type="checkbox"
          id="wd-time-limit"
          checked={quiz.timeLimit}
          onChange={(e) => setQuiz({ ...quiz, timeLimit: e.target.checked })}
          className="me-2"
        />
        <label htmlFor="wd-time-limit" className="me-3">
          Time Limit :
        </label>
        <input
          type="number"
          id="wd-time"
          value={quiz.time}
          onChange={(e) => setQuiz({ ...quiz, time: Number(e.target.value) })}
          disabled={!quiz.timeLimit}
          placeholder="Minutes"
          className="form-control"
          style={{ width: "80px" }}
        />
        <span className="ms-2">Minutes</span>
      </div>

      <div className="mb-3 d-flex align-items-center ">
        <label htmlFor="wd-points mb-2" className="me-2 ">
          Points :
        </label>
        <input
          type="number"
          id="wd-points"
          value={quiz.points}
          onChange={(e) => setQuiz({ ...quiz, points: Number(e.target.value) })}
          className="me-2"
          style={{ width: "60px" }}
        />
      </div>

      <div className="mb-3 d-flex align-items-center">
        <input
          type="checkbox"
          id="wd-shuffle-answers"
          checked={quiz.shuffleAnswers}
          onChange={(e) => setQuiz({ ...quiz, shuffleAnswers: e.target.checked })}
          className="me-2"
        />
        <label htmlFor="wd-shuffle-answers">
          Shuffle Answers
        </label>
      </div>

      <div className="mb-3 d-flex align-items-center">
        <input
          type="checkbox"
          id="wd-multiple-attempts"
          checked={quiz.multipleAttempts}
          onChange={(e) => setQuiz({ ...quiz, multipleAttempts: e.target.checked })}
          className="me-2"
        />
        <label htmlFor="wd-multiple-attempts" className="me-2">
          Allow Multiple Attempts :
        </label>
        <input
          type="number"
          id="wd-number-attempts"
          value={quiz.numberAttempts}
          onChange={(e) => setQuiz({ ...quiz, numberAttempts: Number(e.target.value) })}
          disabled={!quiz.multipleAttempts}
          placeholder="Attempts"
          className="form-control"
          style={{ width: "80px" }}
        />
        <span className="ms-2">Attempts</span>
      </div>

      <div className="mb-3 d-flex align-items-center">
        <input
          type="checkbox"
          id="wd-show-correct-answers"
          checked={quiz.showCorrectAnswers}
          onChange={(e) => setQuiz({ ...quiz, showCorrectAnswers: e.target.checked })}
          className="me-2"
        />
        <label htmlFor="wd-show-correct-answers">
          Show Correct Answers
        </label>
      </div>

      <div className="mb-3 d-flex align-items-center">
        <input
          type="checkbox"
          id="wd-one-question-at-a-time"
          checked={quiz.oneAtATime}
          onChange={(e) => setQuiz({ ...quiz, oneAtATime: e.target.checked })}
          className="me-2"
        />
        <label htmlFor="wd-one-question-at-a-time">
          One Question at a Time
        </label>
      </div>

      <div className="mb-3 d-flex align-items-center">
        <input
          type="checkbox"
          id="wd-web-cam-required"
          checked={quiz.webCam}
          onChange={(e) => setQuiz({ ...quiz, webCam: e.target.checked })}
          className="me-2"
        />
        <label htmlFor="wd-web-cam-required">
          Webcam Required
        </label>
      </div>

      <div className="mb-3 d-flex align-items-center">
        <input
          type="checkbox"
          id="wd-lock-questions-after-answering"
          checked={quiz.lockQuestionsAfterAnswering}
          onChange={(e) => setQuiz({ ...quiz, lockQuestionsAfterAnswering: e.target.checked })}
          className="me-2"
        />
        <label htmlFor="wd-lock-questions-after-answering">
          Lock Questions After Answering
        </label>
      </div>

      <div className="container mt-5">
        <Card className="p-4 mb-4">
          <Card.Title className="fw-bold mb-4">Assign Dates</Card.Title>

          {/* Due Date Field */}
          <Form.Group controlId="dueDate" className="mb-3">
            <Form.Label>Due</Form.Label>
            <Form.Control
              type="date"
              value={quiz.dueDate}
              onChange={(e) => setQuiz({...quiz, dueDate: e.target.value})}
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
                  value={quiz.availableFrom}
                  onChange={(e) => setQuiz({...quiz, availableFrom: e.target.value})}
                  placeholder="Select start date"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="untilDate" className="mb-3">
                <Form.Label>Until</Form.Label>
                <Form.Control
                  type="date"
                  value={quiz.untilDate}
                  onChange={(e) => setQuiz({...quiz, untilDate: e.target.value})}
                  placeholder="Select end date"
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Add Button */}
          <Button variant="light" className="w-100 text-center border mb-3">
            + Add
          </Button>

         
        </Card>
      </div>

    
   

      {/* More Input Fields - Checkbox, Number Input etc. */}
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
