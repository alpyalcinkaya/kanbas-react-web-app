import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";
import Account from "./Account";
import Dashboard from "./Dashboard";
import KanbasNavigation from "./Navigation";
import Courses from "./Courses";
import "./styles.css";
import { useState } from "react";
import ProtectedRoute from "./Account/ProtectedRoute";
import Session from "./Account/Session";
import * as userClient from "./Account/client";
import { useSelector } from "react-redux";
import * as courseClient from "./Courses/client";

export default function Kanbas() {
  const [courses, setCourses] = useState<any[]>([]);
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const [course, setCourse] = useState<any>({
    _id: "1234",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    description: "New Description",
  });

  // Add a new course
  const addNewCourse = async () => {
    try {
      const newCourse = await userClient.createCourse(course);
      setCourses(prevCourses => [...prevCourses, newCourse]);
    } catch (error) {
      console.error("Failed to add course:", error);
    }
  };

  // Delete a course
  const deleteCourse = async (courseId: string) => {
    try {
      await courseClient.deleteCourse(courseId);
      setCourses(prevCourses => prevCourses.filter((c) => c._id !== courseId));
    } catch (error) {
      console.error("Failed to delete course:", error);
    }
  };

  // Update a course
  const updateCourse = async () => {
    try {
      await courseClient.updateCourse(course);
      setCourses(prevCourses =>
        prevCourses.map((c) => (c._id === course._id ? course : c))
      );
    } catch (error) {
      console.error("Failed to update course:", error);
    }
  };

  // Fetch the courses assigned to the logged-in faculty
  const fetchCourses = async () => {
    try {
      const fetchedCourses = await courseClient.fetchAllCourses();
      setCourses(fetchedCourses);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  useEffect(() => {
    if (currentUser?.role === "FACULTY") {
      fetchCourses();
    }
  }, [currentUser]);

  return (
    <Session>
      <div id="wd-kanbas">
        <KanbasNavigation />
        <div className="wd-main-content-offset p-3">
          <Routes>
            <Route path="/" element={<Navigate to="/Kanbas/Account" />} />
            <Route path="/Account/*" element={<Account />} />
            <Route
              path="/Dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard
                    courses={courses}
                    course={course}
                    setCourse={setCourse}
                    addNewCourse={addNewCourse}
                    deleteCourse={deleteCourse}
                    updateCourse={updateCourse}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Courses/:cid/*"
              element={
                <ProtectedRoute>
                  <Courses courses={courses} />
                </ProtectedRoute>
              }
            />
            <Route path="/Calendar" element={<h1>Calendar</h1>} />
            <Route path="/Inbox" element={<h1>Inbox</h1>} />
          </Routes>
        </div>
      </div>
    </Session>
  );
}

