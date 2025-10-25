// electron/preload.js
const { contextBridge, ipcRenderer } = require("electron");

/**
 * This preload script securely exposes limited APIs
 * to the renderer (React) environment.
 *
 * Available under: window.electronAPI
 */

contextBridge.exposeInMainWorld("electronAPI", {
  /**
   * Launch the Chrome window alongside the Electron app.
   * The Chrome process and positioning are managed by the main process.
   */
  launchChromeWindow: () => ipcRenderer.invoke("launch-chrome-window"),

  /**
   * (Optional future expansion)
   * Navigate the launched Chrome instance to a custom URL.
   * You’ll add a handler for this later in main.js.
   */
  openChromeURL: (url) => ipcRenderer.invoke("open-chrome-url", url),
});
