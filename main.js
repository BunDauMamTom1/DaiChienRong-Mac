const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

// Duong dan PepperFlashPlayer.plugin cho macOS
const flashPath = app.isPackaged
  ? path.join(process.resourcesPath, 'PepperFlashPlayer.plugin')
  : path.join(__dirname, 'plugins', 'PepperFlashPlayer.plugin');

app.commandLine.appendSwitch('ppapi-flash-path', flashPath);
app.commandLine.appendSwitch('ppapi-flash-version', '32.0.0.371');
app.commandLine.appendSwitch('ignore-certificate-errors');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 650,
    minWidth: 1000,
    minHeight: 620,
    title: 'Đại Chiến Rồng - Launcher macOS',
    backgroundColor: '#1a120b',
    webPreferences: {
      plugins: true,
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Menu nho giup nguoi choi F5 / Xoa cache nhanh tren MacBook
  const template = [
    {
      label: 'Đại Chiến Rồng',
      submenu: [
        {
          label: 'Tải lại game (Reload)',
          accelerator: 'CmdOrCtrl+R',
          click: () => { if (mainWindow) mainWindow.reload(); }
        },
        {
          label: 'Xóa Cache & Tải lại',
          accelerator: 'CmdOrCtrl+Shift+R',
          click: async () => {
            if (mainWindow) {
              await mainWindow.webContents.session.clearCache();
              mainWindow.reload();
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Mở Trang Chủ',
          click: () => shell.openExternal('http://daichienrong.com')
        },
        { type: 'separator' },
        { label: 'Thoát', role: 'quit' }
      ]
    },
    {
      label: 'Chỉnh sửa',
      submenu: [
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  // URL dang nhap / choi game (sua link nay neu ban dung link choi rieng)
  mainWindow.loadURL('http://daichienrong.com');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});
