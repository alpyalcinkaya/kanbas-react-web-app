import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import * as quizClient from "./client";
import { CheckCircleFill, XCircleFill } from "react-bootstrap-icons";

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
import "react-quill/dist/quill.snow.css"; // Import styles for ReactQuill
import ReactQuill from "react-quill";

export default function DestailsScreen() {
  const { cid, aid } = useParams<{ cid: any; aid: any }>();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [hasStarted, setHasStarted] = useState(false);
  console.log("QuizEditor Params - courseId:", cid, ", quizId:", aid); // Debugging params
  const [questionType, setQuestionType] = useState("Multiple Choice");
  const [toggleResults, setToggleResults] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null); // Holds the question being edited
  const [scores, setScores] = useState<{ [key: string]: number }>({});
  const [questions, setQuestions] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [newQuestion, setNewQuestion] = useState({
    _id: null,
    quizId: aid,
    title: "",
    points: 1,
    question: "",
    options: [{ value: "", isCorrect: false }],
    answer: [],
    type: "Multiple Choice",
  });

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
    questions: [],
  });

  useEffect(() => {
    if (editingQuestion) {
      console.log("Editing Question Updated:", editingQuestion); // Debugging
      const updatedQuestion = {
        _id: editingQuestion._id,
        quizId: editingQuestion.quizId || aid,
        title: editingQuestion.title || "",
        points: editingQuestion.points || 1,
        question: editingQuestion.question || "",
        options: editingQuestion.options.map((opt: any) =>
          opt === true ? "True" : opt === false ? "False" : opt
        ),
        answer: editingQuestion.answer || [],
        type: editingQuestion.type || "Multiple Choice",
      };

      setNewQuestion(updatedQuestion);
      setQuestionType(updatedQuestion.type); // Synchronize question type
    }
  }, [editingQuestion, aid]);

  const handleQuestionTypeChange = (newType: string) => {
    console.log("Changing Question Type to:", newType);
    setQuestionType(newType);
    setNewQuestion((prev) => ({
      ...prev,
      type: newType,
    }));
  };

  // Active tab state
  const [key, setKey] = useState<string>("details");

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        if (aid) {
          console.log("Fetching quiz data for aid:", aid);
          const fetchedQuiz = await quizClient.findQuizById(
            cid,
            aid,
            "preview"
          );

          if (fetchedQuiz) {
            // Update state with fetched data
            console.log("Quiz fetched successfully:", fetchedQuiz);
            setQuiz(fetchedQuiz);
            setQuestions(fetchedQuiz.questions || []);
            console.log("Attempting to fetch db questions");
            // Fetch questions after fetching the quiz
            const fetchedQuestions = await quizClient.findQuestionsByQuizId(
              aid
            );
            console.log("Questions fetched ", fetchedQuestions);
            setQuestions(fetchedQuestions || []); // updates questions list
            console.log("Questions fetched successfully:", fetchedQuestions);
          }
        }
      } catch (error) {
        console.error("Error fetching quiz or questions:", error);
      }
    };
    fetchQuiz();
  }, [cid, aid]);

  const handleDeleteQuestion = async (questionId: any) => {
    try {
      await quizClient.deleteQuestion(questionId);
      const updatedQuestions = questions.filter(
        (question) => question._id !== questionId
      );
      setQuestions(updatedQuestions);
      
      // Update quiz points
      const totalPoints = calculateTotalPoints(updatedQuestions);
      const updatedQuiz = { ...quiz, points: totalPoints };
      await quizClient.updateQuiz(updatedQuiz);
      setQuiz(updatedQuiz);
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("Failed to delete question.");
    }
  };

  const handleAddChoice = () => {
    setNewQuestion({
      ...newQuestion,
      options: [...newQuestion.options, { value: "", isCorrect: false }],
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

  const handleCorrectChoiceChangeCheckbox = (index: number, e: any) => {
    const updatedOptions = newQuestion.options.map((option, i) => ({
      ...option,
      isCorrect: i === index ? e.target.checked : option.isCorrect,
    }));
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const handleSaveQuestion = async () => {
    try {
      if (newQuestion._id) {
        // Edit logic
        const updatedQuestion = await quizClient.updateQuestion(
          newQuestion._id,
          newQuestion
        );
        const updatedQuestions = questions.map((q) =>
          q._id === newQuestion._id ? updatedQuestion : q
        );
        setQuestions(updatedQuestions);
        
        // Update quiz points
        const totalPoints = calculateTotalPoints(updatedQuestions);
        const updatedQuiz = { ...quiz, points: totalPoints };
        await quizClient.updateQuiz(updatedQuiz);
        setQuiz(updatedQuiz);
      } else {
        // Add logic
        const savedQuestion = await quizClient.addQuestionToQuiz(aid, newQuestion);
        const updatedQuestions = [...questions, savedQuestion];
        setQuestions(updatedQuestions);
        
        // Update quiz points
        const totalPoints = calculateTotalPoints(updatedQuestions);
        const updatedQuiz = { ...quiz, points: totalPoints };
        await quizClient.updateQuiz(updatedQuiz);
        setQuiz(updatedQuiz);
      }
      resetNewQuestion();
      setKey("questions-list");
    } catch (error) {
      console.error("Error saving question:", error);
    }
  };
  

  // Function to reset the new question form fields to the default values
  const resetNewQuestion = () => {
    setNewQuestion({
      _id: null,
      quizId: aid,
      title: "",
      points: 1,
      question: "",
      options: [{ value: "", isCorrect: false }],
      answer: [],
      type: "Multiple Choice",
    });

    // Set question type back to "Multiple Choice" by default
    setQuestionType("Multiple Choice");
  };

  const handleCancelQuestion = () => {
    // Reset new question fields
    resetNewQuestion();
    setEditingQuestion(null); // clear editing state
    setKey("questions-list");
  };

  const calculateTotalPoints = (questions: any[]) => {
    return questions.reduce((total, question) => total + question.points, 0);
  };

  const handleMultipleChoiceAnswers = (e: any, opt: any, index: number) => {
    console.log("### index", index);
    console.log("### Event", e);
    console.log("### Opt", opt);
    if (e.target.checked === true && opt.isCorrect === true) {
      // set score to 1
      console.log("### correct answer");
      const k = String(index + 1);
      const newState = scores;
      if (k in newState) {
        newState[k] = newState[k] + 1;
      } else {
        newState[k] = 1;
      }
      setScores(newState);
    } else if (e.target.checked === false && opt.isCorrect === true) {
      // reset score to 0
      console.log("### incorrect answer");
      const k = String(index + 1);
      const newState = scores;
      newState[k] = newState[k] - 1;
      setScores((prevScores) => newState);
    }
    console.log("### Scores", scores);
  };

  const handleTrueOrFalseAnswer = (e: any, opt: any, index: number) => {
    console.log("### index", index);
    console.log("### Event", e);
    console.log("### Opt", opt);
    if (e.target.checked === true && opt.isCorrect === true) {
      // set score to 1
      console.log("### correct answer");
      const k = String(index + 1);
      const newState = scores;
      newState[k] = 1;
      setScores(newState);
    } else {
      // reset score to 0
      console.log("### incorrect answer");
      const k = String(index + 1);
      const newState = scores;
      newState[k] = 0;
      setScores((prevScores) => newState);
    }
    console.log("### Scores", scores);
  };

  const handleAnswer = (type: string, e: any, options: any, index: number) => {
    if (type === "True/False") {
      handleTrueOrFalseAnswer(e, options, index);
    } else if (type === "Multiple Choice") {
      handleMultipleChoiceAnswers(e, options, index);
    } else if (type === "Fill in the Blank") {
      const k = String(index + 1);
      const userAnswer = e.target.value;
      setUserAnswers((prev) => ({
        ...prev,
        [k]: userAnswer,
      }));
    }
  };

  const renderAnswers = (
    question: { options: any; type: string },
    index: number
  ) => {
    const type = question.type;

    if (type === "Fill in the Blank") {
      return (
        <div className="mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Type your answer here"
            onChange={(e) => handleAnswer(type, e, question.options, index)}
          />
        </div>
      );
    }

    const answerType = type === "True/False" ? "radio" : "checkbox";

    return question.options.map((opt: any, optIndex: number) => (
      <div key={optIndex} className="mb-2">
        <input
          type={answerType}
          id={`question-${index}-option-${optIndex}`}
          name={`question-${index}`}
          value={opt.value}
          onChange={(e) => handleAnswer(type, e, opt, index)}
          className="me-2"
        />
        <label
          htmlFor={`question-${index}-option-${optIndex}`}
          className="ms-2"
        >
          {opt.value}
        </label>
      </div>
    ));
  };

  const handleSubmitOnClick = async () => {
    // Calculate scores for fill-in-the-blank questions
    const newScores = { ...scores };
    
    questions.forEach((question, index) => {
      if (question.type === "Fill in the Blank") {
        const questionNum = String(index + 1);
        const userAnswer = userAnswers[questionNum]?.toLowerCase() || "";
        const isCorrect = question.options.some((opt: any) => 
          opt.value.toLowerCase() === userAnswer
        );
        newScores[questionNum] = isCorrect ? question.points : 0;
      }
    });
  
    setScores(newScores);
    
    // Calculate total score
    const totalScore = questions.reduce((total, question, index) => {
      const questionNum = String(index + 1);
      const isCorrect = question.type === "Fill in the Blank"
        ? question.options.some((opt: any) => 
            opt.value.toLowerCase() === (userAnswers[questionNum] || "").toLowerCase()
          )
        : (newScores[questionNum] || 0) === question.options.filter((opt: any) => opt.isCorrect).length;
      return total + (isCorrect ? question.points : 0);
    }, 0);
  
    // Save the score if user is a student
    if (currentUser?.role === "STUDENT") {
      try {
        await quizClient.saveQuizScore(currentUser._id, aid, totalScore);
      } catch (error) {
        console.error("Error saving quiz score:", error);
      }
    }
  
    setToggleResults(true);
    
    const updatedAttempts = quiz.numberAttempts - 1;
    const updatedQuiz = {
      ...quiz,
      numberAttempts: updatedAttempts,
    };
    await quizClient.updateQuiz(updatedQuiz);
    setQuiz(updatedQuiz);
  };
  

  // Student View Component
  if (currentUser?.role === "STUDENT") {
    if (!hasStarted) {
      return (
        <div className="container mt-4">
          <Card>
            <Card.Header>
              <h3>{quiz.title}</h3>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <strong>Total Points:</strong> {quiz.points}
              </div>
              <div className="mb-3">
                <strong>Time Limit:</strong>{" "}
                {quiz.timeLimit ? `${quiz.time} minutes` : "No time limit"}
              </div>
              <div className="mb-3">
                <strong>Number of Questions:</strong> {questions.length}
              </div>
              <div className="mb-3">
                <strong>Due Date:</strong>{" "}
                {new Date(quiz.dueDate).toLocaleDateString()}
              </div>
              <div className="mb-3">
                <strong>Instructions:</strong>
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      quiz.description ||
                      "Answer all questions to the best of your ability.",
                  }}
                />
              </div>
              <Button
                variant="danger"
                size="lg"
                className="w-100"
                onClick={() => setHasStarted(true)}
              >
                Start Quiz
              </Button>
            </Card.Body>
          </Card>
        </div>
      );
    }

    return (
      <div className="container mt-4">
        {questions.map((question, index) => (
          <Card key={index} className="mb-4">
            <Card.Header className="bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  Question {index + 1}: {question.title}
                </h5>
                <span className="badge bg-primary">
                  Points: {question.points}
                </span>
              </div>
            </Card.Header>
            <Card.Body>
              <div
                className="mb-4"
                dangerouslySetInnerHTML={{ __html: question.question }}
              />
              <div className="ps-3">{renderAnswers(question, index)}</div>
            </Card.Body>
          </Card>
        ))}

        {toggleResults && (
          <Card className="mb-4">
            <Card.Header>
              <h4>Quiz Results</h4>
            </Card.Header>
            <Card.Body>
              {questions.map((question, index) => {
                const questionNum = String(index + 1);
                const isCorrect =
                  question.type === "Fill in the Blank"
                    ? question.options.some(
                        (opt: any) =>
                          opt.value.toLowerCase() ===
                          (userAnswers[questionNum] || "").toLowerCase()
                      )
                    : (scores[questionNum] || 0) ===
                      question.options.filter((opt: any) => opt.isCorrect)
                        .length;

                // Calculate actual points earned based on correctness
                const pointsEarned = isCorrect ? question.points : 0;

                return (
                  <div
                    key={questionNum}
                    className="mb-3 d-flex align-items-center"
                  >
                    {isCorrect ? (
                      <CheckCircleFill
                        className="text-success me-2"
                        size={20}
                      />
                    ) : (
                      <XCircleFill className="text-danger me-2" size={20} />
                    )}
                    <div>
                      <strong>Question {questionNum}:</strong> {pointsEarned}{" "}
                      out of {question.points} points
                    </div>
                  </div>
                );
              })}
              <div className="mt-4 pt-3 border-top">
                <strong>Total Score:</strong>{" "}
                {questions.reduce((total, question, index) => {
                  const questionNum = String(index + 1);
                  const isCorrect =
                    question.type === "Fill in the Blank"
                      ? question.options.some(
                          (opt: any) =>
                            opt.value.toLowerCase() ===
                            (userAnswers[questionNum] || "").toLowerCase()
                        )
                      : (scores[questionNum] || 0) ===
                        question.options.filter((opt: any) => opt.isCorrect)
                          .length;
                  return total + (isCorrect ? question.points : 0);
                }, 0)}{" "}
                points
              </div>
            </Card.Body>
          </Card>
        )}

        <Button
          variant="primary"
          disabled={quiz.numberAttempts <= 0}
          onClick={handleSubmitOnClick}
        >
          {" "}
          {quiz.numberAttempts <= 0 ? "Max attempts reached" : "Submit"}{" "}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-start">{quiz.title}</h3>
        <div>
          {/* <Button variant="secondary" className="me-2">
            Preview
          </Button> */}
          <Button
            variant="secondary"
            onClick={() => {
              navigate(`/Kanbas/Courses/${cid}/Quizzes/${aid}/edit`);
            }}
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

            <Row className="align-items-center mb-1">
              <Col xs={5} className="fw-bold text-end pe-1">
                Number of Questions :
              </Col>
              <Col xs={7} className="text-start ps-1">
                {questions.length}
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

        {/* Editor for quiz questions */}
        <Tab eventKey="questions" title="Questions Editor">
          {questionType === "Multiple Choice" && (
            <>
              <div className="mb-4">
                <label className="fw-bold" style={{ fontSize: "1.1rem" }}>
                  Question Type
                </label>

                <select
                  value={questionType}
                  onChange={(e) => handleQuestionTypeChange(e.target.value)}
                  className="form-select mb-3"
                >
                  <option value="Multiple Choice">Multiple Choice</option>
                  <option value="True/False">True/False</option>
                  <option value="Fill in the Blank">Fill in the Blank</option>
                </select>

                <label className="" style={{ fontSize: "1.1rem" }}>
                  Enter your question and answer choices, then
                  select the correct answer(s). <br />
                </label>
              </div>
              <div className="mb-4">
                <label className="fw-bold" style={{ fontSize: "1.1rem" }}>
                  <br /> Question Title
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
                  key={newQuestion._id}
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
                  key={newQuestion._id} // Force re-render when editing a new question
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
                      key={newQuestion._id}
                      type="checkbox"
                      name="correctChoice"
                      onChange={(e) =>
                        handleCorrectChoiceChangeCheckbox(index, e)
                      }
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

          {questionType === "True/False" && (
            <>
              <div className="mb-4">
                <label className="fw-bold" style={{ fontSize: "1.1rem" }}>
                  Question Type
                </label>

                <select
                  value={questionType}
                  onChange={(e) => handleQuestionTypeChange(e.target.value)}
                  className="form-select mb-3"
                >
                  <option value="Multiple Choice">Multiple Choice</option>
                  <option value="True/False">True/False</option>
                  <option value="Fill in the Blank">Fill in the Blank</option>
                </select>

                <label className="" style={{ fontSize: "1.1rem" }}>
                  Enter your question and multiple possible answer choices, then
                  select the correct answer. <br />
                </label>
              </div>
              <div className="mb-4">
                <label className="fw-bold" style={{ fontSize: "1.1rem" }}>
                  <br /> Question Title
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
                  key={newQuestion._id} // Force re-render when editing a new question
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

          {questionType === "Fill in the Blank" && (
            <>
              <div className="mb-4">
                <label className="fw-bold" style={{ fontSize: "1.1rem" }}>
                  Question Type
                </label>

                <select
                  value={questionType}
                  onChange={(e) => handleQuestionTypeChange(e.target.value)}
                  className="form-select mb-3"
                >
                  <option value="Multiple Choice">Multiple Choice</option>
                  <option value="True/False">True/False</option>
                  <option value="Fill in the Blank">Fill in the Blank</option>
                </select>

                <label className="" style={{ fontSize: "1.1rem" }}>
                  Enter your question and multiple possible answer choices, then
                  select the correct answer(s). <br />
                </label>
              </div>

              <div className="mb-4">
                <label className="fw-bold" style={{ fontSize: "1.1rem" }}>
                  <br /> Question Title
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
                  key={newQuestion._id}
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
                  Possible Answers
                </label>
                {newQuestion.options.map((option, index) => (
                  <div key={index} className="d-flex align-items-center mb-2">
                    <input
                      key={newQuestion._id}
                      type="text"
                      value={option.value}
                      onChange={(e) =>
                        handleChoiceChange(index, e.target.value)
                      }
                      className="form-cntrol me-2"
                      placeholder={`Possible Answer ${index + 1}`}
                    />

                    <Button
                      variant="danger"
                      onClick={() => handleRemoveChoice(index)}
                    >
                      {" "}
                      -{" "}
                    </Button>
                  </div>
                ))}
                <Button variant="primary" onClick={handleAddChoice}>
                  {" "}
                  + Add Another Answer{" "}
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
        {/* List of quizzes questions */}
        <Tab eventKey="questions-list" title="Questions List">
          {questions.length > 0 ? (
            <div className="question-list">
              {questions.map((question, index) => (
                <Card key={index} className="mb-3">
                  <Card.Body>
                    <Card.Title>{question.title}</Card.Title>
                    <Card.Text>Points: {question.points}</Card.Text>
                    <Card.Text>Type: {question.type}</Card.Text>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setEditingQuestion(question);
                        handleQuestionTypeChange(question.type);
                        setQuestionType(question.type);
                        setKey("questions");
                      }}
                      className="me-2"
                    >
                      Edit Question
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteQuestion(question._id)}
                    >
                      Delete Question
                    </Button>
                  </Card.Body>
                </Card>
              ))}
            </div>
          ) : (
            <p>No questions added yet.</p>
          )}
        </Tab>
        {/* <Tab eventKey="preview-quiz" title="Preview Quiz">
{questions.map((question, index) => (
        <Card key={index} className="mb-3">
          <Card.Body>
          <h3>Question {index+1 }: {question.title}</h3>
            <Card.Text>Points: {question.points}</Card.Text>
            <div dangerouslySetInnerHTML={{ __html: question.question }} />
            {
              question.options.map((opt: { value: string}) => (
                <p>{opt.value}</p>
              ))
            }
          </Card.Body>
        </Card>
      ))}
</Tab> */}

        <Tab eventKey="preview-quiz" title="Preview Quiz">
          {questions.map((question, index) => (
            <Card key={index} className="mb-3">
              <Card.Body style={{ padding: 0 }}>
                <div
                  style={{
                    backgroundColor: "#f0f0f0",
                    padding: "15px",
                    borderRadius: "8px 8px 0 0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h5 style={{ margin: 0, flex: 1, fontWeight: "bold" }}>
                    Question {index + 1}: {question.title}
                  </h5>
                  <p style={{ margin: 0, fontWeight: "bold" }}>
                    Points: {question.points}
                  </p>
                </div>
                <div style={{ padding: "15px" }}>
                  <div
                    dangerouslySetInnerHTML={{ __html: question.question }}
                  />
                  <hr style={{ padding: "1px", borderTop: "1px solid #ccc" }} />
                  <div>{renderAnswers(question, index)}</div>
                </div>
              </Card.Body>
            </Card>
          ))}

          {toggleResults && (
            <Card className="mb-4">
              <Card.Header>
                <h4>Quiz Results</h4>
              </Card.Header>
              <Card.Body>
                {questions.map((question, index) => {
                  const questionNum = String(index + 1);
                  const isCorrect =
                    question.type === "Fill in the Blank"
                      ? question.options.some(
                          (opt: any) =>
                            opt.value.toLowerCase() ===
                            (userAnswers[questionNum] || "").toLowerCase()
                        )
                      : (scores[questionNum] || 0) ===
                        question.options.filter((opt: any) => opt.isCorrect)
                          .length;

                  const pointsEarned = isCorrect ? question.points : 0;

                  return (
                    <div
                      key={questionNum}
                      className="mb-3 d-flex align-items-center"
                    >
                      {isCorrect ? (
                        <CheckCircleFill
                          className="text-success me-2"
                          size={20}
                        />
                      ) : (
                        <XCircleFill className="text-danger me-2" size={20} />
                      )}
                      <div>
                        <strong>Question {questionNum}:</strong> {pointsEarned}{" "}
                        out of {question.points} points
                      </div>
                    </div>
                  );
                })}
                <div className="mt-4 pt-3 border-top">
                  <strong>Total Score:</strong>{" "}
                  {questions.reduce((total, question, index) => {
                    const questionNum = String(index + 1);
                    const isCorrect =
                      question.type === "Fill in the Blank"
                        ? question.options.some(
                            (opt: any) =>
                              opt.value.toLowerCase() ===
                              (userAnswers[questionNum] || "").toLowerCase()
                          )
                        : (scores[questionNum] || 0) ===
                          question.options.filter((opt: any) => opt.isCorrect)
                            .length;
                    return total + (isCorrect ? question.points : 0);
                  }, 0)}{" "}
                  points
                </div>
              </Card.Body>
            </Card>
          )}

          <Button variant="primary" onClick={handleSubmitOnClick}>
            Submit
          </Button>
        </Tab>
      </Tabs>

      {/* <div className="text-end">
        <Button variant="secondary" className="me-3" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleSave}>
          Save
        </Button>
      </div> */}
    </div>
  );
}
