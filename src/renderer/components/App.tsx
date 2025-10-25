// src/renderer/components/App.tsx
import React, { useState, useEffect, useRef } from "react";

declare global {
  interface Window {
    electronAPI: {
      launchChrome: (options: { url: string; x: number; y: number; width: number; height: number }) => void;
      resizeChrome?: (options: { width: number; height: number; x: number; y: number }) => void;
    };
  }
}

const App: React.FC = () => {
  const [activeMode, setActiveMode] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [hoveredMode, setHoveredMode] = useState<string | null>(null);
  const chromeLaunchedRef = useRef(false);

  const modes = ["Manual", "Semi-Auto", "FullGoblin", "AmberEye", "Directory", "Records"];

  // Update window dimensions on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);

      // If AmberEye Chrome is already launched, resize it
      if (activeMode === "AmberEye" && chromeLaunchedRef.current && window.electronAPI?.launchChrome) {
        const sidebarWidth = Math.floor(window.innerWidth / 3);
        const chromeWidth = window.innerWidth - sidebarWidth;
        window.electronAPI.launchChrome({
          url: "https://example.com",
          x: sidebarWidth,
          y: 0,
          width: chromeWidth,
          height: window.innerHeight,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeMode]);

  // Launch Chrome for AmberEye
  useEffect(() => {
    if (activeMode === "AmberEye" && !chromeLaunchedRef.current && window.electronAPI?.launchChrome) {
      const sidebarWidth = Math.floor(windowWidth / 3);
      const chromeWidth = windowWidth - sidebarWidth;

      window.electronAPI.launchChrome({
        url: "https://example.com",
        x: sidebarWidth,
        y: 0,
        width: chromeWidth,
        height: windowHeight,
      });

      chromeLaunchedRef.current = true;
    }
  }, [activeMode, windowWidth, windowHeight]);

  // Reset Chrome launched state when leaving AmberEye
  useEffect(() => {
    if (activeMode !== "AmberEye") {
      chromeLaunchedRef.current = false;
    }
  }, [activeMode]);

  // AmberEye sidebar view
  if (activeMode === "AmberEye") {
    return (
      <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
        <div
          style={{
            width: "33.33%",
            backgroundColor: "#E5E7EB",
            padding: "16px",
            borderRight: "1px solid #9CA3AF",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <button
            style={{
              marginBottom: "16px",
              padding: "8px 12px",
              backgroundColor: "#16A34A",
              color: "#FFFFFF",
              fontWeight: "bold",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={() => setActiveMode(null)}
          >
            &larr; Back
          </button>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "16px" }}>AmberEye</h2>
          <div style={{ flex: 1, color: "#374151" }}>Sidebar controls here</div>
        </div>
        <div
          style={{
            width: "66.66%",
            backgroundColor: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderLeft: "1px solid #9CA3AF",
          }}
        >
          <p style={{ color: "#6B7280", textAlign: "center" }}>
            Real Chrome window is launched externally.
          </p>
        </div>
      </div>
    );
  }

  // Main menu view
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#F3F4F6",
        fontFamily: "sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "48px",
        position: "relative",
      }}
    >
      <h1 style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "32px", letterSpacing: "2px" }}>GoblinHQ</h1>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", fontSize: "1.25rem", cursor: "pointer" }}>
        {modes.map((mode) => (
          <div
            key={mode}
            onClick={() => setActiveMode(mode)}
            onMouseEnter={() => setHoveredMode(mode)}
            onMouseLeave={() => setHoveredMode(null)}
            style={{
              transition: "color 0.2s",
              userSelect: "none",
              color: hoveredMode === mode ? "#16A34A" : "inherit",
            }}
          >
            {mode}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", bottom: "8px", right: "16px", fontSize: "0.75rem", color: "#6B7280" }}>v1.0.0</div>
    </div>
  );
};

export default App;
