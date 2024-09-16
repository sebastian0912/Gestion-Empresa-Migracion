import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContratacionService } from '../../services/contratacion/contratacion.service';
import { isPlatformBrowser, CommonModule } from '@angular/common'; // Importa CommonModule
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-leer-info-candidato',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    CommonModule // Asegúrate de agregar CommonModule
  ],
  templateUrl: './leer-info-candidato.component.html',
  styleUrl: './leer-info-candidato.component.css'
})
export class LeerInfoCandidatoComponent {
  oficina: string | null = null;
  evaluador: any = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

  ngOnInit(): void {
    console.log(this.data.seleccion);
    console.log(this.data.infoGeneralC);
    this.getUser();
  }

  // Función para actualizar los campos al cambiar el input
  updateField(field: string, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.data.infoGeneralC[field] = inputElement.value;
  }

  // Convertir un número de días en una fecha válida (basado en el 1 de enero de 1900)
  convertirDiasAFecha(dias: string): Date {
    const diasDesde1900 = parseInt(dias, 10); // Convertimos a entero
    const fechaBase = new Date(1900, 0, 1); // 1 de enero de 1900
    fechaBase.setDate(fechaBase.getDate() + diasDesde1900);
    return fechaBase;
  }

  // Calcular edad a partir del número de días desde 1 de enero de 1900
  calcularEdad(dias: string): number {
    if (!dias || isNaN(Number(dias))) {
      return NaN; // Si no es un número válido
    }
    const fechaNacimiento = this.convertirDiasAFecha(dias);
    const today = new Date();
    let age = today.getFullYear() - fechaNacimiento.getFullYear();
    const monthDiff = today.getMonth() - fechaNacimiento.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < fechaNacimiento.getDate())) {
      age--;
    }
    return age;
  }

  // Obtener el nombre completo
  getFullName(): string {
    const { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido } = this.data.infoGeneralC || {};
    return `${primer_nombre || ''} ${segundo_nombre || ''} ${primer_apellido || ''} ${segundo_apellido || ''}`.trim();
  }

  // Obtener información del usuario local
  async getUser(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('user');
      if (user) {
        // Parsea el JSON almacenado en el localStorage para convertirlo en un objeto
        const parsedUser = JSON.parse(user);
        console.log(parsedUser);
        this.evaluador = parsedUser.primer_nombre + ' ' + parsedUser.primer_apellido;
        this.oficina = parsedUser.sucursalde;
      }
    }
  }


  enviarFormulario() {
    console.log('Información del formulario:', this.data.infoGeneralC);
    // Aquí puedes agregar la lógica para enviar los datos al backend o servicio correspondiente
  }

}
