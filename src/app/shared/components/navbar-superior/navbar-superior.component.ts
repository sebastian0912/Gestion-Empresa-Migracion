import { Component, OnInit } from '@angular/core';
import { isPlatformBrowser, NgFor, NgIf } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { AdminService } from '../../services/admin/admin.service';

@Component({
  selector: 'app-navbar-superior',
  standalone: true,
  imports: [
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    NgIf,
    NgFor
  ],
  templateUrl: './navbar-superior.component.html',
  styleUrls: ['./navbar-superior.component.css']
})
export class NavbarSuperiorComponent implements OnInit {
  role: string = '';
  username: string = '';
  appVersion: string = '';

  sede: string = '';
  sedes: any[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private adminService: AdminService,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    const user = await this.getUser();
    this.getAppVersion();

    if (user) {
      this.username = `${user.primer_nombre} ${user.primer_apellido}`;
      this.role = user.rol;
      this.sede = user.sucursalde;
    }
  }

  getAppVersion() {
    // Verificar si estamos en un entorno del navegador antes de acceder a 'window'
    if (isPlatformBrowser(this.platformId)) {
      // Comprobar si window.electron está disponible
      if (window.electron && window.electron.version) {
        window.electron.version.get().then((response: any) => {
          this.appVersion = response;
        });
      }
    }
  }


  async getUser(): Promise<any> {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('user');
      if (user) {
        return JSON.parse(user);
      }
    }
    return null;
  }

  async cargarSedes(): Promise<void> {
    (await this.adminService.traerSucursales()).subscribe((data: any) => {
      // ordenar por nombre
      data.sucursal.sort((a: any, b: any) => a.nombre.localeCompare(b.nombre));
      this.sedes = data.sucursal;
    });
  }

  async onSedeSeleccionada(sede: string): Promise<void> {
    try {
      const user = await this.getUser();
      if (user) {
        const response = await this.adminService.editarSede(user.numero_de_documento, sede);
        if (response.message === 'error') {
          Swal.fire('Error!', 'Hubo un problema al asignar la sede, vuelva a intentarlo.', 'error');
          return;
        } else if (response.message === 'success') {
          user.sucursalde = sede;
          localStorage.setItem('user', JSON.stringify(user));
          Swal.fire('Editado!', 'La sede ha sido asignada.', 'success')
            .then(() => {
              // que mire donde esta y lo redirija a la pagina donde esta

              this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
                this.router.navigate([this.router.url], { skipLocationChange: true });
              });


            });
        }
      }
    } catch (error) {
      Swal.fire('Error!', 'Hubo un problema al asignar la sede.', 'error');
    }
  }
}
