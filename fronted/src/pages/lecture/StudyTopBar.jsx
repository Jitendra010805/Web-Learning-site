import React from "react";
import { MdArrowBack, MdSearch, MdSettings, MdMenu } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "./studyTopBar.css";

const StudyTopBar = ({ courseTitle, toggleSidebar }) => {
  const navigate = useNavigate();

  return (
    <nav className="study-top-bar">
      <div className="top-bar-left">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <MdArrowBack size={24} />
        </button>
        <div className="course-title-container">
          <span className="course-badge">Course</span>
          <h1 className="study-course-title">{courseTitle}</h1>
        </div>
      </div>

      <div className="top-bar-right">
        <button className="top-bar-icon-btn mobile-only" onClick={toggleSidebar}>
          <MdMenu size={24} />
        </button>
        <button className="top-bar-icon-btn">
          <MdSearch size={24} />
        </button>
        <button className="top-bar-icon-btn">
          <MdSettings size={22} />
        </button>
      </div>
    </nav>
  );
};

export default StudyTopBar;
