import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavbarLateralComponent } from '../../components/navbar-lateral/navbar-lateral.component';
import { NavbarSuperiorComponent } from '../../components/navbar-superior/navbar-superior.component';
import { MatCardModule } from '@angular/material/card';
import { AdminService } from '../../services/admin/admin.service';
import { VetadosService } from '../../services/vetados/vetados.service';
import { isPlatformBrowser, NgFor } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';  // Importar operadores de rxjs
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-reporte-vetado',
  standalone: true,
  imports: [
    NavbarLateralComponent,
    NavbarSuperiorComponent,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    NgFor,
    MatIconModule
  ],
  templateUrl: './reporte-vetado.component.html',
  styleUrls: ['./reporte-vetado.component.css']
})
export class ReporteVetadoComponent implements OnInit {
  reporteForm!: FormGroup;
  sedes: any[] = [];
  username: string = '';  // Usuario actual (reportado por)
  sede: any;  // Sede del usuario
  categorias: number[] = [];  // Array de categorías del 1 al 13

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private vetadosService: VetadosService,
    private snackBar: MatSnackBar,  // Para mostrar notificaciones (opcional)
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

  }

  isSidebarHidden = false;

  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
  }

  async ngOnInit(): Promise<void> {

    // Inicializar el formulario reactivo
    this.reporteForm = this.fb.group({
      cedula: ['', Validators.required],
      nombre: [{ value: '', disabled: true }],  // Campo de nombre solo lectura
      sede: ['', Validators.required],
      observacion: ['', Validators.required],
      reportadoPor: [{ value: '', disabled: true }],
      centro_costo_carnet: ['', Validators.required],
      fecha_contratacion: [{ value: '', disabled: true }],
    });

    // Escuchar cambios en el campo de cédula con debounceTime
    this.reporteForm.get('cedula')?.valueChanges
      .pipe(
        debounceTime(3000),  // Espera 3 segundos después de que el usuario deje de escribir
        distinctUntilChanged()  // Solo dispara la petición si el valor cambió
      )
      .subscribe(cedula => {
        if (cedula) {
          this.buscarNombre(cedula);
        }
      });

    // Obtener lista de sedes
    (await this.adminService.traerSucursales()).subscribe((data: any) => {
      data.sucursal.sort((a: any, b: any) => a.nombre.localeCompare(b.nombre));  // Ordenar sedes
      this.sedes = data.sucursal;
    });

    // Obtener usuario actual y sede
    const user = await this.getUser();
    if (user) {
      this.username = `${user.primer_nombre} ${user.primer_apellido} - ${user.rol}`;
      this.sede = user.sucursalde;

      // Asignar el valor del campo 'reportadoPor' en el formulario
      this.reporteForm.patchValue({
        reportadoPor: this.username
      });
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

  buscarNombre(cedula: string): void {

    this.vetadosService.traerNombreCompletoCandidato(cedula).subscribe(
      (response: any) => {
        console.log('Nombre encontrado:', response);
        const nombreCompleto = response?.nombre_completo || '';

        // Si encuentra el nombre, actualiza el campo de nombre y elimina los errores
        this.reporteForm.patchValue({ nombre: nombreCompleto });
        // colocar el centro de costo carnet en el formulario
        this.reporteForm.patchValue({ centro_costo_carnet: response?.centro_costo_carnet });
        // colopcar fecha_contratacion
        this.reporteForm.patchValue({ fecha_contratacion: response?.fechaContratacion });
        this.reporteForm.get('nombre')?.setErrors(null);  // Elimina el error si existe
        this.reporteForm.get('cedula')?.setErrors(null);  // Elimina cualquier error asociado a la cédula
        this.reporteForm.updateValueAndValidity();  // Actualiza el estado del formulario
      },
      (error: any) => {
        if (error.error.message === "No se encontró el candidato con la cédula proporcionada") {
          // Establece el error en el campo de nombre para invalidar el formulario
          this.reporteForm.get('nombre')?.setErrors({ notFound: true });
          this.reporteForm.get('cedula')?.setErrors({ notFound: true });  // Marca también la cédula como error
          this.reporteForm.updateValueAndValidity();  // Actualiza el estado del formulario

          // Muestra el mensaje de error con SweetAlert
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se encontró el candidato con la cédula proporcionada, habla con contratación para más información, o verifica que la cédula sea correcta',
            confirmButtonText: 'Cerrar'
          });
        }
      }
    );
  }




  async enviarReporte() {
    if (this.reporteForm.valid) {
      const reporte = this.reporteForm.getRawValue();  // Obtener valores del formulario
      this.vetadosService.enviarReporte(reporte, this.sede).subscribe(
        response => {
          Swal.fire({
            title: 'Éxito',
            text: 'Reporte enviado exitosamente.',
            icon: 'success', // Ícono de éxito
            confirmButtonText: 'Aceptar'
          });
        },
        error => {
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al enviar el reporte.',
            icon: 'error', // Ícono de error
            confirmButtonText: 'Aceptar'
          });
        }
      );
    } else {
      Swal.fire({
        title: 'Formulario Inválido',
        text: 'Por favor, completa todos los campos requeridos.',
        icon: 'warning', // Ícono de advertencia
        confirmButtonText: 'Aceptar'
      });
    }
  }
  
}
