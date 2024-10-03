import React from "react";

export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor" className="container mt-4">
      {/* Assignment Name */}
      <div className="row mb-3">
        <label htmlFor="wd-name" className="col-md-2 col-form-label text-end">
          Assignment Name
        </label>
        <div className="col-md-12">
          <input
            id="wd-name"
            value="A1 - ENV + HTML"
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
            defaultValue="The assignment is available online. Submit a link to the landing page of your Web application running on Netlify."
          ></textarea>
        </div>
      </div>

      {/* Points */}
      <div className="row mb-3">
        <label htmlFor="wd-points" className="col-md-2 col-form-label text-end">
          Points
        </label>
        <div className="col-md-10">
          <input id="wd-points" value={100} className="form-control" />
        </div>
      </div>

      {/* Assignment Group */}
      <div className="row mb-3">
        <label htmlFor="wd-group" className="col-md-2 col-form-label text-end">
          Assignment Group
        </label>
        <div className="col-md-10">
          <select id="wd-group" className="form-control">
            <option value="assignments">ASSIGNMENTS</option>
          </select>
        </div>
      </div>

      {/* Display Grade As */}
      <div className="row mb-3">
        <label
          htmlFor="wd-display-grade-as"
          className="col-md-2 col-form-label text-end"
        >
          Display Grade As
        </label>
        <div className="col-md-10">
          <select id="wd-display-grade-as" className="form-control">
            <option value="percentage">Percentage</option>
          </select>
        </div>
      </div>

      <div className="row mb-3">
        {/* Submission Type */}
        <div className="col-md-2 text-end">
          <label htmlFor="wd-submission-type" className="col-form-label">
            Submission Type
          </label>
        </div>
        <div className="col-md-10 border p-4">
          {/* Dropdown for Submission Type */}
          <select id="wd-submission-type" className="form-control mb-3 ">
            <option value="online">Online</option>
          </select>
          {/* Online Entry Options */}
          <label className="col-form-label">
            <strong>Online Entry Options</strong>
          </label>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="wd-text-entry"
            />
            <label className="form-check-label" htmlFor="wd-text-entry">
              Text Entry
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="wd-website-url"
            />
            <label className="form-check-label" htmlFor="wd-website-url">
              Website URL
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="wd-media-recordings"
            />
            <label className="form-check-label" htmlFor="wd-media-recordings">
              Media Recordings
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="wd-student-annotation"
            />
            <label className="form-check-label" htmlFor="wd-student-annotation">
              Student Annotation
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="wd-file-upload"
            />
            <label className="form-check-label" htmlFor="wd-file-upload">
              File Uploads
            </label>
          </div>
        </div>
      </div>

      <div className="row mb-3">
        {/* Assign Label */}
        <div className="col-md-2 text-end">
          <label htmlFor="wd-assign-to" className="col-form-label">
            Assign
          </label>
        </div>
        <div className="col-md-10 border p-3">
          {/* Assign To */}
          <div className="mb-3">
            <label htmlFor="wd-assign-to" className="form-label">
              <strong>Assign To</strong>
            </label>
            <input
              id="wd-assign-to"
              value={"Everyone"}
              className="form-control"
            />
          </div>

          {/* Due Date */}
          <div className="mb-3">
            <label htmlFor="wd-due-date" className="form-label">
              <strong>Due</strong>
            </label>
            <input
              type="datetime-local"
              id="wd-due-date"
              className="form-control"
              defaultValue={"2024-05-13T23:59"}
            />
          </div>

          {/* Available From and Until */}
          <div className="row">
            <div className="col-md-6">
              <label htmlFor="wd-available-from" className="form-label">
                <strong>Available From</strong>
              </label>
              <input
                type="datetime-local"
                id="wd-available-from"
                className="form-control"
                defaultValue={"2024-05-06T00:00"}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="wd-until" className="form-label">
                <strong>Until</strong>
              </label>
              <input
                type="datetime-local"
                id="wd-until"
                className="form-control"
                defaultValue={"2024-05-20T00:00"}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="row mt-4">
        <hr />
        <div className="col-md-12 text-end">
          <button className="btn btn-secondary me-2">Cancel</button>
          <button className="btn btn-danger">Save</button>
        </div>
      </div>
    </div>
  );
}
