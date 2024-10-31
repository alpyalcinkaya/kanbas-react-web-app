import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { updateAssignment, addAssignment } from "./reducer";

export default function AssignmentEditor() {
  const { cid, aid } = useParams<{ cid: string; aid: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch the specific assignment from Redux store based on aid
  const assignment = useSelector((state: any) =>
    state.assignmentsReducer.assignments.find((a: any) => a._id === aid)
  );

  // Initialize state with assignment details if found
  const [title, setTitle] = useState(assignment?.title || "");
  const [description, setDescription] = useState(assignment?.description || "");
  const [points, setPoints] = useState(assignment?.points || 0);
  const [dueDate, setDueDate] = useState(assignment?.dueDate || "");
  const [availableFrom, setAvailableFrom] = useState(assignment?.availableFrom || "");
  const [availableUntil, setAvailableUntil] = useState(assignment?.availableUntil || "");

  useEffect(() => {
    // Populate state fields if an assignment is found (Edit mode)
    if (assignment) {
      setTitle(assignment.title);
      setDescription(assignment.description);
      setPoints(assignment.points);
      setDueDate(assignment.dueDate);
      setAvailableFrom(assignment.availableFrom);
      setAvailableUntil(assignment.availableUntil);
    }
  }, [assignment]);

  const handleSave = () => {
    if (aid && assignment) {
      // Edit mode: Update existing assignment
      const updatedAssignment = {
        _id: assignment._id,
        title,
        description,
        points,
        dueDate,
        availableFrom,
        availableUntil,
        course: assignment.course,
      };
      dispatch(updateAssignment(updatedAssignment));
    } else {
      // Add mode: Create a new assignment
      const newAssignment = {
        title,
        description,
        points,
        dueDate,
        availableFrom,
        availableUntil,
        course: cid, 
      };
      dispatch(addAssignment(newAssignment));
    }
    navigate(`/Kanbas/Courses/${cid}/Assignments`);
  };

  const handleCancel = () => {
    navigate(`/Kanbas/Courses/${cid}/Assignments`);
  };

  
  return (
    <div id="wd-assignments-editor" className="container mt-4">
      <h2>{aid ? "Edit Assignment" : "Add New Assignment"}</h2>

      {/* Assignment Title */}
      <div className="row mb-3">
        <label htmlFor="wd-title" className="col-md-2 col-form-label">
          Assignment Title
        </label>
        <div className="col-md-12">
          <input
            id="wd-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
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
            type="number"
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
            className="form-control"
          />
        </div>
      </div>

      {/* Available From and Until Dates */}
      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="wd-available-from" className="form-label">
            Available From
          </label>
          <input
            type="datetime-local"
            id="wd-available-from"
            className="form-control"
            value={availableFrom}
            onChange={(e) => setAvailableFrom(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="wd-until" className="form-label">
            Available Until
          </label>
          <input
            type="datetime-local"
            id="wd-until"
            className="form-control"
            value={availableUntil}
            onChange={(e) => setAvailableUntil(e.target.value)}
          />
        </div>
      </div>

      {/* Due Date */}
      <div className="row mb-3">
        <label htmlFor="wd-due-date" className="col-md-2 col-form-label text-end">
          Due Date
        </label>
        <div className="col-md-10">
          <input
            type="datetime-local"
            id="wd-due-date"
            className="form-control"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="row mt-4">
        <hr />
        <div className="col-md-12 text-end">
          <button onClick={handleCancel} className="btn btn-secondary me-2">
            Cancel
          </button>
          <button onClick={handleSave} className="btn btn-danger">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
