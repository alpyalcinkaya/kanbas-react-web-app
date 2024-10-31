import { createSlice } from "@reduxjs/toolkit";
import { enrollments as initialEnrollments } from "../Database";

const initialState = {
  enrollments: initialEnrollments || []
};

const enrollmentSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    enrollInCourse: (state, { payload }) => {
      const { userId, courseId } = payload;
      const alreadyEnrolled = state.enrollments.some(
        (enrollment) => enrollment.user === userId && enrollment.course === courseId
      );

      if (!alreadyEnrolled) {
        const newEnrollment = {
          _id: new Date().getTime().toString(),
          user: userId,
          course: courseId,
        };
        state.enrollments.push(newEnrollment);
      }
    },
    unenrollFromCourse: (state, { payload }) => {
      const { userId, courseId } = payload;

      state.enrollments = state.enrollments.filter(
        (enrollment) => !(enrollment.user === userId && enrollment.course === courseId)
      );
    },
    setEnrollments: (state, { payload }) => {
      state.enrollments = payload;
    },
  },
});

export const { enrollInCourse, unenrollFromCourse, setEnrollments } = enrollmentSlice.actions;

export default enrollmentSlice.reducer;
