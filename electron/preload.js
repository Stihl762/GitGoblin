// electron/preload.js
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  launchChrome: (options) => {
    // options: { url, x, y, width, height }
    return ipcRenderer.invoke("launch-chrome", options);
  },

  // Optional: expose file icon functionality if needed
  // getFileIcon: (filePath) => ipcRenderer.invoke("get-file-icon", filePath),
});
