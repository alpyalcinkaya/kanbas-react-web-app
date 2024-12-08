import axios from "axios";

const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const ENROLLMENTS_API = `${REMOTE_SERVER}/api/enrollments`;
const axiosWithCredentials = axios.create({ withCredentials: true });


// Enroll a user in a course
export const enrollInCourse = async (userId : any, courseId : any) => {
  const response = await axiosWithCredentials.post(ENROLLMENTS_API, { userId, courseId });
  return response.data;
};

// Unenroll a user from a course
export const unenrollFromCourse = async (userId : any, courseId :any) => {
  await axiosWithCredentials.delete(ENROLLMENTS_API, { data: { userId, courseId } });
};

// Get all enrollments
export const findEnrollments = async () => {
  const response = await axiosWithCredentials.get(ENROLLMENTS_API);
  return response.data;
};

// Get all enrolled courses for a user
export const findCoursesForUser = async (userId:any) => {
  const response = await axiosWithCredentials.get(`${ENROLLMENTS_API}/${userId}/courses`);
  return response.data;
};



