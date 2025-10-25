import React, { useEffect, useState } from "react";

/**
 * AmberEyeModule.tsx
 *
 * Sidebar view for GoblinHQ’s AmberEye mode.
 * Launches a real Chrome window (handled in Electron main process)
 * that stays docked to the right 2/3 of the screen.
 */

declare global {
  interface Window {
    electronAPI?: {
      launchChromeWindow: () => void;
    };
  }
}

const AmberEyeModule: React.FC = () => {
  const [isLaunching, setIsLaunching] = useState<boolean>(false);

  // When this module mounts, trigger Chrome launch in main process
  useEffect(() => {
    setIsLaunching(true);
    window.electronAPI?.launchChromeWindow();
    const timer = setTimeout(() => setIsLaunching(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        width: "33.33%", // one-third of the screen
        height: "100%",
        backgroundColor: "#0b0b0b",
        color: "#f0f0f0",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        borderRight: "2px solid #1f1f1f",
        padding: "20px",
      }}
    >
      <h1
        style={{
          fontSize: "26px",
          color: "#ffbf00",
          marginBottom: "10px",
          fontFamily: "'Courier New', monospace",
          letterSpacing: "1px",
        }}
      >
        AmberEye
      </h1>

      <p style={{ color: "#bbb", marginBottom: "15px" }}>
        The real Chrome window is now docked to the right side of your screen.
      </p>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          paddingRight: "8px",
          fontFamily: "'Courier New', monospace",
          fontSize: "14px",
          color: "#ccc",
        }}
      >
        <p>
          Use this sidebar to interact with captured selectors and automation
          tools while Chrome displays the live site.
        </p>

        <ul style={{ marginTop: "12px", lineHeight: "1.6" }}>
          <li>🔹 Captures CSS selectors in real time (future integration).</li>
          <li>🔹 Controls browser actions via automation modules.</li>
          <li>🔹 Always locked to Chrome’s right edge.</li>
        </ul>

        <p style={{ color: "#666", marginTop: "20px" }}>
          (You can resize or move the Electron window — the Chrome window will
          follow automatically.)
        </p>
      </div>

      <div
        style={{
          marginTop: "auto",
          paddingTop: "12px",
          borderTop: "1px solid #222",
          textAlign: "center",
          color: "#888",
          fontSize: "13px",
        }}
      >
        {isLaunching ? "Launching Chrome..." : "Chrome linked and active"}
      </div>
    </div>
  );
};

export default AmberEyeModule;
