// Para correrla y tener los cambios en vivo
/*/
const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

let mainWindow;

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),  // Asegúrate de que esta ruta es correcta
      contextIsolation: true,  // Mantener el aislamiento del contexto
      nodeIntegration: false,  // Desactivar la integración de Node.js
    },
  });

  mainWindow.loadURL('http://localhost:4200');

  // Maximize the window
  mainWindow.maximize();

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  // Check for updates after window is created
  autoUpdater.checkForUpdates();
}

autoUpdater.on("update-available", async () => {
  console.log("Actualización disponible");
  mainWindow.webContents.send('update-available');
  autoUpdater.downloadUpdate();
});

autoUpdater.on("update-downloaded", async (info) => {
  console.log("Actualización descargada");
  mainWindow.webContents.send('update-downloaded');
  setTimeout(() => {
    autoUpdater.quitAndInstall();
  }, 5000);
});

autoUpdater.on("update-not-available", () => {
  console.log("Actualización no disponible");
});

autoUpdater.on("error", (error) => {
  console.error("Hubo un error con la actualización:", error);
});

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});*/





// Para empaquetar
const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path'); // Mantenemos solo una declaración de 'path'
const { autoUpdater } = require('electron-updater');

let mainWindow;

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

const url = require("url");

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),  // Asegúrate de que esta ruta es correcta
      contextIsolation: true,  // Mantener el aislamiento del contexto
      nodeIntegration: true,
    }
  });

  mainWindow.setMenu(null)


  // Check for updates after window is created
  autoUpdater.checkForUpdates();

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, `dist/gestion-empresa-migracion/browser/index.html`),
    protocol: "file:",
    slashes: true
  }));

  // Maximize the window
  mainWindow.maximize();

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

}

autoUpdater.on("update-available", async () => {
  console.log("Actualización disponible");
  mainWindow.webContents.send('update-available');
  autoUpdater.downloadUpdate();
});

autoUpdater.on("update-downloaded", async (info) => {
  console.log("Actualización descargada");
  mainWindow.webContents.send('update-downloaded');
  setTimeout(() => {
    autoUpdater.quitAndInstall();
  }, 5000);
});

autoUpdater.on("update-not-available", () => {
  console.log("Actualización no disponible");
});

autoUpdater.on("error", (error) => {
  console.error("Hubo un error con la actualización:", error);
});

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});
