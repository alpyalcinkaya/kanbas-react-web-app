import React
 from "react";
export default function AssignmentEditor() {
    return (
      <div id="wd-assignments-editor">
        <label htmlFor="wd-name"><h2>Assignment Name</h2></label>
        <input id="wd-name" value="A1 - ENV + HTML" /><br /><br />
        <textarea id="wd-description">
          The assignment is available online Submit a link to the landing page of
        </textarea>
        <br />
        <table>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-points">Points</label>
            </td>
            <td>
              <input id="wd-points" value={100} />
            </td>
          </tr>
          {/* Complete on your own */}

          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-group">Assignment Group</label>
            </td>
            <td>
              <select name = "groups" id="wd-group">
                <option value="assignments">ASSIGNMENTS</option>
              </select>
            </td>
          </tr>

          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-display-grade-as">Display Grade As</label>
            </td>
            <td>
              <select name = "grade-display" id="wd-display-grade-as">
                <option value="assignments">Percentage</option>
              </select>
            </td>
          </tr>

          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-submission-type">Submission Type</label><br />
            </td>
            <td>
              <select name = "submission" id="wd-submission-type">
                <option value="online">Online</option>
              </select>
            </td>
          </tr>

          <tr>
            <td align="right" valign="top">
            </td>

            <td>
                <br />
                <label htmlFor="wd-submission-type"> Online Entry Options</label><br />
                <input type ="checkbox" id="wd-text-entry" name="text-entry" value="text-entry"></input>
                <label htmlFor="wd-text-entry"> Text Entry</label><br />
                <input type ="checkbox" id="wd-website-url" name="website-url" value="website-url"></input>
                <label htmlFor="wd-website-url">Website URL</label><br />
                <input type ="checkbox" id="wd-media-recordings" name="media-recordings" value="media-recordings"></input>
                <label htmlFor="wd-media-recordings">Media Recordings</label><br />
                
                <input type ="checkbox" id="wd-student-annotation" name="student-annotation" value="student-annotation"></input>
                <label htmlFor="wd-student-annotation">Student Annotation</label><br />
                
                <input type ="checkbox" id="wd-file-upload" name="file-upload" value="file-upload"></input>
                <label htmlFor="wd-file-upload">File Uploads</label><br />
            </td>
          </tr>

          <tr>
            <td>
            </td>

            <td align="left">
                <br />
                <label htmlFor="wd-assign-to">Assign Assign to</label><br />
                <input id="wd-assign-to" value={"Everyone"} /><br/>
                <br />
                <label htmlFor="wd-due-date">Due</label><br />
                <input type="date" id="wd-due-date" value={"Everyone"} />
            </td>
          </tr>

          <tr>
            <td>
            </td>

            <td align="left">
                <br />
                <label htmlFor="wd-available-from">Available from</label> <br />
                <input type="date" id="wd-due-date" value={"Everyone"} />
            </td>

            <td align="left">
                <br />
                <label htmlFor="wd-due-date">Until</label> <br />
                <input type="date" id="wd-due-date" value={"Everyone"} />
            </td>


          </tr>

        </table>

        <hr></hr>
        <button>Cancel</button>
        <button>Save</button>
      </div>
  );}
  