const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, func) => {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    },
  },
  getAppVersion: () => {
    console.log('getAppVersion invocado'); // Verifica que esta función se está exponiendo correctamente
    return ipcRenderer.invoke('getAppVersion');
  }
});
