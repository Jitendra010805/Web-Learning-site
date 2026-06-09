import React, { useState } from "react";
import Layout from "../Utils/Layout";
import { motion } from "framer-motion";
import "../adminFeatures.css";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const hours = ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"];

const initialEvents = [
  { id: 1, day: "Monday", time: "09:00 AM", title: "React Basics", type: "lecture" },
  { id: 2, day: "Tuesday", time: "02:00 PM", title: "UI Design Live", type: "live" },
  { id: 3, day: "Thursday", time: "11:00 AM", title: "Office Hours", type: "meeting" },
];

const AdminSchedule = () => {
  const [events, setEvents] = useState(initialEvents);

  const getEvent = (day, time) => events.find(e => e.day === day && e.time === time);

  const addEventPrompt = (day, time) => {
    if(getEvent(day, time)) return alert("Slot already booked!");
    const title = prompt(`Enter event title for ${day} at ${time}:`);
    if(title) {
      setEvents([...events, { id: Date.now(), day, time, title, type: "lecture" }]);
    }
  };

  const getBadgeColor = (type) => {
    if(type === "live") return "rgba(239, 68, 68, 0.15)";
    if(type === "meeting") return "rgba(59, 130, 246, 0.15)";
    return "rgba(74, 222, 128, 0.15)";
  };
  const getBadgeTextColor = (type) => {
    if(type === "live") return "#dc2626";
    if(type === "meeting") return "#2563eb";
    return "#16a34a";
  };

  return (
    <Layout>
      <motion.div 
        className="feature-page-container"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      >
        <div className="feature-header">
          <h2 className="feature-title">Weekly Schedule</h2>
          <button className="submit-btn" style={{ padding: "8px 16px" }}>Add Event +</button>
        </div>

        <div className="glass-panel" style={{ padding: 0, overflowX: "auto" }}>
          <table className="styled-table" style={{ textAlign: "center" }}>
            <thead>
              <tr>
                <th style={{ width: "100px" }}>Time</th>
                {days.map(d => <th key={d}>{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {hours.map(time => (
                <tr key={time}>
                  <td style={{ fontWeight: 600, color: "var(--text-muted)", fontSize: "0.8rem" }}>{time}</td>
                  {days.map(day => {
                    const e = getEvent(day, time);
                    return (
                      <td key={day} onClick={() => addEventPrompt(day, time)} style={{ cursor: "pointer", border: "1px dashed var(--border-color)", position: "relative", height: "80px", minWidth: "140px" }}>
                        {e ? (
                          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ background: getBadgeColor(e.type), color: getBadgeTextColor(e.type), margin: "4px", padding: "8px", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 700 }}>
                            {e.title}
                          </motion.div>
                        ) : (
                          <span style={{ color: "transparent" }}>+</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </Layout>
  );
};

export default AdminSchedule;
