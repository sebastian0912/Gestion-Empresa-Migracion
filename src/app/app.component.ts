import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import Swal from 'sweetalert2';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        on: (channel: string, func: (...args: any[]) => void) => void;
        send: (channel: string, ...args: any[]) => void;
        invoke: (channel: string, ...args: any[]) => Promise<any>;
      };
      version: {
        get: () => Promise<{ success: boolean; data?: string; error?: string }>;
      };
      env: {
        get: () => Promise<string>;
      };
      __dirname: string;
    }
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgIf
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Tesoreria-Angular-Electron-Actualizacion';
  updateAvailable: boolean = false;
  updateDownloaded: boolean = false;
  downloadProgress: number = 0;
  

  async ngOnInit() {
    if (typeof window !== 'undefined' && window.electron) {
      window.electron.ipcRenderer.on('update-available', () => {
        this.updateAvailable = true;
        Swal.fire({
          title: 'Nueva actualización disponible',
          text: 'Se descargará en segundo plano.',
          icon: 'info',
          confirmButtonText: 'OK'
        });
      });

      // Mostrar el progreso de la descarga
      window.electron.ipcRenderer.on('download-progress', (progressObj: any) => {
        this.downloadProgress = progressObj.percent;
        Swal.fire({
          title: 'Descargando actualización...',
          html: `Progreso: ${this.downloadProgress.toFixed(2)}%`,
          icon: 'info',
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
      });

      window.electron.ipcRenderer.on('update-downloaded', () => {
        this.updateDownloaded = true;
        Swal.close();
        Swal.fire({
          title: 'Actualización descargada',
          text: '¿Quieres reiniciar la aplicación para aplicar la actualización ahora?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Sí',
          cancelButtonText: 'No'
        }).then((result) => {
          if (result.isConfirmed) {
            window.electron.ipcRenderer.send('restart-app');
          }
        });
      });

      window.electron.ipcRenderer.on('update-not-available', () => {
        Swal.close();  // Cierra cualquier Swal abierto en caso de que no haya actualizaciones
        Swal.fire({
          title: 'No hay nuevas actualizaciones',
          text: 'Estás utilizando la última versión.',
          icon: 'info',
          confirmButtonText: 'OK'
        });
      });

      window.electron.ipcRenderer.on('update-error', (error) => {
        Swal.close();  // Cierra cualquier Swal de progreso si ocurre un error
        Swal.fire({
          title: 'Error en la actualización',
          text: `Error: ${error}`,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
    }
  }
}
