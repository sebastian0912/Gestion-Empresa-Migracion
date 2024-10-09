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
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ContratacionService } from '../../services/contratacion/contratacion.service';
import { SeguimientoHvService } from '../../services/seguimiento-hv/seguimiento-hv.service';
import { DateRangeDialogComponent } from '../../components/date-rang-dialog/date-rang-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { SeguimientoHvComponent } from '../../components/seguimiento-hv/seguimiento-hv.component';
import { lastValueFrom } from 'rxjs';
import { SeguimientoHvArchivoService } from '../../services/seguimiento-hv-archivo/seguimiento-hv-archivo.service';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-seguimiento-auditoria-archivo',
  standalone: true,
  imports: [
    NavbarLateralComponent,
    NavbarSuperiorComponent,
    InfoCardComponent,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatCardModule,
    NgIf,
    NgFor,
    NgClass,
    DateRangeDialogComponent,
    MatDialogModule,
    MatExpansionModule,
    SeguimientoHvComponent,
    MatMenuModule
  ],
  templateUrl: './seguimiento-auditoria-archivo.component.html',
  styleUrl: './seguimiento-auditoria-archivo.component.css'
})
export class SeguimientoAuditoriaArchivoComponent implements OnInit {
  correo: string | null = null;
  rol: string | null = null;

  groupedData: any = {};
  filteredSIN_REVISAR: any[] = [];
  filteredREVISADO: any[] = [];
  filteredARCHIVOEDITADO: any[] = [];
  filteredARCHIVOREVISADO: any[] = [];

  dataSource = new MatTableDataSource<any>([]);

  public isMenuVisible = true;

  // Método para manejar el evento del menú
  onMenuToggle(isMenuVisible: boolean): void {
    this.isMenuVisible = isMenuVisible;
  }

  constructor(
    private pagosService: PagosService,
    private seguimientoHvService: SeguimientoHvArchivoService,
    private dialog: MatDialog,
  ) { }

  isLoading = true; // Add a loading state

  async ngOnInit(): Promise<void> {

    try {
      this.isLoading = true;
      const user = await this.pagosService.getUser();
      this.correo = user?.correo_electronico;
      this.rol = user?.rol;

      await this.loadData();

      this.applyAllFilters(); // Aplicar filtros después de cargar datos

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: "Ha ocurrido un error al obtener la información"
      });
      this.isLoading = false; // Loading failed
    }

  }

  descargarSinRevisar(): void {
    // Define el arreglo de datos con las columnas requeridas
    const datosParaExcel = this.filteredSIN_REVISAR.map((item: any) => {
      return {
        Cedula: item.cedula,
        'Codigo Archivo': '', // Columna vacía
        'Apellidos y Nombres': item.apellidos_y_nombres,
        'Fecha de Ingreso': item.fecha_de_ingreso,
        'Centro de Costo': item.centro_de_costo,
        'Codigo de Contrato': item.codigo_contratacion,
        Temporal: item.tipo,
      };
    });
    console.log(datosParaExcel);

    // Crear una nueva hoja de trabajo (worksheet)
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosParaExcel);

    // Crear un libro de trabajo (workbook) que contenga la hoja
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sin Revisar');

    // Generar y descargar el archivo Excel
    XLSX.writeFile(workbook, 'sin_revisar.xlsx');
  }

  seleccionarArchivo(): void {
    const inputFile = document.getElementById('inputFile') as HTMLInputElement;
    inputFile.click();
  }

  cargarArchivo(event: any): void {
    const file = event.target.files[0]; // Obtener el archivo seleccionado
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const data: Uint8Array = new Uint8Array(e.target.result);
      const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'array' });

      // Seleccionar la primera hoja de trabajo (worksheet)
      const sheetName: string = workbook.SheetNames[0];
      const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

      // Convertir la hoja de trabajo en JSON a partir de la fila 3 (índice 2)
      const datos: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Procesar las filas desde la tercera en adelante (índice 2)
      const filas = datos.slice(2).map((fila, index) => {
        return fila.reduce((obj: any, valor: any, i: number) => {
          obj[`${i}`] = valor;
          return obj;
        }, {});
      });

      console.log(filas); // Aquí tienes los datos desde la fila 3 en adelante, con índices de columnas
      this.seguimientoHvService.enviarSeguimientoHvArchivo(filas)
      .then(observable => {
        observable.subscribe({
          next: (response: any) => {
            console.log(response);
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'Se ha cargado el archivo correctamente'
            });
          },
          error: (error: any) => {
            console.error(error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ha ocurrido un error al cargar el archivo'
            });
          },
          complete: () => {
            this.loadData(); // Recargar los datos después de cargar el archivo
          }
        });
      });
    
    
      
      

      // Limpiar el input de archivo
      (document.getElementById('inputFile') as HTMLInputElement).value = '';
    };

    reader.readAsArrayBuffer(file); // Leer el archivo como array buffer
  }

  async loadData(): Promise<void> {

    try {
      const response = await lastValueFrom(this.seguimientoHvService.buscarSeguimientoHv("3"));
      if (response.REVISADO) {
        response.REVISADO.sort((a: any, b: any) => b.zero_count - a.zero_count);
      }
      this.groupedData = response;
      this.applyAllFilters(); // Asegurarse de que los filtros se apliquen después de cargar datos
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ha ocurrido un error al mostrar la información3'
      });
    }
  }

  generarExcel(): void {
    this.seguimientoHvService.generarComparacion().subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'comparacion.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error: any) => {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ha ocurrido un error al generar el archivo Excel'
        });
      }
    });
  }

  applyAllFilters(): void {
    // Reaplicar los filtros a todas las propiedades filtradas
    this.filteredSIN_REVISAR = this.groupedData.SIN_REVISAR?.filter((item: any) =>
      this.filterCondition(item, (document.getElementById('globalInput') as HTMLInputElement)?.value?.toLowerCase() || '')
    ) || [];

    this.filteredREVISADO = this.groupedData.REVISADO?.filter((item: any) =>
      this.filterCondition(item, (document.getElementById('globalInput') as HTMLInputElement)?.value?.toLowerCase() || '')
    ) || [];

    this.filteredARCHIVOEDITADO = this.groupedData.ARCHIVOEDITADO?.filter((item: any) =>
      this.filterCondition(item, (document.getElementById('globalInput') as HTMLInputElement)?.value?.toLowerCase() || '')
    ) || [];

    this.filteredARCHIVOREVISADO = this.groupedData.ARCHIVOREVISADO?.filter((item: any) =>
      this.filterCondition(item, (document.getElementById('globalInput') as HTMLInputElement)?.value?.toLowerCase() || '')
    ) || [];
  }


  applyGroupFilter(event: Event, group: string) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();

    switch (group) {
      case 'SIN_REVISAR':
        this.filteredSIN_REVISAR = this.groupedData.SIN_REVISAR.filter((item: any) =>
          this.filterCondition(item, filterValue)
        );
        break;
      case 'REVISADO':
        this.filteredREVISADO = this.groupedData.REVISADO.filter((item: any) =>
          this.filterCondition(item, filterValue)
        );
        break;
      case 'ARCHIVOEDITADO':
        this.filteredARCHIVOEDITADO = this.groupedData.ARCHIVOEDITADO.filter((item: any) =>
          this.filterCondition(item, filterValue)
        );
        break;
      case 'ARCHIVOREVISADO':
        this.filteredARCHIVOREVISADO = this.groupedData.ARCHIVOREVISADO.filter((item: any) =>
          this.filterCondition(item, filterValue)
        );
        break;
    }
  }

  applyGlobalFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();

    // Ensure groupedData and each group are defined before filtering
    if (this.groupedData.SIN_REVISAR) {
      this.filteredSIN_REVISAR = this.groupedData.SIN_REVISAR.filter((item: any) =>
        this.filterCondition(item, filterValue)
      );
    }

    if (this.groupedData.REVISADO) {
      this.filteredREVISADO = this.groupedData.REVISADO.filter((item: any) =>
        this.filterCondition(item, filterValue)
      );
    }

    if (this.groupedData.ARCHIVOEDITADO) {
      this.filteredARCHIVOEDITADO = this.groupedData.ARCHIVOEDITADO.filter((item: any) =>
        this.filterCondition(item, filterValue)
      );
    }

    if (this.groupedData.ARCHIVOREVISADO) {
      this.filteredARCHIVOREVISADO = this.groupedData.ARCHIVOREVISADO.filter((item: any) =>
        this.filterCondition(item, filterValue)
      );
    }
  }


  filterCondition(item: any, filterValue: string) {
    return (
      String(item.cedula).toLowerCase().includes(filterValue) ||
      String(item.centro_de_costo).toLowerCase().includes(filterValue)
    );
  }


  calculateDateDifference(fechaRadicado: string, fechaIngreso: string): string {
    if (fechaIngreso === 'No encontrado' || !fechaRadicado) {
      return 'No disponible';
    }

    const [dayRad, monthRad, yearRad] = fechaRadicado.split('/');
    const [dayIng, monthIng, yearIng] = fechaIngreso.split('/');
    const radicadoDate = new Date(`${monthRad}/${dayRad}/${yearRad}`);
    const ingresoDate = new Date(`${monthIng}/${dayIng}/${yearIng}`);

    if (isNaN(radicadoDate.getTime()) || isNaN(ingresoDate.getTime())) {
      return 'Fecha inválida';
    }

    const diffTime = Math.abs(radicadoDate.getTime() - ingresoDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} días`;
  }


  openAuditDialog(data: any): void {
    const dialogRef = this.dialog.open(SeguimientoHvComponent, {
      width: '80%',
      minWidth: '80vw',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result !== null) {
        this.seguimientoHvService.actualizarRegistroTuAlianzaAsync(data.id, result, "true").then(
          (response: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'Se ha actualizado la información correctamente'
            });
          },
          (error: any) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ha ocurrido un error al actualizar la información'
            });
          }
        ).finally(() => {
          this.loadData(); // Reload the data after the dialog closes
        });
      } else {
        this.loadData(); // Reload the data even if no changes were made
      }
    });
  }



  async openAuditEditDialog(data: any): Promise<void> {
    this.seguimientoHvService.buscarById(data.id)
      .subscribe(
        (response: any) => {
          const dialogRef = this.dialog.open(SeguimientoHvComponent, {
            minWidth: '80vw',
            data: response[0] // Pass the response data to the dialog
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined && result !== null) {
              this.seguimientoHvService.actualizarRegistroTuAlianzaAsync(data.id, result, "false").then(
                (response: any) => {
                  Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Se ha actualizado la información correctamente'
                  });
                },
                (error: any) => {
                  Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ha ocurrido un error al actualizar la información'
                  });
                }
              ).finally(() => {
                this.loadData(); // Reload the data after the dialog closes
              });
            } else {
              this.loadData(); // Reload the data even if no changes were made
            }
          });
        },
        (error: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ha ocurrido un error al obtener la información'
          });
        }
      );
  }







  // Ejemplo de llamada al método generateExcel después de filtrar los datos
  openDateRangeDialog(): void {
    const dialogRef = this.dialog.open(DateRangeDialogComponent, { width: '550px' });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const filteredData = this.filterDataByDateRange(result.start, result.end);
        this.generateExcel(filteredData);
      }
    });
  }

  filterDataByDateRange(startDate: string, endDate: string): any[] {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return this.dataSource.data.filter(item => {
      return item.ultimas_actualizaciones.some((update: { fecha: string | number | Date; estado: string; }) => {
        const updateDate = new Date(update.fecha);
        return updateDate >= start && updateDate <= end && update.estado === "SIN_REVISAR";
      });
    });
  }



  generateExcel(filteredData: any[]): void {
    // Mapeo de datos en el orden especificado
    const mappedData = filteredData.map(item => ({
      tipo: item.tipo,
      cedula: item.cedula,
      apellidos_y_nombres: item.apellidos_y_nombres,
      fecha_de_ingreso: item.fecha_de_ingreso,
      centro_de_costo: item.centro_de_costo,
      codigo_contratacion: item.codigo_contratacion,

      contratos_si: item.contratos_si,
      contratos_no: item.contratos_no,
      numero_de_contrato: item.numero_de_contrato,

      foto: item.foto,
      infolaboral_FT: item.infolaboral_FT,
      firma_trabajador: item.firma_trabajador,
      huella: item.huella,
      referencia: item.referencia,
      firma_carnet_FT: item.firma_carnet_FT,
      firma_loker_FT: item.firma_loker_FT,
      fecha_de_ingreso_FT: item.fecha_de_ingreso_FT,
      empleador_FT: item.empleador_FT,

      ampliada_al_150: item.ampliada_al_150,
      huellaCedula: item.huellaCedula,
      sello: item.sello,
      legible: item.legible,

      procuraduria_vigente: item.procuraduria_vigente,
      fecha_procuraduria: item.fecha_procuraduria,
      contraloria_vigente: item.contraloria_vigente,
      fecha_contraloria: item.fecha_contraloria,
      ofac_lista_clinton: item.ofac_lista_clinton,
      fecha_ofac: item.fecha_ofac,
      policivos_vigente: item.policivos_vigente,
      fecha_policivos: item.fecha_policivos,
      medidas_correstivas: item.medidas_correstivas,
      fecha_medidas_correstivas: item.fecha_medidas_correstivas,

      adres: item.adres,
      fecha_adres: item.fecha_adres,

      sisben: item.sisben,
      fecha_sisben: item.fecha_sisben,

      formatoElite: item.formatoElite,
      cargoElite: item.cargoElite,

      nombres_trabajador_contrato: item.nombres_trabajador_contrato,
      no_cedula_contrato: item.no_cedula_contrato,
      direccion: item.direccion,
      correo_electronico: item.correo_electronico,
      fecha_de_ingreso_contrato: item.fecha_de_ingreso_contrato,
      salario_contrato: item.salario_contrato,
      empresa_usuaria: item.empresa_usuaria,
      cargo_contrato: item.cargo_contrato,
      descripcion_temporada: item.descripcion_temporada,
      firma_trabajador_contrato: item.firma_trabajador_contrato,
      firma_testigos: item.firma_testigos,
      sello_temporal: item.sello_temporal,

      autorizacion_dscto_casino: item.autorizacion_dscto_casino,
      forma_de_pago: item.forma_de_pago,
      autorizacion_funerario: item.autorizacion_funerario,
      huellas_docs: item.huellas_docs,
      fecha_de_recibido_docs: item.fecha_de_recibido_docs,

      entrevista_ingreso: item.entrevista_ingreso,

      centro_de_costo_arl: item.centro_de_costo_arl,
      clase_de_riesgo: item.clase_de_riesgo,
      cedula_arl: item.cedula_arl,
      nombre_trabajador_arl: item.nombre_trabajador_arl,
      fecha_de_ingreso_arl: item.fecha_de_ingreso_arl,

      temporal: item.temporal,
      fecha_no_mayor_a_15_dias: item.fecha_no_mayor_a_15_dias,
      nombres_trabajador_examenes: item.nombres_trabajador_examenes,
      cargo: item.cargo,
      cedula_examenes: item.cedula_examenes,
      apto: item.apto,
      salud_ocupacional: item.salud_ocupacional,
      colinesterasa: item.colinesterasa,
      planilla_colinesterasa: item.planilla_colinesterasa,
      otros: item.otros,

      certificado_afp: item.certificado_afp,
      ruaf: item.ruaf,
      nombre_trabajador_ruaf: item.nombre_trabajador_ruaf,
      cedula_ruaf: item.cedula_ruaf,
      fecha_cerRuaf15menor: item.fecha_cerRuaf15menor,
      historia: item.historia,

      fecha_radicado_eps: item.fecha_radicado_eps,
      fecha_ingreso_eps: item.fecha_ingreso_eps,
      nombre_y_cedula_eps: item.nombre_y_cedula_eps,
      salario_eps: item.salario_eps,

      fecha_radicado_caja: item.fecha_radicado_caja,
      fecha_ingreso_caja: item.fecha_ingreso_caja,
      nombre_y_cedula_caja: item.nombre_y_cedula_caja,
      salario_caja: item.salario_caja,

      nombre_y_cedula_seguridad: item.nombre_y_cedula_seguridad,
      fecha_radicado_seguridad: item.fecha_radicado_seguridad,

      codigo_hoja_de_vida: item.codigo_hoja_de_vida,
      foto_hoja_de_vida: item.foto_hoja_de_vida,
      nombre_y_cedula_hoja_de_vida: item.nombre_y_cedula_hoja_de_vida,
      correo_electronico_hoja_de_vida: item.correo_electronico_hoja_de_vida,
      direccion_hoja_de_vida: item.direccion_hoja_de_vida,
      referencia_hoja_de_vida: item.referencia_hoja_de_vida,
      firma_carnet_hoja_de_vida: item.firma_carnet_hoja_de_vida,

      firma_clausulas_add: item.firma_clausulas_add,
      sello_temporal_clausulas_add: item.sello_temporal_clausulas_add,

      firma_add_contrato: item.firma_add_contrato,
      sello_temporal_add_contrato: item.sello_temporal_add_contrato,

      autorizaciontratamientosDatosJDA: item.autorizaciontratamientosDatosJDA,

      cartadescuentoflor: item.cartadescuentoflor,

      formato_timbre: item.formato_timbre,

      cartaaurotiracioncorreo: item.cartaaurotiracioncorreo,

      responsable: item.responsable,
    }));

    // Crear hoja de Excel
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mappedData);
    const workbook: XLSX.WorkBook = { Sheets: { 'Datos Filtrados': worksheet }, SheetNames: ['Datos Filtrados'] };

    // Exportar Excel
    XLSX.writeFile(workbook, 'DatosFiltrados.xlsx');
  }

}