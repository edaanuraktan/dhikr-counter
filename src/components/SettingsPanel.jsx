import React from "react";

const SettingsPanel = ({ darkMode, toggleDarkMode, muted, toggleMuted }) => {
  return (
    <div style={{
      position: "fixed",
      top: "20px",
      right: "20px",
      display: "flex",
      flexDirection: "row",
      gap: "1rem",
      zIndex: 9999
    }}>
      <span onClick={toggleDarkMode} title="Tema Değiştir" style={{ cursor: "pointer", fontSize: "3rem", color: darkMode ? "#fff" : "#333" }}>
        {darkMode ? "🌞" : "🌙"}
      </span>
      <span onClick={toggleMuted} title="Sesi Aç/Kapat" style={{ cursor: "pointer", fontSize: "3rem", color: darkMode ? "#fff" : "#333" }}>
        {muted ? "🔇" : "🔊"}
      </span>
    </div>
  );
};

export default SettingsPanel;
