import React, { useState } from "react";
import "./themeSettings.css";
import { useTheme } from "../../context/ThemeContext";
import { MdOutlineSettings, MdClose, MdDarkMode, MdLightMode } from "react-icons/md";

const colors = [
  { name: "Purple", hex: "#8a4baf" },
  { name: "Blue", hex: "#3b82f6" },
  { name: "Green", hex: "#10b981" },
  { name: "Rose", hex: "#f43f5e" },
  { name: "Amber", hex: "#f59e0b" },
];

const ThemeSettings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme, accentColor, changeAccentColor } = useTheme();

  return (
    <>
      <button 
        className={`theme-fab ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Settings"
      >
        <div className="fab-icon-wrapper">
          {isOpen ? <MdClose size={26} /> : <MdOutlineSettings size={26} />}
        </div>
      </button>

      <div className={`theme-settings-modal ${isOpen ? "show" : ""}`}>
        <h3>Theme Settings</h3>
        
        <div className="theme-toggle-section">
          <span>Mode</span>
          <button className="mode-toggle-btn" onClick={toggleTheme}>
            {theme === "dark" ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        <div className="color-picker-section">
          <span>Accent Color</span>
          <div className="color-options">
            {colors.map((color) => (
              <button
                key={color.name}
                className={`color-circle ${accentColor === color.hex ? "active" : ""}`}
                style={{ backgroundColor: color.hex }}
                onClick={() => changeAccentColor(color.hex)}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ThemeSettings;
