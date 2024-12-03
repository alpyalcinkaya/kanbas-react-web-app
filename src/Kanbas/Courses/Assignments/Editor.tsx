import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as assignmentClient from "./client"; // Import all functions as assignmentClient
import { useDispatch } from "react-redux";
import { addAssignment, updateAssignment } from "./reducer";

export default function AssignmentEditor() {
  const { cid, aid } = useParams();  
  const navigate = useNavigate();

  // State variables
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableUntil, setAvailableUntil] = useState("");

  // Fetch assignment data (in edit mode)
  useEffect(() => {
    const fetchAssignment = async () => {
      if (aid && aid !== "New" && cid) {
        const assignments = await assignmentClient.findAssignmentsForCourse(cid);
        const assignment = assignments.find((a: any) => a._id === aid);
        if (assignment) {
          setTitle(assignment.title);
          setDescription(assignment.description);
          setPoints(assignment.points);
          setDueDate(assignment.dueDate ? new Date(assignment.dueDate).toISOString().slice(0, 16) : "");
          setAvailableFrom(assignment.availableFrom ? new Date(assignment.availableFrom).toISOString().slice(0, 16) : "");
          setAvailableUntil(assignment.availableUntil ? new Date(assignment.availableUntil).toISOString().slice(0, 16) : "");
        }
      }
    };
    fetchAssignment();
  }, [cid, aid]);


  // Handle Save Button Click
  const handleSave = async () => {
    try {
      const assignmentData = {
        title,
        description,
        points,
        dueDate: new Date(dueDate),
        availableFrom: new Date(availableFrom),
        availableUntil: new Date(availableUntil),
        course: cid,
      };

      if (aid && aid !== "New") {
        await assignmentClient.updateAssignment({ _id: aid, ...assignmentData });
      } else {
        await assignmentClient.createAssignmentForCourse(cid, assignmentData);
      }
      navigate(`/Kanbas/Courses/${cid}/Assignments`);
    } catch (error) {
      console.error("Failed to save assignment:", error);
    }
  };

  // Handle Cancel Button Click
  const handleCancel = () => {
    navigate(`/Kanbas/Courses/${cid}/Assignments`);
  };

  return (
    <div id="wd-assignments-editor" className="container mt-4">
      <h2>{aid === "New" ? "Add New Assignment" : "Edit Assignment"}</h2>

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
