// electron/main.js
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { spawn, exec } = require("child_process");
const os = require("os");

let mainWindow;
let chromeProcess = null;

/**
 * 🔧 Utility: get Google Chrome path per OS
 */
function getChromePath() {
  switch (os.platform()) {
    case "win32":
      return "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
    case "darwin":
      return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    case "linux":
      return "/usr/bin/google-chrome";
    default:
      return null;
  }
}

/**
 * 🚀 Create GoblinHQ main window
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    backgroundColor: "#0b0b0b",
    title: "GoblinHQ — AmberEye",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Load Vite dev server or built index.html
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../out/renderer/index.html"));
  }

  mainWindow.on("closed", () => {
    if (chromeProcess) chromeProcess.kill();
    mainWindow = null;
  });

  // Watch for movement and resizing
  mainWindow.on("move", handleResize);
  mainWindow.on("resize", handleResize);
}

/**
 * 🧩 Handle request from renderer to launch Chrome window
 */
ipcMain.handle("launch-chrome-window", () => {
  launchChromeWindow();
});

/**
 * 🧱 Launch a real Chrome window next to Electron
 */
function launchChromeWindow() {
  if (chromeProcess) return; // Avoid duplicates

  const chromePath = getChromePath();
  if (!chromePath) {
    console.error("❌ Chrome executable not found on this system.");
    return;
  }

  const { x, y, width, height } = mainWindow.getBounds();
  const sidebarWidth = Math.floor(width / 3);
  const chromeX = x + sidebarWidth;
  const chromeWidth = width - sidebarWidth;

  // Launch Chrome with a minimal app window
  const args = [
    "--new-window",
    "--app=https://www.google.com", // Default site; can be changed later
    `--window-position=${chromeX},${y}`,
    `--window-size=${chromeWidth},${height}`,
  ];

  console.log("🟢 Launching Chrome:", chromePath, args.join(" "));
  chromeProcess = spawn(chromePath, args, { detached: true });

  chromeProcess.on("exit", () => {
    console.log("⚪ Chrome closed.");
    chromeProcess = null;
  });
}

/**
 * 🔄 Sync Chrome position and size when Electron moves/resizes
 */
function handleResize() {
  if (!chromeProcess || !mainWindow) return;

  const { x, y, width, height } = mainWindow.getBounds();
  const sidebarWidth = Math.floor(width / 3);
  const chromeX = x + sidebarWidth;
  const chromeWidth = width - sidebarWidth;

  // ⚙️ Windows-specific resizing
  if (os.platform() === "win32") {
    exec(
      `powershell -Command "Get-Process chrome | Where-Object { $_.MainWindowTitle -match 'Google' } | ForEach-Object { $hwnd = $_.MainWindowHandle; $win = Add-Type -MemberDefinition '[DllImport(\\\"user32.dll\\\")] public static extern bool MoveWindow(IntPtr hWnd, int X, int Y, int nWidth, int nHeight, bool bRepaint);' -Name 'Win32' -Namespace 'Native' -PassThru; $win::MoveWindow($hwnd, ${chromeX}, ${y}, ${chromeWidth}, ${height}, $true) }"`
    );
  }
  // ⚙️ macOS resizing (AppleScript)
  else if (os.platform() === "darwin") {
    exec(
      `osascript -e 'tell application "Google Chrome" to set bounds of front window to {${chromeX}, ${y}, ${chromeX + chromeWidth}, ${y + height}}'`
    );
  }
  // ⚙️ Linux (xdotool)
  else if (os.platform() === "linux") {
    exec(
      `xdotool search --onlyvisible --class "Google-chrome" windowmove ${chromeX} ${y} windowsize ${chromeWidth} ${height}`
    );
  }
}

/**
 * 🪄 App lifecycle
 */
app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    if (chromeProcess) chromeProcess.kill();
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
