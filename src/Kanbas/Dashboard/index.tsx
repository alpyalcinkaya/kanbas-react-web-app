import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaPlus } from "react-icons/fa";
import * as courseClient from "../Courses/client";
import * as enrollmentClient from "./client";
import * as userClient from "../Account/client";

interface Course {
  _id: string;
  name: string;
  description: string;
}

interface DashboardProps {
  courses: Course[];
  course: Course;
  setCourse: (course: Course) => void;
  addNewCourse: () => void;
  deleteCourse: (courseId: string) => void;
  updateCourse: () => void;
}

export default function Dashboard({
  courses,
  course,
  setCourse,
  addNewCourse,
  deleteCourse,
  updateCourse,
}: DashboardProps) {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [showAllCourses, setShowAllCourses] = useState(true);
  const [allCourses, setAllCourses] = useState<Course[]>(courses);

  // Fetch all courses and enrollments for students
  const fetchData = async () => {
    try {
      // Both roles should be able to see all courses
      const fetchedCourses = await courseClient.fetchAllCourses();
      setAllCourses(fetchedCourses);

      if (currentUser.role === "STUDENT") {
        // Only students need to track their enrollments
        const enrollments = await enrollmentClient.findCoursesForUser(
          currentUser._id
        );
        setEnrolledCourses(
          enrollments.map((enrollment: any) => enrollment._id)
        );
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  // Filter courses based on the student's view preference
  const filteredCourses =
    currentUser.role === "STUDENT"
      ? showAllCourses
        ? allCourses
        : allCourses.filter((course) => enrolledCourses.includes(course._id))
      : courses;

  // Toggle enrollment for students
  const handleEnrollmentToggle = async (courseId: string) => {
    const isEnrolled = enrolledCourses.includes(courseId);
    try {
      if (isEnrolled) {
        await enrollmentClient.unenrollFromCourse(currentUser._id, courseId);
        setEnrolledCourses((prevEnrolled) =>
          prevEnrolled.filter((id) => id !== courseId)
        );
      } else {
        await enrollmentClient.enrollInCourse(currentUser._id, courseId);
        setEnrolledCourses((prevEnrolled) => [...prevEnrolled, courseId]);
      }
    } catch (error) {
      console.error("Failed to update enrollment:", error);
    }
  };

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />

      {/* Toggle button for Students */}
      {currentUser.role === "STUDENT" && (
        <button
          className="btn btn-primary mb-3"
          onClick={() => setShowAllCourses(!showAllCourses)}
        >
          {showAllCourses ? "Show Enrolled Courses" : "Show All Courses"}
        </button>
      )}

      {currentUser.role === "FACULTY" && (
        <>
          <h5>
            New Course
            <button
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={addNewCourse}
            >
              <FaPlus className="me-1" /> Add
            </button>
            <button
              className="btn btn-warning float-end me-2"
              onClick={updateCourse}
              id="wd-update-course-click"
            >
              Update
            </button>
          </h5>
          <br />
          <input
            value={course.name}
            className="form-control mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
          />
          <textarea
            value={course.description}
            className="form-control mb-2"
            onChange={(e) =>
              setCourse({ ...course, description: e.target.value })
            }
          />
          <hr />
          <h2 id="wd-dashboard-published">
            Published Courses ({courses.length})
          </h2>
          <hr />
        </>
      )}

      <div
        id="wd-dashboard-courses"
        className="row row-cols-1 row-cols-md-5 g-4"
      >
        {filteredCourses.map((course: Course) => {
          const isEnrolled = enrolledCourses.includes(course._id);

          return (
            <div className="wd-dashboard-course col" key={course._id}>
              <div className="card rounded-3 overflow-hidden">
                <Link
                  to={`/Kanbas/Courses/${course._id}/Home`}
                  className="text-decoration-none text-dark"
                >
                  <img
                    src="/images/reactjs.jpg"
                    alt="Course Thumbnail"
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{course.name}</h5>
                    <p
                      className="card-text"
                      style={{ maxHeight: 100, overflow: "hidden" }}
                    >
                      {course.description}
                    </p>
                  </div>
                </Link>

                {/* Enrollment Button for Students */}
                {currentUser.role === "STUDENT" && (
                  <button
                    onClick={() => handleEnrollmentToggle(course._id)}
                    className={`btn ${
                      isEnrolled ? "btn-danger" : "btn-success"
                    } w-100`}
                  >
                    {isEnrolled ? "Unenroll" : "Enroll"}
                  </button>
                )}

                {/* Edit/Delete Controls for Faculty */}
                {currentUser.role === "FACULTY" && (
                  <div className="d-flex justify-content-between p-2">
                    <button
                      className="btn btn-warning"
                      onClick={() => setCourse(course)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteCourse(course._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
