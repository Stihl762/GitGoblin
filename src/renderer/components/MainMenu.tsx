import React from "react";

const MainMenu: React.FC = () => {
  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    backgroundColor: "#0b0b0b", // temporary dark background
    color: "#f0f0f0",
    fontFamily: "'Courier New', monospace",
    paddingTop: "40px",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "48px",
    fontWeight: "bold",
    marginBottom: "30px",
    letterSpacing: "2px",
  };

  const modeListStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    fontSize: "24px",
    cursor: "pointer",
    textTransform: "uppercase",
  };

  const versionStyle: React.CSSProperties = {
    position: "absolute",
    bottom: "10px",
    right: "15px",
    fontSize: "12px",
    opacity: 0.7,
  };

  const modes = ["Manual", "Semi-Auto", "FullGoblin", "AmberEye", "Directory", "Records"];

  return (
    <div style={containerStyle}>
      <div style={titleStyle}>GoblinHQ</div>
      <div style={modeListStyle}>
        {modes.map((mode) => (
          <div key={mode}>{mode}</div>
        ))}
      </div>
      <div style={versionStyle}>v1.0.0</div>
    </div>
  );
};

export default MainMenu;
