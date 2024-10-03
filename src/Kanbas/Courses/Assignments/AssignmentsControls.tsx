import React from "react";
import { FaPlus } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import GreenCheckmark from "../Modules/GreenCheckmark";

export default function AssignmentControls() {
  return (
    <div id="wd-assignments-controls" className="d-flex justify-content-between align-items-center mb-3">
      {/* Search Bar with Icon */}
      <div className="flex-grow-1 me-2">
        <div className="input-group input-group-lg"> 
          <span className="input-group-text" id="basic-addon1">
            <CiSearch />
          </span>
          <input
            id="wd-search-assignment"
            className="form-control form-control-lg" 
            placeholder="Search..."
          />
        </div>
      </div>

      {/* View Progress button */}
      <button
        id="wd-group-progress"
        className="btn btn-lg btn-secondary me-1"
      >
        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
        Group
      </button>

      {/* Add Assignment button */}
      <button
        id="wd-add-assgn-btn"
        className="btn btn-lg btn-danger"
      >
        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
        Assignment
      </button>
    </div>
  );
}
