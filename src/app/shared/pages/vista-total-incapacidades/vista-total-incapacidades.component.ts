import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { NavbarLateralComponent } from '../../components/navbar-lateral/navbar-lateral.component';
import { NavbarSuperiorComponent } from '../../components/navbar-superior/navbar-superior.component';
import { InfoCardComponent } from '../../components/info-card/info-card.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { IncapacidadService } from '../../services/incapacidad/incapacidad.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { saveAs } from 'file-saver';
interface ColumnTitle {
  [key: string]: string;
}

interface FilterCriteria {
  tipodeincapacidad: string;
  centrodecosto: string;
  empresa: string;
  estadorobot: string;
  temporal: string;
}

interface FileData {
  [key: string]: any[];
}
@Component({
  selector: 'app-vista-total-incapacidades',
  standalone: true,
  imports: [NavbarLateralComponent,
    NavbarSuperiorComponent,
    InfoCardComponent,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule ,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatCardModule,
    NgClass,
    NgIf,
    NgFor],
  templateUrl: './vista-total-incapacidades.component.html',
  styleUrl: './vista-total-incapacidades.component.css'
})
export class VistaTotalIncapacidadesComponent implements OnInit {
  query: string = '';
  [key: string]: any;

  ColumnsTable1 = [
    'Dias_temporal',
    'F_inicio',
    'F_final',
    'Fecha_de_Envio_Incapacidad_Fisica',
    'Incapacidad_transitada',
    'Numero_de_documento',
    'Oficina',
    'Temporal',
    'Tipo_de_documento',
    'apellido',
    'celular_o_telefono_01',
    'celular_o_telefono_02',
    'centrodecosto',
    'codigo_diagnostico',
    'consecutivoSistema',
    'correoElectronico',
    'descripcion_diagnostico',
    'dias_de_diferencia',
    'dias_eps',
    'dias_incapacidad',
    'edad',
    'empresa',
    'estado_incapacidad',
    'estado_robot_doctor',
    'fecha_de_ingreso_temporal',
    'fondo_de_pensiones',
    'historial_clinico',
    'ips_punto_de_atencion',
    'link_incapacidad',
    'marcaTemporal',
    'nit_de_la_IPS',
    'nombre',
    'nombre_de_quien_recibio',
    'nombre_doctor',
    'nombre_eps',
    'numero_de_contrato',
    'numero_de_documento_doctor',
    'numero_de_incapacidad',
    'observaciones',
    'prorroga',
    'responsable_de_envio',
    'sexo',
    'tipo_de_documento_doctor_atendido',
    'tipo_incapacidad'
  ];

  columnTitlesTable1 = {
    'dias_temporal': 'Días Temporal',
    'f_inicio': 'Fecha de Inicio',
    'fecha_de_envio_incapacidad_fisica': 'Fecha de Envío Incapacidad Física',
    'incapacidad_transitada': 'Incapacidad Transitada',
    'numero_de_documento': 'Número de Documento',
    'oficina': 'Oficina',
    'temporal': 'Temporal',
    'tipo_de_documento': 'Tipo de Documento',
    'apellido': 'Apellido',
    'celular_o_telefono_01': 'Celular o Teléfono 01',
    'celular_o_telefono_02': 'Celular o Teléfono 02',
    'centrodecosto': 'Centro de Costo',
    'codigo_diagnostico': 'Código Diagnóstico',
    'consecutivoSistema': 'Consecutivo Sistema',
    'correoElectronico': 'Correo Electrónico',
    'descripcion_diagnostico': 'Descripción Diagnóstico',
    'dias_de_diferencia': 'Días de Diferencia',
    'dias_eps': 'Días EPS',
    'dias_incapacidad': 'Días Incapacidad',
    'edad': 'Edad',
    'empresa': 'Empresa',
    'estado_incapacidad': 'Estado Incapacidad',
    'estado_robot_doctor': 'Estado Robot Doctor',
    'fecha_de_ingreso_temporal': 'Fecha de Ingreso Temporal',
    'fondo_de_pensiones': 'Fondo de Pensiones',
    'historial_clinico': 'Historial Clínico',
    'ips_punto_de_atencion': 'IPS Punto de Atención',
    'link_incapacidad': 'Link Incapacidad',
    'marcaTemporal': 'Marca Temporal',
    'nit_de_la_IPS': 'NIT de la IPS',
    'nombre': 'Nombre',
    'nombre_de_quien_recibio': 'Nombre de Quien Recibió',
    'nombre_doctor': 'Nombre Doctor',
    'nombre_eps': 'Nombre EPS',
    'numero_de_contrato': 'Número de Contrato',
    'numero_de_documento_doctor': 'Número de Documento Doctor',
    'numero_de_incapacidad': 'Número de Incapacidad',
    'observaciones': 'Observaciones',
    'prorroga': 'Prórroga',
    'responsable_de_envio': 'Responsable de Envío',
    'sexo': 'Sexo',
    'tipo_de_documento_doctor_atendido': 'Tipo de Documento Doctor Atendido',
    'tipo_incapacidad': 'Tipo Incapacidad'
  };


  displayedColumnsTable4 = [
    'Numero_de_documento',
    'a_donde_se_radico',
    'aquien_corresponde_el_pago',
    'codigo_respuesta_eps',
    'confirmacionn_fecha_de_radicacion',
    'consecutivoSistema_id',
    'dias_pagos_incapacidad',
    'estado_del_documento_incapacidad',
    'fecha_de_recepcion_de_la_incapacidad',
    'fecha_de_respuesta_eps',
    'fecha_ed_radicado_eps',
    'fecha_revision_por_parte_de_incapacidades',
    'numero_de_incapacidad_eps',
    'numero_de_radicado',
    'numero_transaccion_eps_arl',
    'quien_corresponde_el_pago_final',
    'quien_radico',
    'respuesta_de_la_eps',
    'respuesta_final_incapacidad',
    'transaccion_empresa_usuaria',
    'valor_incapacidad'
  ];
  columnTitlesTable4 = {
    'consecutivoSistema_id': 'Número de consecutivo del sistema',
    'confirmacion_fecha_de_radicacion': 'Fecha de confirmación de radicación',
    'fecha_de_recepcion_de_la_incapacidad': 'Fecha de recepción de la incapacidad',
    'fecha_revision_por_parte_de_incapacidades': 'Fecha de revisión por parte de incapacidades',
    'estado_del_documento_incapacidad': 'Estado del documento de incapacidad',
    'aquien_corresponde_el_pago': 'A quién corresponde el pago',
    'fecha_de_radicado_eps': 'Fecha de radicado EPS',
    'numero_de_radicado': 'Número de radicado',
    'a_donde_se_radico': 'A dónde se radicó',
    'quien_radico': 'Quién radicó',
    'respuesta_de_la_eps': 'Respuesta de la EPS',
    'codigo_respuesta_eps': 'Código de respuesta EPS',
    'fecha_de_respuesta_eps': 'Fecha de respuesta EPS',
    'numero_de_incapacidad_eps': 'Número de incapacidad EPS',
    'dias_pagos_incapacidad': 'Días pagos incapacidad',
    'valor_incapacidad': 'Valor incapacidad',
    'numero_transaccion_eps_arl': 'Número de transacción EPS/ARL',
    'transaccion_empresa_usuaria': 'Transacción empresa usuaria',
    'quien_corresponde_el_pago_final': 'Quién corresponde el pago final',
    'respuesta_final_incapacidad': 'Respuesta final incapacidad'
  };

  dataSourceTable1 = new MatTableDataSource<any>();
  dataSourceTable4 = new MatTableDataSource<any>();

  resultsincapacidades: any[] = [];
  resultsarl: any[] = [];
  resultssst: any[] = [];

  user: any;
  correo: any;
  filteredData: any[] = [];
  isSearched = false;
  overlayVisible = false;
  loaderVisible = false;
  counterVisible = false;

  filterCriteria: any = {
    numeroDeDocumento: '',
    fechaInicio: '',
    empresa: '',
    estadoIncapacidad: ''
  };
  isFilterCollapsed = true;

  toggleFilter(): void {
    this.isFilterCollapsed = !this.isFilterCollapsed;
  }

  constructor(
    private incapacidadService: IncapacidadService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadData();
  }
  tiposIncapacidad: string[] = [
    'ENFERMEDAD GENERAL',
    'LICENCIA DE MATERNIDAD',
    'LICENCIA PATERNIDAD',
    'ACCIDENTE DE TRABAJO',
    'SOAT / ACCIDENTE DE TRANCITO',
    'ENFERMEDAD LABORAL'
  ];

  private normalizeKeys(data: any): { [key: string]: any } {
    const normalizedData: { [key: string]: any } = {};

    Object.keys(data).forEach(key => {
      const normalizedKey = key
        .toLowerCase()
        .replace(/ /g, '_')
        .replace(/-/g, '_');

      normalizedData[normalizedKey] = data[key];
    });

    return normalizedData;
  }


  private loadData(): void {
    Promise.all([
      this.incapacidadService.traerTodosDatosIncapacidad().toPromise(),
      this.incapacidadService.traerTodosDatosReporte().toPromise()
    ])
      .then(([incapacidadesResponse, reporteResponse]) => {
        this.toggleLoader(false);
        const incapacidades = incapacidadesResponse.data || [];
        const reporte = reporteResponse.data || [];
        // Combinar los datos
        const incapacidadData = incapacidades.map((incapacidad: any, index: number) => {
          // Puedes combinar los datos aquí si hay una relación entre ellos
          // En este ejemplo, solo se concatenan, pero puedes personalizar la lógica según tus necesidades
          return {
            ...incapacidad,
          };
        });
        const reporteData = reporte.map((reporte: any, index: number) => {
          // Puedes combinar los datos aquí si hay una relación entre ellos
          // En este ejemplo, solo se concatenan, pero puedes personalizar la lógica según tus necesidades
          return {
            ...reporte,
          };
        });
        console.log('Datos combinados:', incapacidadData);
        // Asigna los datos normalizados a sus respectivas tablas
        this.dataSourceTable1.data = incapacidadesResponse.data
        this.dataSourceTable4.data = reporte
      })
      .catch(error => {
        console.error('Error al cargar los datos:', error);
        this.toggleLoader(false);
      });
  }


  toTitleCase(text: string, columnTitles: ColumnTitle): string {
    return columnTitles[text] || text
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  playSound(success: boolean): void {
    const audio = new Audio(success ? 'Sounds/positivo.mp3' : 'Sounds/negativo.mp3');
    audio.play();
  }

  toggleOverlay(visible: boolean): void {
    this.overlayVisible = visible;
  }

  toggleLoader(visible: boolean, showCounter: boolean = false): void {
    this.loaderVisible = visible;
    this.counterVisible = showCounter;
  }

  applyFilter() {
    // Filtra los datos basados en los criterios seleccionados
    const filteredData = this.dataSourceTable1.data.filter(item => {
      return (
        (this.filterCriteria.numeroDeDocumento ? item.numero_de_documento.includes(this.filterCriteria.numeroDeDocumento) : true) &&
        (this.filterCriteria.fechaInicio ? item.f_inicio === this.filterCriteria.fechaInicio : true) &&
        (this.filterCriteria.empresa ? item.empresa.includes(this.filterCriteria.empresa) : true) &&
        (this.filterCriteria.tipoIncapacidad ? item.tipo_incapacidad === this.filterCriteria.tipoIncapacidad : true)
      );
    });

    // Si no se encuentran datos, muestra un mensaje con Swal
    if (filteredData.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'No se encontraron datos',
        text: 'No se encontraron datos con los criterios seleccionados.',
        confirmButtonText: 'Aceptar'
      });
      this.filterCriteria = {};

    }

    // Actualiza el dataSource con los datos filtrados
  }

  resetFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = '';
  }



  readonly claves = [
    "NroDes", "Contrato", "Cedula", "Nombre", "CentrodeCosto", "Concepto",
    "FormadePago", "Valor", "Banco", "FECHADEPAGO"
  ];


  downloadExcel() {
    // Crear una nueva instancia de un libro de trabajo
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    // Mapear los datos de la primera tabla con los títulos correspondientes
    const mappedData1 = this.mapDataWithTitles(this.dataSourceTable1.data, this.columnTitlesTable1);
    const ws1: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mappedData1);
    XLSX.utils.book_append_sheet(wb, ws1, 'Incapacidades');

    // Mapear los datos de la segunda tabla con los títulos correspondientes
    const mappedData2 = this.mapDataWithTitles(this.dataSourceTable4.data, this.columnTitlesTable4);
    const ws2: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mappedData2);
    XLSX.utils.book_append_sheet(wb, ws2, 'Reporte');

    // Generar el archivo Excel y descargarlo
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'Reporte.xlsx');
  }

  mapDataWithTitles(data: any[], columnTitles: ColumnTitle): any[] {
    return data.map(item => {
      const mappedItem: any = {};
      for (const key in columnTitles) {
        if (item.hasOwnProperty(key)) {
          mappedItem[columnTitles[key]] = item[key];
        }
      }
      return mappedItem;
    });
  }

}
