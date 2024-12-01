import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import React from 'react';
import * as quizClient from "./client";
import { Button, Row, Col, Card, Table, Tabs, Tab, ListGroup } from "react-bootstrap";
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

  // Active tab state
  const [key, setKey] = useState<string>('details');

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
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-start">{quiz.title}</h3>
        <div>
          <Button variant="secondary" className="me-2">
            Preview
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              navigate(`/Kanbas/Courses/${cid}/Quizzes/${quiz._id}/edit`)
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
        onSelect={(k) => setKey(k || 'details')}
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
              {quiz.multipleAttempts ? `${quiz.numberAttempts} attempts` : "No"}
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
          {/* Questions Content */}
          <Card className="p-3">
            <Button
              variant="primary"
              onClick={() =>
                navigate(
                  `/Kanbas/Courses/${cid}/Quizzes/${quiz._id}/questions`
                )
              }
            >
              Edit Questions
            </Button>
  
            {/* Display list of questions if available */}
            {quiz.questions && quiz.questions.length > 0 ? (
              <ListGroup className="mt-3">
                {quiz.questions.map((question : any, index : any) => (
                  <ListGroup.Item key={index}>
                    <strong>Question {index + 1}:</strong> {question.text}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p className="mt-3">No questions added yet.</p>
            )}
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
  
}
