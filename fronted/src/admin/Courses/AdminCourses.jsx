import React, { useState, useEffect } from "react";
import Layout from "../Utils/Layout";
import { useNavigate } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import CourseCard from "../../components/coursecard/CourseCard";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../../main";
import { motion } from "framer-motion";
import { MdLibraryBooks, MdAdd, MdClose } from "react-icons/md";
import "./admincourses.css";

const categories = [
  "Web Development", "App Development", "Game Development",
  "Data Science", "Artificial Intelligence",
];

const AdminCourses = ({ user }) => {
  const navigate = useNavigate();
  const { courses, fetchCourses } = CourseData();

  const [showForm, setShowForm]     = useState(false);
  const [title, setTitle]           = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory]     = useState("");
  const [price, setPrice]           = useState("");
  const [createdBy, setCreatedBy]   = useState("");
  const [duration, setDuration]     = useState("");
  const [image, setImage]           = useState("");
  const [imagePrev, setImagePrev]   = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    if (user && user.role !== "admin") navigate("/");
  }, [user, navigate]);

  const changeImageHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => { setImagePrev(reader.result); setImage(file); };
  };

  const resetForm = () => {
    setTitle(""); setDescription(""); setCategory(""); setPrice("");
    setCreatedBy(""); setDuration(""); setImage(""); setImagePrev("");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    const myForm = new FormData();
    myForm.append("title", title); myForm.append("description", description);
    myForm.append("category", category); myForm.append("price", price);
    myForm.append("createdBy", createdBy); myForm.append("duration", duration);
    myForm.append("file", image);
    try {
      const { data } = await axios.post(`${server}/api/course/new`, myForm, {
        headers: { token: localStorage.getItem("token") },
      });
      toast.success(data.message);
      await fetchCourses();
      resetForm();
      setShowForm(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <Layout>
      <div className="ac-page">

        {/* ── Header bar ── */}
        <div className="ac-header">
          <div className="ac-title-group">
            <MdLibraryBooks size={22} className="ac-icon" />
            <h2>All Courses</h2>
            <span className="ac-count">{courses?.length || 0} Courses</span>
          </div>
          {user && (
            <button className="ac-add-btn" onClick={() => setShowForm(!showForm)}>
              {showForm ? <MdClose size={18} /> : <MdAdd size={18} />}
              {showForm ? "Cancel" : "Add Course"}
            </button>
          )}
        </div>

        {/* ── Add Course Form ── */}
        {user && showForm && (
          <motion.div
            className="ac-form-panel"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="ac-form-title">New Course Details</h3>
            <form onSubmit={submitHandler} className="ac-form">
              <div className="ac-form-grid">
                <div className="ac-field">
                  <label>Course Title</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="E.g. Full Stack Web Dev" />
                </div>
                <div className="ac-field">
                  <label>Created By</label>
                  <input type="text" value={createdBy} onChange={(e) => setCreatedBy(e.target.value)} required placeholder="Instructor name" />
                </div>
                <div className="ac-field ac-span2">
                  <label>Description</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Short description of the course..." rows={3} />
                </div>
                <div className="ac-field">
                  <label>Price (₹)</label>
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
                </div>
                <div className="ac-field">
                  <label>Duration (Hours)</label>
                  <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} required />
                </div>
                <div className="ac-field">
                  <label>Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="">Select Category</option>
                    {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="ac-field">
                  <label>Cover Image</label>
                  <input type="file" onChange={changeImageHandler} required />
                  {imagePrev && <img src={imagePrev} alt="preview" className="ac-img-preview" />}
                </div>
              </div>
              <button type="submit" disabled={btnLoading} className="ac-submit-btn">
                {btnLoading ? "Creating Course..." : "Create Course"}
              </button>
            </form>
          </motion.div>
        )}

        {/* ── Course Grid ── */}
        {courses && courses.length > 0 ? (
          <motion.div
            className="ac-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            {courses.map((course, i) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="ac-empty">
            <div className="ac-empty-icon">📚</div>
            <h3>No Courses Yet</h3>
            <p>Add your first course using the button above.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminCourses;
