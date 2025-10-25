// src/renderer/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App"; // ensure App.tsx is inside components/
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found. Make sure your index.html has a div with id='root'");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
