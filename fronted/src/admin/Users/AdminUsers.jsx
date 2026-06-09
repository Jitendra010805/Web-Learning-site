import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import Layout from "../Utils/Layout";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { MdPeople, MdSecurity, MdSwapHoriz, MdSearch } from "react-icons/md";
import "./users.css";

const AdminUsers = ({ user }) => {
  const navigate = useNavigate();
  const [users, setUsers]   = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.mainrole !== "superadmin") navigate("/");
  }, [user, navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/users`, {
        headers: { token: localStorage.getItem("token") },
      });
      setUsers(data.users);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const updateRole = async (id) => {
    if (!window.confirm("Update this user's role?")) return;
    try {
      const { data } = await axios.put(`${server}/api/user/${id}`, {}, {
        headers: { token: localStorage.getItem("token") },
      });
      toast.success(data.message);
      fetchUsers();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update role");
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const admins = users.filter((u) => u.role === "admin").length;
  const students = users.filter((u) => u.role === "user").length;

  return (
    <Layout>
      <div className="users-page">

        {/* ── Stats Row ── */}
        <div className="user-stats-row">
          {[
            { label: "Total Users",  value: users.length, color: "#818cf8", bg: "#eef2ff" },
            { label: "Students",     value: students,     color: "#4ade80", bg: "#f0fdf4" },
            { label: "Admins",       value: admins,       color: "#fb923c", bg: "#fff7ed" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              className="user-stat-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -3 }}
            >
              <div className="ust-icon" style={{ background: s.bg, color: s.color }}>
                <MdPeople size={20} />
              </div>
              <div>
                <p className="ust-value">{s.value}</p>
                <p className="ust-label">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Users Table Panel ── */}
        <motion.div
          className="users-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="users-panel-header">
            <div className="panel-title-group">
              <MdSecurity size={20} className="panel-icon" />
              <h2>User Management</h2>
              <span className="count-badge">{users.length} Total</span>
            </div>
            <div className="search-box">
              <MdSearch size={17} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="table-wrapper">
            {loading ? (
              <div className="table-loading">Loading users…</div>
            ) : (
              <table className="users-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th className="center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? (
                    filtered.map((u, i) => (
                      <motion.tr
                        key={u._id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.04 }}
                      >
                        <td><span className="row-index">{i + 1}</span></td>
                        <td>
                          <div className="user-cell">
                            <div className="user-avatar-sm">
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="user-name-text">{u.name}</span>
                          </div>
                        </td>
                        <td className="email-cell">{u.email}</td>
                        <td>
                          <span className={`role-badge role-${u.role}`}>
                            {u.role === "admin" ? "Admin" : "Student"}
                          </span>
                        </td>
                        <td className="center">
                          <button
                            className="role-toggle-btn"
                            onClick={() => updateRole(u._id)}
                            title="Toggle role"
                          >
                            <MdSwapHoriz size={16} />
                            Toggle Role
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="empty-row">
                        {search ? "No users match your search." : "No users found."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AdminUsers;
