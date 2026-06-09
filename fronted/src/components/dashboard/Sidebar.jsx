import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdLibraryBooks,
  MdPeople,
  MdAttachMoney,
  MdChat,
  MdCalendarToday,
  MdLiveTv,
  MdSettings,
  MdMenuOpen,
  MdMenu,
  MdLogout,
} from "react-icons/md";
import { UserData } from "../../context/UserContext";
import "./sidebar.css";

const menuItems = [
  { path: "/admin/dashboard", icon: <MdDashboard size={20} />, label: "Dashboard" },
  { path: "/admin/course",    icon: <MdLibraryBooks size={20} />, label: "Course" },
  { path: "/admin/users",     icon: <MdPeople size={20} />,       label: "Student", superAdminOnly: true },
  { path: "/admin/transactions", icon: <MdAttachMoney size={20} />, label: "Transactions" },
  { path: "/admin/chat",      icon: <MdChat size={20} />,         label: "Chat" },
  { path: "/admin/schedule",  icon: <MdCalendarToday size={20} />, label: "Schedule" },
  { path: "/admin/live",      icon: <MdLiveTv size={20} />,       label: "Live Class" },
  { path: "/admin/settings",  icon: <MdSettings size={20} />,     label: "Settings" },
];

const Sidebar = ({ isCollapsed, setIsCollapsed, showMobile, setShowMobile }) => {
  const { user } = UserData();
  const location = useLocation();

  const filtered = menuItems.filter((item) => {
    if (item.superAdminOnly && user?.mainrole !== "superadmin") return false;
    return true;
  });

  return (
    <aside
      className={`dashboard-sidebar ${isCollapsed ? "collapsed" : ""} ${showMobile ? "show-mobile" : ""}`}
    >
      {/* Logo */}
      <div className="sidebar-header">
        {!isCollapsed && (
          <span className="sidebar-logo">
            <span className="logo-e">E</span>study
          </span>
        )}
        <button
          className="collapse-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title="Toggle sidebar"
        >
          {isCollapsed ? <MdMenu size={22} /> : <MdMenuOpen size={22} />}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="sidebar-nav">
        <ul>
          {filtered.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-link ${isActive ? "active" : ""}`}
                  onClick={() => setShowMobile(false)}
                  title={isCollapsed ? item.label : ""}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!isCollapsed && <span className="nav-label">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <Link to="/account" className="nav-link logout-link" title={isCollapsed ? "Sign Out" : ""}>
          <span className="nav-icon"><MdLogout size={20} /></span>
          {!isCollapsed && <span className="nav-label">Sign Out</span>}
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
