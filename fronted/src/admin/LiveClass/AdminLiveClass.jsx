import React, { useState } from "react";
import Layout from "../Utils/Layout";
import { motion } from "framer-motion";
import "../adminFeatures.css";
import { MdMic, MdMicOff, MdVideocam, MdVideocamOff, MdScreenShare, MdStopScreenShare, MdCallEnd } from "react-icons/md";

const AdminLiveClass = () => {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenShare, setScreenShare] = useState(false);
  const [isLive, setIsLive] = useState(false);

  return (
    <Layout>
      <motion.div 
        className="feature-page-container"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      >
        <div className="feature-header">
          <h2 className="feature-title">Live Studio Broadcast</h2>
          {isLive && (
            <motion.span 
              initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 2 }}
              style={{ background: "#ef4444", color: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 700 }}
            >
              LIVE NOW
            </motion.span>
          )}
        </div>

        <div className="live-studio">
          {/* Main Broadcast Area */}
          <div className="broadcast-area" style={{ background: camOn ? "#1a1a2e" : "#0f0f1a" }}>
            <div className="broadcast-placeholder">
              {camOn ? (
                <>
                  <MdVideocam size={48} color="rgba(255,255,255,0.2)" />
                  <p style={{ marginTop: "10px", color: "rgba(255,255,255,0.5)" }}>Camera Feed Active</p>
                </>
              ) : (
                <>
                  <MdVideocamOff size={48} color="rgba(255,255,255,0.1)" />
                  <p style={{ marginTop: "10px", color: "rgba(255,255,255,0.3)" }}>Camera Disabled</p>
                </>
              )}
            </div>
            
            {screenShare && (
               <div style={{ position: "absolute", top: 20, left: 20, background: "rgba(0,0,0,0.6)", padding: "5px 10px", borderRadius: "8px", color: "#4ade80", fontSize: "0.8rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "5px" }}>
                 <MdScreenShare /> Screen is being shared
               </div>
            )}

            <div className="live-controls">
              <button className="live-btn" onClick={() => setMicOn(!micOn)}>
                {micOn ? <MdMic size={22} /> : <MdMicOff size={22} color="#f87171" />}
              </button>
              <button className="live-btn" onClick={() => setCamOn(!camOn)}>
                {camOn ? <MdVideocam size={22} /> : <MdVideocamOff size={22} color="#f87171" />}
              </button>
              <button className="live-btn" onClick={() => setScreenShare(!screenShare)}>
                {screenShare ? <MdStopScreenShare size={22} color="#60a5fa" /> : <MdScreenShare size={22} />}
              </button>
              <button className={`live-btn ${isLive ? "danger" : ""}`} onClick={() => setIsLive(!isLive)}>
                {isLive ? <MdCallEnd size={22} /> : "O"}
              </button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="glass-panel" style={{ display: "flex", flexDirection: "column", padding: "15px" }}>
            <h3 style={{ margin: "0 0 15px 0", fontSize: "1rem" }}>Studio Settings</h3>
            
            <div style={{ marginBottom: "15px" }}>
              <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Stream Title</label>
              <input type="text" defaultValue="Introduction to Advanced UI" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-color)", outline: "none", marginTop: "5px" }} />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Class Module</label>
              <select style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-color)", outline: "none", marginTop: "5px" }}>
                <option>Week 1: Fundamentals</option>
                <option>Week 2: State Management</option>
              </select>
            </div>

            <div style={{ flex: 1, borderTop: "1px solid var(--border-color)", paddingTop: "15px", display: "flex", flexDirection: "column" }}>
              <h4 style={{ margin: "0 0 10px 0", fontSize: "0.9rem" }}>Audience Chat</h4>
              <div style={{ flex: 1, background: "rgba(0,0,0,0.02)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                {isLive ? "Waiting for messages..." : "Start stream to enable chat"}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default AdminLiveClass;
