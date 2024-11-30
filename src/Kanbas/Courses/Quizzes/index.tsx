// Quizzes.tsx
import React, { useEffect, useState } from "react";
import { FaPlus, FaChevronDown } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { BsThreeDotsVertical } from "react-icons/bs";
import { LuRocket } from "react-icons/lu";
import { AiOutlineEyeInvisible } from "react-icons/ai"; // Import icon for unpublished
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Import useSelector from Redux
import * as quizClient from "./client";
import GreenCheckmark from "../Modules/GreenCheckmark";
import UnpublishedIcon from "../Modules/UnpublishedIcon"; // Import UnpublishedIcon

export default function Quizzes() {
  const { cid } = useParams(); // Course ID
  const navigate = useNavigate();

  // Access the user's role from Redux store
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const role = currentUser?.role; // Assuming 'role' is 'FACULTY' or 'STUDENT'

  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [openContextMenuQuizId, setOpenContextMenuQuizId] = useState<string | null>(null); // State for context menu

  const fetchQuizzes = async () => {
    const quizzesData = await quizClient.findQuizzesForCourse(cid);

    // If the user is a student, filter out unpublished quizzes
    const filteredQuizzes =
      role === "STUDENT"
        ? quizzesData.filter((quiz: any) => quiz.published)
        : quizzesData;

    setQuizzes(filteredQuizzes);
  };

  useEffect(() => {
    if (cid) {
      fetchQuizzes(); // Fetch quizzes when component mounts or role changes
    }
  }, [cid, role]);

  const handleDelete = async (quizId: string) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      await quizClient.deleteQuiz(quizId);
      setQuizzes(quizzes.filter((quiz) => quiz._id !== quizId));
    }
  };

  const handlePublishToggle = async (quizId: string) => {
    // Find the quiz
    const quiz = quizzes.find((q) => q._id === quizId);
    if (quiz) {
      // Toggle published status
      const updatedQuiz = { ...quiz, published: !quiz.published };
      // Update on server
      await quizClient.updateQuiz(updatedQuiz); // Pass only the updated quiz object
      // Update state
      setQuizzes(quizzes.map((q) => (q._id === quizId ? updatedQuiz : q)));
    }
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

        {/* + Quiz Button (Visible to FACULTY only) */}
        {role === "FACULTY" && (
          <button
            id="wd-add-quiz-btn"
            className="btn btn-danger btn-lg"
            onClick={() => navigate(`/Kanbas/Courses/${cid}/Quizzes/New/edit`)}
          >
            <FaPlus className="me-1" /> Quiz
          </button>
        )}
      </div>

      {/* Quizzes Header */}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center bg-secondary rounded-0">
          <div className="d-flex align-items-center">
            <FaChevronDown className="me-2 fs-5" />
            <span className="wd-title p-3 fw-bold d-block text-decoration-none text-dark">
              Assignment Quizzes
            </span>
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
                <LuRocket className="fs-4 ms-2 text-success" />
              </div>
              <div className="flex-grow-1">
                <a
                  className="wd-quiz-link fw-bold d-block text-decoration-none text-dark"
                  onClick={() =>
                    navigate(`/Kanbas/Courses/${cid}/Quizzes/${quiz._id}/preview`)
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
                {/* Conditionally render the symbol for FACULTY only */}
                {role === "FACULTY" && (
                  <>
                    {quiz.published ? (
                      <GreenCheckmark />
                    ) : (
                      <UnpublishedIcon />
                    )}
                  </>
                )}

                {/* Context Menu Button (FACULTY only) */}
                {role === "FACULTY" && (
                  <>
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
                        style={{ top: "100%", right: 0, zIndex: 1000 }}
                      >
                        <li
                          className="list-group-item"
                          onClick={() => {
                            navigate(
                              `/Kanbas/Courses/${cid}/Quizzes/${quiz._id}/preview`
                            );
                            setOpenContextMenuQuizId(null); // Close the menu
                          }}
                        >
                          Edit
                        </li>
                        <li
                          className="list-group-item"
                          onClick={() => {
                            handleDelete(quiz._id);
                            setOpenContextMenuQuizId(null); // Close the menu
                          }}
                        >
                          Delete
                        </li>
                        <li
                          className="list-group-item"
                          onClick={() => {
                            handlePublishToggle(quiz._id);
                            setOpenContextMenuQuizId(null); // Close the menu
                          }}
                        >
                          {quiz.published ? "Unpublish" : "Publish"}
                        </li>
                      </ul>
                    )}
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}