import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import React from 'react';
import * as quizClient from "./client";
import { Button, Row, Col, Card, Table, Tabs, Tab, ListGroup } from "react-bootstrap";
import 'react-quill/dist/quill.snow.css'; // Import styles for ReactQuill
import ReactQuill from "react-quill";

export default function DestailsScreen() {

  
  const { cid, aid } = useParams<{ cid: any; aid: any }>();
  console.log("QuizEditor Params - courseId:", cid, ", quizId:", aid);  // Debugging params
  
  const [editingQuestion, setEditingQuestion] = useState<any>(null); // Holds the question being edited
  const [scores, setScores] = useState<{ [key: string]: number}>({})
  const [questions, setQuestions] = useState<any[]>([]);
  const [newQuestion, setNewQuestion] = useState({
    _id: null,
    quizId: aid,
    title: "",
    points: 1,
    question: "",
    options: [{ value: "", isCorrect: false}],
    answer: [],
    type: "Multiple Choice",
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
        options: editingQuestion.options.map((opt: any) => opt === true ? "True" : opt === false ? "False" : opt),
        answer: editingQuestion.answer || [],
        type: editingQuestion.type || "Multiple Choice",
      };
  
      setNewQuestion(updatedQuestion);
      setQuestionType(updatedQuestion.type); // Synchronize question type
    }
  }, [editingQuestion, aid]);
  
  
  

  

  const [questionType, setQuestionType] = useState("Multiple Choice");


  const handleQuestionTypeChange = (newType: string) => {
    console.log("Changing Question Type to:", newType);
    setQuestionType(newType);
    setNewQuestion((prev) => ({
      ...prev,
      type: newType,
    }));
  };
  

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
    questions: []
 
  });

  // Active tab state
  const [key, setKey] = useState<string>('details');
  
// Fetch quiz data
useEffect(() => {
  const fetchQuiz = async () => {
    try {
      if (aid) {
        console.log("Fetching quiz data for aid:", aid);
        const fetchedQuiz = await quizClient.findQuizById(cid, aid, "preview");
        
        if (fetchedQuiz) {
          // Update state with fetched data
          console.log("Quiz fetched successfully:", fetchedQuiz);
          setQuiz(fetchedQuiz);
          setQuestions(fetchedQuiz.questions || []);
          console.log("Attempting to fetch db questions");
          // Fetch questions after fetching the quiz
          const fetchedQuestions = await quizClient.findQuestionsByQuizId(aid);
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
    console.log(`Attempting to delete question with ID: ${questionId}`);
    await quizClient.deleteQuestion(questionId);
    const updatedQuestions = questions.filter((question) => question._id !== questionId);
    console.log("Updated questions after deletion:", updatedQuestions);
    setQuestions(updatedQuestions);
  } catch (error) {
    console.error('Error deleting question:', error);
    alert('Failed to delete question.');
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
  if (newQuestion._id) {
    // Edit logic
    await quizClient.updateQuestion(newQuestion._id, newQuestion);
    setQuestions(
      questions.map((q) => (q._id === newQuestion._id ? newQuestion : q))
    );
  } else {
    // Add logic
    const savedQuestion = await quizClient.addQuestionToQuiz(aid, newQuestion);
    setQuestions([...questions, savedQuestion]);
  }
  resetNewQuestion();
  setKey("questions-list");
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

  const handleMultipleChoiceAnswers = (e: any, opt: any, index: number) => {
    console.log("### index", index)
    console.log("### Event", e)
    console.log("### Opt", opt)
    if (e.target.checked === true && opt.isCorrect === true) {
      // set score to 1
      console.log("### correct answer")
      const k = String(index+1)
      const newState = scores
      if (k in newState) {
        newState[k] = newState[k] + 1
      } else {
        newState[k] = 1
      }
      setScores((newState))
    } else if (e.target.checked === false && opt.isCorrect === true) {
      // reset score to 0
      console.log("### incorrect answer")
      const k = String(index+1)
      const newState = scores
      newState[k] = newState[k] - 1
      setScores((prevScores) => (newState))
    }
    console.log("### Scores", scores)
  }

  const handleTrueOrFalseAnswer = (e: any, opt: any, index: number) => {
    console.log("### index", index)
    console.log("### Event", e)
    console.log("### Opt", opt)
    if (e.target.checked === true && opt.isCorrect === true) {
      // set score to 1
      console.log("### correct answer")
      const k = String(index+1)
      const newState = scores
      newState[k] = 1
      setScores((newState))
    } else {
      // reset score to 0
      console.log("### incorrect answer")
      const k = String(index+1)
      const newState = scores
      newState[k] = 0
      setScores((prevScores) => (newState))
    }
    console.log("### Scores", scores)
  }

  const handleAnswer = (type: string, e: any, opt: any, index: number) => {
    if (type === "True/False") {
      handleTrueOrFalseAnswer(e, opt, index)
    } else if (type === "Multiple Choice") {
      handleMultipleChoiceAnswers(e, opt, index)
    }
  }

  const renderAnswers = (question: { options: any; type: string}, index: number) => {
    const type = question.type;
    let answerType: string;
    if (type === "True/False") {
      answerType = "radio"
    } else if (type === "Multiple Choice") {
      answerType = "checkbox"
    }

    const answers = question.options.map((opt: any, optIndex: number) => (
      <div key={optIndex} style={{ marginBottom: '10px' }}>
        <input 
          type= { answerType }
          id={`question-${index}-option-${optIndex}`} 
          name={`question-${index}`} 
          value={opt.value} 
          onChange={(e) => handleAnswer(type, e, opt, index)}
        />
        <label 
          htmlFor={`question-${index}-option-${optIndex}`} 
          style={{ marginLeft: '8px' }}
        >
          {opt.value}
        </label>
      </div>
    ))
    return answers
  }
  
  const [toggleResults, setToggleResults] = useState(false);

  const handleSubmitOnClick = () => {
    console.log("### WHATSUPPPPPPP!!!")
    setToggleResults(!toggleResults)
  }

  const displayResults = () => {
    const results = Object.entries(scores).map(([key, value]) => (
      <div>
        Question {key}: {value}
      </div>
    ));

    return (
      <div>
        <h3> Your scores are: </h3>
        {results}
      </div>

    )
  };

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
               {/* Test new question or change to get another question */}
              setEditingQuestion(newQuestion);
              setKey("questions");
            }
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
              Enter your question and multiple possible answer choices, then select the correct answer. <br />
                </label>   
            </div>
              <div className="mb-4">
                <label className="fw-bold" style={{ fontSize: "1.1rem" }}>
                <br /> Question Title
                </label>
                <input
                  type="text"
                  value={newQuestion.title}
                  onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
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
                  onChange={(e) => setNewQuestion({ ...newQuestion, points: Number(e.target.value) })}
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
                      onChange={(value) => setNewQuestion({ ...newQuestion, question: value })}
                      placeholder="Write question here..."
                      className="quill-editor"
                    />
              </div>

              <div className="mb-4">
                <label className="fw-bold" style={{ fontSize: "1.1rem" }}>Choices</label>
                {newQuestion.options.map((choice, index) => (
                  <div key={index} className="d-flex align-items-center mb-2">
                    <input
                     key={newQuestion._id}
                      type="checkbox"
                      name="correctChoice"
                      onChange={(e) => handleCorrectChoiceChangeCheckbox(index, e)}
                      className="me-2"
                    />
                    <input
                      type="text"
                      value={choice.value}
                      onChange={(e) => handleChoiceChange(index, e.target.value)}
                      className="form-control me-2"
                      placeholder={`Choice ${index + 1}`}
                    />
                    <Button variant="danger" onClick={() => handleRemoveChoice(index)}>-</Button>
                  </div>
                ))}
                <Button variant="primary" onClick={handleAddChoice}>+ Add Choice</Button>
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
              Enter your question and multiple possible answer choices, then select the correct answer. <br />
                </label>   
            </div>
              <div className="mb-4">
                <label className="fw-bold" style={{ fontSize: "1.1rem" }}>
                <br />  Question Title
                </label>
                <input
                
                  type="text"
                  value={newQuestion.title}
                  onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
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
                  onChange={(e) => setNewQuestion({ ...newQuestion, points: Number(e.target.value) })}
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
                  onChange={(value) => setNewQuestion({ ...newQuestion, question: value })}
                  placeholder="Write question here..."
                  className="quill-editor"
                />
              </div>

              <div className="mb-4">
                <label className="fw-bold" style={{ fontSize: "1.1rem" }}>Choices</label>
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
                      onChange={(e) => handleChoiceChange(index, e.target.value)}
                      className="form-control me-2"
                      placeholder={`Choice ${index + 1}`}
                    />
                    <Button variant="danger" onClick={() => handleRemoveChoice(index)}>-</Button>
                  </div>
                ))}
                <Button variant="primary" onClick={handleAddChoice}>+ Add Choice</Button>
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
              Enter your question and multiple possible answer choices, then select the correct answer(s). <br />
                </label>   
            </div>

              <div className="mb-4">
                <label className="fw-bold" style={{ fontSize: "1.1rem" }}>
                <br />  Question Title
                </label>
                <input
                  type="text"
                  value={newQuestion.title}
                  onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
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
                  onChange={(e) => setNewQuestion({ ...newQuestion, points: Number(e.target.value) })}
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
                  onChange={(value) => setNewQuestion({ ...newQuestion, question: value })}
                  placeholder="Write question here..."
                  className="quill-editor"
                />
              </div>

             
        <div className="mb-4">
          <label className="fw-bold" style={{ fontSize: "1.1rem" }}>Possible Answers</label>
          {newQuestion.options.map((option, index) => (
            <div key={index} className="d-flex align-items-center mb-2">
              <input
                key={newQuestion._id}
                type="text"
                value={option.value}
                onChange={(e) => handleChoiceChange(index, e.target.value)}
                className="form-cntrol me-2"
                placeholder={`Possible Answer ${index + 1}`} />

                <Button variant="danger" onClick={() => handleRemoveChoice(index)}> - </Button>
                </div>
          ))}
          <Button variant="primary" onClick={handleAddChoice}> + Add Another Answer </Button>
          </div>

       

      </>
    )}

        
<div className="text-end">
            <Button variant="secondary" className="me-3" onClick={handleCancelQuestion}>
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
              onClick={() => { setEditingQuestion(question);
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
      <Card.Body style={{ padding: 0 }}> {/* Remove default padding */}
        {/* Light grey rectangle filling the width */}
        <div style={{
          backgroundColor: '#f0f0f0', 
          padding: '15px', 
          borderRadius: '8px 8px 0 0', // Rounded only on top corners
          display: 'flex', // Align items horizontally
          justifyContent: 'space-between', // Space between title and points
          alignItems: 'center' // Center align vertically
        }}>
          <h5 style={{ margin: 0, flex: 1, fontWeight: 'bold' }}>Question {index + 1}: {question.title}</h5>
          <p style={{ margin: 0, fontWeight: 'bold' }}>Points: {question.points}</p>
        </div>

        {/* Render the question content */}
        <div style={{ padding: '15px' }}>
          <div dangerouslySetInnerHTML={{ __html: question.question }} />

          <hr style={{padding: '1px', borderTop: '1px solid #ccc'}} />

          {/* Render the options as checkboxes */}
          <div>
            { renderAnswers(question, index) }
          </div>
        </div>
        <div>
        </div>
      </Card.Body>
    </Card>
  ))}
  { displayResults() }

  <Button variant="primary" onClick={ handleSubmitOnClick }> Submit </Button>
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