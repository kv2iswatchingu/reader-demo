const { ipcMain } = require("electron/main");
const fs = require('fs');
const path = require('path');
const { dialog } = require('electron');
const { BrowserWindow } = require('electron');
const fastglob = require('fast-glob');

function registerIpcHandlers() {

  // 返回当前文件夹内的所有文件
  ipcMain.handle('foreach-all', async (event, dirPath) => {
    try {
      const files = fs.readdirSync(dirPath)
      .filter(name => !/^\./.test(name) && name !== '.DS_Store')
      .map(name => {
        const fullPath = path.join(dirPath, name);
        const stat = fs.statSync(fullPath);
        return { 
          name: name,
          path: fullPath,
          size: stat.size,
          sizeText: formatSize(stat.size),
          isDirectory: stat.isDirectory(),
          isImage: stat.isFile() && /\.(png|jpe?g|gif|bmp|webp)$/i.test(name),
          isVideo: stat.isFile() && /\.(mp4|mkv|avi|mov|wmv|flv)$/i.test(name),
          isJson: stat.isFile() && /^config\.json$/i.test(name),
          isPdf: stat.isFile() && /\.(pdf)$/i.test(name),
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
  // 根据path读取此文件夹本身，返回其信息
  ipcMain.handle('read-dir', async (event, dirPath) => {
    try {
      const stat = fs.statSync(dirPath);
      if (!stat.isDirectory()) {
        return { success: false, message: '路径不是文件夹' };
      }
      return {
        success: true,
        file: {
          name: path.basename(dirPath),
          path: dirPath,
          size: stat.size,
          sizeText: formatSize(stat.size),
          isDirectory: stat.isDirectory(),
          isImage: stat.isFile() && /\.(png|jpe?g|gif|bmp|webp)$/i.test(path.basename(dirPath)),
          isVideo: stat.isFile() && /\.(mp4|mkv|avi|mov|wmv|flv)$/i.test(path.basename(dirPath)),
          isJson: stat.isFile() && /^config\.json$/i.test(path.basename(dirPath)),
          isPdf: stat.isFile() && /\.(pdf)$/i.test(path.basename(dirPath)),
          birthtime: stat.birthtime,
          birthtimeText: formatDate(stat.birthtime),
          mtime: stat.mtime,
          mtimeText: formatDate(stat.mtime)
        }
      };
  } catch (e) {
    return { success: false, message: e.message };
  }
  });
  // 读写文件
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
  // 删除文件/文件夹
  ipcMain.handle('remove-path', async (event, targetPath) => {
    try {
      const stat = fs.statSync(targetPath);
      if (stat.isDirectory()) {
        fs.rmdirSync(targetPath, { recursive: true });
      } else {
        fs.unlinkSync(targetPath);
      }
      return { success: true };
    } catch (e) {
      return { success: false, message: e.message };
    }
  });
  // 选择主文件夹作为根目录
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
  // 返回当前文件夹内的所有图片内容，不包含子文件夹与config文件
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
  // 返回当前根目录下所有文件夹及其子文件夹的的某个文件（默认cofig.json）
  ipcMain.handle('search-file', async (event,dirpath,options) => {
    try{
      const { filename } = options;
      let result = [];
      const patterns = [
        `${dirpath.replace(/\\/g, '/')}/**/*${filename}*`,
      ];
      const files = await fastglob(patterns, { 
        onlyFiles: false,
        caseSensitiveMatch: false,
        deep: 10,
        absolute: true, 
      });
      for (const file of files) {
        const stat = fs.statSync(file);
        const fileInfo = {
          path: file,
          name: path.basename(file),
          size: stat.size,
          sizeText: formatSize(stat.size),
          isDirectory: stat.isDirectory(),
          isImage: stat.isFile() && /\.(png|jpe?g|gif|bmp|webp)$/i.test(path.basename(file)),
          isVideo: stat.isFile() && /\.(mp4|mkv|avi|mov|wmv|flv)$/i.test(path.basename(file)),
          isJson: stat.isFile() && /^config\.json$/i.test(path.basename(file)),
          isPdf: stat.isFile() && /\.(pdf)$/i.test(path.basename(file)),
          birthtime: stat.birthtime,
          birthtimeText: formatDate(stat.birthtime),
          mtime: stat.mtime,
          mtimeText: formatDate(stat.mtime)
        }
        result.push(fileInfo);
      }
      return { success: true, result };
    }catch(e){
      return { success: false, message: e.message };
    }
  })
  // 全屏监测方法
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
  // 重命名/移动/粘贴
  ipcMain.handle('move-path', async (event, { oldPath, newPath }) => {
    try {
      fs.renameSync(oldPath, newPath);
      return { success: true };
    } catch (e) {
      return { success: false, message: e.message };
    }
  });
  // 复制
  ipcMain.handle('copy-path', async (event, { srcPath, destPath }) => {
    try {
      const stat = fs.statSync(srcPath);
      if (stat.isDirectory()) {
        // 递归复制目录
        fs.cpSync(srcPath, destPath, { recursive: true });
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
      return { success: true };
    } catch (e) {
      return { success: false, message: e.message };
    }
  });
  // 存在同名文件/夹
  ipcMain.handle('exists-path', async (event, targetPath) => {
    return fs.existsSync(targetPath);
  });
  // 新建文件夹
  ipcMain.handle('create-folder', async (event, targetPath) => {
    try {
      fs.mkdirSync(targetPath);
      return { success: true };
    } catch (e) {
      return { success: false, message: e.message };
    }
  });
  // 检查元素
  ipcMain.handle('stat-path', async (event, targetPath) => {
    try {
      const stat = fs.statSync(targetPath);
      return { isDirectory: stat.isDirectory(), isFile: stat.isFile() };
    } catch (e) {
      return { isDirectory: false, isFile: false };
    }
  });
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

