'use strict';

import { app, protocol, BrowserWindow, shell } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer';
import config from './config';
const os = require('os');
const fs = require('fs');
const path = require('path');
const isDevelopment = process.env.NODE_ENV !== 'production';
const Badge = require('electron-windows-badge');

const { ipcMain } = require('electron');
let win: any;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('app://./index.html');
  }

  // win 下设置角标
  if (process.platform !== 'darwin') {
    new Badge(win, {});
  } else {
    // mac 下设置角标
    ipcMain.on('sendMessage', (event, data) => {
      app.dock.setBadge(data);
    });
  }

  // active 程序
  ipcMain.on('appActive', (event, data) => {
    if (data) {
      win.show();
    }
  });

  // 设置通知标题
  app.setAppUserModelId(config.ELECTRON_NAME || '');

  let dowUrl = '';
  // 使用本地应用打开文件
  ipcMain.on('openFileInSysApp', (event, url, fileName) => {
    dowUrl = path.join(os.homedir(), config.ELECTRON_NAME, fileName); //`${os.homedir()}/${config.ELECTRON_NAME}/${fileName}`;
    // 查看文件是否存在 如果存在 并且大小相同 则直接打开
    fs.access(dowUrl, (err: any) => {
      if (!err) {
        shell.openPath(dowUrl);
      } else {
        win.webContents.downloadURL(url);
      }
    });
  });
  win.webContents.session.on('will-download', (event, item) => {
    item.setSavePath(dowUrl);
    item.once('done', (_, state) => {
      if (state === 'completed') {
        shell.openPath(dowUrl);
      } else {
        console.log(`Download failed: ${state}`);
      }
    });
  });

  win.on('close', () => {
    win.webContents.send('close');
  });
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS);
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
