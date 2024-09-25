declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        send: (channel: string, data: any) => void;
        on: (channel: string, func: (...args: any[]) => void) => void;
      };
      fingerprint: {
        get: () => Promise<{ success: boolean; data?: string; error?: string }>;
      };
    };
  }
}
