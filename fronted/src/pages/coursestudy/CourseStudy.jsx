import React, { useEffect } from "react";
import "./coursestudy.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../main";
import StudyTopBar from "../lecture/StudyTopBar";
import { MdPlayArrow, MdOutlineCalendarToday, MdPersonOutline } from "react-icons/md";

const CourseStudy = ({ user }) => {
  const params = useParams();
  const navigate = useNavigate();
  const { fetchCourse, course } = CourseData();

  useEffect(() => {
    fetchCourse(params.id);
  }, [params.id, fetchCourse]);

  useEffect(() => {
     if (user && user.role !== "admin" && !user.subscription.includes(params.id)) {
        navigate("/");
     }
  }, [user, params.id, navigate]);

  return (
    <div className="course-study-container fade-in">
      <StudyTopBar courseTitle={course?.title} />
      
      {course && (
        <main className="course-study-hero">
          <div className="hero-background-wrapper">
             <img src={`${server}/${course.image}`} alt="" className="hero-blur-bg" />
          </div>

          <div className="hero-content-wrapper">
            <div className="course-hero-card glass-card">
              <div className="hero-grid">
                <div className="hero-image-section">
                  <img src={`${server}/${course.image}`} alt={course.title} className="main-hero-image" />
                </div>
                
                <div className="hero-info-section">
                  <div className="badge">Active Enrollment</div>
                  <h1 className="course-title-main">{course.title}</h1>
                  <p className="course-desc-main">{course.description}</p>
                  
                  <div className="course-meta-grid">
                    <div className="meta-item">
                      <MdPersonOutline className="meta-icon" />
                      <div className="meta-text">
                        <span>Instructor</span>
                        <strong>{course.createdBy}</strong>
                      </div>
                    </div>
                    <div className="meta-item">
                      <MdOutlineCalendarToday className="meta-icon" />
                      <div className="meta-text">
                        <span>Duration</span>
                        <strong>{course.duration} weeks</strong>
                      </div>
                    </div>
                  </div>

                  <div className="cta-section">
                    <Link to={`/lectures/${course._id}`} className="start-btn-main">
                      <MdPlayArrow size={24} />
                      Start Learning Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default CourseStudy;
