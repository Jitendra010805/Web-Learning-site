import React, { useState } from "react";
import {
  MdSearch, MdNotifications, MdKeyboardArrowDown, MdMenu,
} from "react-icons/md";
import { UserData } from "../../context/UserContext";
import "./topNavbar.css";

const TopNavbar = ({ toggleMobile, pageTitle = "Dashboard" }) => {
  const { user } = UserData();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications = [
    { id: 1, text: "New student enrolled in React Basics", time: "2m ago" },
    { id: 2, text: "Course 'UI Design' was reviewed", time: "15m ago" },
    { id: 3, text: "Monthly report is ready", time: "1h ago" },
  ];

  return (
    <nav className="top-navbar">
      <div className="navbar-left">
        <button className="mobile-menu-btn" onClick={toggleMobile} title="Toggle menu">
          <MdMenu size={22} />
        </button>
        <h2 className="page-title">{pageTitle}</h2>
      </div>

      <div className="navbar-right">
        {/* Search */}
        <div className="search-container">
          <MdSearch size={19} className="search-icon" />
          <input type="text" placeholder="Search..." />
        </div>

        {/* Notifications */}
        <div className="notif-wrapper">
          <button
            className="nav-icon-btn"
            onClick={() => { setNotifOpen(!notifOpen); setDropdownOpen(false); }}
            title="Notifications"
          >
            <MdNotifications size={22} />
            <span className="notification-badge">3</span>
          </button>
          {notifOpen && (
            <div className="notif-dropdown">
              <p className="notif-title">Notifications</p>
              {notifications.map((n) => (
                <div key={n.id} className="notif-item">
                  <p>{n.text}</p>
                  <span>{n.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="user-profile-nav" onClick={() => { setDropdownOpen(!dropdownOpen); setNotifOpen(false); }}>
          <div className="profile-avatar-circle">
            {(user?.name || "W").charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <span className="user-name">{user?.name || "William"}</span>
            <span className="user-role">{user?.role || "Admin"}</span>
          </div>
          <MdKeyboardArrowDown
            className={`dropdown-icon ${dropdownOpen ? "rotated" : ""}`}
            size={18}
          />
          {dropdownOpen && (
            <div className="profile-dropdown">
              <a href="/account">My Profile</a>
              <a href="/account">Settings</a>
              <a href="/login">Sign Out</a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
