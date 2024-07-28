import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

declare global {
  interface Window {
    electron: {
      ipcRenderer: any;
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
        alert('Nueva actualización disponible. Se descargará en segundo plano.');
      });

      window.electron.ipcRenderer.on('update-downloaded', () => {
        this.updateDownloaded = true;
        alert('Actualización descargada. La aplicación se reiniciará en breve.');
      });
    }
  }
}
