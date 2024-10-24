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
import { DatePipe } from '@angular/common'; // Importa DatePipe
import { forkJoin, mergeMap } from 'rxjs';

interface ColumnTitle {
  [key: string]: string;
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
  styleUrl: './vista-total-incapacidades.component.css',
  providers: [DatePipe]
})
export class VistaTotalIncapacidadesComponent implements OnInit {
  query: string = '';

  isSidebarHidden = false;

  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
  }
  
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
  copiadataSourceTable1 = new MatTableDataSource<any>();
  copiadataSourceTable4 = new MatTableDataSource<any>();
  tiposIncapacidad: string[] = [
    'ENFERMEDAD GENERAL',
    'LICENCIA DE MATERNIDAD',
    'LICENCIA PATERNIDAD',
    'ACCIDENTE DE TRABAJO',
    'SOAT / ACCIDENTE DE TRANCITO',
    'ENFERMEDAD LABORAL'
  ];
  resultsincapacidades: any[] = [];
  resultsarl: any[] = [];
  resultssst: any[] = [];
  myForm: FormGroup;
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
  constructor(
    private incapacidadService: IncapacidadService,
    private router: Router,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.myForm = this.fb.group({
      confirmacion_fecha_de_radicacion_inicio: ['', Validators.required],
      confirmacion_fecha_de_radicacion_fin: ['', Validators.required]
    });


  }

  ngOnInit(): void {
    this.setupFormListeners();
    this.loadData();

  }
  mostrarCargando(estado: boolean) {
    if (estado) {
      // Mostrar la alerta de carga con spinner
      Swal.fire({
        title: 'Cargando...',
        html: 'Por favor espera mientras se carga la información',
        allowOutsideClick: false, // Evitar que se cierre al hacer click fuera
        didOpen: () => {
          Swal.showLoading(); // Mostrar el spinner
        }
      });
    } else {
      // Cerrar la alerta de carga
      Swal.close();
    }
  }

  // Método que se llama con el estado
  cargarInformacion(estado: boolean) {
    this.mostrarCargando(estado); // Mostrar o cerrar la alerta dependiendo del estado

    if (estado) {
      // Simulación de una operación de carga (reemplazar con lógica real)
      setTimeout(() => {
        // Aquí se cierra el Swal después de la simulación (simulación de 5 segundos)
        this.mostrarCargando(false);
      }, 5000);
    }
  }

  private initializeLoader(): void {
    const isLoading = !this.isloadeddata;
    this.toggleLoader(isLoading);
    this.toggleOverlay(isLoading);
  }

  private setupFormListeners(): void {
    this.myForm.get('confirmacion_fecha_de_radicacion_inicio')?.valueChanges.subscribe(value => {
      this.filterCriteria.fechaInicio = this.formatDate(value);
    });

    this.myForm.get('confirmacion_fecha_de_radicacion_fin')?.valueChanges.subscribe(value => {
      this.filterCriteria.fechaFin = this.formatDate(value);
    });
  }

  private formatDate(date: any): string {
    return this.datePipe.transform(date, 'dd-MM-YYYY') || '';
  }

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

  private loadData(): void {
    this.cargarInformacion(true);
    // Utiliza mergeMap para manejar las solicitudes de manera más eficiente
    this.incapacidadService.traerTodosDatosIncapacidad().pipe(
      mergeMap(incapacidadesResponse =>
        this.incapacidadService.traerTodosDatosReporte().pipe(
          mergeMap(reporteResponse => {
            // Procesa ambos conjuntos de datos aquí
            this.handleDataSuccess(incapacidadesResponse || [], reporteResponse.data || []);
            this.cargarInformacion(false);
            return []; // Retorna vacío o un Observable según sea necesario
          })
        )
      )
    ).subscribe({
      next: () => {
        // Se completó la carga de datos


      },
      error: () => this.handleError('Error al cargar los datos, por favor intenta de nuevo.')
    });
  }

  private handleDataSuccess(incapacidades: any[], reporte: any[]): void {
    this.dataSourceTable1.data = incapacidades;
    this.dataSourceTable4.data = reporte;
    this.copiadataSourceTable1.data = incapacidades;
    this.copiadataSourceTable4.data = reporte;
    this.toggleLoader(false, false);
    this.toggleOverlay(false);
  }

  private handleError(errorMessage: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: errorMessage,
      confirmButtonText: 'Aceptar'
    });
    this.toggleLoader(false, false);
    this.toggleOverlay(false);
  }

  applyDateFilter(): void {
    const fechaInicio = this.formatDate(this.myForm.get('confirmacion_fecha_de_radicacion_inicio')?.value);
    // Verifica que la fecha de inicio esté presente
    if (!fechaInicio) {
      this.showWarning('Por favor, selecciona una fecha para filtrar.');
      return;
    }

    // Convierte la fecha de inicio al formato de Date
    const fechaInicioDate = new Date(fechaInicio);

    // Filtra los datos según la fecha de inicio proporcionada
    const filteredData = this.dataSourceTable1.data.filter(item => {
      const itemDate = new Date(item.F_inicio);
      return this.isDateWithinRange(itemDate, fechaInicioDate);
    });

    // Muestra un mensaje si no hay datos filtrados o actualiza las tablas con los datos filtrados
    if (filteredData.length === 0) {
      this.showInfo('No se encontraron datos con los criterios seleccionados.');
    } else {
      this.updateDataSources(filteredData);
    }
  }

  // Función actualizada para manejar solo la fecha de inicio
  private isDateWithinRange(itemDate: Date, startDate: Date): boolean {
    // Verifica que la fecha del elemento sea igual o posterior a la fecha de inicio
    return itemDate.getTime() >= startDate.getTime();
  }


  private showInfo(message: string): void {
    Swal.fire({
      icon: 'info',
      title: 'Información',
      text: message,
      confirmButtonText: 'Aceptar'
    });
  }

  private showWarning(message: string): void {
    Swal.fire({
      icon: 'warning',
      title: 'Advertencia',
      text: message,
      confirmButtonText: 'Aceptar'
    });
  }

  private updateDataSources(data: any[]): void {
    this.dataSourceTable1.data = data;
    this.dataSourceTable1._updateChangeSubscription();
    this.dataSourceTable4.data = data;
    this.dataSourceTable4._updateChangeSubscription();
  }

  applyFilter(): void {
    const filteredData = this.filterData(this.dataSourceTable1.data);
    const filteredData2 = this.filterData(this.dataSourceTable4.data);

    if (filteredData.length === 0) {
      this.showInfo('No se encontraron datos con los criterios seleccionados.');
      this.resetFilterCriteria();
      this.dataSourceTable1.data = this.copiadataSourceTable1.data;
      this.dataSourceTable4.data = this.copiadataSourceTable4.data;
    }else{
      this.updateDataSources(filteredData);
      this.resetFilterCriteria();
    }

  }

  private filterData(data: any[]): any[] {
    return data.filter(item => this.matchesCriteria(item));
  }
  private empresaAbreviaturas: { [key: string]: string } = {
    'Tu Alianza': 'TA',
    'Apoyo Laboral': 'AL',
    // Agrega más correspondencias según sea necesario
  };
  private matchesCriteria(item: any): boolean {
    const { numeroDeDocumento, fechaInicio, temporal, tipoIncapacidad } = this.filterCriteria;

    // Obtener la abreviatura de la empresa si existe
    const empresaAbreviada = temporal ? this.empresaAbreviaturas[temporal.trim()] : '';

    return this.exactStringMatch(item.Numero_de_documento, numeroDeDocumento) ||
      this.dateMatch(item.f_inicio, fechaInicio) ||

      this.stringMatch(item.Temporal, empresaAbreviada) ||
      this.exactStringMatch(item.tipo_incapacidad, tipoIncapacidad);
  }

  private exactStringMatch(value: string, filterValue: string): boolean {
    return value?.toLowerCase().trim() === filterValue?.toLowerCase().trim();
  }

  private stringMatch(value: string, filterValue: string): boolean {
    console.log(value, filterValue);

    if (!value || !filterValue) return false; // Asegura que ambos valores existan antes de comparar
    return value.toLowerCase().trim().includes(filterValue.toLowerCase().trim());
  }

  private dateMatch(date: string, filterDate: string): boolean {
    if (!date || !filterDate) return false; // Verifica si alguna fecha es inválida o está vacía

    const formattedDate = new Date(date).toISOString().split('T')[0];
    const formattedFilterDate = new Date(filterDate).toISOString().split('T')[0];

    return formattedDate === formattedFilterDate; // Devuelve el resultado de la comparación booleana
  }

  private resetFilterCriteria(): void {
    this.filterCriteria = { numeroDeDocumento: '', fechaInicio: '', empresa: '', tipoIncapacidad: '' };

  }

  downloadExcel(): void {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const combinedData = this.combineDataForExcel();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(combinedData);

    XLSX.utils.book_append_sheet(wb, ws, 'Incapacidades y Reporte');
    const formattedDate = new Date().toISOString().split('T')[0];
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `Reporte_${formattedDate}.xlsx`);
  }

  private combineDataForExcel(): any[] {
    const reporteMap = this.createReportMap();
    return this.dataSourceTable1.data.map((item: any) => this.combineItemData(item, reporteMap));
  }

  private createReportMap(): Map<string, any> {
    const map = new Map<string, any>();
    this.dataSourceTable4.data.forEach((item: any) => {
      const mappedItem = this.mapDataWithTitles([item], this.columnTitlesTable4excel)[0];
      if (item['consecutivoSistema_id']) {
        map.set(item['consecutivoSistema_id'], mappedItem);
      }
    });
    return map;
  }

  private combineItemData(item: any, reporteMap: Map<string, any>): any {
    const mappedItem = this.mapDataWithTitles([item], this.columnTitlesTable1excel)[0];
    const reporteItem = reporteMap.get(item['consecutivoSistema']);
    Object.keys(this.columnTitlesTable4excel).forEach(key => {
      mappedItem[this.columnTitlesTable4excel[key]] = reporteItem?.[this.columnTitlesTable4excel[key]] || '';
    });
    return mappedItem;
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

  playSound(success: boolean): void {
    const audio = new Audio(success ? 'Sounds/positivo.mp3' : 'Sounds/negativo.mp3');
    audio.play();
  }

  resetFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = '';
  }
  toTitleCase(text: string, columnTitles: ColumnTitle): string {
    return columnTitles[text] || text
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}


