import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("app-theme") || "dark"
  );
  const [accentColor, setAccentColor] = useState(
    () => localStorage.getItem("app-accent-color") || "#8a4baf"
  );

  useEffect(() => {
    localStorage.setItem("app-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("app-accent-color", accentColor);
    document.documentElement.style.setProperty("--accent-color", accentColor);
    
    // Also set a slightly darker version for hover effects (simple opacity/blend trick or using hex parsing if needed, but we can rely on CSS filters for hover instead)
    document.documentElement.style.setProperty("--accent-hover", accentColor); 
  }, [accentColor]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const changeAccentColor = (color) => {
    setAccentColor(color);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, accentColor, changeAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
