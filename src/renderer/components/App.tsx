// src/renderer/components/App.tsx
import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import AmberEyeModule from "../modules/ambereye/AmberEyeModule";

declare global {
  interface Window {
    electronAPI?: {
      launchChromeWindow: () => void;
    };
  }
}

const AppCore: React.FC = () => {
  const [activeMode, setActiveMode] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [hoveredMode, setHoveredMode] = useState<string | null>(null);
  const chromeLaunchedRef = useRef(false);
  const navigate = useNavigate();

  const modes = ["Manual", "Semi-Auto", "FullGoblin", "AmberEye", "Directory", "Records"];

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleModeSelect = (mode: string) => {
    setActiveMode(mode);
    setHoveredMode(null);

    if (mode === "AmberEye") {
      navigate("/ambereye");
      if (!chromeLaunchedRef.current) {
        window.electronAPI?.launchChromeWindow();
        chromeLaunchedRef.current = true;
      }
    } else {
      navigate("/");
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between bg-gray-900 border-b border-gray-800 p-4">
        <h1 className="text-2xl font-bold text-amber-500">GoblinHQ</h1>
        <nav className="flex gap-4">
          {modes.map((mode) => (
            <button
              key={mode}
              onClick={() => handleModeSelect(mode)}
              onMouseEnter={() => setHoveredMode(mode)}
              onMouseLeave={() => setHoveredMode(null)}
              className={`px-4 py-2 rounded transition ${
                activeMode === mode
                  ? "bg-amber-600 text-black"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {mode}
            </button>
          ))}
        </nav>
      </header>

      {/* Main content area */}
      <main className="flex-1 overflow-hidden">
        <Routes>
          <Route
            path="/"
            element={
              <div className="p-8 text-center text-gray-400">
                Welcome to GoblinHQ — Select a mode above.
              </div>
            }
          />
          <Route path="/ambereye" element={<AmberEyeModule />} />
        </Routes>
      </main>
    </div>
  );
};

// Wrap AppCore with Router for routing support
const App: React.FC = () => (
  <Router>
    <AppCore />
  </Router>
);

export default App;
