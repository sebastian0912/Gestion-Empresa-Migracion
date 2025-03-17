const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const { execFile } = require('child_process'); // Asegúrate de importar execFile aquí

let mainWindow;

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
autoUpdater.autoDownload = false; // La descarga manual se gestionará después de la notificación

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false
    }
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:4500');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.removeMenu();
    mainWindow.loadURL(`file://${path.join(__dirname, 'dist/gestion-empresa-migracion/browser/index.html')}`);
  }

  mainWindow.maximize();

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  // Verificar actualizaciones
  autoUpdater.checkForUpdatesAndNotify();
}

// Obtener la versión de la aplicación
ipcMain.handle('version:get', () => {
  const packageJson = require(path.resolve(__dirname, 'package.json'));
  return packageJson.version;
});

// Obtener el entorno actual
ipcMain.handle('env:get', () => {
  return process.env.NODE_ENV || 'production';
});

// Evento para cuando haya una actualización disponible
autoUpdater.on('update-available', () => {
  log.info('Update available.');
  mainWindow.webContents.send('update-available');
  autoUpdater.downloadUpdate(); // Iniciar la descarga de la actualización
});

// Evento para el progreso de la descarga
autoUpdater.on('download-progress', (progressObj) => {
  log.info(`Download progress: ${progressObj.percent}%`);
  mainWindow.webContents.send('download-progress', progressObj);
});

// Evento cuando la actualización haya sido descargada
autoUpdater.on('update-downloaded', (info) => {
  log.info('Update downloaded.');
  mainWindow.webContents.send('update-downloaded');
});

// Evento cuando no haya actualizaciones disponibles
autoUpdater.on('update-not-available', () => {
  log.info('Update not available.');
  mainWindow.webContents.send('update-not-available');
});

// Evento cuando ocurra un error en el proceso de actualización
autoUpdater.on('error', (error) => {
  log.error('Error in auto-updater:', error);
  mainWindow.webContents.send('update-error', error);
});

// Reiniciar la aplicación después de la descarga de la actualización
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


ipcMain.handle('fingerprint:get', async (event) => {
  return new Promise((resolve, reject) => {
    let csharpAppPath;

    if (process.env.NODE_ENV === 'development') {
      // En desarrollo, el archivo está en el mismo directorio del código
      csharpAppPath = path.join(__dirname, 'csharp', 'UareUSampleCSharp_CaptureOnly.exe');
    } else {
      // En producción, el ejecutable debe estar en la carpeta "resources"
      csharpAppPath = path.join(process.resourcesPath, 'csharp', 'UareUSampleCSharp_CaptureOnly.exe');
    }

    execFile(csharpAppPath, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error al ejecutar el archivo C#: ${stderr}`);
        reject({ error: stderr });
        return;
      }

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
