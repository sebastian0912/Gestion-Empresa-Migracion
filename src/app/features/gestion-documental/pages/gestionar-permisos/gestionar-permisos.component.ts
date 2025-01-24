import { Component, OnInit } from '@angular/core';
import { NavbarLateralComponent } from '../../../../shared/components/navbar-lateral/navbar-lateral.component';
import { NavbarSuperiorComponent } from '../../../../shared/components/navbar-superior/navbar-superior.component';
import { MatCardModule } from '@angular/material/card';
import { AdminService } from '../../../../shared/services/admin/admin.service';
import { DocumentacionService } from '../../service/documentacion/documentacion.service';
import Swal from 'sweetalert2';
import { MatButtonModule } from '@angular/material/button';
import { CrearPermisoUsuarioComponent } from '../../components/crear-permiso-usuario/crear-permiso-usuario.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { DataSource } from '@angular/cdk/collections';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-gestionar-permisos',
  standalone: true,
  imports: [
    NavbarLateralComponent,
    NavbarSuperiorComponent,
    MatCardModule,
    MatButtonModule,
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatExpansionModule,
  ],
  templateUrl: './gestionar-permisos.component.html',
  styleUrl: './gestionar-permisos.component.css',
})
export class GestionarPermisosComponent implements OnInit {
  isSidebarHidden = false;
  usuariosPermisos: any;
  mostrarJerarquiaGestionDocumental: any;

  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
  }

  constructor(
    private adminService: AdminService,
    private documentacionService: DocumentacionService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.documentacionService.mostrar_permisos().subscribe((res: any) => {
      this.usuariosPermisos = res;
      console.log(this.usuariosPermisos);
      // si es vacio mostrar mensaje
      if (this.usuariosPermisos.length == 0) {
        Swal.fire({
          icon: 'info',
          title: 'Cuidado',
          text: 'No hay usuarios con permisos asignados',
        });
      }
    });

    this.documentacionService
      .mostrar_jerarquia_gestion_documental()
      .subscribe((res: any) => {
        this.mostrarJerarquiaGestionDocumental = res;
      });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CrearPermisoUsuarioComponent, {
      minWidth: '70vw', // Opcional: ajusta el ancho del diálogo
      data: {
        /* puedes pasar datos opcionales aquí */
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      this.documentacionService
        .crear_permiso({
          cedula: result?.usuario.numero_de_documento,
          tipo_documental_id: result?.tipoDocumental.id,
        })
        .subscribe({
          next: (res: any) => {
            console.log(res);
            Swal.fire({
              icon: 'success',
              title: 'Permiso creado',
              text: 'El permiso fue creado correctamente',
            });
            this.ngOnInit(); // Actualiza la vista
          },
          error: (err: any) => {
            console.error('Error al crear permiso:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo crear el permiso. Por favor, intenta de nuevo.',
            });
          },
        });
    });
  }

  editPermission(permission: string): void {
    console.log('Editando permiso:', permission);
    // Lógica adicional para editar el permiso
  }

  addPermission(data: any) {
    console.log('Agregando tipo:', data);

    const dialogRef = this.dialog.open(CrearPermisoUsuarioComponent, {
      minWidth: '70vw',
      data: {
        email: data.usuario, // Correo del usuario
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      this.documentacionService
        .crear_permiso({
          cedula: result.usuario.numero_de_documento,
          tipo_documental_id: result.tipoDocumental.id,
        })
        .subscribe({
          next: (res: any) => {
            console.log(res);
            Swal.fire({
              icon: 'success',
              title: 'Permiso creado',
              text: 'El permiso fue creado correctamente',
            });
            this.ngOnInit(); // Actualiza la vista
          },
          error: (err: any) => {
            console.error('Error al crear permiso:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo crear el permiso. Por favor, intenta de nuevo.',
            });
          },
        });
    });
  }
}
