import React from "react";
import { useParams, Link } from "react-router-dom";
import * as db from "../../Database"; // Assuming your assignments data is in the Database

export default function AssignmentEditor() {
  const { cid, aid } = useParams(); // Get the course and assignment IDs from the URL params

  // Filter the assignment directly from the database based on the assignment ID
  const assignment = db.assignments.find(assignment => assignment._id === aid);

  if (!assignment) {
    return <div>Assignment not found.</div>; // Display a message if the assignment doesn't exist
  }

  return (
    <div id="wd-assignments-editor" className="container mt-4">
      {/* Assignment Name */}
      <div className="row mb-3">
        <label htmlFor="wd-name" className="col-md-2 col-form-label">
          Assignment Name
        </label>
        <div className="col-md-12">
          <input
            id="wd-name"
            value={assignment.title} 
            className="form-control"
            readOnly
          />
        </div>
      </div>

      {/* Assignment Description */}
      <div className="row mb-3">
        <div className="col-md-12">
          <textarea
            id="wd-description"
            rows={5}
            className="form-control"
            value={assignment.description || "No description available."} // Description field
            readOnly
          ></textarea>
        </div>
      </div>

      {/* Points */}
      <div className="row mb-3">
        <label htmlFor="wd-points" className="col-md-2 col-form-label text-end">
          Points
        </label>
        <div className="col-md-10">
          <input
            id="wd-points"
            value={assignment.points || 100} // Points value from the database
            className="form-control"
            readOnly
          />
        </div>
      </div>



      {/* Assign To, Due Date, Available From, and Until */}
      <div className="row mb-3">
        <div className="col-md-2 text-end">
          <label htmlFor="wd-assign-to" className="col-form-label">Assign</label>
        </div>
        <div className="col-md-10 border p-3">
          <div className="mb-3">
            <label htmlFor="wd-assign-to" className="form-label"><strong>Assign To</strong></label>
            <input id="wd-assign-to" value={"Everyone"} className="form-control" readOnly />
          </div>

          <div className="mb-3">
            <label htmlFor="wd-due-date" className="form-label"><strong>Due</strong></label>
            <input
              type="datetime-local"
              id="wd-due-date"
              className="form-control"
              value={assignment.dueDate} // Due date dynamically updated
              readOnly
            />
          </div>

          <div className="row">
            <div className="col-md-6">
              <label htmlFor="wd-available-from" className="form-label"><strong>Available From</strong></label>
              <input type="datetime-local" id="wd-available-from" className="form-control" defaultValue="2024-05-06T00:00" />
            </div>
            <div className="col-md-6">
              <label htmlFor="wd-until" className="form-label"><strong>Until</strong></label>
              <input type="datetime-local" id="wd-until" className="form-control" defaultValue="2024-05-20T00:00" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="row mt-4">
        <hr />
        <div className="col-md-12 text-end">
          <Link to={`/Kanbas/Courses/${cid}/Assignments`} className="btn btn-secondary me-2">Cancel</Link>
          <Link to={`/Kanbas/Courses/${cid}/Assignments`} className="btn btn-danger">Save</Link>
        </div>
      </div>
    </div>
  );
}
