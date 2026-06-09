import React, { useState, useEffect } from "react";
import Layout from "../Utils/Layout";
import { useNavigate } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import axios from "axios";
import { server } from "../../main";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  MdPeople, MdLibraryBooks, MdPlayCircle, MdAttachMoney,
  MdAdd, MdTrendingUp, MdSend,
} from "react-icons/md";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from "recharts";
import "./admindashboard.css";

/* ─── Mock Data ─── */
const weeklyActivity = [
  { day: "Sat", value: 55 }, { day: "Sun", value: 60 },
  { day: "Mon", value: 82 }, { day: "Tue", value: 70 },
  { day: "Wed", value: 75 }, { day: "Thu", value: 68 },
  { day: "Fri", value: 78 },
];

const topCourses = [
  { name: "History of Graphic Design", price: 120, sales: 284, color: "#f472b6", bg: "rgba(244, 114, 182, 0.15)" },
  { name: "Digital Painting",           price: 60,  sales: 196, color: "#fb923c", bg: "rgba(251, 146, 60, 0.15)" },
  { name: "App Design Course",          price: 250, sales: 342, color: "#818cf8", bg: "rgba(129, 140, 248, 0.15)" },
];

const recentTransactions = [
  { id: 1, name: "Alice Johnson",  amount: 120, time: "2m ago",  initials: "AJ", color: "#4ade80" },
  { id: 2, name: "Bob Martinez",   amount: 60,  time: "14m ago", initials: "BM", color: "#60a5fa" },
  { id: 3, name: "Carol White",    amount: 250, time: "1h ago",  initials: "CW", color: "#f472b6" },
  { id: 4, name: "David Kim",      amount: 120, time: "3h ago",  initials: "DK", color: "#fb923c" },
];

const chatMessages = [
  { id: 1, from: "Alice",   text: "Hey, when is the next live class?",    mine: false },
  { id: 2, from: "Me",      text: "It's scheduled for Friday 6PM IST!",   mine: true  },
  { id: 3, from: "Alice",   text: "Perfect, thanks! 🎉",                  mine: false },
  { id: 4, from: "Bob",     text: "Can I get access to React course?",    mine: false },
];

const engagementData = [
  { country: "India",   pct: 42, color: "#4ade80" },
  { country: "USA",     pct: 28, color: "#60a5fa" },
  { country: "UK",      pct: 15, color: "#f472b6" },
  { country: "Germany", pct: 9,  color: "#fb923c" },
  { country: "Others",  pct: 6,  color: "#a78bfa" },
];

const categories = [
  "Web Development", "App Development", "Game Development",
  "Data Science", "Artificial Intelligence",
];

/* ─── Sub-Components ─── */
const StatCard = ({ icon, label, value, color, bg, delay = 0 }) => (
  <motion.div
    className="stat-card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: "easeOut" }}
    whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
  >
    <div className="stat-icon-wrap" style={{ background: bg, color }}>
      {icon}
    </div>
    <div className="stat-info">
      <p className="stat-value">{value}</p>
      <p className="stat-label">{label}</p>
    </div>
    <div className="stat-trend">
      <MdTrendingUp size={14} />
      <span>+12%</span>
    </div>
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="tooltip-label">{label}</p>
        <p className="tooltip-val">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

/* ─── Main Component ─── */
const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();
  const { courses, fetchCourses } = CourseData();

  const [stats, setStats] = useState({ totalCourses: 0, totalLectures: 0, totalUsers: 0 });
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState(chatMessages);
  const [activityRange, setActivityRange] = useState("Last Week");

  // Course form
  const [title, setTitle]           = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory]     = useState("");
  const [price, setPrice]           = useState("");
  const [createdBy, setCreatedBy]   = useState("");
  const [duration, setDuration]     = useState("");
  const [image, setImage]           = useState("");
  const [imagePrev, setImagePrev]   = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [showForm, setShowForm]     = useState(false);

  useEffect(() => {
    if (user && user.role !== "admin") navigate("/");
    fetchCourses();
    fetchStats();
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${server}/api/stats`, {
        headers: { token: localStorage.getItem("token") },
      });
      setStats(data.stats);
    } catch {
      setStats({ totalCourses: courses?.length || 0, totalLectures: 0, totalUsers: 0 });
    }
  };

  const changeImageHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => { setImagePrev(reader.result); setImage(file); };
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
      await fetchCourses(); fetchStats();
      setTitle(""); setDescription(""); setCategory(""); setPrice("");
      setCreatedBy(""); setDuration(""); setImage(""); setImagePrev("");
      setShowForm(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setBtnLoading(false);
    }
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now(), from: "Me", text: chatInput.trim(), mine: true }]);
    setChatInput("");
  };

  const statCards = [
    { icon: <MdPeople size={22} />,      label: "Total Students",  value: stats.totalUsers   > 0 ? `${(stats.totalUsers/1000).toFixed(1)}k` : "72k",    color: "#4ade80", bg: "rgba(74, 222, 128, 0.15)" },
    { icon: <MdLibraryBooks size={22} />, label: "Courses",         value: courses?.length    || 360, color: "#818cf8", bg: "rgba(129, 140, 248, 0.15)" },
    { icon: <MdPlayCircle size={22} />,  label: "Total Videos",    value: stats.totalLectures > 0 ? stats.totalLectures : 925, color: "#fb923c", bg: "rgba(251, 146, 60, 0.15)" },
    { icon: <MdAttachMoney size={22} />, label: "Total Earnings",  value: "$45,000",          color: "#f43f5e", bg: "rgba(244, 63, 94, 0.15)" },
  ];

  return (
    <Layout>
      <div className="adm-dash">

        {/* ── Stats Row ── */}
        <div className="stats-grid">
          {statCards.map((c, i) => (
            <StatCard key={c.label} {...c} delay={i * 0.09} />
          ))}
        </div>

        {/* ── Row 2: Activity Chart + Top Courses ── */}
        <div className="row-2">
          {/* Activity Chart */}
          <motion.div
            className="glass-panel activity-panel"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="panel-header">
              <div>
                <h3 className="panel-title">Working Activity</h3>
                <p className="panel-sub">Weekly performance overview</p>
              </div>
              <select
                className="range-select"
                value={activityRange}
                onChange={(e) => setActivityRange(e.target.value)}
              >
                <option>Last Week</option>
                <option>Last Month</option>
                <option>Last Year</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={weeklyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#4ade80" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#4ade80"
                  strokeWidth={3}
                  fill="url(#areaGrad)"
                  dot={{ r: 5, fill: "#4ade80", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 7, fill: "#16a34a" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Top Courses */}
          <motion.div
            className="glass-panel top-courses-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            <div className="panel-header">
              <h3 className="panel-title">Top Courses</h3>
              <button className="text-btn" onClick={() => navigate("/admin/course")}>See All</button>
            </div>
            <div className="top-course-list">
              {topCourses.map((c, i) => (
                <motion.div
                  key={c.name}
                  className="top-course-item"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  whileHover={{ x: 4 }}
                >
                  <div className="tc-icon" style={{ background: c.bg, color: c.color }}>
                    <MdLibraryBooks size={18} />
                  </div>
                  <div className="tc-info">
                    <p className="tc-name">{c.name}</p>
                    <p className="tc-sales">{c.sales} sales</p>
                  </div>
                  <span className="tc-price">${c.price}</span>
                </motion.div>
              ))}
            </div>

          </motion.div>
        </div>



        {/* ── Row 3: Transactions + Engagement + Chat ── */}
        <div className="row-3">
          {/* Transactions */}
          <motion.div
            className="glass-panel transactions-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="panel-header">
              <h3 className="panel-title">Recent Transactions</h3>
              <button className="text-btn">View All</button>
            </div>
            <div className="txn-list">
              {recentTransactions.map((t) => (
                <motion.div
                  key={t.id}
                  className="txn-item"
                  whileHover={{ x: 4, background: "#f8fafc" }}
                >
                  <div className="txn-avatar" style={{ background: t.color + "22", color: t.color }}>
                    {t.initials}
                  </div>
                  <div className="txn-info">
                    <p className="txn-name">{t.name}</p>
                    <p className="txn-time">{t.time}</p>
                  </div>
                  <span className="txn-amount">+${t.amount}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Engagement */}
          <motion.div
            className="glass-panel engagement-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
          >
            <div className="panel-header">
              <h3 className="panel-title">Top Engagement</h3>
              <span className="panel-sub">By Region</span>
            </div>
            <div className="engagement-list">
              {engagementData.map((e) => (
                <div key={e.country} className="eng-item">
                  <div className="eng-label">
                    <span className="eng-dot" style={{ background: e.color }} />
                    <span className="eng-country">{e.country}</span>
                  </div>
                  <div className="eng-bar-wrap">
                    <motion.div
                      className="eng-bar"
                      style={{ background: e.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${e.pct}%` }}
                      transition={{ delay: 0.6, duration: 0.7, ease: "easeOut" }}
                    />
                  </div>
                  <span className="eng-pct">{e.pct}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Chat */}
          <motion.div
            className="glass-panel chat-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="panel-header">
              <h3 className="panel-title">Quick Chat</h3>
              <span className="online-dot" />
            </div>
            <div className="chat-messages">
              {messages.map((m) => (
                <div key={m.id} className={`chat-bubble-wrap ${m.mine ? "mine" : "theirs"}`}>
                  {!m.mine && <div className="chat-avatar">{m.from.charAt(0)}</div>}
                  <div className={`chat-bubble ${m.mine ? "bubble-mine" : "bubble-theirs"}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="chat-input-row">
              <input
                type="text"
                placeholder="Type a message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button className="send-btn" onClick={sendMessage}><MdSend size={18} /></button>
            </div>
          </motion.div>
        </div>

      </div>
    </Layout>
  );
};

export default AdminDashboard;