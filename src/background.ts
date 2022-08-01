'use strict';

import {
  app,
  protocol,
  BrowserWindow,
  shell,
  nativeImage,
  Tray,
  Menu,
} from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer';
import config, { IConfig } from './config';
const { machineIdSync } = require('node-machine-id');
const os = require('os');
const fs = require('fs');
const path = require('path');
const isDevelopment = process.env.NODE_ENV !== 'production';
const Badge = require('electron-windows-badge');

const { ipcMain } = require('electron');
let win: any;
let tray: any;
let isQuit = false;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);

app.setAsDefaultProtocolClient('yime');

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

  const gotTheLock = app.requestSingleInstanceLock();

  if (!gotTheLock) {
    app.quit();
  } else {
    // windows
    app.on('second-instance', async (event, argv) => {
      // Windows 下通过协议URL启动时，URL会作为参数，所以需要在这个事件里处理
      if (process.platform === 'win32') {
        if (win.isMinimized()) win.restore();
        win.focus();
        /** 向渲染进程传递唤醒参数 */
        win.webContents.send('awaken', { awakenArgs: argv.pop() });
      }
    });
  }

  // Mac
  app.on('open-url', (event, url) => {
    /** 向渲染进程传递唤醒参数 */
    win.webContents.send('awaken', { awakenArgs: url });
  });

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

  // active 程序
  ipcMain.on('getUUid', (event) => {
    win.webContents.send('sendUuid', { uuid: machineIdSync() });
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
        dowUrl = '';
      } else {
        win.webContents.downloadURL(url);
      }
    });
  });
  win.webContents.session.on('will-download', (_: any, item: any) => {
    if (dowUrl) {
      item.setSavePath(dowUrl);
    }
    item.once('done', (_: any, state: string) => {
      if (state === 'completed') {
        if (dowUrl) {
          shell.openPath(dowUrl);
        }
      } else {
        console.log(`Download failed: ${state}`);
      }
    });
  });

  win.on('close', (e: any) => {
    win.webContents.send('close');
    if (!win.isFocused()) {
      win = null;
    } else {
      if (!isQuit) {
        e.preventDefault();
        win.hide();
      }
    }
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
  else win.show();
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

  // 设置系统托盘
  setTray();

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

function setTray() {
  const config = {
    dev: 'YIME',
    yime: 'YIME',
    duoliao: 'DUOLIAO',
    momo: 'MOMO',
  };
  const icon = nativeImage.createFromPath(
    path.join(
      __dirname,
      `../build/${config[process.env.VUE_APP_MODE as keyof IConfig]}/logo.png`
    )
  );
  tray = new Tray(icon);
  //单击打开应用
  tray.on('click', () => {
    win.show();
  });
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '退出',
      click: function () {
        isQuit = true;
        app.quit();
      },
    },
  ]);
  tray.on('right-click', () => {
    tray.popUpContextMenu(contextMenu);
  });
}
