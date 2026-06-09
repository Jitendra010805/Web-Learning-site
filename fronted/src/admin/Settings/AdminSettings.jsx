import React, { useState } from "react";
import Layout from "../Utils/Layout";
import { motion } from "framer-motion";
import "../adminFeatures.css";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("Profile");
  
  const [toggles, setToggles] = useState({
    notifEmail: true,
    notifPush: false,
    twoFactor: false,
    publicProfile: true,
  });

  const toggleSwitch = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const tabs = ["Profile", "Notifications", "Security", "Appearance"];

  return (
    <Layout>
      <motion.div 
        className="feature-page-container"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      >
        <div className="feature-header">
          <h2 className="feature-title">Platform Settings</h2>
          <button className="submit-btn" style={{ padding: "8px 16px" }}>Save Changes</button>
        </div>

        <div className="settings-layout">
          {/* Side Tabs */}
          <div className="settings-tabs">
             {tabs.map(tab => (
               <div 
                 key={tab} 
                 className={`setting-tab ${activeTab === tab ? "active" : ""}`}
                 onClick={() => setActiveTab(tab)}
               >
                 {tab}
               </div>
             ))}
          </div>

          {/* Content Pane */}
          <div className="glass-panel settings-content">
             <h3 style={{ margin: "0 0 20px 0", fontSize: "1.2rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px" }}>
               {activeTab} Settings
             </h3>

             {activeTab === "Profile" && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="form-grid">
                 <div className="form-group span-2" style={{ flexDirection: "row", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
                   <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "var(--accent-color)", color: "white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"2rem", fontWeight:700 }}>T</div>
                   <div>
                     <button className="submit-btn" style={{ padding: "6px 12px", fontSize: "0.8rem", marginBottom: "5px" }}>Upload Avatar</button>
                     <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)" }}>JPG or PNG. Max 1MB.</p>
                   </div>
                 </div>
                 <div className="form-group">
                   <label>Display Name</label>
                   <input type="text" defaultValue="Instructor" />
                 </div>
                 <div className="form-group">
                   <label>Email Address</label>
                   <input type="email" defaultValue="instructor@estudy.com" />
                 </div>
                 <div className="form-group span-2">
                   <label>Bio</label>
                   <textarea rows={4} defaultValue="Expert in full-stack web development." />
                 </div>
               </motion.div>
             )}

             {activeTab === "Notifications" && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                   <div>
                     <h4 style={{ margin: "0 0 5px 0" }}>Email Notifications</h4>
                     <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)" }}>Receive emails for new student enrollments.</p>
                   </div>
                   <div className={`toggle-switch ${toggles.notifEmail ? 'on' : ''}`} onClick={() => toggleSwitch('notifEmail')}>
                     <div className="toggle-knob" />
                   </div>
                 </div>
                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                   <div>
                     <h4 style={{ margin: "0 0 5px 0" }}>Push Notifications</h4>
                     <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)" }}>Receive browser push notifications for chat messages.</p>
                   </div>
                   <div className={`toggle-switch ${toggles.notifPush ? 'on' : ''}`} onClick={() => toggleSwitch('notifPush')}>
                     <div className="toggle-knob" />
                   </div>
                 </div>
               </motion.div>
             )}

             {activeTab === "Security" && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "20px" }}>
                   <div>
                     <h4 style={{ margin: "0 0 5px 0" }}>Two-Factor Authentication</h4>
                     <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)" }}>Secure your account with an extra layer of security.</p>
                   </div>
                   <div className={`toggle-switch ${toggles.twoFactor ? 'on' : ''}`} onClick={() => toggleSwitch('twoFactor')}>
                     <div className="toggle-knob" />
                   </div>
                 </div>
                 <div className="form-group" style={{ marginTop: "10px" }}>
                   <label>Current Password</label>
                   <input type="password" />
                 </div>
                 <div className="form-grid">
                   <div className="form-group">
                     <label>New Password</label>
                     <input type="password" />
                   </div>
                   <div className="form-group">
                     <label>Confirm Password</label>
                     <input type="password" />
                   </div>
                 </div>
                 <button className="submit-btn" style={{ background: "transparent", color: "var(--accent-color)", border: "1px solid var(--accent-color)", width: "max-content" }}>Update Password</button>
               </motion.div>
             )}

             {activeTab === "Appearance" && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                   <div>
                     <h4 style={{ margin: "0 0 5px 0" }}>Public Profile</h4>
                     <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)" }}>Allow students to view your profile and enrolled courses.</p>
                   </div>
                   <div className={`toggle-switch ${toggles.publicProfile ? 'on' : ''}`} onClick={() => toggleSwitch('publicProfile')}>
                     <div className="toggle-knob" />
                   </div>
                 </div>
                 <div>
                   <h4 style={{ margin: "0 0 10px 0" }}>Dashboard Theme</h4>
                   <p style={{ margin: "0 0 15px 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>Theme settings are managed by the global theme toggle in the main layout.</p>
                   <button className="submit-btn" style={{ padding: "8px 16px", background: "var(--bg-color)", color: "var(--text-color)", border: "1px solid var(--border-color)" }}>Open Global Theme Menu</button>
                 </div>
               </motion.div>
             )}

          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default AdminSettings;
