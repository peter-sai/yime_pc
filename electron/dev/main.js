// eslint-disable-next-line @typescript-eslint/no-var-requires
const { app, BrowserWindow, Menu } = require('electron');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
const Badge = require('electron-windows-badge');

const { ipcMain } = require('electron');

ipcMain.on('sendMessage', (event, data) => {
  if (process.platform === 'darwin') {
    app.dock.setBadge(data);
  }
});

const winURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:8000`
    : path.join('file://', __dirname, 'index.html');
function createWindow() {
  // Menu.setApplicationMenu(Menu.buildFromTemplate([]));
  if (process.platform === 'darwin') {
    const template = [
      {
        label: 'Application',
        submenu: [
          {
            label: 'Quit',
            accelerator: 'Command+Q',
            click: function () {
              app.quit();
            },
          },
        ],
      },
      {
        label: 'Edit',
        submenu: [
          { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
          { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
        ],
      },
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  } else {
    Menu.setApplicationMenu(null);
  }

  // 创建浏览器窗口
  const win = new BrowserWindow({
    icon: path.join(__dirname, 'img/ico.ico'),
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      // preload: path.join(__dirname, './reload.js'),
    },
  });

  // 并且为你的应用加载index.html
  win.loadURL(winURL);
  if (process.platform !== 'darwin') {
    new Badge(win, {});
  }

  // 打开开发者工具
  // win.webContents.openDevTools();
}

// Electron会在初始化完成并且准备好创建浏览器窗口时调用这个方法
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(createWindow);

//当所有窗口都被关闭后退出
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 您可以把应用程序其他的流程写在在此文件中
// 代码 也可以拆分成几个文件，然后用 require 导入。
