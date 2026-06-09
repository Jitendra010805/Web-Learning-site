import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import Testimonials from "../../components/testimonials/Testimonials";
import { FaLaptopCode, FaPuzzlePiece, FaBoxOpen } from "react-icons/fa";
import { CourseData } from "../../context/CourseContext";
import CourseCard from "../../components/coursecard/CourseCard";

const Home = () => {
  const navigate = useNavigate();
  const { courses } = CourseData();

  return (
    <div className="home-page fade-in">
      {/* Hero Section */}
      <div className="home-hero">
        <h1 className="fade-up" style={{animationDelay: '0.2s'}}>Learn from Industry Experts</h1>
        <p className="fade-up" style={{animationDelay: '0.4s'}}>
          Discover a world of knowledge with our premium courses. Master new skills, 
          advance your career, and learn at your own pace from the best in the industry.
        </p>
        <button 
          onClick={() => navigate("/courses")} 
          className="white-btn fade-up" 
          style={{animationDelay: '0.6s'}}
        >
          View All Courses
        </button>
      </div>

      {/* Features Section */}
      <section className="features">
        <div className="feature-card fade-up" style={{animationDelay: '0.8s'}}>
          <div className="icon"><FaLaptopCode /></div>
          <h3>Actionable Training</h3>
          <p>Get hands-on experience with real-world projects and practical exercises.</p>
        </div>
        <div className="feature-card fade-up" style={{animationDelay: '1.0s'}}>
          <div className="icon"><FaPuzzlePiece /></div>
          <h3>Interesting Quizzes</h3>
          <p>Test your knowledge with interactive quizzes and track your progress.</p>
        </div>
        <div className="feature-card fade-up" style={{animationDelay: '1.2s'}}>
          <div className="icon"><FaBoxOpen /></div>
          <h3>Premium Material</h3>
          <p>Access exclusive resources, handouts, and high-quality learning content.</p>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="popular-courses fade-up" style={{animationDelay: '1.4s'}}>
        <h2 className="section-title">Our Most Popular Courses</h2>
        <div className="home-courses-container">
          {courses && courses.slice(0, 3).map((course, index) => (
            <div className="fade-up" style={{animationDelay: `${1.6 + index * 0.2}s`}} key={course._id}>
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      </section>

      <Testimonials />

      {/* CTA Section */}
      <div className="home-cta fade-up" style={{animationDelay: '2.2s'}}>
        <h2>Join Our 7452 Happy Students Today!</h2>
        <p>
          Don't wait to start your learning journey. Join thousands of students who have already transformed their careers through our platform.
        </p>
        <button onClick={() => navigate("/courses")} className="white-btn">
          Start Learning Now
        </button>
      </div>
    </div>
  );
};

export default Home;