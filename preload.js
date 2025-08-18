const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
});

contextBridge.exposeInMainWorld("electronAPI", {
  readDir: (dirPath) => ipcRenderer.invoke("read-dir", dirPath),
  foreachAll:(dirPath) => ipcRenderer.invoke("foreach-all", dirPath),
  searchFile: (dirPath, options) => ipcRenderer.invoke("search-file", dirPath, options),
  writeIn: (filePath, content) => ipcRenderer.invoke("write-in", filePath, content),
  readOut: (filePath) => ipcRenderer.invoke("read-out", filePath),
  removeFile: (filePath) => ipcRenderer.invoke("remove-file",filePath),
  removePath: (filePath) => ipcRenderer.invoke("remove-path",filePath),
  movePath: (oldPath,newPath) => ipcRenderer.invoke("move-path",oldPath,newPath),
  copyPath: (srcPath,destPath) => ipcRenderer.invoke("copy-path",srcPath,destPath),
  setMainPath: () => ipcRenderer.invoke("set-main-directory"),
  floderImage: (targetPath) => ipcRenderer.invoke("floder-image", targetPath),
  setFullscreen: (flag) => ipcRenderer.send('set-fullscreen', flag),
  onFullscreenChanged: (callback) => ipcRenderer.on('fullscreen-changed', (event, isFullscreen) => callback(isFullscreen)),
});
