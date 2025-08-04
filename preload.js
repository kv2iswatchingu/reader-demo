const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
});

contextBridge.exposeInMainWorld("electronAPI", {
  writeIn: (filePath, content) => ipcRenderer.invoke("write-in", filePath, content),
  readOut: (filePath) => ipcRenderer.invoke("read-out", filePath),
  floderImage: (targetPath) => ipcRenderer.invoke("floder-image", targetPath),
});
