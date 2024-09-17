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
  convertirAFecha(fecha: string): Date | null {
    // Si la fecha es un número de días (solo contiene dígitos)
    if (/^\d+$/.test(fecha)) {
      const diasDesde1900 = Number(fecha);
      const fechaBase = new Date(1900, 0, 1); // 1 de enero de 1900
      fechaBase.setDate(fechaBase.getDate() + diasDesde1900);
      
      if (isNaN(fechaBase.getTime())) {
        console.error('Fecha inválida generada a partir de los días:', fecha);
        return null;
      }
      
      return fechaBase;
  
    // Si la fecha está en formato "DD/MM/YYYY"
    } else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(fecha)) {
      const [dia, mes, anio] = fecha.split('/').map(Number);
      if (!dia || !mes || !anio) {
        console.error('Formato de fecha inválido:', fecha);
        return null;
      }
  
      const fechaValida = new Date(anio, mes - 1, dia);
      
      if (isNaN(fechaValida.getTime())) {
        console.error('Fecha inválida generada a partir del string:', fecha);
        return null;
      }
  
      return fechaValida;
  
    } else {
      console.error('Formato de fecha no reconocido:', fecha);
      return null;
    }
  }
  

  // Calcular edad a partir del número de días desde 1 de enero de 1900
  calcularEdad(fecha: string): number {
    const fechaNacimiento = this.convertirAFecha(fecha);
    if (!fechaNacimiento) {
      return NaN; // Si la fecha no es válida
    }
  
    const today = new Date();
    let age = today.getFullYear() - fechaNacimiento.getFullYear();
  
    // Restar un año si aún no ha pasado el cumpleaños este año
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
