import React, { useState } from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import "./dashboardLayout.css";

const DashboardLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showMobile, setShowMobile] = useState(false);

  const toggleMobile = () => setShowMobile(!showMobile);

  return (
    <div className={`dashboard-layout ${showMobile ? "mobile-open" : ""}`}>
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        showMobile={showMobile}
        setShowMobile={setShowMobile}
      />
      
      <main className="dashboard-main">
        <TopNavbar toggleMobile={toggleMobile} />
        <div className="dashboard-container">
          <div className="dashboard-content-wrapper">
            {children}
          </div>
        </div>
        {showMobile && <div className="sidebar-overlay" onClick={toggleMobile}></div>}
      </main>
    </div>
  );
};

export default DashboardLayout;
