import React, { useEffect, useState, useCallback } from "react";
import "./lecture.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import Loading from "../../components/loading/Loading";
import toast from "react-hot-toast";
import { TiTick } from "react-icons/ti";
import { MdSkipPrevious, MdSkipNext, MdAdd, MdDelete } from "react-icons/md";
import StudyTopBar from "./StudyTopBar";
import StudyBottomNav from "./StudyBottomNav";
import { CourseData } from "../../context/CourseContext";

const Lecture = ({ user }) => {
  const [lectures, setLectures] = useState([]);
  const [lecture, setLecture] = useState({});
  const [loading, setLoading] = useState(true);
  const [lecLoading, setLecLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState("player"); // 'lessons', 'progress', 'player'

  const params = useParams();
  const navigate = useNavigate();
  const { fetchCourse, course } = CourseData();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setvideo] = useState("");
  const [videoPrev, setVideoPrev] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const [completed, setCompleted] = useState("");
  const [completedLec, setCompletedLec] = useState("");
  const [lectLength, setLectLength] = useState("");
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    if (
      user &&
      user.role !== "admin" &&
      !user.subscription.includes(params.id)
    ) {
      navigate("/");
    }
    fetchCourse(params.id);
  }, [user, params.id, navigate, fetchCourse]);

  const fetchLectures = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${server}/api/lectures/${params.id}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      setLectures(data.lectures);
      if (data.lectures.length > 0 && !lecture._id) {
        setLecture(data.lectures[0]);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [params.id, lecture._id]);

  const fetchLecture = async (id) => {
    setLecLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/lecture/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setLecture(data.lecture);
      setLecLoading(false);
      setActiveTab("player"); // Switch to player on mobile when selecting a lecture
    } catch (error) {
      console.log(error);
      setLecLoading(false);
    }
  }

  const changeVideoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setVideoPrev(reader.result);
      setvideo(file);
    };
  };

  const submitHandler = async (e) => {
    setBtnLoading(true);
    e.preventDefault();

    const myForm = new FormData();
    myForm.append("title", title);
    myForm.append("description", description);
    myForm.append("file", video);

    try {
      const { data } = await axios.post(
        `${server}/api/course/${params.id}`,
        myForm,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      toast.success(data.message);
      setBtnLoading(false);
      setShow(false);
      fetchLectures();

      setTitle("");
      setDescription("");
      setvideo("");
      setVideoPrev("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
      setBtnLoading(false);
    }
  };

  const uploadNotesHandler = async (file) => {
    if (!file) return;
    const toastId = toast.loading("Uploading Notes...");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await axios.post(
        `${server}/api/lecture/notes/${lecture._id}`,
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      toast.success(data.message, { id: toastId });
      fetchLecture(lecture._id); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Error uploading notes", { id: toastId });
    }
  };

  const deleteHandler = async (id) => {
    if (confirm("Are you sure you want to delete this lecture")) {
      try {
        const { data } = await axios.delete(
          `${server}/api/lecture/${id}`,
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );

        toast.success(data.message);
        fetchLectures();
      } catch (error) {
        toast.error(error.response?.data?.message || "Error");
      }
    }
  };

  const fetchProgress = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${server}/api/user/progress?course=${params.id}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      setCompleted(data.courseProgressPercentage);
      setCompletedLec(data.completedLectures);
      setLectLength(data.allLectures);
      setProgress(data.progress);
    } catch (error) {
      console.log(error);
    }
  }, [params.id]);

  const addProgress = async (id) => {
    try {
      await axios.post(
        `${server}/api/user/progress?course=${params.id}&lectureId=${id}`,
        {},
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      fetchProgress();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLectures();
    fetchProgress();
  }, [fetchLectures, fetchProgress]);

  const handleNext = () => {
    const currentIndex = lectures.findIndex(l => l._id === lecture._id);
    if (currentIndex < lectures.length - 1) {
      fetchLecture(lectures[currentIndex + 1]._id);
    }
  };

  const handlePrev = () => {
    const currentIndex = lectures.findIndex(l => l._id === lecture._id);
    if (currentIndex > 0) {
      fetchLecture(lectures[currentIndex - 1]._id);
    }
  };

  return (
    <div className="study-session-container">
      {loading ? (
        <Loading />
      ) : (
        <>
          <StudyTopBar 
            courseTitle={course?.title} 
            toggleSidebar={() => setActiveTab(activeTab === "lessons" ? "player" : "lessons")} 
          />

          <div className="study-layout">
            {/* Main Learning Content */}
            <main className={`study-main-content ${(activeTab === 'player' || window.innerWidth > 768) ? 'show' : 'hide'}`}>
              <div className="video-player-section">
                {lecLoading ? (
                  <div className="video-skeleton-container"><Loading /></div>
                ) : lecture.video ? (
                  <div className="video-wrapper fade-in">
                    <video
                      src={`${server}/${lecture.video}`}
                      width={"100%"}
                      controls
                      autoPlay
                      onEnded={() => addProgress(lecture._id)}
                      className="main-video"
                    ></video>
                    
                    <div className="video-info-overlay">
                      <div className="lecture-meta">
                         <span className="lecture-index">Module {lectures.findIndex(l => l._id === lecture._id) + 1}</span>
                         <h2 className="lecture-title">{lecture.title}</h2>
                      </div>
                      
                      <div className="video-controls-pills">
                        <button 
                          className="control-pill" 
                          onClick={handlePrev}
                          disabled={lectures.findIndex(l => l._id === lecture._id) === 0}
                        >
                          <MdSkipPrevious size={20} /> Prev
                        </button>
                        <button 
                          className="control-pill" 
                          onClick={handleNext}
                          disabled={lectures.findIndex(l => l._id === lecture._id) === lectures.length - 1}
                        >
                          Next <MdSkipNext size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="select-prompt glass-card">
                    <div className="prompt-icon">🎬</div>
                    <h2>Ready to learn?</h2>
                    <p>Select a lecture from the curriculum to begin your journey.</p>
                  </div>
                )}
              </div>

              <div className="lecture-content-details fade-in">
                {lecture.description && (
                  <div className="glass-card description-card">
                    <h3>Lesson Description</h3>
                    <p>{lecture.description}</p>
                  </div>
                )}

                <div className="glass-card notes-card" style={{marginTop: "1rem"}}>
                  <h3>Lesson Notes</h3>
                  <div style={{display: "flex", gap: "10px", alignItems: "center", marginTop: "10px"}}>
                    {lecture.notes ? (
                      <a href={`${server}/${lecture.notes}`} target="_blank" rel="noreferrer" className="control-pill" style={{textDecoration: "none"}}>
                        Download Notes
                      </a>
                    ) : (
                      <p style={{margin: 0, color: "var(--text-secondary)"}}>No notes available for this lesson.</p>
                    )}
                    {user?.role === "admin" && (
                      <div className="upload-notes-section">
                        <input type="file" id="notesFile" onChange={(e) => uploadNotesHandler(e.target.files[0])} style={{display: 'none'}} />
                        <label htmlFor="notesFile" className="control-pill" style={{cursor: "pointer", background: "var(--accent-color)", color: "white"}}>
                           Upload Notes
                        </label>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="study-stats-grid mobile-hide">
                    <div className="stat-pill glass">
                        <span className="stat-label">Progress</span>
                        <div className="stat-progress-bar">
                            <div className="progress-fill" style={{ width: `${completed}%` }}></div>
                        </div>
                        <span className="stat-value">{completed}%</span>
                    </div>
                    <div className="stat-pill glass text-center">
                        <span className="stat-label">Lectures</span>
                        <span className="stat-value">{completedLec}/{lectLength}</span>
                    </div>
                </div>
              </div>
            </main>

            {/* Sidebar / Curriculum */}
            <aside className={`study-sidebar ${activeTab === 'lessons' ? 'show' : ''}`}>
              <div className="sidebar-header-study">
                <h3>Course Curriculum</h3>
                {user?.role === "admin" && (
                    <button className="add-lec-btn" onClick={() => setShow(!show)}>
                        <MdAdd />
                    </button>
                )}
              </div>

              {show && (
                <div className="lecture-form-overlay glass-card">
                  <div className="form-header">
                      <h4>New Lesson</h4>
                      <button className="close-form" onClick={() => setShow(false)}>×</button>
                  </div>
                  <form onSubmit={submitHandler} className="modern-study-form">
                    <input
                      type="text"
                      placeholder="Lecture Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                    <textarea
                      placeholder="What will students learn?"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                    <div className="file-dropzone">
                        <input type="file" onChange={changeVideoHandler} required />
                        <div className="dropzone-text">
                            {video ? video.name : "Select Video File"}
                        </div>
                    </div>
                    <button disabled={btnLoading} className="submit-lec-btn">
                      {btnLoading ? "Uploading..." : "Add Lecture"}
                    </button>
                  </form>
                </div>
              )}

              <div className="curriculum-list">
                {lectures.length > 0 ? (
                  lectures.map((e, i) => (
                    <div key={e._id} className="lecture-item-wrapper">
                      <div
                        onClick={() => fetchLecture(e._id)}
                        className={`lecture-item glass ${
                          lecture._id === e._id ? "active" : ""
                        }`}
                      >
                        <div className="lec-index">{i + 1}</div>
                        <div className="lec-info">
                            <h4 className="lec-title">{e.title}</h4>
                            <span className="lec-status">
                                {progress[0]?.completedLectures.includes(e._id) ? "Completed" : "Video Lesson"}
                            </span>
                        </div>
                        {progress[0]?.completedLectures.includes(e._id) && (
                          <div className="lec-tick"><TiTick /></div>
                        )}
                      </div>

                      {user?.role === "admin" && (
                        <button
                          className="delete-lec-icon"
                          onClick={() => deleteHandler(e._id)}
                          title="Delete Lesson"
                        >
                          <MdDelete />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="empty-curriculum">
                    <p>No lessons available yet.</p>
                  </div>
                )}
              </div>
            </aside>

            {/* Progress Tab for Mobile */}
            {activeTab === 'progress' && (
                <div className="mobile-progress-view fade-in">
                    <div className="glass-card">
                        <h2>Your Progress</h2>
                        <div className="big-progress-circle">
                             <svg viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" stroke="var(--border-color)" strokeWidth="8" fill="none" />
                                <circle cx="50" cy="50" r="45" stroke="var(--accent-color)" strokeWidth="8" fill="none" 
                                    strokeDasharray={`${completed * 2.82} 282`} strokeLinecap="round" transform="rotate(-90 50 50)" />
                             </svg>
                             <div className="percentage-text">{completed}%</div>
                        </div>
                        <div className="progress-details">
                            <div className="detail-item">
                                <span className="label">Lessons Completed</span>
                                <span className="value">{completedLec} / {lectLength}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
          </div>

          <StudyBottomNav 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
        </>
      )}
    </div>
  );
};

export default Lecture;