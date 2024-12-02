import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import React from "react";
import * as quizClient from "./client";
import {
  Button,
  Row,
  Col,
  Card,
  Table,
  Tabs,
  Tab,
  ListGroup,
} from "react-bootstrap";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";


export default function DestailsScreen() {
  // Get quiz IDs
  const { cid, aid } = useParams<{ cid: string; aid?: string }>();
  console.log("QuizEditor Params - cid:", cid, ", aid:", aid);

  const navigate = useNavigate();

  // State for quiz and questions
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    points: 1,
    question: "",
    options: [{ value: "" }],
    answer: [],
    type: "Multiple Choice",
  });
  const [questionType, setQuestionType] = useState("Multiple Choice");

  // Active tab state
  const [key, setKey] = useState<string>('details');

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      if (aid) {
        console.log("Fetching quiz data for aid:", aid);
        const fetchedQuiz = await quizClient.findQuizById(cid, aid, "preview");

        if (fetchedQuiz) {
          setQuiz(fetchedQuiz);
          setQuestions(fetchedQuiz.questions || []);
        }
      }
    };
    fetchQuiz();
  }, [cid, aid]);

  const handleAddChoice = () => {
    setNewQuestion({
      ...newQuestion,
      options: [...newQuestion.options, { value: "" }],
    });
  };

  const handleRemoveChoice = (index: number) => {
    const updatedOptions = newQuestion.options.filter((_, i) => i !== index);
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const handleChoiceChange = (index: number, value: string) => {
    const updatedChoices = newQuestion.options.map((choice, i) =>
      i === index ? { ...choice, value } : choice
    );
    setNewQuestion({ ...newQuestion, options: updatedChoices });
  };

  const handleCorrectChoiceChange = (index: number) => {
    const updatedOptions = newQuestion.options.map((option, i) => ({
      ...option,
      isCorrect: i === index,
    }));
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const handleSaveQuestion = async () => {
    try {
      // Step 1: Create the question
      const savedQuestion = await quizClient.createQuestion(newQuestion);

      // Step 2: Associate the question with the quiz
      await quizClient.associateQuestionWithQuiz(aid, savedQuestion._id);

      // Step 3: Update local state
      setQuestions([...questions, savedQuestion]);

      // Step 4: Reset the newQuestion form
      setNewQuestion({
        title: "",
        points: 1,
        question: "",
        options: [{ value: "" }],
        answer: [],
        type: "Multiple Choice",
      });
    } catch (error) {
      console.error("Error saving question:", error);
      alert("Failed to save question.");
    }
  };

  const handleCancelQuestion = () => {
    // Reset new question fields
    setNewQuestion({
      title: "",
      points: 1,
      question: "",
      options: [{ value: "" }],
      answer: [],
      type: "Multiple Choice",
    });
  };


  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-start">{quiz?.title}</h3>
        <div>
          <Button variant="secondary" className="me-2">
            Preview
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              navigate(`/Kanbas/Courses/${cid}/Quizzes/${quiz?._id}/edit`)
            }
          >
            Edit
          </Button>
        </div>
      </div>
      {/* Tabs Interface */}
      <Tabs
        id="quiz-details-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k || "details")}
        className="mb-3"
      >
        <Tab eventKey="details" title="Details">
          {/* Details Content */}
          <Card className="p-3">
            <Row className="align-items-center mb-1">
              <Col xs={5} className="fw-bold text-end pe-1">
                Quiz Type:
              </Col>
              <Col xs={7} className="text-start ps-1">
                {quiz.quizType}
              </Col>
            </Row>
            <Row className="align-items-center mb-1">
              <Col xs={5} className="fw-bold text-end pe-1">
                Points:
              </Col>
              <Col xs={7} className="text-start ps-1">
                {quiz.points}
              </Col>
            </Row>
            <Row className="align-items-center mb-1">
              <Col xs={5} className="fw-bold text-end pe-1">
                Assignment Group:
              </Col>
              <Col xs={7} className="text-start ps-1">
                {quiz.assignmentGroup}
              </Col>
            </Row>
            <Row className="align-items-center mb-1">
              <Col xs={5} className="fw-bold text-end pe-1">
                Shuffle Answers:
              </Col>
              <Col xs={7} className="text-start ps-1">
                {quiz.shuffleAnswers ? "Yes" : "No"}
              </Col>
            </Row>
            <Row className="align-items-center mb-1">
              <Col xs={5} className="fw-bold text-end pe-1">
                Time Limit:
              </Col>
              <Col xs={7} className="text-start ps-1">
                {quiz.timeLimit ? `${quiz.time} minutes` : "No"}
              </Col>
            </Row>
            <Row className="align-items-center mb-1">
              <Col xs={5} className="fw-bold text-end pe-1">
                Multiple Attempts:
              </Col>
              <Col xs={7} className="text-start ps-1">
                {quiz.multipleAttempts
                  ? `${quiz.numberAttempts} attempts`
                  : "No"}
              </Col>
            </Row>
            <Row className="align-items-center mb-1">
              <Col xs={5} className="fw-bold text-end pe-1">
                Show Correct Answers:
              </Col>
              <Col xs={7} className="text-start ps-1">
                {quiz.showCorrectAnswers ? "Yes" : "No"}
              </Col>
            </Row>
            <Row className="align-items-center mb-1">
              <Col xs={5} className="fw-bold text-end pe-1">
                Access Code:
              </Col>
              <Col xs={7} className="text-start ps-1">
                {quiz.accessCode}
              </Col>
            </Row>
            <Row className="align-items-center mb-1">
              <Col xs={5} className="fw-bold text-end pe-1">
                One Question at a Time:
              </Col>
              <Col xs={7} className="text-start ps-1">
                {quiz.oneAtATime ? "Yes" : "No"}
              </Col>
            </Row>
            <Row className="align-items-center mb-1">
              <Col xs={5} className="fw-bold text-end pe-1">
                Webcam Required:
              </Col>
              <Col xs={7} className="text-start ps-1">
                {quiz.webCam ? "Yes" : "No"}
              </Col>
            </Row>
            <Row className="align-items-center mb-1">
              <Col xs={5} className="fw-bold text-end pe-1">
                Lock Questions After Answering:
              </Col>
              <Col xs={7} className="text-start ps-1">
                {quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}
              </Col>
            </Row>

            {/* Nested Card/Table for Due Dates */}
            <Card className="mt-4">
              <Table bordered hover>
                <thead>
                  <tr>
                    <th>Due</th>
                    <th>For</th>
                    <th>Available from</th>
                    <th>Until</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {quiz.dueDate
                        ? new Date(quiz.dueDate).toLocaleString()
                        : "-"}
                    </td>
                    <td>Everyone</td>
                    <td>
                      {quiz.availableFrom
                        ? new Date(quiz.availableFrom).toLocaleString()
                        : "-"}
                    </td>
                    <td>
                      {quiz.untilDate
                        ? new Date(quiz.untilDate).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card>
          </Card>
        </Tab>

        <Tab eventKey="questions" title="Questions">
          {/* List of existing questions */}
          <Card className="mb-3">
            <Card.Header>Existing Questions</Card.Header>
            <ListGroup variant="flush">
              {questions.length > 0 ? (
                questions.map((question, index) => (
                  <ListGroup.Item key={index}>
                    <strong>{question.title}</strong>
                    <div
                      dangerouslySetInnerHTML={{ __html: question.question }}
                    />
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item>No questions added yet.</ListGroup.Item>
              )}
            </ListGroup>
          </Card>

          {/* Form to add a new question */}
          <div className="mb-4">
            <label className="fw-bold" style={{ fontSize: "1.1rem" }}>
              Question Type
            </label>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
              className="form-select mb-3"
            >
              <option value="Multiple Choice">Multiple Choice</option>
              <option value="True/False">True/False</option>
              <option value="Fill in the Blank">Fill in the Blank</option>
            </select>
          </div>

          {questionType === "Multiple Choice" && (
            <>
              <div className="mb-4">
                <label className="fw-bold" style={{ fontSize: "1.1rem" }}>
                  Question Title
                </label>
                <input
                  type="text"
                  value={newQuestion.title}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, title: e.target.value })
                  }
                  className="form-control"
                  placeholder="Enter question title"
                />
              </div>

              <div className="mb-4">
                <label className="fw-bold" style={{ fontSize: "1.1rem" }}>
                  Question Points
                </label>
                <input
                  type="number"
                  value={newQuestion.points}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      points: Number(e.target.value),
                    })
                  }
                  className="form-control"
                  placeholder="Enter points"
                />
              </div>

              <div className="mb-4">
                <label className="fw-bold" style={{ fontSize: "1.1rem" }}>
                  Question Text
                </label>
                <ReactQuill
                  value={newQuestion.question}
                  onChange={(value) =>
                    setNewQuestion({ ...newQuestion, question: value })
                  }
                  placeholder="Write question here..."
                  className="quill-editor"
                />
              </div>

              <div className="mb-4">
                <label className="fw-bold" style={{ fontSize: "1.1rem" }}>
                  Choices
                </label>
                {newQuestion.options.map((choice, index) => (
                  <div key={index} className="d-flex align-items-center mb-2">
                    <input
                      type="radio"
                      name="correctChoice"
                      onChange={() => handleCorrectChoiceChange(index)}
                      className="me-2"
                    />
                    <input
                      type="text"
                      value={choice.value}
                      onChange={(e) =>
                        handleChoiceChange(index, e.target.value)
                      }
                      className="form-control me-2"
                      placeholder={`Choice ${index + 1}`}
                    />
                    <Button
                      variant="danger"
                      onClick={() => handleRemoveChoice(index)}
                    >
                      -
                    </Button>
                  </div>
                ))}
                <Button variant="primary" onClick={handleAddChoice}>
                  + Add Choice
                </Button>
              </div>
            </>
          )}

          <div className="text-end">
            <Button
              variant="secondary"
              className="me-3"
              onClick={handleCancelQuestion}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleSaveQuestion}>
              Save Question
            </Button>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
