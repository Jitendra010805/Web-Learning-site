import React from "react";
import "./dashboard.css";
import { CourseData } from "../../context/CourseContext";
import CourseCard from "../../components/coursecard/CourseCard";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { MdPlayCircle, MdCheckCircle, MdTimeline } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Dashbord = () => {
  const { mycourse } = CourseData();
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="student-dashboard fade-in">



        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'rgba(22, 163, 74, 0.1)', color: '#16a34a' }}>
              <MdPlayCircle size={28} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{mycourse?.length || 0}</div>
              <div className="stat-label">Enrolled Courses</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
              <MdCheckCircle size={28} />
            </div>
            <div className="stat-info">
              <div className="stat-value">0</div>
              <div className="stat-label">Completed Courses</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
              <MdTimeline size={28} />
            </div>
            <div className="stat-info">
              <div className="stat-value">0h</div>
              <div className="stat-label">Learning Time</div>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Your Enrolled Courses</h2>
            <button className="text-btn" onClick={() => navigate("/courses")}>Browse More</button>
          </div>
          <div className="dashboard-content">
            {mycourse && mycourse.length > 0 ? (
              <div className="course-grid">
                {mycourse.map((e) => (
                  <CourseCard key={e._id} course={e} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h3>No courses enrolled yet</h3>
                <p>Start your learning journey by browsing our available courses.</p>
                <button className="common-btn" onClick={() => navigate("/courses")}>Explore Courses</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashbord;
