// electron/main.js
import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev =
  process.env.NODE_ENV === "development" ||
  process.env.ELECTRON_DEV === "true";

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (isDev) {
    console.log("⚡ Development mode: loading Vite server...");
    mainWindow.loadURL("http://localhost:5173");
  } else {
    console.log("📦 Production mode: loading built files...");
    mainWindow.loadFile(path.join(__dirname, "../out/renderer/index.html"));
  }

  // Optional DevTools only in dev
  if (isDev) {
     mainWindow.webContents.openDevTools();
  }

  // Suppress Autofill console warnings
  mainWindow.webContents.on("console-message", (event, level, message) => {
    if (
      message.includes("Autofill.enable") ||
      message.includes("Autofill.setAddresses")
    ) {
      event.preventDefault();
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// IPC handler to launch real Chrome for AmberEye
ipcMain.handle("launch-chrome", async (event, { url, x, y, width, height }) => {
  const chromePath = `"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"`;
  const command = `${chromePath} --new-window --window-size=${width},${height} --window-position=${x},${y} ${url}`;
  exec(command, (error) => {
    if (error) {
      console.error("Failed to launch Chrome:", error);
    }
  });
  return true;
});

export function getMainWindow() {
  return mainWindow;
}
