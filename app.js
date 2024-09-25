const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const { execFile } = require('child_process'); // Asegúrate de importar execFile aquí


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
      contextIsolation: true,
      //nodeIntegration: true,
      nodeIntegration: false,
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
ipcMain.handle('fingerprint:get', async (event) => {
  return new Promise((resolve, reject) => {
    const csharpAppPath = path.join(__dirname, 'csharp', 'UareUSampleCSharp_CaptureOnly.exe'); // Ruta a tu ejecutable de C#

    execFile(csharpAppPath, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error al ejecutar el archivo C#: ${stderr}`);
        reject({ error: stderr });
        return;
      }

      // Busca la línea que contiene 'DATA:'
      const match = stdout.match(/DATA:\s*(.+)/);
      if (match) {
        const base64Image = match[1].trim();
        resolve({ success: true, data: base64Image });
      } else {
        reject({ error: 'No se recibió una imagen en Base64.' });
      }
    });
  });
});
app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});
