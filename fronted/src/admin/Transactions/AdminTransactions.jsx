import React, { useState } from "react";
import Layout from "../Utils/Layout";
import { motion } from "framer-motion";
import "../adminFeatures.css";
import { MdTrendingUp, MdTrendingDown } from "react-icons/md";

const mockTransactions = [
  { id: "TXN1001", date: "Oct 12, 2026", user: "Alice Walker", course: "Advanced React", amount: "$150", status: "Completed" },
  { id: "TXN1002", date: "Oct 12, 2026", user: "Bob Marley", course: "Digital Marketing", amount: "$80", status: "Failed" },
  { id: "TXN1003", date: "Oct 11, 2026", user: "Charlie Puth", course: "UI/UX Bootcamp", amount: "$220", status: "Completed" },
  { id: "TXN1004", date: "Oct 10, 2026", user: "Diana Prince", course: "Data Science 101", amount: "$300", status: "Pending" },
  { id: "TXN1005", date: "Oct 09, 2026", user: "Evan Wright", course: "Advanced React", amount: "$150", status: "Completed" },
];

const AdminTransactions = ({ user }) => {
  const [filter, setFilter] = useState("All");

  const filteredTxns = mockTransactions.filter(t => filter === "All" || t.status === filter);

  return (
    <Layout>
      <motion.div 
        className="feature-page-container"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      >
        <div className="feature-header">
          <h2 className="feature-title">Transactions Log</h2>
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="submit-btn" style={{ padding: "8px 16px", background: "var(--bg-color)", color: "var(--text-color)", border: "1px solid var(--border-color)" }}>Export CSV</button>
          </div>
        </div>

        <div className="stats-grid">
          <div className="glass-panel" style={{ padding: "16px" }}>
             <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase" }}>Total Revenue</p>
             <h3 style={{ margin: "5px 0", fontSize: "1.5rem" }}>$45,210</h3>
             <span style={{ color: "#16a34a", fontSize: "0.8rem", display:"flex", alignItems:"center", gap:"4px" }}><MdTrendingUp/> +12.5% this month</span>
          </div>
          <div className="glass-panel" style={{ padding: "16px" }}>
             <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase" }}>Refunds</p>
             <h3 style={{ margin: "5px 0", fontSize: "1.5rem" }}>$320</h3>
             <span style={{ color: "#dc2626", fontSize: "0.8rem", display:"flex", alignItems:"center", gap:"4px" }}><MdTrendingDown/> -2% this month</span>
          </div>
          <div className="glass-panel" style={{ padding: "16px" }}>
             <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase" }}>Active Subscriptions</p>
             <h3 style={{ margin: "5px 0", fontSize: "1.5rem" }}>1,280</h3>
             <span style={{ color: "#16a34a", fontSize: "0.8rem", display:"flex", alignItems:"center", gap:"4px" }}><MdTrendingUp/> +8% this month</span>
          </div>
        </div>

        <div className="glass-panel transactions-table-wrap">
          <div style={{ display: "flex", justifyContent: "space-between", margin: "0 0 15px 0" }}>
             <h3 style={{ margin: 0, fontSize: "1rem" }}>Recent Orders</h3>
             <select 
               style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", outline:"none" }}
               value={filter} onChange={e => setFilter(e.target.value)}
             >
               <option value="All">All Status</option>
               <option value="Completed">Completed</option>
               <option value="Pending">Pending</option>
               <option value="Failed">Failed</option>
             </select>
          </div>
          <table className="styled-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>User</th>
                <th>Course</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTxns.map((t, idx) => (
                <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.05 }}>
                  <td><strong>{t.id}</strong></td>
                  <td>{t.date}</td>
                  <td>{t.user}</td>
                  <td>{t.course}</td>
                  <td>{t.amount}</td>
                  <td><span className={`status-badge ${t.status.toLowerCase()}`}>{t.status}</span></td>
                </motion.tr>
              ))}
              {filteredTxns.length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}>No transactions found for this filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </Layout>
  );
};

export default AdminTransactions;
