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
import { NgIf } from '@angular/common';
import { ContratacionService } from '../../services/contratacion/contratacion.service';
import { SeguimientoHvService } from '../../services/seguimiento-hv/seguimiento-hv.service';
import { DateRangeDialogComponent } from '../../components/date-rang-dialog/date-rang-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-seguimiento-auditoria',
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
    DateRangeDialogComponent,
    MatDialogModule
  ],
  templateUrl: './seguimiento-auditoria.component.html',
  styleUrls: ['./seguimiento-auditoria.component.css']
})
export class SeguimientoAuditoriaComponent implements OnInit {

  displayedColumns: string[] = [
    'acciones',
    'confirmacion_Hoja_de_vida',
    'tipo',
    'cedula',
    'apellidos_y_nombres',
    'fecha_de_ingreso',
    'centro_de_costo',
    'codigo_contratacion',
    'contratos_si',
    'contratos_no',
    'numero_de_contrato',
    'foto',
    'fecha_de_ingreso_FT',
    'infolaboral_FT',
    'firma_trabajador',
    'huella',
    'referencia',
    'firma_carnet_FT',
    'firma_loker_FT',
    'empleador_FT',
    'ampliada_al_150',
    'huellaCedula',
    'sello',
    'legible',
    'procuraduria_vigente',
    'fecha_procuraduria',
    'contraloria_vigente',
    'fecha_contraloria',
    'ofac_lista_clinton',
    'fecha_ofac',
    'policivos_vigente',
    'fecha_policivos',
    'medidas_correstivas',
    'fecha_medidas_correstivas',
    'adres',
    'fecha_adres',
    'sisben',
    'fecha_sisben',
    'formatoElite',
    'cargoElite',
    'nombres_trabajador_contrato',
    'no_cedula_contrato',
    'direccion',
    'correo_electronico',
    'fecha_de_ingreso_contrato',
    'salario_contrato',
    'empresa_usuaria',
    'cargo_contrato',
    'descripcion_temporada',
    'firma_trabajador_contrato',
    'firma_testigos',
    'sello_temporal',
    'autorizacion_dscto_casino',
    'forma_de_pago',
    'autorizacion_funerario',
    'huellas_docs',
    'fecha_de_recibido_docs',
    'centro_de_costo_arl',
    'clase_de_riesgo',
    'cedula_arl',
    'nombre_trabajador_arl',
    'fecha_de_ingreso_arl',
    'entrevista_ingreso',
    'temporal',
    'fecha_no_mayor_a_15_dias',
    'nombres_trabajador_examenes',
    'cargo',
    'apto',
    'salud_ocupacional',
    'colinesterasa',
    'planilla_colinesterasa',
    'otros',
    'certificado_afp',
    'ruaf',
    'nombre_trabajador_ruaf',
    'cedula_ruaf',
    'fecha_cerRuaf15menor',
    'historia',
    'fecha_radicado_eps',
    'diferencia_fecha_radicado_eps',
    'nombre_y_cedula_eps',
    'salario_eps',
    'fecha_radicado_caja',
    'diferencia_fecha_radicado_caja',
    'nombre_y_cedula_caja',
    'salario_caja',
  ];

  dataSource = new MatTableDataSource<any>();
  originalData: any[] = [];
  correo: string | null = null;

  overlayVisible = false;
  loaderVisible = false;
  counterVisible = false;

  constructor(
    private pagosService: PagosService,
    private seguimientoHvService: SeguimientoHvService,
    private dialog: MatDialog,

  ) { }

  async ngOnInit(): Promise<void> {
    try {
      const user = await this.pagosService.getUser();

      if (user && user.correo_electronico) {
        this.correo = user.correo_electronico;
      } else {
        throw new Error('Usuario no encontrado o correo electrónico no disponible.');
      }

      if (this.correo === 'archivotualianza@gmail.com') {
        this.seguimientoHvService.buscarSeguimientoHv("todos").subscribe(
          (response: any) => {
            response.sort((a: any, b: any) => b.codigo_contratacion - a.codigo_contratacion);
            this.dataSource.data = response;

            this.originalData = response;
          },
          (error: any) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ha ocurrido un error al obtener la información'
            });
          }
        );
      } else {
        this.seguimientoHvService.buscarSeguimientoHv(`${user.primer_nombre} ${user.primer_apellido}`).subscribe(
          (response: any) => {
            this.dataSource.data = response;
            this.originalData = response;
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
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: "Ha ocurrido un error al obtener la información"
      });
    }
  }


  calculateDateDifference(fechaRadicado: string, fechaIngreso: string): string {
    if (fechaIngreso === 'No encontrado' || !fechaRadicado) {
      return 'No disponible';
    }

    // Convertir fechas al formato MM/DD/YYYY
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


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleEdit(element: any): void {
    element.editing = !element.editing;

    if (!element.editing) {
      const editedData = { ...element };
      this.seguimientoHvService.editarSeguimientoHv(element.id, element.tipo, editedData).then((response: any) => {
        if (response.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'La información ha sido actualizada correctamente'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ha ocurrido un error al actualizar la información'
          });
        }
      }).catch((error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ha ocurrido un error al actualizar la información'
        });
      });
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  cargarExcel(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = (event.target as FileReader).result;
        const data = new Uint8Array(arrayBuffer as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true, cellNF: false, cellText: false });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false, dateNF: "dd/mm/yyyy" }) as any[][];

        const modifiedRows = rows.slice(2).map((row: any[], rowIndex: number) => {
          let modifiedRow: { [key: string]: any } = {};
          row.forEach((cell: any, cellIndex: number) => {
            if (this.isDate(cell)) {
              cell = this.normalizeDate(cell);
            }
            modifiedRow[`${cellIndex + 1}`] = cell !== undefined && cell !== null && cell !== "" ? cell : '-';
          });
          return modifiedRow;
        });

        // Filtrar filas con la primera columna que no sean AL, E1 o E2
        const validRows = modifiedRows.filter((row: any) => {
          return row['1'] != 'AL' && row['1'] != 'E1' && row['1'] != 'E2';
        });

        if (validRows.length > 0) {
          // Mostrar un mensaje de error si se encuentran filas no válidas
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hay filas que no cumplen con el formato requerido en la primera columna. Por favor, verifique la información'
          });
          return;
        }

        if (validRows.length === 0) {
          this.seguimientoHvService.cargarSeguimientoHv(modifiedRows).then((response: any) => {
            if (response.status === 'success') {
              Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'La información ha sido cargada correctamente'
              });
              this.ngOnInit();
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ha ocurrido un error al cargar la información'
              });
            }
          }).catch((error: any) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ha ocurrido un error al cargar la información'
            });
          });
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }

  isDate(cell: any): boolean {
    if (typeof cell === 'string') {
      return /^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/.test(cell);
    } else if (typeof cell === 'number') {
      const date = new Date((cell - (25567 + 1)) * 86400 * 1000);
      return !isNaN(date.getTime());
    }
    return false;
  }

  normalizeDate(cell: any): string {
    if (typeof cell === 'string') {
      const dateParts = cell.split(/[\/\-]/);
      if (dateParts.length === 3) {
        const [day, month, year] = dateParts;
        return `${this.pad(parseInt(day))}/${this.pad(parseInt(month))}/${year}`;
      }
    } else if (typeof cell === 'number') {
      const date = new Date((cell - (25567 + 1)) * 86400 * 1000);
      const day = date.getUTCDate();
      const month = date.getUTCMonth() + 1;
      const year = date.getUTCFullYear();
      return `${this.pad(day)}/${this.pad(month)}/${year}`;
    }
    return cell.toString();
  }

  pad(number: number): string {
    return number < 10 ? `0${number}` : number.toString();
  }

  resetFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
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
      return item.ultimas_actualizaciones.some((update: { fecha: string | number | Date; }) => {
        const updateDate = new Date(update.fecha);
        return updateDate >= start && updateDate <= end;
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
      fecha_de_ingreso_FT: item.fecha_de_ingreso_FT,
      infolaboral_FT: item.infolaboral_FT,
      firma_trabajador: item.firma_trabajador,
      huella: item.huella,
      referencia: item.referencia,
      firma_carnet_FT: item.firma_carnet_FT,
      firma_loker_FT: item.firma_loker_FT,
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
      centro_de_costo_arl: item.centro_de_costo_arl,
      clase_de_riesgo: item.clase_de_riesgo,
      cedula_arl: item.cedula_arl,
      nombre_trabajador_arl: item.nombre_trabajador_arl,
      fecha_de_ingreso_arl: item.fecha_de_ingreso_arl,
      entrevista_ingreso: item.entrevista_ingreso,
      temporal: item.temporal,
      fecha_no_mayor_a_15_dias: item.fecha_no_mayor_a_15_dias,
      nombres_trabajador_examenes: item.nombres_trabajador_examenes,
      cargo: item.cargo,
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
      nombre_y_cedula_eps: item.nombre_y_cedula_eps,
      salario_eps: item.salario_eps,
      fecha_radicado_caja: item.fecha_radicado_caja,
      nombre_y_cedula_caja: item.nombre_y_cedula_caja,
      salario_caja: item.salario_caja
    }));

    // Crear hoja de Excel
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mappedData);
    const workbook: XLSX.WorkBook = { Sheets: { 'Datos Filtrados': worksheet }, SheetNames: ['Datos Filtrados'] };

    // Exportar Excel
    XLSX.writeFile(workbook, 'DatosFiltrados.xlsx');
  }

}