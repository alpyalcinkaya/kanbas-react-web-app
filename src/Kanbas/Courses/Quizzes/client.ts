// client.ts
import axios from "axios";

const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const QUIZZES_API = `${REMOTE_SERVER}/api/quizzes`;
const COURSES_API = `${REMOTE_SERVER}/api/courses`;

const axiosInstance = axios.create({
  baseURL: REMOTE_SERVER,
  withCredentials: true,
});

// Create a quiz for a specific course
export const createQuizForCourse = async (courseId: any, quiz: any) => {
  const response = await axiosInstance.post(`${COURSES_API}/${courseId}/quizzes`, quiz);
  return response.data;
};

// Retrieve all quizzes for a specific course
export const findQuizzesForCourse = async (courseId: any) => {
  const response = await axiosInstance.get(`${COURSES_API}/${courseId}/quizzes`);
  return response.data;
};

// Fetch questions by quiz ID
export const findQuestionsByQuizId = async (quizId: any) => {
  try {
    console.log("Attempting to find questions for the quiz.");
    const response = await axiosInstance.get(`${QUIZZES_API}/${quizId}/questions`);
    console.log("findQuestionsByQuizId response: ", response);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching questions 1 :", error);
    throw error;
  }
};

// Update an existing quiz
export const updateQuiz = async (quiz: any) => {
  const response = await axiosInstance.put(`${QUIZZES_API}/${quiz._id}`, quiz);
  return response.data;
};

// Delete a quiz by its ID
export const deleteQuiz = async (quizId: any) => {
  const response = await axiosInstance.delete(`${QUIZZES_API}/${quizId}`);
  return response.data;
};

// Find a quiz by ID
export const findQuizById = async (
  courseId: any,
  quizId: any,
  mode: "edit" | "preview" = "preview"
) => {
  const baseUrl = `${COURSES_API}/${courseId}/quizzes/${quizId}`;
  const url = mode === "edit" ? `${baseUrl}/edit` : `${baseUrl}/preview`;
  const response = await axiosInstance.get(url);
  return response.data;
};

// Create a new question
export const createQuestion = async (questionData: any) => {
  const response = await axiosInstance.post(`/api/questions`, questionData);
  return response.data;
};

// Associate a question with a quiz
export const associateQuestionWithQuiz = async (quizId: any, questionId: any) => {
  const response = await axiosInstance.post(
    `/api/quizzes/${quizId}/questions/${questionId}`
  );
  return response.data;
};

export const addQuestionToQuiz = async (quizId: any, questionData: any) => {
  try {
    console.log("Sending request to add question:", questionData);
    const response = await axiosInstance.post(
      `/api/quizzes/${quizId}/questions`,
      questionData
    );
    console.log("Question added successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error in addQuestionToQuiz:", error);
    throw error;
  }
};

// Delete a quiz by its ID
export const deleteQuestion = async (questionId: any) => {
  try {
    console.log(`Deleting question with ID: ${questionId}`);
    const response = await axiosInstance.delete(`/api/questions/${questionId}`);
    console.log("Question deleted successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error deleting question:", error);
    throw error;
  }
};


