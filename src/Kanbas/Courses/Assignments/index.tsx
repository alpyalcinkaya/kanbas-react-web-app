import React from "react";
import { FaPlus, FaTrash, FaChevronDown } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { BsGripVertical, BsThreeDotsVertical } from "react-icons/bs";
import { LuClipboardEdit } from "react-icons/lu";
import GreenCheckmark from "../Modules/GreenCheckmark";
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteAssignment } from "./reducer";

export default function Assignments() {
  const { cid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const assignments = useSelector((state: any) =>
    state.assignmentsReducer.assignments.filter((assignment: any) => assignment.course === cid)
  );

  const handleDelete = (assignmentId: string) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      dispatch(deleteAssignment(assignmentId));
    }
  };
  return (
    <div id="wd-assignments" className="container">
      {/* Assignments Controls */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* Search Bar with Icon */}
        <div className="flex-grow-1 me-2">
          <div className="input-group input-group-lg">
            <span className="input-group-text" id="search-icon">
              <CiSearch />
            </span>
            <input
              id="wd-search-assignment"
              className="form-control"
              placeholder="Search..."
              aria-label="Search"
              aria-describedby="search-icon"
            />
          </div>
        </div>

        {/* + Group Button */}
        <button id="wd-group-btn" className="btn btn-secondary btn-lg me-2">
          <FaPlus className="me-1" /> Group
        </button>

        {/* + Assignment Button */}
        <button
          id="wd-add-assignment-btn"
          className="btn btn-danger btn-lg"
          onClick={() => navigate(`/Kanbas/Courses/${cid}/Assignments/New`)}
        >
          <FaPlus className="me-1" /> Assignment
        </button>
      </div>

      {/* Assignments Header */}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center bg-secondary rounded-0">
          <div className="d-flex align-items-center">
            <BsGripVertical className="me-2 fs-4" />
            <FaChevronDown className="me-2 fs-5" />
            <span className="wd-title p-3 ps-2 strong">ASSIGNMENTS</span>
          </div>

          <div className="d-flex align-items-center">
            <span className="bg-secondary text-dark border border-dark me-2 p-2 rounded text-muted">40% of Total</span>
            <FaPlus className="me-2" />
            <BsThreeDotsVertical className="fs-4" />
          </div>
        </div>

        {/* Assignment List */}
        <ul id="wd-assignment-list" className="list-group">
          {assignments.map((assignment: any) => (
            <li
              key={assignment._id}
              className="wd-assignment-list-item list-group-item d-flex align-items-start p-3 rounded-0"
              style={{ borderLeft: "5px solid green" }}
            >
              <div className="d-flex align-items-center align-self-center me-3">
                <BsGripVertical className="fs-4" />
                <LuClipboardEdit className="fs-4 ms-2 text-success" /> {/* Green Clipboard Icon */}
              </div>
              <div className="flex-grow-1">
                <a
                  className="wd-assignment-link fw-bold d-block text-decoration-none text-dark"
                  onClick={() => navigate(`/Kanbas/Courses/${cid}/Assignments/${assignment._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  {assignment.title}
                </a>
                <p className="mb-0 text-muted">
                  <span className="text-danger">Multiple Modules</span> | <strong>Not available until</strong> {assignment.availableFrom} <br />
                  <strong>Due</strong> {assignment.dueDate} | {assignment.points} pts
                </p>
              </div>
              <div className="d-flex align-items-center align-self-center">
                <GreenCheckmark />
                <FaTrash
                  className="text-danger ms-3 fs-5"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleDelete(assignment._id)}
                />
                <BsThreeDotsVertical className="ms-3 fs-4" />

              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
