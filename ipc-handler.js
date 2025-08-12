const { ipcMain } = require("electron/main");
const fs = require('fs');
const path = require('path');
const { dialog } = require('electron');
const { BrowserWindow } = require('electron');

function registerIpcHandlers() {

  //返回当前文件夹内的所有文件
  ipcMain.handle('foreach-all', async (event, dirPath) => {
    try {
      const files = fs.readdirSync(dirPath)
      .filter(name => !/^\./.test(name) && name !== '.DS_Store')
      .map(name => {
        const fullPath = path.join(dirPath, name);
        const stat = fs.statSync(fullPath);
        return { 
          name,
          path: fullPath,
          size: stat.size,
          sizeText: formatSize(stat.size),
          isDirectory: stat.isDirectory(),
          isImage: stat.isFile() && /\.(png|jpe?g|gif|bmp|webp)$/i.test(name),
          isVideo: stat.isFile() && /\.(mp4|mkv|avi|mov|wmv|flv)$/i.test(name),
          isJson: stat.isFile() && /^config\.json$/i.test(name),
          birthtime: stat.birthtime,
          birthtimeText: formatDate(stat.birthtime),
          mtime: stat.mtime,
          mtimeText: formatDate(stat.mtime)
        }
      });
      return { success: true, files };
    } catch (e) {
      return { success: false, message: e.message };
    }
  });
  //读写文件
  ipcMain.handle('write-in', async (event, filePath, content ) => {
    try {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(content), 'utf-8');
      return { success: true };
    } catch (e) {
      return { success: false, message: e.message };
    }
  });
  ipcMain.handle('read-out', async (event, filePath) => {
    try {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      //console.log(content,"1q");
      return { success: true, content };
    } catch (e) {
      return { success: false, message: e.message };
    }
  });
  // 删除文件
  ipcMain.handle('remove-file', async (event, filePath) => {
    try {
      fs.unlinkSync(filePath);
      return { success: true };
    } catch (e) {
      return { success: false, message: e.message };
    }
  });
  //选择主文件夹作为根目录
  ipcMain.handle('set-main-directory', async () => {
    const result = await dialog.showOpenDialog({
      title: '选择主文件夹作为根目录',
      properties: ['openDirectory']
    });
    if (result.canceled || result.filePaths.length === 0) {
      return null
    }
    return result.filePaths[0];
  });
  //返回当前文件夹内的所有图片内容，不包含子文件夹与config文件
  ipcMain.handle('floder-image', async (event,targetPath) => {
    try {
      const all = fs.readdirSync(targetPath, { withFileTypes: true });
      // 只返回图片文件（可根据需要扩展图片类型）
      const images = all
        .filter(dirent => dirent.isFile() && /\.(png|jpe?g|gif|bmp|webp)$/i.test(dirent.name))
        .map(dirent => dirent.name)
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
      return { success: true, images };
    } catch (e) {
      return { success: false, message: e.message };
    }
  })
  //全屏监测方法
  ipcMain.on('set-fullscreen', (event, flag) => {
    try{
      const win = BrowserWindow.getFocusedWindow();
      if (win){
        win.setFullScreen(!!flag);
        if (!win._fullscreenEventBound) {
        win.on('enter-full-screen', () => {
          win.webContents.send('fullscreen-changed', true);
        });
        win.on('leave-full-screen', () => {
          win.webContents.send('fullscreen-changed', false);
        });
        win._fullscreenEventBound = true;
      }
      } 
     
    }
    catch(e){
       return { success: false, message: e.message };
    }
  });
  


  // ipcMain.handle("select-files", async () => {
  //   const result = await dialog.showOpenDialog({
  //     properties: ["openFile","multiSelections"],
  //     filters: [
  //       { name: "所有文件", extensions: ["*"] },
  //     ],
  //   });
  //   if (result.canceled || result.filePaths.length === 0) {
  //     return null;
  //   }
  //   return result.filePaths;
  // });


  



  // //选择保存位置
  // ipcMain.handle('select-save-path', async (event, { defaultPath, filters }) => {
  //   const result = await dialog.showSaveDialog({
  //     title: '选择保存位置',
  //     defaultPath,
  //     filters
  //   });
  //   if (result.canceled) return null;
  //   return result.filePath;

  // });

  

  
  



  // // 删除文件/文件夹
  // ipcMain.handle('remove-path', async (event, targetPath) => {
  //   try {
  //     const stat = fs.statSync(targetPath);
  //     if (stat.isDirectory()) {
  //       fs.rmdirSync(targetPath, { recursive: true });
  //     } else {
  //       fs.unlinkSync(targetPath);
  //     }
  //     return { success: true };
  //   } catch (e) {
  //     return { success: false, message: e.message };
  //   }
  // });

  // // 重命名/移动
  // ipcMain.handle('move-path', async (event, { oldPath, newPath }) => {
  //   try {
  //     fs.renameSync(oldPath, newPath);
  //     return { success: true };
  //   } catch (e) {
  //     return { success: false, message: e.message };
  //   }
  // });

  // // 复制
  // ipcMain.handle('copy-path', async (event, { srcPath, destPath }) => {
  //   try {
  //     const stat = fs.statSync(srcPath);
  //     if (stat.isDirectory()) {
  //       // 递归复制目录
  //       fs.cpSync(srcPath, destPath, { recursive: true });
  //     } else {
  //       fs.copyFileSync(srcPath, destPath);
  //     }
  //     return { success: true };
  //   } catch (e) {
  //     return { success: false, message: e.message };
  //   }
  // });

  //OVERRIDE
  


}

function formatSize(size) {
  if (size < 1024) return size + ' B';
  if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
  if (size < 1024 * 1024 * 1024) return (size / 1024 / 1024).toFixed(1) + ' MB';
  return (size / 1024 / 1024 / 1024).toFixed(1) + ' GB';
}

function formatDate(date) {
  return date instanceof Date
    ? date.toLocaleString('zh-CN', { hour12: false })
    : '';
}

module.exports = { registerIpcHandlers };

