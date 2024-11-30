// Assignments/reducer.ts
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  quizzes: [],
};

const quizSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setQuizzes: (state, action) => {
      console.log("setQuizzes called with:", action.payload);
      state.quizzes = action.payload;
    },
    addQuiz: (state, { payload: assignment }) => {
      console.log("addAssignment called with:", assignment);
      assignment.course = String(assignment.course);
      console.log("add assignment course", assignment.course);
      state.quizzes = [...state.quizzes, assignment] as any;
    },
    updateQuiz: (state, { payload: assignment }) => {
      state.quizzes = state.quizzes.map((a: any) =>
        a._id === assignment._id ? assignment : a
      ) as any;
    },
    deleteQuizAction: (state, { payload: quizId }) => {
      state.quizzes = state.quizzes.filter((a: any) => a._id !== quizId);
    
    },
  },
});

export const { setQuizzes, addQuiz, updateQuiz, deleteQuizAction } =
  quizSlice.actions;
export default quizSlice.reducer;
