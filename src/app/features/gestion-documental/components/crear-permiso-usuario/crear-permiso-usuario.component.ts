import { Component, Inject, InjectionToken, OnInit } from '@angular/core';
import { DocumentacionService } from '../../service/documentacion/documentacion.service';
import { AdminService } from '../../../../shared/services/admin/admin.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-crear-permiso-usuario',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
  templateUrl: './crear-permiso-usuario.component.html',
  styleUrl: './crear-permiso-usuario.component.css'
})
export class CrearPermisoUsuarioComponent implements OnInit {
  usuariosEmpresas: any;
  tiposDocumentos: any;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private documentacionService: DocumentacionService,
    private adminService: AdminService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      usuario: [null, Validators.required],
      tipoDocumental: [null, Validators.required],
    });
  }

  ngOnInit() {
    // Obtener tipos documentales
    this.documentacionService.mostrar_jerarquia_gestion_documental().subscribe((res: any) => {
      this.tiposDocumentos = res;
    });

    // Obtener lista de usuarios y preseleccionar el usuario con el correo recibido
    this.adminService.traerUsuarios().subscribe((res: any) => {
      this.usuariosEmpresas = res;

      // Buscar el usuario correspondiente al correo
      const preselectedUser = this.usuariosEmpresas.find(
        (usuario: any) => usuario.username === this.data.email
      );

      if (preselectedUser) {
        this.form.patchValue({
          usuario: preselectedUser,
        });

        // Deshabilitar el control de usuario
        this.form.get('usuario')?.disable();
      }
    });
  }


  // Enviar el valor del usuario deshabilitado junto con el formulario
  getFormValue() {
    const formValue = this.form.getRawValue();
    return {
      ...formValue,
      usuario: this.form.get('usuario')?.value,
    };
  }

}

