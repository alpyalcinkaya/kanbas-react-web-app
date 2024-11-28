import axios from "axios";

const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const QUIZZES_API = `${REMOTE_SERVER}/api/quizzes`;
const COURSES_API = `${REMOTE_SERVER}/api/courses`;

const axiosWithCredentials = axios.create({ withCredentials: true
});

// Create a quiz for a specific course
export const createQuizForCourse = async (courseId : any, quiz : any) => {
  const response = await axios.post(`${COURSES_API}/${courseId}/quizzes`, quiz);
  return response.data;
};

// Retrieve all quizzes for a specific course
export const findQuizzesForCourse = async (courseId: any) => {
  const response = await axios.get(`${COURSES_API}/${courseId}/quizzes`);
  return response.data;
};

// Update an existing quiz
export const updateQuiz = async (quiz: any) => {
  const response = await axios.put(`${QUIZZES_API}/${quiz._id}`, quiz);
  return response.data;
};

// Delete a quiz by its ID
export const deleteQuiz = async (quizId: any) => {
  const response = await axios.delete(`${QUIZZES_API}/${quizId}`);
  return response.data;
};

export const findQuizById = async (courseId: any, quizId: any, mode: 'edit' | 'preview' = 'preview') => {
  console.log("Client - Fetching Quiz by ID:", quizId, "Mode:", mode);
  
  // Determine URL based on mode
  // Base url for going to a specific quiz
  const baseUrl = `${COURSES_API}/${courseId}/quizzes/${quizId}`;

  // if edit mode then we go to edit page, preview go to preview page
  const url = mode === 'edit' ? `${baseUrl}/edit` : `${baseUrl}/preview`;

  const response = await axios.get(url);
  console.log("Client - Fetched Quiz Response:", response.data);
  return response.data;
};
