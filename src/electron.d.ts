export interface IElectron {
  ipcRenderer: {
    send(channel: string, data: any): void;
    on(channel: string, listener: (event: any, ...args: any[]) => void): void;
  };
  getAppVersion: () => Promise<string>; // Declara getAppVersion correctamente
}

interface Window {
  electron: IElectron; // Declara que window tiene un objeto electron de tipo IElectron
}
