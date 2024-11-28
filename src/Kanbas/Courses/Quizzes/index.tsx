import React, { useEffect, useState } from "react";
import { FaPlus, FaChevronDown } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { BsThreeDotsVertical } from "react-icons/bs";
import { LuRocket } from "react-icons/lu";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import * as quizClient from "./client";
import GreenCheckmark from "../Modules/GreenCheckmark";

export default function Quizzes() {
  const { cid } = useParams(); // Course ID
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [openContextMenuQuizId, setOpenContextMenuQuizId] = useState<string | null>(null); // State for context menu

  const fetchQuizzes = async () => {
    const quizzesData = await quizClient.findQuizzesForCourse(cid);
    setQuizzes(quizzesData);
  };

  useEffect(() => {
    if (cid) {
      fetchQuizzes(); // Fetch quizzes when component mounts
    }
  }, [cid]);

  const handleDelete = async (quizId: string) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      await quizClient.deleteQuiz(quizId);
      setQuizzes(quizzes.filter((quiz) => quiz._id !== quizId));
    }
  };

  const handleNav = async (quizId: string) => {
    console.log("Navigating to Quiz Editor");
    console.log("Course ID:", cid);
    console.log("Quiz ID:", quizId);
    navigate(`/Kanbas/Courses/${cid}/Quizzes/${quizId}`);
  };
  

  return (
    <div id="wd-quizzes" className="container">
      {/* Quizzes Controls */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* Search Bar with Icon */}
        <div className="flex-grow-1 me-2">
          <div className="input-group input-group-lg">
            <span className="input-group-text" id="search-icon">
              <CiSearch />
            </span>
            <input
              id="wd-search-quiz"
              className="form-control"
              placeholder="Search..."
              aria-label="Search"
              aria-describedby="search-icon"
            />
          </div>
        </div>

        {/* + Quiz Button */}
        <button
          id="wd-add-quiz-btn"
          className="btn btn-danger btn-lg"
          onClick={() => navigate(`/Kanbas/Courses/${cid}/Quizzes/New`)}
        >
          <FaPlus className="me-1" /> Quiz
        </button>
      </div>

      {/* Quizzes Header */}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center bg-secondary rounded-0">
          <div className="d-flex align-items-center">
            <FaChevronDown className="me-2 fs-5" />
            <span className="wd-title p-3 fw-bold d-block text-decoration-none text-dark">Assignment Quizzes</span>
          </div>
        </div>

        {/* Quiz List */}
        <ul id="wd-quiz-list" className="list-group">
          {quizzes.map((quiz: any) => (
            <li
              key={quiz._id}
              className="wd-quiz-list-item list-group-item d-flex align-items-start p-3 rounded-0 position-relative"
              style={{ borderLeft: "5px solid green" }}
            >
              <div className="d-flex align-items-center align-self-center me-3">
                <LuRocket className="fs-4 ms-2 text-success" /> {/* Green Clipboard Icon */}
              </div>

              <div className="flex-grow-1">
                <a
                  className="wd-quiz-link fw-bold d-block text-decoration-none text-dark"
                  
                  onClick={() =>
                    
                    handleNav(quiz._id)
                  }
                  style={{ cursor: "pointer" }}
                >
                  {quiz.title}
                </a>
                <p className="mb-0 text-muted">
                  <strong>Available From:</strong> {quiz.availableFrom} <br />
                  <strong>Due:</strong> {quiz.dueDate} | {quiz.points} pts
                </p>
              </div>
              <div className="d-flex align-items-center align-self-center position-relative">
                <GreenCheckmark />
                {/* Context Menu Button */}
                <BsThreeDotsVertical
                  className="ms-3 fs-4"
                  onClick={() =>
                    setOpenContextMenuQuizId(
                      openContextMenuQuizId === quiz._id ? null : quiz._id
                    )
                  }
                  style={{ cursor: "pointer" }}
                />
                {/* Context Menu */}
                {openContextMenuQuizId === quiz._id && (
                  <ul
                    className="list-group position-absolute"
                    style={{ top: '100%', right: 0, zIndex: 1000 }}
                  >
                    <li className="list-group-item">Edit</li>
                    <li className="list-group-item">Delete</li>
                    <li className="list-group-item">Publish</li>
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
