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
import { AdminService } from '../../services/admin/admin.service';

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
    private vacantesService: VacantesService,
    private adminService: AdminService
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
      console.log('🔍 Vacantes cargadas:', response);
      this.vacantes = response.map((vacante: any) => ({
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
      data: vacante ? vacante : null // Si existe vacante, se pasa como data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('🔍 Resultado del modal:', result);

      if (result) {
        // ✅ Asegurar que `oficinasQueContratan` es una lista válida
        const oficinas = result.oficinasQueContratan || [];

        // ✅ Formatear correctamente el payload
        const payload = {
          cargo: result.cargo.trim(),  // ✅ Enviar nombre del cargo
          empresaUsuariaSolicita: result.empresaUsuariaSolicita.trim(),
          finca: result.finca?.trim() || null,
          ubicacionPruebaTecnica: result.ubicacionPruebaTecnica?.trim() || null,
          experiencia: result.experiencia?.trim(),
          fechadePruebatecnica: result.fechadePruebatecnica ? this.formatDate(result.fechadePruebatecnica) : null,
          horadePruebatecnica: result.horadePruebatecnica?.trim() || null,
          observacionVacante: result.observacionVacante?.trim() || null,
          fechadeIngreso: result.fechadeIngreso ? this.formatDate(result.fechadeIngreso) : null,
          temporal: result.temporal.trim(),  // ✅ Enviar nombre de la empresa
          descripcion: result.descripcion?.trim(),
          fechaPublicado: this.formatDate(new Date()), // Fecha actual
          quienpublicolavacante: result.quienpublicolavacante?.trim() || "Usuario Logueado",
          estadovacante: result.estadovacante?.trim() || "Activa",
          salario: parseFloat(result.salario) || 0, // ✅ Convertir salario a número
          codigoElite: result.codigoElite?.trim() || null,

          // ✅ Mapear `oficinasQueContratan`
          oficinasQueContratan: oficinas.map((oficina: any) => ({
            nombre: oficina.nombre.trim(),
            numeroDeGenteRequerida: parseInt(oficina.numeroDeGenteRequerida, 10) || 1, // ✅ Convertir a número
            ruta: oficina.ruta || false // ✅ Ajustar si hay lógica para ruta
          }))
        };

        console.log("✅ Payload enviado a la API:", payload);

        // ✅ Enviar los datos a la API Django
        this.vacantesService.enviarVacante(payload).subscribe({
          next: async (response) => {
            console.log("✅ Publicación creada exitosamente:", response);
            await this.loadData();
            Swal.fire({
              title: '¡Éxito!',
              text: 'La vacante ha sido enviada correctamente',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
          },
          error: (error) => {
            console.error("❌ Error al crear la publicación:", error);
            Swal.fire({
              title: 'Error',
              text: `Hubo un problema al enviar la vacante: ${error.message || 'Error desconocido'}`,
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        });
      } else {
        console.warn("⚠️ No se enviaron datos válidos.");
      }
    });
  }


  formatDate(date: Date | string | null): string | null {
    if (!date) return null; // Si la fecha es nula, devolver null
    const d = new Date(date);

    // Extraer día, mes y año
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0'); // getMonth() empieza en 0
    const year = d.getFullYear();

    return `${year}-${month}-${day}`; // Formato YYYY-MM-DD
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
        console.log('Datos procesados:', datosProcesados);
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

    // Iterar sobre las filas, comenzando en la segunda (índice 1) para omitir los encabezados
    for (let i = 1; i < jsonData.length; i++) {
      const fila = jsonData[i];

      if (fila && fila.length > 0) {
        const vacante = {
          empresa_temporal: fila[0] || '',
          empresa_usuaria: fila[1] || '',
          centro_costo_carnet: fila[2] || '',
          empresa_usuaria_centro_costo: fila[3] || '',
          ciudad: fila[4] || '',
          telefono_encargado: fila[5] || '',
          sublabor: fila[6] || '',
          categoria: fila[7] || '',
          ccostos: fila[8] || '',
          subcentro: fila[9] || '',
          grupo: fila[10] || '',
          operacion: fila[11] || '',
          salario: fila[12] || 0,
          auxilio_transporte: fila[13] || '',
          ruta: fila[14] || '',
          valor_transporte: fila[15] || 0,
          horas_extras: fila[16] || 0,
          porcentaje_arl: fila[17] || 0
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
