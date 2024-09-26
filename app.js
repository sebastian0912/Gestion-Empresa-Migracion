const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');


let mainWindow;

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
autoUpdater.autoDownload = false;




function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: false, // Deshabilita temporalmente para pruebas
      enableRemoteModule: true, // Habilita temporalmente para pruebas
      nodeIntegration: true
    }
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:4200');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.removeMenu();
    mainWindow.loadURL(`file://${path.join(__dirname, 'dist/gestion-empresa-migracion/browser/index.html')}`);
  }

  mainWindow.maximize();

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  // Evento para manejar recargas de página
  mainWindow.webContents.on('will-navigate', (event, url) => {
    event.preventDefault();
    mainWindow.loadURL(url);
  });

  autoUpdater.checkForUpdatesAndNotify();
}
ipcMain.handle('version:get', async (event) => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  return packageJson.version;
});
autoUpdater.on('update-available', () => {
  log.info('Update available.');
  mainWindow.webContents.send('update-available');
  autoUpdater.downloadUpdate();
});

autoUpdater.on('update-downloaded', (info) => {
  log.info('Update downloaded.');
  mainWindow.webContents.send('update-downloaded');
});

autoUpdater.on('update-not-available', () => {
  log.info('Update not available.');
});

autoUpdater.on('error', (error) => {
  log.error('Error in auto-updater:', error);
  mainWindow.webContents.send('update-error', error);
});

ipcMain.on('restart-app', () => {
  autoUpdater.quitAndInstall();
});

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});
