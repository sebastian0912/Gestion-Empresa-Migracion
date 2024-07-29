import { Component, OnInit } from '@angular/core';
import { isPlatformBrowser, NgFor, NgIf } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
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
  styleUrl: './navbar-superior.component.css'
})

export class NavbarSuperiorComponent implements OnInit {
  role: string = '';
  username: string = '';
  sedes: any[] = [];
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private adminService: AdminService
  ) { }

  async ngOnInit(): Promise<void> {
    const user = await this.getUser();
    this.username = `${user.primer_nombre} ${user.primer_apellido}`;
    this.role = user.rol;
  }

  public getUser(): any {
    if (isPlatformBrowser(this.platformId)) {
      return JSON.parse(localStorage.getItem('user') || '{}');
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

  async onSedeSeleccionada(sede: string) {
    try {
      const response = await this.adminService.editarSede(this.getUser().numero_de_documento, sede);
      if (response.message === 'error') {
        Swal.fire('Error!', 'Hubo un problema al asignar la sede, vuelva a intentarlo.', 'error');
        return;
      } else if (response.message === 'success') {
        const user = this.getUser();
        user.sucursal = sede;
        localStorage.setItem('user', JSON.stringify(user));

        Swal.fire('Editado!', 'La sede ha sido asignada.', 'success')
          .then(() => {
            window.location.reload();
          });
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error!', 'Hubo un problema al asignar la sede.', 'error');
    }
  }
}
