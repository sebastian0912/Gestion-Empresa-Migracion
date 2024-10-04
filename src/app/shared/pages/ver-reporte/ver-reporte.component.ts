import { Component, OnInit } from '@angular/core';
import { NavbarSuperiorComponent } from '../../components/navbar-superior/navbar-superior.component';
import { NavbarLateralComponent } from '../../components/navbar-lateral/navbar-lateral.component';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgIf, NgIfContext } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ContratacionService } from '../../services/contratacion/contratacion.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table'; // Import MatTableDataSource
import { VerPdfsComponent } from '../../components/ver-pdfs/ver-pdfs.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateRangeDialogComponent } from '../../components/date-rang-dialog/date-rang-dialog.component';
import Swal from 'sweetalert2';
import { AdminService } from '../../services/admin/admin.service';
import saveAs from 'file-saver';
import { response } from 'express';
import { MatMenuModule } from '@angular/material/menu';


@Component({
  selector: 'app-ver-reporte',
  standalone: true,
  imports: [
    NavbarSuperiorComponent,
    NavbarLateralComponent,
    MatButtonModule,
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    NgIf

  ],
  templateUrl: './ver-reporte.component.html',
  styleUrl: './ver-reporte.component.css'
})
export class VerReporteComponent implements OnInit {
  reportes: any[] = [];
  displayedColumns: string[] = ['fecha', 'nombre', 'sede', 'cantidadContratosTuAlianza', 'cantidadContratosApoyoLaboral', 'cedulas', 'traslados', 'cruce', 'sst', 'nota'];
  dataSource = new MatTableDataSource<any>(); // Table 1 Data Source
  consolidadoFechasFincaDataSource: any[] = [];
  userCorreo: string = '';
  userNombre: string = '';
  filterValues: any = {
    nombre: '',
    sede: ''
  };

  consolidadoDataSource = new MatTableDataSource<any>(); // Table 2 Data Source
  consolidadoDisplayedColumns: string[] = [
    'fecha', 'status', 'sede', 'cantidadContratosTuAlianza',
    'cantidadContratosApoyoLaboral', 'totalIngresos',
    'cedulas', 'traslados', 'sst', 'notas'
  ];

  public isMenuVisible = true;

  // Método para manejar el evento del menú
  onMenuToggle(isMenuVisible: boolean): void {
    this.isMenuVisible = isMenuVisible;
  }

  constructor(
    private contratacionService: ContratacionService,
    public dialog: MatDialog,
    private adminService: AdminService
  ) { }

  async ngOnInit(): Promise<void> {
    const user = await this.contratacionService.getUser();
    if (user) {
      this.userCorreo = user.correo_electronico;
      this.userNombre = user.primer_nombre + ' ' + user.primer_apellido;
    }
    this.obtenerReportes();
    this.dataSource.filterPredicate = this.createFilter(); // Ensure filter applies to the first table
  }

  trackByIndex(index: number, item: any): any {
    return index;
  }


  async obtenerReportes(): Promise<void> {
    // Mostrar el swal de cargando
    Swal.fire({
      icon: 'info',
      title: 'Cargando...',
      html: 'Por favor espera mientras se cargan los reportes.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    if (this.userCorreo != "tuafiliacion@tsservicios.co" && this.userCorreo != "programador.ts@gmail.com" && this.userCorreo != "a.seguridad.ts@gmail.com") {
      // Llamar al servicio para obtener los reportes
      this.contratacionService.obtenerTodosLosReportes(this.userNombre).subscribe(
        async (response) => {
          // Ocultar el Swal de cargando
          Swal.close();

          this.reportes = response.reportes;
          this.dataSource.data = this.reportes; // Actualiza la tabla principal

        },
        (error) => {
          // Ocultar el Swal de cargando
          Swal.close();

          // Mostrar alerta de error
          Swal.fire({
            icon: 'error',
            title: 'Error al obtener los reportes',
            text: 'Ocurrió un error al obtener los reportes, por favor intenta de nuevo.'
          });
        }
      );
    }
    else {
      // Llamar al servicio para obtener los reportes
      this.contratacionService.obtenerTodosLosReportes("todos").subscribe(
        async (response) => {
          // Ocultar el Swal de cargando
          Swal.close();

          this.reportes = response.reportes;
          this.dataSource.data = this.reportes; // Actualiza la tabla principal

          // Espera a que los datos consolidados estén listos
          const consolidado = await this.generateConsolidatedData(this.reportes);
          this.consolidadoDataSource.data = consolidado; // Actualiza la tabla consolidada
        },
        (error) => {
          // Ocultar el Swal de cargando
          Swal.close();

          // Mostrar alerta de error
          Swal.fire({
            icon: 'error',
            title: 'Error al obtener los reportes',
            text: 'Ocurrió un error al obtener los reportes, por favor intenta de nuevo.'
          });
        }
      );
    }

  }



  // Apply filter only for the first table
  applyFilter(filterKey: string, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.filterValues[filterKey] = inputElement.value.trim().toLowerCase();
    this.dataSource.filter = JSON.stringify(this.filterValues); // Trigger the filter
  }

  // Custom filter for filtering by nombre and sede
  createFilter(): (data: any, filter: string) => boolean {
    return (data: any, filter: string): boolean => {
      const searchTerms = JSON.parse(filter);
      const nombreMatches = data.nombre.toLowerCase().includes(searchTerms.nombre);
      const sedeMatches = data.sede.toLowerCase().includes(searchTerms.sede);
      return nombreMatches && sedeMatches; // Return true if both match
    };
  }

  // Modal handling for the PDFs
  openCedulasModal(cedulas: any[]): void {
    const dialogRef = this.dialog.open(VerPdfsComponent, {
      minWidth: '90vw',
      maxHeight: '70vh',
      data: { cedulas: cedulas }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  // PDF/Excel Document viewing and downloading
  verDocumento(base64: string, fileName: string = 'CruceSubido.xlsx'): void {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const mimeType = base64.split(';')[0].split(':')[1];
    const blob = new Blob([byteArray], { type: mimeType });

    if (mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      const downloadLink = document.createElement('a');
      const url = URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else {
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl);
    }
  }

  // Function to generate consolidated data for second table
  async generateConsolidatedData(reportes: any[]): Promise<any[]> {
    const consolidado: any[] = [];

    // Traer las sucursales y generar el consolidado
    const sucursalesObservable = await this.adminService.traerSucursales();

    return new Promise((resolve, reject) => {
      sucursalesObservable.subscribe((data: any) => {
        // Ordenar por nombre las sucursales
        const sucursalesOrdenadas = data.sucursal.sort((a: any, b: any) => a.nombre.localeCompare(b.nombre));

        // Recorrer las sucursales para generar el consolidado
        sucursalesOrdenadas.forEach((sucursal: any) => {
          const reportsForSede = reportes.filter(report => report.sede === sucursal.nombre);
          const totalContratosTuAlianza = reportsForSede.reduce((sum: any, report: { cantidadContratosTuAlianza: any; }) => sum + (report.cantidadContratosTuAlianza || 0), 0);
          const totalContratosApoyoLaboral = reportsForSede.reduce((sum: any, report: { cantidadContratosApoyoLaboral: any; }) => sum + (report.cantidadContratosApoyoLaboral || 0), 0);

          // Filtrar y sumar cédulas solo si no contienen el texto "No se han cargado cédulas"
          const totalCedulas = reportsForSede.reduce((sum: any, report: { cedulas: any; }) => {
            if (report.cedulas !== 'No se han cargado cédulas') {
              return sum + (Array.isArray(report.cedulas) ? report.cedulas.length : 0);
            }
            return sum;
          }, 0);

          // Filtrar y sumar traslados solo si no contienen el texto "No se han cargado traslados"
          const totalTraslados = reportsForSede.reduce((sum: any, report: { traslados: any; }) => {
            if (report.traslados !== 'No se han cargado traslados') {
              return sum + (Array.isArray(report.traslados) ? report.traslados.length : 0);
            }
            return sum;
          }, 0);

          const sstOk = reportsForSede.some((report: { sst: string | null; }) => report.sst !== null && report.sst !== 'No se ha cargado SST');
          const notas = reportsForSede.map((report: { nota: any; }) => report.nota).filter((nota: any) => nota).join(', ');

          // Definir el status de acuerdo a las reglas
          let status = '';

          if (reportsForSede.length === 0) {
            status = 'NO REALIZO REPORTE';
          }
          else if (totalContratosTuAlianza === 0 && totalContratosApoyoLaboral === 0) {
            status = 'NO HUBO CONTRATACION';
          }
          else if (reportsForSede.length > 0 && reportsForSede.length > 0) {
            status = 'REALIZO REPORTE';
          }

          consolidado.push({
            fecha: reportsForSede.length > 0 ? reportsForSede[0].fecha : null,
            sede: sucursal.nombre,
            cantidadContratosTuAlianza: totalContratosTuAlianza,
            cantidadContratosApoyoLaboral: totalContratosApoyoLaboral,
            totalIngresos: totalContratosTuAlianza + totalContratosApoyoLaboral,
            cedulas: totalCedulas,
            traslados: totalTraslados,
            sst: sstOk,
            notas,
            status // Nueva columna status
          });
        });

        resolve(consolidado);
      }, error => {
        reject(error);
      });
    });
  }



  // Helper function to group by sede
  groupBy(array: any[], key: string): any {
    return array.reduce((result, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
      return result;
    }, {});
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }


  openDateRangeDialog(): void {
    const dialogRef = this.dialog.open(DateRangeDialogComponent, { width: '550px' });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {

        // Mostrar el swal de cargando
        Swal.fire({
          icon: 'info',
          title: 'Cargando...',
          html: 'Por favor espera mientras se cargan los reportes.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        this.contratacionService.obtenerReportesPorFechas(result.start, result.end).subscribe(
          async (response) => {
            // Ocultar el Swal de cargando
            Swal.close();

            this.reportes = response.reportes;
            this.dataSource.data = this.reportes; // Actualiza la tabla principal

            // Espera a que los datos consolidados estén listos
            const consolidado = await this.generateConsolidatedData(this.reportes);
            this.consolidadoDataSource.data = consolidado; // Actualiza la tabla consolidada
          },
          (error) => {
            // Ocultar el Swal de cargando
            Swal.close();

            // Mostrar alerta de error
            Swal.fire({
              icon: 'error',
              title: 'Error al obtener los reportes',
              text: 'Ocurrió un error al obtener los reportes, por favor intenta de nuevo.'
            });
          }
        );
      }
    });
  }

  openDateRangeDialog2(): void {
    const dialogRef = this.dialog.open(DateRangeDialogComponent, { width: '550px' });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        const start = result.start;
        const end = result.end;

        // Mostrar Swal de "Cargando"
        Swal.fire({
          icon: 'info',
          title: 'Cargando',
          text: 'Espere mientras se descarga el archivo...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();  // Mostrar animación de carga
          }
        });

        // Llama al servicio para descargar el archivo Excel
        this.contratacionService.obtenerBaseContratacionPorFechas(start, end).subscribe(
          (response: Blob) => {

            const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const fileName = `reporte_contratacion_${start}_a_${end}.xlsx`;

            // Usar FileSaver.js para descargar el archivo
            saveAs(blob, fileName);

            // Cerrar el Swal de "Cargando"
            Swal.close();
          },
          (error) => {
            console.error('Error al descargar el archivo:', error);

            // Cerrar el Swal y mostrar error
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un error al descargar el archivo.',
            });
          }
        );
      }
    });
  }

  openDateRangeDialog3(): void {
    const dialogRef = this.dialog.open(DateRangeDialogComponent, { width: '550px' });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.contratacionService.obtenerReportesPorFechasCentroCosto(result.start, result.end).subscribe(
          (response: any) => {
            console.log(response);
            if (response.resultado.total_general === 0) {
              Swal.fire({
                icon: 'warning',
                title: 'No hay reportes',
                text: 'No se encontraron reportes para las fechas seleccionadas.'
              });
              return;
            }
            // Asignar los datos al dataSource de la tabla
            this.consolidadoFechasFincaDataSource = this.formatData(response.resultado.detalles);
          }
        );
      }
    });
  }

  openDateRangeDialog4(): void {
    const dialogRef = this.dialog.open(DateRangeDialogComponent, { width: '550px' });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {

        // Descargar archivo
        this.contratacionService.descargarReporteFechaIngresoCentroCostoFincas(result.start, result.end).subscribe(
          (response: Blob) => {
            // Verifica si la respuesta es un archivo binario
            if (response.size === 0) {
              Swal.fire({
                icon: 'warning',
                title: 'No hay reportes',
                text: 'No se encontraron reportes para las fechas seleccionadas.'
              });
              return;
            }

            // Crear un enlace de descarga
            const file = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(file);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'reporte_centro_costos.xlsx';  // Nombre del archivo
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);  // Liberar el objeto URL
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un error al descargar el archivo.',
            });
          }
        );
      }
    });
  }


  // Función para formatear los datos y ordenar las fechas de mayor a menor
  formatData(data: any): any[] {
    const formattedData = [];

    // Obtener las fechas y ordenarlas de mayor a menor
    const fechas = Object.keys(data).sort((a, b) => {
      // Convertir 'dd/mm/yyyy' a objetos Date para compararlas
      const dateA = new Date(a.split('/').reverse().join('-'));
      const dateB = new Date(b.split('/').reverse().join('-'));
      return dateB.getTime() - dateA.getTime(); // Orden descendente
    });

    // Iterar sobre las fechas ya ordenadas
    for (const fecha of fechas) {
      const detalles = data[fecha];
      let isFirstRow = true;

      // Para cada fecha, iterar sobre los centros de costo
      for (const item of detalles) {
        formattedData.push({
          fechaIngreso: isFirstRow ? fecha : '', // Solo muestra la fecha en la primera fila
          centroCosto: item.centro_costo,
          total: item.total
        });
        isFirstRow = false; // Para las siguientes filas de la misma fecha, la fecha queda vacía
      }
    }

    return formattedData;
  }






}
