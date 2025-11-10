import { createContext, useContext, useEffect, useState } from "react";
import API from "../api";

const CourseContext = createContext();

export const CourseContextProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState([]);
  const [mycourse, setMyCourse] = useState([]);

  // Fetch all courses
  async function fetchCourses() {
    try {
      const { data } = await API.get("/api/course/all");
      setCourses(data.courses);
    } catch (error) {
      console.log("fetchCourses error:", error);
    }
  }

  // Fetch single course
  async function fetchCourse(id) {
    try {
      const { data } = await API.get(`/api/course/${id}`);
      setCourse(data.course);
    } catch (error) {
      console.log("fetchCourse error:", error);
    }
  }

  // Fetch user’s enrolled courses
  async function fetchMyCourse() {
    try {
      const { data } = await API.get("/api/mycourse"); // token handled by interceptor
      setMyCourse(data.courses);
    } catch (error) {
      console.log("fetchMyCourse error:", error);
    }
  }

  useEffect(() => {
    fetchCourses();
    fetchMyCourse();
  }, []);

  return (
    <CourseContext.Provider
      value={{
        courses,
        fetchCourses,
        fetchCourse,
        course,
        mycourse,
        fetchMyCourse,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const CourseData = () => useContext(CourseContext);
