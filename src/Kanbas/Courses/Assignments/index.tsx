import React from "react";
import { FaPlus, FaChevronDown } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { BsGripVertical, BsThreeDotsVertical } from "react-icons/bs";
import { LuClipboardEdit } from "react-icons/lu";
import GreenCheckmark from "../Modules/GreenCheckmark";
import { useParams } from "react-router"; 
import * as db from "../../Database"; 

export default function Assignments() {
  const { cid } = useParams(); 
  const assignments = db.assignments.filter(assignment => assignment.course === cid); // Filter assignments by course ID

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
        <button id="wd-add-assignment-btn" className="btn btn-danger btn-lg">
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
          {assignments.map((assignment) => (
            <li
              key={assignment._id}
              className="wd-assignment-list-item list-group-item d-flex align-items-start p-3 rounded-0"
              style={{ borderLeft: "5px solid green" }}
            >
              <div className="d-flex align-items-center align-self-center me-3">
                {/* Centering icons vertically */}
                <BsGripVertical className="fs-4" />
                <LuClipboardEdit className="fs-4 ms-2 text-success" /> {/* Green Clipboard Icon */}
              </div>
              <div className="flex-grow-1">
                <a
                  className="wd-assignment-link fw-bold d-block text-decoration-none text-dark"
                  href={`#/Kanbas/Courses/${cid}/Assignments/${assignment._id}`}
                >
                  {assignment.title}
                </a>
                <p className="mb-0 text-muted">
                  <span className="text-danger">Multiple Modules</span> | <strong>Not available until</strong> May 6 at 12:00am <br />
                  <strong>Due</strong> May 13 at 11:59pm | 100 pts
                </p>
              </div>
              <div className="d-flex align-items-center align-self-center">
                <GreenCheckmark />
                <BsThreeDotsVertical className="ms-3 fs-4" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
