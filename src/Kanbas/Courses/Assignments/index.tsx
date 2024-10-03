import React from "react";
import { FaPlus, FaChevronDown } from "react-icons/fa6"; // FaChevronDown for dropdown arrow
import { CiSearch } from "react-icons/ci";
import { BsGripVertical, BsThreeDotsVertical } from "react-icons/bs"; // BsThreeDotsVertical for the three dots
import { LuClipboardEdit } from "react-icons/lu"; // Clipboard icon
import GreenCheckmark from "../Modules/GreenCheckmark";

export default function Assignments() {
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
          {/* Assignment Item 1 */}
          <li className="wd-assignment-list-item list-group-item d-flex align-items-start p-3 rounded-0" style={{ borderLeft: "5px solid green" }}>
            <div className="d-flex align-items-center align-self-center me-3"> {/* Centering icons vertically */}
              <BsGripVertical className="fs-4" />
              <LuClipboardEdit className="fs-4 ms-2 text-success" /> {/* Green Clipboard Icon */}
            </div>
            <div className="flex-grow-1">
              <a className="wd-assignment-link fw-bold d-block text-decoration-none text-dark" href="#/Kanbas/Courses/1234/Assignments/123">
                A1 - ENV + HTML
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

          {/* Assignment Item 2 */}
          <li className="wd-assignment-list-item list-group-item d-flex align-items-start p-3 rounded-0" style={{ borderLeft: "5px solid green" }}>
            <div className="d-flex align-items-center align-self-center me-3"> 
              <BsGripVertical className="fs-4" />
              <LuClipboardEdit className="fs-4 ms-2 text-success" /> {/* Green Clipboard Icon */}
            </div>
            <div className="flex-grow-1">
              <a className="wd-assignment-link fw-bold d-block text-decoration-none text-dark" href="#/Kanbas/Courses/1234/Assignments/123">
                A2 - CSS + BOOTSTRAP
              </a>
              <p className="mb-0 text-muted">
                <span className="text-danger">Multiple Modules</span> | <strong>Not available until</strong> May 13 at 12:00am <br />
                <strong>Due</strong> May 20 at 11:59pm | 100 pts
              </p>
            </div>
            <div className="d-flex align-items-center align-self-center">
              <GreenCheckmark />
              <BsThreeDotsVertical className="ms-3 fs-4" /> 
            </div>
          </li>

          {/* Assignment Item 3 */}
          <li className="wd-assignment-list-item list-group-item d-flex align-items-start p-3 rounded-0" style={{ borderLeft: "5px solid green" }}>
            <div className="d-flex align-items-center align-self-center me-3"> 
              <BsGripVertical className="fs-4" />
              <LuClipboardEdit className="fs-4 ms-2 text-success" /> {/* Green Clipboard Icon */}
            </div>
            <div className="flex-grow-1">
              <a className="wd-assignment-link fw-bold d-block text-decoration-none text-dark" href="#/Kanbas/Courses/1234/Assignments/123">
                A3 - JAVASCRIPT + REACT
              </a>
              <p className="mb-0 text-muted">
                <span className="text-danger">Multiple Modules</span> | <strong>Not available until</strong> May 20 at 12:00am <br />
                <strong>Due</strong> May 27 at 11:59pm | 100 pts
              </p>
            </div>
            <div className="d-flex align-items-center align-self-center">
              <GreenCheckmark />
              <BsThreeDotsVertical className="ms-3 fs-4" /> 
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
