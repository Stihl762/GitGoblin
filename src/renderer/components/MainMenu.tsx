import React from "react";
import { useNavigate } from "react-router-dom";

const MainMenu: React.FC = () => {
  const navigate = useNavigate();

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    backgroundColor: "#0b0b0b",
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

  const modes = [
    { name: "Manual", path: "/manual" },
    { name: "Semi-Auto", path: "/semiauto" },
    { name: "FullGoblin", path: "/fullgoblin" },
    { name: "AmberEye", path: "/ambereye" },
    { name: "Directory", path: "/directory" },
    { name: "Records", path: "/records" },
  ];

  const handleModeClick = (path: string) => {
    navigate(path);
  };

  return (
    <div style={containerStyle}>
      <div style={titleStyle}>GoblinHQ</div>
      <div style={modeListStyle}>
        {modes.map((mode) => (
          <div
            key={mode.name}
            onClick={() => handleModeClick(mode.path)}
            onMouseEnter={(e) =>
              ((e.target as HTMLDivElement).style.color = "#ffbf00")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLDivElement).style.color = "#f0f0f0")
            }
          >
            {mode.name}
          </div>
        ))}
      </div>
      <div style={versionStyle}>v1.0.0</div>
    </div>
  );
};

export default MainMenu;
