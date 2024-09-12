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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MatDatepickerModule } from '@angular/material/datepicker';

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
    MatOptionModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    ReactiveFormsModule,
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
  columnTitlesTable1excel: Record<string, string> = {
    marcaTemporal: 'Marca Temporal',
    Oficina: 'Oficina',
    consecutivoSistema: 'Consecutivo Sistema',
    numero_de_contrato: 'Número de Contrato',
    Temporal: 'Temporal',
    Fecha_de_Envio_Incapacidad_Fisica: 'Fecha de Envío Incapacidad Física',
    Tipo_de_documento: 'Tipo de Documento',
    Numero_de_documento: 'Número de Documento',

    nombre: 'Nombre',
    apellido: 'Apellido',
    empresa: 'Empresa',
    centrodecosto: 'Centro de Costo',
    tipo_incapacidad: 'Tipo Incapacidad',
    codigo_diagnostico: 'Código Diagnóstico',
    descripcion_diagnostico: 'Descripción Diagnóstico',
    F_inicio: 'Fecha de Inicio Incapacidad',
    F_final: 'Fecha Final de la Incapacidad',
    dias_incapacidad: 'Días Incapacidad',
    Dias_temporal: 'Días Temporal',
    dias_eps: 'Días EPS',
    edad: 'Edad',
    sexo: 'Sexo',
    fecha_de_ingreso_temporal: 'Fecha de Ingreso Temporal',
    celular_o_telefono_01: 'Celular o Teléfono 01',
    celular_o_telefono_02: 'Celular o Teléfono 02',
    correoElectronico: 'Correo Electrónico',
    nombre_eps: 'Nombre EPS',
    estado_incapacidad: 'Estado Incapacidad',
    prorroga: 'Prórroga',
    Incapacidad_transcrita: 'Incapacidad Transitada',
    numero_de_incapacidad: 'Número de Incapacidad',
    nit_de_la_IPS: 'NIT de la IPS',
    ips_punto_de_atencion: 'IPS Punto de Atención',
    fondo_de_pensiones: 'Fondo de Pensiones',
    nombre_de_quien_recibio: 'Nombre de Quien Recibió',
    dias_de_diferencia: 'Días de Diferencia entre fecha de envio a fecha actual',
    observaciones: 'Observaciones',
    quiencorrespondepago: 'Quién Corresponde el Pago',
    estado_documento_incapacidad: 'Estado Documento Incapacidad',
    estado_robot_doctor: 'Estado Robot Doctor',



    tipo_de_documento_doctor_atendido: 'Tipo de Documento Doctor Atendido',
    numero_de_documento_doctor: 'Número de Documento Doctor',
    nombre_doctor: 'Nombre Doctor',
    responsable_de_envio: 'Responsable de Envío',
  };

  columnTitlesTable4excel: Record<string, string> = {
    consecutivoSistema_id: 'Número de consecutivo del sistema',
    fecha_de_recepcion_de_la_incapacidad: 'Fecha de recepción de la incapacidad',
    fecha_de_radicado_eps: 'Fecha de radicado EPS',
    confirmacion_fecha_de_radicacion: 'Fecha de confirmación de radicación',
    numero_de_radicado: 'Número de radicado',
    quien_radico: 'Quién radicó',
    respuesta_de_la_eps: 'Respuesta de la EPS',
    codigo_respuesta_eps: 'Código de respuesta EPS',
    fecha_de_respuesta_eps: 'Fecha de respuesta EPS',
    numero_de_incapacidad_eps: 'Número de incapacidad EPS',
    dias_pagos_incapacidad: 'Días pagos incapacidad',
    valor_incapacidad: 'Valor incapacidad',
    numero_transaccion_eps_arl: 'Número de transacción EPS/ARL',
    transaccion_empresa_usuaria: 'Transacción empresa usuaria',
    quien_corresponde_el_pago_final: 'Quién corresponde el pago final',
    respuesta_final_incapacidad: 'Respuesta final incapacidad',
    fecha_revision_por_parte_de_incapacidades: 'Fecha de revisión por parte de incapacidades',
    estado_del_documento_incapacidad: 'Estado del documento de incapacidad',
    aquien_corresponde_el_pago: 'A quién corresponde el pago',
    a_donde_se_radico: 'A dónde se radicó',
  };
  ColumnsTable1 = [
    'Tipo_de_documento',
    'Numero_de_documento',
    'numero_de_contrato',
    'nombre',
    'apellido',
    'celular_o_telefono_01',
    'celular_o_telefono_02',
    'Oficina',
    'Temporal',
    'edad',
    'observaciones',
    'Dias_temporal',
    'F_inicio',
    'F_final',
    'Fecha_de_Envio_Incapacidad_Fisica',
    'Incapacidad_transcrita',
    'centrodecosto',
    'codigo_diagnostico',
    'consecutivoSistema',
    'correoElectronico',
    'descripcion_diagnostico',
    'dias_de_diferencia',
    'dias_eps',
    'dias_incapacidad',
    'empresa',
    'estado_incapacidad',
    'estado_robot_doctor',
    'fecha_de_ingreso_temporal',
    'fondo_de_pensiones',
    'ips_punto_de_atencion',
    'marcaTemporal',
    'nit_de_la_IPS',
    'nombre_de_quien_recibio',
    'nombre_doctor',
    'nombre_eps',
    'numero_de_documento_doctor',
    'numero_de_incapacidad',
    'prorroga',
    'responsable_de_envio',
    'sexo',
    'tipo_de_documento_doctor_atendido',
    'tipo_incapacidad',
    'quiencorrespondepago',
    'estado_documento_incapacidad'

  ];

  columnTitlesTable1 = {
    'dias_temporal': 'Días Temporal',
    'f_inicio': 'Fecha de Inicio',
    'fecha_de_envio_incapacidad_fisica': 'Fecha de Envío Incapacidad Física',
    'incapacidad_transcrita': 'Incapacidad Transitada',
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
    'ips_punto_de_atencion': 'IPS Punto de Atención',
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
    'tipo_incapacidad': 'Tipo Incapacidad',
    'quiencorrespondepago': 'Quién Corresponde el Pago',
    'estado_documento_incapacidad': 'Estado Documento Incapacidad'
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
  temporales: string[] = ['Tu Alianza', 'Apoyo Laboral'];
  filterCriteria: any = {
    numeroDeDocumento: '',
    fechaInicio: '',
    temporal: '',
    estadoIncapacidad: ''
  };
  isFilterCollapsed = true;
  isloadeddata = false;
  toggleFilter(): void {
    this.isFilterCollapsed = !this.isFilterCollapsed;
  }
  toggleOverlay(visible: boolean): void {
    this.overlayVisible = visible;
  }

  toggleLoader(visible: boolean, showCounter: boolean = false): void {
    this.loaderVisible = visible;
    this.counterVisible = showCounter;
  }


  constructor(
    private incapacidadService: IncapacidadService,
    private router: Router
  ) {
    if (!this.isloadeddata) {
      this.toggleLoader(true, true);
      this.toggleOverlay(true);
    } else {
      this.toggleLoader(false, false);
      this.toggleOverlay(false);
    }


  }

  ngOnInit(): void {
    this.toggleLoader(true, true);
    this.toggleOverlay(true);
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
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar los datos',
          text: 'Ocurrió un error al cargar los datos, por favor intenta de nuevo.',
          confirmButtonText: 'Aceptar'
        });
        this.toggleLoader(false, false);
        this.toggleOverlay(false);
      });
  }
  applyDateFilter() {
    const startDate = this.filterCriteria.fechaInicio;
    const endDate = this.filterCriteria.fechaFin;

    if (startDate && endDate) {
      // Asegura que las fechas son válidas y filtra los datos según el rango de fechas
      const filteredData = this.dataSourceTable1.data.filter(item => {
        const itemDate = new Date(item.f_inicio); // Suponiendo que 'f_inicio' es la propiedad de la fecha
        return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
      });

      this.dataSourceTable1.data = filteredData;
      this.dataSourceTable1._updateChangeSubscription(); // Asegura que la tabla se actualice
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Por favor, selecciona ambas fechas para filtrar.',
        confirmButtonText: 'Aceptar'
      });
    }
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


  applyFilter() {


    // Función auxiliar para verificar coincidencias de cadenas
    const stringMatch = (value: string, filterValue: string): boolean => {
      return value?.toLowerCase().trim().includes(filterValue?.toLowerCase().trim());
    };

    // Función auxiliar para verificar coincidencias exactas de cadenas
    const exactStringMatch = (value: string, filterValue: string): boolean => {
      return value?.toLowerCase().trim() === filterValue?.toLowerCase().trim();
    };
    if (this.filterCriteria.temporal === 'Tu Alianza') {
      this.filterCriteria.temporal = 'TA';
    } else if (this.filterCriteria.temporal === 'Apoyo Laboral') {
      this.filterCriteria.temporal = 'AL';
    }

    // Filtrar los datos basados en los criterios seleccionados
    const filteredData = this.dataSourceTable1.data.filter(item => {


      // Verifica específicamente si el campo existe y normaliza la comparación
      const numeroDeDocumentoMatch = this.filterCriteria.numeroDeDocumento
        ? exactStringMatch(item.Numero_de_documento?.toString(), this.filterCriteria.numeroDeDocumento)
        : true;

      const fechaInicioMatch = this.filterCriteria.fechaInicio
        ? (item.f_inicio && new Date(item.f_inicio).toISOString().split('T')[0] === new Date(this.filterCriteria.fechaInicio).toISOString().split('T')[0])
        : true;

      const empresaMatch = this.filterCriteria.temporal
        ? stringMatch(item.Temporal, this.filterCriteria.temporal)
        : true;

      const tipoIncapacidadMatch = this.filterCriteria.tipoIncapacidad
        ? exactStringMatch(item.tipo_incapacidad, this.filterCriteria.tipoIncapacidad)
        : true;

      return numeroDeDocumentoMatch && fechaInicioMatch && empresaMatch && tipoIncapacidadMatch;
    });
    const filteredData2 = this.dataSourceTable4.data.filter(item => {

      // Verifica específicamente si el campo existe y normaliza la comparación
      const numeroDeDocumentoMatch = this.filterCriteria.numeroDeDocumento
        ? exactStringMatch(item.Numero_de_documento?.toString(), this.filterCriteria.numeroDeDocumento)
        : true;

      const fechaInicioMatch = this.filterCriteria.fechaInicio
        ? (item.f_inicio && new Date(item.f_inicio).toISOString().split('T')[0] === new Date(this.filterCriteria.fechaInicio).toISOString().split('T')[0])
        : true;

      const empresaMatch = this.filterCriteria.empresa
        ? stringMatch(item.empresa, this.filterCriteria.empresa)
        : true;

      const tipoIncapacidadMatch = this.filterCriteria.tipoIncapacidad
        ? exactStringMatch(item.tipo_incapacidad, this.filterCriteria.tipoIncapacidad)
        : true;

      return numeroDeDocumentoMatch && fechaInicioMatch && empresaMatch && tipoIncapacidadMatch;
    });


    if (filteredData.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'No se encontraron datos',
        text: 'No se encontraron datos con los criterios seleccionados.',
        confirmButtonText: 'Aceptar'
      });

      // Limpia los criterios de filtro
      this.filterCriteria = {
        numeroDeDocumento: '',
        fechaInicio: '',
        empresa: '',
        tipoIncapacidad: ''
      };
    }

    // Actualiza el dataSource con los datos filtrados
    this.dataSourceTable1.data = filteredData;
    this.dataSourceTable1._updateChangeSubscription(); // Asegura que la tabla se actualice
    this.dataSourceTable4.data = filteredData2;
    this.dataSourceTable4._updateChangeSubscription(); // Asegura que la tabla se actualice
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

    // Mapear los datos de la segunda tabla (Reporte) con los títulos correspondientes y crear un diccionario
    const reporteMap = new Map<string, any>();
    this.dataSourceTable4.data.forEach((item: any) => {
      const mappedItem: any = {};
      Object.keys(this.columnTitlesTable4excel).forEach(key => {
        mappedItem[this.columnTitlesTable4excel[key]] = item[key] || ''; // Mapea el título y el valor, asigna vacío si no hay datos
      });
      const numeroConsecutivo = item['consecutivoSistema_id'];
      if (numeroConsecutivo) {
        reporteMap.set(numeroConsecutivo, mappedItem);
      }
    });

    // Combinar los datos de la primera tabla (Incapacidades) con los datos de "Reporte" basados en el consecutivo del sistema
    const combinedData = this.dataSourceTable1.data.map((item: any) => {
      const mappedItem: any = {};
      Object.keys(this.columnTitlesTable1excel).forEach(key => {
        mappedItem[this.columnTitlesTable1excel[key]] = item[key] || ''; // Mapea el título y el valor, asigna vacío si no hay datos
      });

      // Buscar el reporte correspondiente usando el consecutivoSistema
      const numeroConsecutivo = item['consecutivoSistema'];
      const reporteItem = reporteMap.get(numeroConsecutivo);

      // Si existe un reporte correspondiente, combinar los datos
      if (reporteItem) {
        Object.keys(this.columnTitlesTable4excel).forEach(key => {
          mappedItem[this.columnTitlesTable4excel[key]] = reporteItem[this.columnTitlesTable4excel[key]] || ''; // Mapea el título y el valor
        });
      } else {
        // Si no existe un reporte correspondiente, agrega columnas vacías para los campos del reporte
        Object.keys(this.columnTitlesTable4excel).forEach(key => {
          mappedItem[this.columnTitlesTable4excel[key]] = ''; // Llena con vacío si no hay reporte correspondiente
        });
      }

      return mappedItem;
    });

    // Crear una hoja de trabajo de Excel con los datos combinados
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(combinedData);

    // Añadir la hoja al libro de trabajo
    XLSX.utils.book_append_sheet(wb, ws, 'Incapacidades y Reporte');

    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

    // Generar el archivo Excel y descargarlo
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `Reporte_${formattedDate}.xlsx`);
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
