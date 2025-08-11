const { app, BrowserWindow } = require('electron/main')
const path = require('node:path')
const { registerIpcHandlers } = require('./ipc-handler')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1600,
    height: 900,
    maximizable: false, // 禁用最大化按钮（Windows）
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      enableRemoteModule: true
    }
  })

   win.loadFile(path.join(__dirname, 'UI/dist/ui/browser/index.html'))
}

registerIpcHandlers();

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})