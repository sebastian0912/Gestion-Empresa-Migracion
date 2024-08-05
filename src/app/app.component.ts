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

  ngOnInit() {
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

      window.electron.ipcRenderer.on('update-downloaded', () => {
        this.updateDownloaded = true;
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
        Swal.fire({
          title: 'No hay nuevas actualizaciones',
          text: 'Estás utilizando la última versión.',
          icon: 'info',
          confirmButtonText: 'OK'
        });
      });

      window.electron.ipcRenderer.on('update-error', (error) => {
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
