import React from "react";
import { MdLibraryBooks, MdOutlineTimeline, MdPerson, MdPlayArrow } from "react-icons/md";
import "./studyBottomNav.css";

const StudyBottomNav = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: "lessons", label: "Lessons", icon: <MdLibraryBooks /> },
    { id: "progress", label: "Progress", icon: <MdOutlineTimeline /> },
    { id: "profile", label: "Profile", icon: <MdPerson /> },
    { id: "player", label: "Watch", icon: <MdPlayArrow /> },
  ];

  return (
    <nav className="study-bottom-nav">
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`bottom-nav-item ${activeTab === item.id ? "active" : ""}`}
          onClick={() => setActiveTab(item.id)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default StudyBottomNav;
