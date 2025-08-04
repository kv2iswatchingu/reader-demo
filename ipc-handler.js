const { ipcMain } = require("electron/main");
const fs = require('fs');
const path = require('path');



function registerIpcHandlers() {

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

  // // 选择文件夹
  // ipcMain.handle('select-directory', async () => {
  //   const result = await dialog.showOpenDialog({
  //     title: '选择输出文件夹',
  //     properties: ['openDirectory']
  //   });
  //   if (result.canceled || result.filePaths.length === 0) {
  //     return null;
  //   }
  //   return result.filePaths[0];
  // });


  

  // ipcMain.handle('remove-file', async (event, filePath) => {
  //   try {
  //     fs.unlinkSync(filePath);
  //     return { success: true };
  //   } catch (e) {
  //     return { success: false, message: e.message };
  //   }
  // });


  //testing 文件操作
  // 获取目录内容
 
  // ipcMain.handle('list-directory', async (dirPath) => {
  //   try {
  //     const files = fs.readdirSync(dirPath);
  //     return { success: true, files };
  //   } catch (e) {
  //     return { success: false, message: e.message };
  //   }
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

module.exports = { registerIpcHandlers };

