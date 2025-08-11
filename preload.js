const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
});

contextBridge.exposeInMainWorld("electronAPI", {
  foreachAll:(dirPath) => ipcRenderer.invoke("foreach-all", dirPath),
  writeIn: (filePath, content) => ipcRenderer.invoke("write-in", filePath, content),
  readOut: (filePath) => ipcRenderer.invoke("read-out", filePath),
  setMainPath: () => ipcRenderer.invoke("set-main-directory"),
  floderImage: (targetPath) => ipcRenderer.invoke("floder-image", targetPath),
  setFullscreen: (flag) => ipcRenderer.send('set-fullscreen', flag),
  onFullscreenChanged: (callback) => ipcRenderer.on('fullscreen-changed', (event, isFullscreen) => callback(isFullscreen)),
});
