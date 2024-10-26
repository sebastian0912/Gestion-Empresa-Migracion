import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tuapo.app',
  appName: 'TuApoApp',
  webDir: 'dist/gestion-empresa-migracion/browser',
  server: {
    cleartext: true, // Permite conexiones HTTP si alguna vez es necesario (mejor si se usa solo en desarrollo)
    androidScheme: 'https' // Especifica que se usará https
  }
};

export default config;
