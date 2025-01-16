import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NavbarLateralComponent } from '../../components/navbar-lateral/navbar-lateral.component';
import { NavbarSuperiorComponent } from '../../components/navbar-superior/navbar-superior.component';
import { InfoCardComponent } from '../../components/info-card/info-card.component';
import { PagosService } from '../../services/pagos/pagos.service';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { NgFor, NgForOf, NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CrearEditarVacanteComponent } from '../../components/crear-editar-vacante/crear-editar-vacante.component';
import { VacantesService } from '../../services/vacantes/vacantes.service';
import { MatMenuModule } from '@angular/material/menu';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-vacantes',
  standalone: true,
  imports: [
    NavbarLateralComponent,
    NavbarSuperiorComponent,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatCardModule,
    NgIf,
    NgFor,
    NgForOf,
    MatMenuModule,

  ],
  templateUrl: './vacantes.component.html',
  styleUrl: './vacantes.component.css'
})
export class VacantesComponent implements OnInit {
  vacantes: any[] = [];

  isSidebarHidden = false;

  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
  }

  constructor(
    private dialog: MatDialog,
    private vacantesService: VacantesService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  async loadData(): Promise<void> {
    this.vacantesService.listarVacantes().pipe(
      catchError((error) => {
        Swal.fire('Error', 'Ocurrió un error al cargar las vacantes', 'error');
        return of([]); // Retorna un arreglo vacío para manejar el error y continuar
      })
    ).subscribe((response: any) => {
      this.vacantes = response.publicacion.map((vacante: any) => ({
        ...vacante,
      }));
    });
  }


  openModalEdit(vacante?: any): void {
    const dialogRef = this.dialog.open(CrearEditarVacanteComponent, {
      minWidth: '80vw',
      data: vacante ? vacante : null // Si existe vacante, se pasa como data, si no, se abre vacío
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.cargos) {
        // Inicializamos un array para capturar los resultados de cada solicitud
        const envioResultados: Array<Promise<any>> = [];

        result.cargos.forEach((cargo: any, index: number) => {
          // Estructurar los datos que se enviarán a la API
          const cargoAEnviar = {
            Cargovacante: cargo.cargo,
            CargovacanteOtros: '',
            Localizaciondelavacante: result.empresa,
            zonaquenoestaTrabajador: '',
            localizacionDeLaPersona: result.oficina.join(', '),
            finca: result.finca,
            zonaquenoestaPostulante: '',
            lugarPrueba: cargo.lugarPrueba || null,
            experiencia: cargo.requiereExperiencia,
            Pruebatecnica: cargo.pruebaTecnica,
            fechadePruebatecnica: cargo.fechaPrueba || null,
            horadepruebatecnica: cargo.horaPrueba || null,
            numeroDeGenteRequerida: cargo.numeroPersonas,
            Observaciones: cargo.observaciones,
            fechadeingreso: cargo.fechaIngresoSeleccionada || null,
            empresaQueSolicita: result.temporal,
            descripcion: cargo.descripcion,
          };

          // Almacenar cada solicitud como una promesa en el array
          const envio = new Promise((resolve, reject) => {
            this.vacantesService.actualizarVacante(vacante.id, cargoAEnviar).subscribe(
              (response: any) => {
                if (response.message === 'success') {
                  resolve(`Cargo #${index + 1} enviado correctamente`);
                } else {
                  reject(`Error en el cargo #${index + 1}: ${response.message}`);
                }
              },
              (error: any) => {
                reject(`Error en el cargo #${index + 1}: ${error.message || 'Error desconocido'}`);
              }
            );
          });

          envioResultados.push(envio);
        });

        // Esperar a que todas las solicitudes se completen
        Promise.allSettled(envioResultados).then(async results => {
          const errores = results.filter(result => result.status === 'rejected');

          if (errores.length > 0) {
            // Si hay errores, mostrar los detalles
            Swal.fire({
              title: 'Errores en el envío',
              text: `Hubo errores en ${errores.length} cargos:\n${errores.map(e => (e as PromiseRejectedResult).reason).join('\n')}`,
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          } else {
            // Si todos fueron exitosos, mostrar el mensaje de éxito
            await this.loadData();
            Swal.fire({
              title: '¡Éxito!',
              text: 'Todos los cargos de la vacante han sido enviados exitosamente',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
          }
        });

      }
    });
  }

  openModal(vacante?: any): void {
    const dialogRef = this.dialog.open(CrearEditarVacanteComponent, {
      minWidth: '80vw',
      data: vacante ? vacante : null // Si existe vacante, se pasa como data, si no, se abre vacío
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.cargos) {
        // Inicializamos un array para capturar los resultados de cada solicitud
        const envioResultados: Array<Promise<any>> = [];

        result.cargos.forEach((cargo: any, index: number) => {
          // Estructurar los datos que se enviarán a la API
          const cargoAEnviar = {
            Cargovacante: cargo.cargo,
            CargovacanteOtros: '',

            Localizaciondelavacante: result.empresa,
            finca: result.finca,
            zonaquenoestaTrabajador: '',

            localizacionDeLaPersona: result.oficina.join(', '),
            zonaquenoestaPostulante: '',
            lugarPrueba: cargo.lugarPrueba || null,
            experiencia: cargo.requiereExperiencia,
            Pruebatecnica: cargo.pruebaTecnica,
            fechadePruebatecnica: cargo.fechaPrueba || null,
            horadepruebatecnica: cargo.horaPrueba || null,
            numeroDeGenteRequerida: cargo.numeroPersonas,
            Observaciones: cargo.observaciones,
            fechadeingreso: cargo.fechaIngresoSeleccionada || null,
            empresaQueSolicita: result.temporal,
            descripcion: cargo.descripcion,
          };

          // Almacenar cada solicitud como una promesa en el array
          const envio = new Promise((resolve, reject) => {
            this.vacantesService.enviarVacante(cargoAEnviar).subscribe(
              (response: any) => {
                if (response.message === 'success') {
                  resolve(`Cargo #${index + 1} enviado correctamente`);
                } else {
                  reject(`Error en el cargo #${index + 1}: ${response.message}`);
                }
              },
              (error: any) => {
                reject(`Error en el cargo #${index + 1}: ${error.message || 'Error desconocido'}`);
              }
            );
          });

          envioResultados.push(envio);
        });

        // Esperar a que todas las solicitudes se completen
        Promise.allSettled(envioResultados).then(async results => {
          const errores = results.filter(result => result.status === 'rejected');

          if (errores.length > 0) {
            // Si hay errores, mostrar los detalles
            Swal.fire({
              title: 'Errores en el envío',
              text: `Hubo errores en ${errores.length} cargos:\n${errores.map(e => (e as PromiseRejectedResult).reason).join('\n')}`,
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          } else {
            // Si todos fueron exitosos, mostrar el mensaje de éxito
            await this.loadData();
            Swal.fire({
              title: '¡Éxito!',
              text: 'Todos los cargos de la vacante han sido enviados exitosamente',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
          }
        });

      }
    });
  }


  // Método para eliminar una vacante
  eliminarVacante(vacante: any): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then(result => {
      if (result.isConfirmed) {
        this.vacantesService.eliminarVacante(vacante.id).subscribe(() => {
          this.vacantes = this.vacantes.filter(v => v.id !== vacante.id);
          Swal.fire('Eliminado!', 'La vacante ha sido eliminada.', 'success');
        });
      }
    });
  }


  // Función para escoger una vacante y almacenarla en LocalStorage
  escogerVacante(vacante: any): void {
    // Almacenar la vacante seleccionada en LocalStorage
    localStorage.setItem('vacanteSeleccionada', JSON.stringify(vacante));
    Swal.fire('Vacante seleccionada', 'La vacante ha sido almacenada para ejecutarla en su proceso de seleccion', 'success');
  }




  // ------------------ Métodos para exportar a Excel ------------------

  // Función para manejar la subida del archivo Excel
  subirArchivoExcel(event: any): void {
    // Dispara el input oculto para seleccionar archivo
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  // Función para manejar la selección del archivo Excel
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Suponemos que el primer sheet contiene los datos
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convertir el Excel a JSON
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Excluir la primera fila (encabezados) y procesar el resto
        const datosProcesados = this.procesarDatosExcel(jsonData);

        // Llamar al servicio para subir los datos
        this.enviarDatosExcel(datosProcesados);
      };

      reader.readAsArrayBuffer(file);
    }

    // Reiniciar el input para permitir la selección de un nuevo archivo
    event.target.value = '';
  }

  // Función para procesar los datos del Excel
  procesarDatosExcel(jsonData: any[]): any[] {
    const datosProcesados = [];

    // Iterar sobre las filas, comenzando en la segunda (índice 1)
    for (let i = 1; i < jsonData.length; i++) {
      const fila = jsonData[i];

      if (fila && fila.length > 0) {
        const vacante = {
          empresa_usuaria: fila[0] || '',
          finca: fila[1] || '',
          centro_costos: fila[2] || '',
          subcentro: fila[3] || '',
          grupo: fila[4] || '',
          categoria: fila[5] || '',
          operacion: fila[6] || '',
          sublabor: fila[7] || '',
          salario: fila[8] || 0,
          auxilio_transporte: fila[9] || 0,
          ruta: fila[10] || '',
          valor_transporte: fila[11] || 0,
          horas_extras: fila[12] || 0,
          porcentaje_arl: fila[13] || 0
        };

        datosProcesados.push(vacante);
      }
    }
    return datosProcesados;
  }

  // Función para enviar los datos procesados al backend
  enviarDatosExcel(datos: any[]): void {
    this.vacantesService.crearDetalleLaboral(datos).subscribe(
      (response: any) => {
        Swal.fire('Éxito', 'Datos subidos correctamente', 'success');
        this.loadData();
      },
      (error: any) => {
        Swal.fire('Error', 'Ocurrió un error al subir los datos', 'error');
      }
    );
  }


}
