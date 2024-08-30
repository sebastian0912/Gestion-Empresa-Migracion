import { Component, OnInit } from '@angular/core';
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
import { MatSelectModule } from '@angular/material/select';

export interface ColumnConfig {
  key: string;
  label: string;
  filterable: boolean;
  filterValue?: string;
}
@Component({
  selector: 'app-buscar-incapacidad',
  standalone: true,

  imports: [
    NavbarLateralComponent,
    NavbarSuperiorComponent,
    InfoCardComponent,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatCardModule,
    NgIf,
    NgClass,
    NgFor
  ],
  templateUrl: './buscar-incapacidad.component.html',
  styleUrl: './buscar-incapacidad.component.css'
})
export class BuscarIncapacidadComponent implements OnInit {
  query: string = '';
  columnFilters: { [key: string]: string[] } = {};

  ColumnsTable1 = [
    'Dias_temporal',
    'F_inicio',
    'F_final',
    'Fecha_de_Envio_Incapacidad_Fisica',
    'Incapacidad_transcrita',
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
    'Incapacidad_transcrita': 'Incapacidad Transcrita',
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

  displayedColumnsTable2= [
    'contrato',
    'empresa',
    'idEmpresa',
    'tipodedocumento',
    'documentodeidentidad',
    'SegundoApellido',
    'nombre',
    'sexo',
    'eps',
    'afp',
    'fecha_de_nacimiento',
    'cargo',
    'codigo_sucursal',
    'nombre_sucursal',
    'codigo_centro_trabajo',
    'nombre_centro_trabajo',
    'porcentaje_corizacion',
    'codigo_actividad_economica',
    'descripcion_actividad_economica',
    'ciudad',
    'fecha_de_ingreso',
    'fecha_retiro_programado',
    'estado_cobertura',
    'tipo_afiliado',
    'tasa_riesgo_independiente',
    'teletrabajo',
    'trabajo_remoto',
    'trabajo_en_casa',
    'tipo_cotizante',
    'acciones'
  ];

  columnTitlesTable2 = {
    'contrato': 'Contrato',
    'empresa': 'Empresa',
    'idEmpresa': 'ID Empresa',
    'tipodedocumento': 'Tipo de Documento',
    'documentodeidentidad': 'Documento de Identidad',
    'SegundoApellido': 'Segundo Apellido',
    'nombre': 'Nombre',
    'sexo': 'Sexo',
    'eps': 'EPS',
    'afp': 'AFP',
    'fecha_de_nacimiento': 'Fecha de Nacimiento',
    'cargo': 'Cargo',
    'codigo_sucursal': 'Código Sucursal',
    'nombre_sucursal': 'Nombre Sucursal',
    'codigo_centro_trabajo': 'Código Centro de Trabajo',
    'nombre_centro_trabajo': 'Nombre Centro de Trabajo',
    'porcentaje_corizacion': 'Porcentaje Cotización',
    'codigo_actividad_economica': 'Código Actividad Económica',
    'descripcion_actividad_economica': 'Descripción Actividad Económica',
    'ciudad': 'Ciudad',
    'fecha_de_ingreso': 'Fecha de Ingreso',
    'fecha_retiro_programado': 'Fecha Retiro Programado',
    'estado_cobertura': 'Estado Cobertura',
    'tipo_afiliado': 'Tipo Afiliado',
    'tasa_riesgo_independiente': 'Tasa Riesgo Independiente',
    'teletrabajo': 'Teletrabajo',
    'trabajo_remoto': 'Trabajo Remoto',
    'trabajo_en_casa': 'Trabajo en Casa',
    'tipo_cotizante': 'Tipo Cotizante',
    'acciones': 'Acciones'

  };

  displayedColumnsTable4 = [
    'Numero_de_documento',
    'a_donde_se_radico',
    'aquien_corresponde_el_pago',
    'codigo_respuesta_eps',
    'confirmacion_fecha_de_radicacion',
    'consecutivoSistema_id',
    'dias_pagos_incapacidad',
    'estado_del_documento_incapacidad',
    'fecha_de_recepcion_de_la_incapacidad',
    'fecha_de_respuesta_eps',
    'fecha_de_radicado_eps',
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

  displayedColumnsTable3 = [
    'tipoidentificacion', 'no_identificacion', 'razon_social', 'clase_aportante', 'tipo_aportante',
    'fecha_de_pago', 'periodo_pension', 'periodo_salud', 'tipo_planilla', 'clave',
    'tipo_id_2', 'no_identificacion_2', 'nombre', 'ciudad', 'depto', 'salario',
    'integral', 'tipo_cotizante', 'subtipo_cotizante', 'horas_laboradas',
    'es_extranjero', 'residente_ext', 'fecha_residencia_ext', 'codigo',
    'centro_de_trabajo', 'nombre_centro_trabajo', 'codigo_2', 'direccion',
    'ing', 'fecha_ing', 'ret', 'fecha_ret', 'tae', 'tde', 'tap', 'tdp',
    'vsp', 'fecha_vsp', 'vst', 'sln', 'inicio_sln', 'fin_sln', 'ige',
    'inicio_ige', 'fin_ige', 'lma', 'inicio_lma', 'fin_lma', 'vac',
    'inicio_vac', 'fin_vac', 'avp', 'vct', 'inicio_vct', 'fin_vct',
    'irl', 'inicio_irl', 'fin_irl', 'vip', 'cor', 'administradora',
    'nit', 'codigo_3', 'dias', 'ibc', 'tarifa', 'aporte', 'tarifa_empleado',
    'aporte_empleado', 'fsp', 'fs', 'voluntaria_empleado', 'valor_no_retenido',
    'total_empleado', 'tarifa_empleador', 'aporte_empleador', 'voluntaria_empleador',
    'total_empleador', 'total_afp', 'afp_destino', 'administradora_afp',
    'nit_afp', 'codigo_4', 'dias_afp', 'ibc_afp', 'tarifa_afp',
    'aporte_afp', 'upc', 'tarifa_empleado_afp', 'aporte_empleado_afp',
    'tarifa_empleador_afp', 'aporte_empleador_afp', 'total_eps', 'eps_destino',
    'administradora_eps', 'nit_eps', 'codigo_eps', 'dias_eps', 'ibc_eps',
    'tarifa_eps', 'aporte_eps', 'administradora_riesgos', 'nit_riesgos',
    'codigo_riesgos', 'dias_riesgos', 'ibc_riesgos', 'tarifa_riesgos',
    'clase_riesgo', 'aporte_riesgos', 'dias_riesgos_2', 'ibc_riesgos_2',
    'tarifa_riesgos_2', 'aporte_riesgos_2', 'tarifa_sena', 'aporte_sena',
    'tarifa_icbf', 'aporte_icbf', 'exonerado_sena_icbf', 'total_aportes', 'acciones'
  ];
  columnTitles = {
    'tipoidentificacion': 'Tipo Identificación',
    'no_identificacion': 'No Identificación',
    'razon_social': 'Razón Social',
    'clase_aportante': 'Clase Aportante',
    'tipo_aportante': 'Tipo Aportante',
    'fecha_de_pago': 'Fecha de Pago',
    'periodo_pension': 'Periodo Pensíon',
    'periodo_salud': 'Periodo Salud',
    'tipo_planilla': 'Tipo Planilla',
    'clave': 'Clave',
    'tipo_id_2': 'Tipo ID 2',
    'no_identificacion_2': 'No Identificación 2',
    'nombre': 'Nombre',
    'ciudad': 'Ciudad',
    'depto': 'Depto',
    'salario': 'Salario',
    'integral': 'Integral',
    'tipo_cotizante': 'Tipo Cotizante',
    'subtipo_cotizante': 'Subtipo Cotizante',
    'horas_laboradas': 'Horas Laboradas',
    'es_extranjero': 'Es Extranjero',
    'residente_ext': 'Residente Ext',
    'fecha_residencia_ext': 'Fecha Residencia Ext',
    'codigo': 'Código',
    'centro_de_trabajo': 'Centro de Trabajo',
    'nombre_centro_trabajo': 'Nombre Centro Trabajo',
    'codigo_2': 'Código 2',
    'direccion': 'Dirección',
    'ing': 'ING',
    'fecha_ing': 'Fecha ING',
    'ret': 'RET',
    'fecha_ret': 'Fecha RET',
    'tae': 'TAE',
    'tde': 'TDE',
    'tap': 'TAP',
    'tdp': 'TDP',
    'vsp': 'VSP',
    'fecha_vsp': 'Fecha VSP',
    'vst': 'VST',
    'sln': 'SLN',
    'inicio_sln': 'Inicio SLN',
    'fin_sln': 'Fin SLN',
    'ige': 'IGE',
    'inicio_ige': 'Inicio IGE',
    'fin_ige': 'Fin IGE',
    'lma': 'LMA',
    'inicio_lma': 'Inicio LMA',
    'fin_lma': 'Fin LMA',
    'vac': 'VAC',
    'inicio_vac': 'Inicio VAC',
    'fin_vac': 'Fin VAC',
    'avp': 'AVP',
    'vct': 'VCT',
    'inicio_vct': 'Inicio VCT',
    'fin_vct': 'Fin VCT',
    'irl': 'IRL',
    'inicio_irl': 'Inicio IRL',
    'fin_irl': 'Fin IRL',
    'vip': 'VIP',
    'cor': 'COR',
    'administradora': 'Administradora',
    'nit': 'NIT',
    'codigo_3': 'Código 3',
    'dias': 'Días',
    'ibc': 'IBC',
    'tarifa': 'Tarifa',
    'aporte': 'Aporte',
    'tarifa_empleado': 'Tarifa Empleado',
    'aporte_empleado': 'Aporte Empleado',
    'fsp': 'FSP',
    'fs': 'FS',
    'voluntaria_empleado': 'Voluntaria Empleado',
    'valor_no_retenido': 'Valor No Retenido',
    'total_empleado': 'Total Empleado',
    'tarifa_empleador': 'Tarifa Empleador',
    'aporte_empleador': 'Aporte Empleador',
    'voluntaria_empleador': 'Voluntaria Empleador',
    'total_empleador': 'Total Empleador',
    'total_afp': 'Total AFP',
    'afp_destino': 'AFP Destino',
    'administradora_afp': 'Administradora AFP',
    'nit_afp': 'NIT AFP',
    'codigo_4': 'Código 4',
    'dias_afp': 'Días AFP',
    'ibc_afp': 'IBC AFP',
    'tarifa_afp': 'Tarifa AFP',
    'aporte_afp': 'Aporte AFP',
    'upc': 'UPC',
    'tarifa_empleado_afp': 'Tarifa Empleado AFP',
    'aporte_empleado_afp': 'Aporte Empleado AFP',
    'tarifa_empleador_afp': 'Tarifa Empleador AFP',
    'aporte_empleador_afp': 'Aporte Empleador AFP',
    'total_eps': 'Total EPS',
    'eps_destino': 'EPS Destino',
    'administradora_eps': 'Administradora EPS',
    'nit_eps': 'NIT EPS',
    'codigo_eps': 'Código EPS',
    'dias_eps': 'Días EPS',
    'ibc_eps': 'IBC EPS',
    'tarifa_eps': 'Tarifa EPS',
    'aporte_eps': 'Aporte EPS',
    'administradora_riesgos': 'Administradora Riesgos',
    'nit_riesgos': 'NIT Riesgos',
    'codigo_riesgos': 'Código Riesgos',
    'dias_riesgos': 'Días Riesgos',
    'ibc_riesgos': 'IBC Riesgos',
    'tarifa_riesgos': 'Tarifa Riesgos',
    'clase_riesgo': 'Clase Riesgo',
    'aporte_riesgos': 'Aporte Riesgos',
    'dias_riesgos_2': 'Días Riesgos 2',
    'ibc_riesgos_2': 'IBC Riesgos 2',
    'tarifa_riesgos_2': 'Tarifa Riesgos 2',
    'aporte_riesgos_2': 'Aporte Riesgos 2',
    'tarifa_sena': 'Tarifa SENA',
    'aporte_sena': 'Aporte SENA',
    'tarifa_icbf': 'Tarifa ICBF',
    'aporte_icbf': 'Aporte ICBF',
    'exonerado_sena_icbf': 'Exonerado SENA ICBF',
    'total_aportes': 'Total Aportes',
    'acciones': 'Acciones'
  };
  displayedColumnsTable5 = ["FECHA",
    "TIPO DOC.",
    "NÚMERO DOC.",
    "CUENTA",
    "CONCEPTO",
    "NOMBRE DEL TERCERO",
    "NOMBRE C. DE COSTO",
    "CUENTA BANCARIA",
    "USUARIO",
    "NOMBRE CUENTA",
    "DEBITO",
    "GRUPO DE INCAPACIDADES"];
  columnTitlesTable5 = {
    'fecha': 'FECHA',
    'tipo_doc': 'TIPO DOC.',
    'numero_doc': 'NÚMERO DOC.',
    'cuenta': 'CUENTA',
    'concepto': 'CONCEPTO',
    'nombre_tercero': 'NOMBRE DEL TERCERO',
    'nombre_centro_costo': 'NOMBRE C. DE COSTO',
    'cuenta_bancaria': 'CUENTA BANCARIA',
    'usuario': 'USUARIO',
    'nombre_cuenta': 'NOMBRE CUENTA',
    'debito': 'DEBITO',
    'grupo_incapacidades': 'GRUPO DE INCAPACIDADES'
  };
  displayedColumnsTable6 = ["temporal", "entidad", "TIPO_ID_AFILIADO", "IDENTIFICACION_AFILIADO", "NOMBRES_AFILIADO",
    "NRO_INCAPACIDAD", "FECHA_INICIO", "FECHA_FÍN", "DÍAS_OTORGADOS", "CONTINGENCIA", "DIAGNÓSTICO",
    "IBL", "DÍAS_PAGADOS", "VALOR_PAGADO", "FECHA_PAGO", "NRO_COMPROBANTE_PAGO", "GRUPO DE INCAPACIDADES"];
  columnTitlesTable6 = {
    'temporal': 'Información temporal o identificador temporal',
    'entidad': 'Nombre de la entidad',
    'tipo_id_afiliado': 'Tipo de identificación del afiliado (ej. CC, TI)',
    'identificacion_afiliado': 'Número de identificación del afiliado',
    'nombres_afiliado': 'Nombres completos del afiliado',
    'nro_incapacidad': 'Número de la incapacidad',
    'fecha_inicio': 'Fecha de inicio de la incapacidad',
    'fecha_fin': 'Fecha de finalización de la incapacidad',
    'dias_otorgados': 'Número de días otorgados de incapacidad',
    'contingencia': 'Tipo de contingencia',
    'diagnostico': 'Diagnóstico relacionado con la incapacidad',
    'ibl': 'Ingreso Base de Liquidación (IBL)',
    'dias_pagados': 'Días pagados por la incapacidad',
    'valor_pagado': 'Valor pagado por la incapacidad',
    'fecha_pago': 'Fecha en que se realizó el pago',
    'nro_comprobante_pago': 'Número de comprobante del pago',
    'grupo_incapacidades': 'Grupo de incapacidades'
  };
  displayedColumnsTable7 = ["Grupo",
    "Cedula",
    "Nombres y Apellidos",
    "Fecha Ingreso",
    "Suma de Dias incapacidad enf gral menor a 2d",
    "Suma de Dias Incapacidad enf grl desde 3d",
    "Verificacion Existencia Incapacidad",
    "Arreglo de Incapacidades registradas",
    "Dias Empresa Usuaria",
    "Dias EPS",
    "Confirmacion Dias Empresa Usuaria",
    "Confirmacion Dias EPS",
    "tabla de indicadores"];
  columnTitlesTable7 = {
    'grupo': 'Grupo del empleado',
    'cedula': 'Cédula del empleado',
    'nombres_apellidos': 'Nombres y Apellidos',
    'fecha_ingreso': 'Fecha Ingreso',
    'suma_dias_incapacidad_menor_2d': 'Suma de Días Incapacidad Enf Gral Menor a 2d',
    'suma_dias_incapacidad_3d_o_mas': 'Suma de Días Incapacidad Enf Grl Desde 3d',
    'verificacion_existencia_incapacidad': 'Verificación Existencia Incapacidad',
    'arreglo_incapacidades_registradas': 'Arreglo de Incapacidades Registradas',
    'dias_empresa_usuaria': 'Días Empresa Usuaria',
    'dias_eps': 'Días EPS',
    'confirmacion_dias_empresa_usuaria': 'Confirmación Días Empresa Usuaria',
    'confirmacion_dias_eps': 'Confirmación Días EPS',
    'tabla_indicadores': 'Tabla de Indicadores'
  };


  dataSourcetable1 = new MatTableDataSource<any>();


  resultsincapacidades: any[] = [];
  resultsarl: any[] = [];
  resultssst: any[] = [];

  user: any
  correo: any
  filteredData: any[] = [];
  isSearchded = false;
  overlayVisible = false;
  loaderVisible = false;
  counterVisible = false;
  columnConfigs: ColumnConfig[] = [
    { key: 'numero_de_documento', label: 'Número de Documento', filterable: true },
    { key: 'a_donde_se_radico', label: 'A dónde se radicó', filterable: true },
    { key: 'aquien_corresponde_el_pago', label: 'A quién corresponde el pago', filterable: true },
    { key: 'codigo_respuesta_eps', label: 'Código de respuesta EPS', filterable: true },
    { key: 'confirmacion_fecha_de_radicacion', label: 'Fecha de confirmación de radicación', filterable: true },
    { key: 'consecutivo_sistema_id', label: 'Número de consecutivo del sistema', filterable: true },
    // Agrega más columnas según sea necesario...
  ];
  tiposIncapacidad: string[] = [
    'ENFERMEDAD GENERAL',
    'LICENCIA DE MATERNIDAD',
    'LICENCIA PATERNIDAD',
    'ACCIDENTE DE TRABAJO',
    'SOAT / ACCIDENTE DE TRANCITO',
    'ENFERMEDAD LABORAL'
  ];
  constructor(private incapacidadService: IncapacidadService, private router: Router) {
  }
  async ngOnInit(): Promise<void> {
    this.displayedColumns = [...this.columnConfigs.map(config => config.key), 'edit'];
  }
  toTitleCase(text: string, columnTitles: { [key: string]: string }): string {
    if (!text) return '';

    // Si el texto existe en la lista de títulos de columnas, devolver ese valor
    if (columnTitles[text]) {
      return columnTitles[text];
    }

    // Si no existe en la lista, realizar la conversión a título de caso
    return text
      .toLowerCase()
      .split('_') // Suponiendo que las claves están en snake_case
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
  onSearch(): void {
    if (this.query.trim()) { // Verifica que el input no esté vacío
      this.incapacidadService.buscar(this.query).subscribe(
        response => {

          // Assuming response contains incapacidades and reporte arrays
          const incapacidades = response.incapacidades || [];
          const reporte = response.reporte || [];
          const movimiento = response.movimientoBanco || [];
          const facturaelite = response.facturaelite || [];
          const incapacidadespagas = response.incapacidadespagas || [];
          // Combinar los datos
          const combinedData = incapacidades.map((incapacidad: any, index: number) => {
            // Puedes combinar los datos aquí si hay una relación entre ellos
            // En este ejemplo, solo se concatenan, pero puedes personalizar la lógica según tus necesidades
            return {
              ...incapacidad,
              ...reporte[index],  // Asumiendo que hay una correspondencia uno a uno
              ...movimiento[index],
              ...facturaelite[index],
              ...incapacidadespagas[index]
            };
          });
          // Asignar los datos al DataSource
          this.dataSourcetable1.data = combinedData;
          this.isSearchded = true;

        },
        error => {
          console.error('Error al buscar datos:', error);
          // Handle error as needed
        }
      );
    } else {
      // Clear the tables if the query is empty
      this.dataSourcetable1.data = [];

    }
  }


  applyFilter() {
    this.filteredData = this.resultsincapacidades.filter(item => {
      return (
        (this.filterCriteria.tipodeincapacidad ? item.tipodeincapacidad.includes(this.filterCriteria.tipodeincapacidad) : true) &&
        (this.filterCriteria.centrodecosto ? item.centrodecosto.includes(this.filterCriteria.centrodecosto) : true) &&
        (this.filterCriteria.empresa ? item.empresa.includes(this.filterCriteria.empresa) : true) &&
        (this.filterCriteria.estadorobot ? item.estadorobot.includes(this.filterCriteria.estadorobot) : true) &&
        (this.filterCriteria.temporal ? item.temporal.includes(this.filterCriteria.temporal) : true)
      );
    });
  }
  resetFileInput(event: any): void {
    event.target.value = '';
  }

  openReportDialog(): void {
    Swal.fire({
      title: 'Crear/Editar Reporte',
      text: '¿Qué acción deseas realizar?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Crear/Editar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.isSearchded) {
        // Manejar el resultado del diálogo aquí
          this.router.navigate(['/formulario-reporte', this.query]);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se han realizado búsquedas'
          });
        }
      } else if (result.isDismissed) {
        console.log('El diálogo fue cancelado');
      }
    });
  }


  claves = ["NroDes", "Contrato", "Cedula", "Nombre", "CentrodeCosto", "Concepto", "FormadePago", "Valor", "Banco", "FECHADEPAGO"];

  asignarClaves(data: any[]): any[] {

    return data.map((row: any) => {
      let modifiedRow: any = {};
      row.forEach((cell: any, index: number) => {
        if (index < this.claves.length) {
          modifiedRow[this.claves[index]] = cell !== null ? cell : 'N/A';
        }
      });
      return modifiedRow;
    });
  }
  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  cargarExcel(event: any): void {
    this.toggleLoader(true, true);
    this.toggleOverlay(true);

    const files = event.target.files;

    if (files.length !== 2) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor seleccione dos archivos Excel'
      });
      this.toggleLoader(false);
      this.toggleOverlay(false);
      return;
    }

    const fileNames: { [key: string]: string } = {};
    const fileData: { [key: string]: any[] } = {};
    let filesProcessed = 0;

    // Función para procesar cada archivo de Excel
    const processExcelFile = (file: File, key: string) => {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true, cellNF: false, cellText: false });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, dateNF: "dd/mm/yyyy" });

        // No hay verificación de columnas aquí
        const modifiedRows = this.asignarClaves(rows);

        fileNames[key] = file.name;
        fileData[key] = modifiedRows;
        filesProcessed++;

        // Cuando ambos archivos hayan sido procesados
        if (filesProcessed === 2) {
          this.incapacidadService.uploadFiles(fileData, fileNames).subscribe(
            (response: any) => {
              if (response.message === 'success') {
                Swal.fire({
                  icon: 'success',
                  title: 'Éxito',
                  text: 'Los archivos han sido cargados correctamente'
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Ocurrió un error al cargar los archivos'
                });
              }
              this.toggleLoader(false);
              this.toggleOverlay(false);
            },
            (error: any) => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ha ocurrido un error al cargar los archivos'
              });
              this.toggleLoader(false);
              this.toggleOverlay(false);
            }
          );
        }
      };

      reader.readAsArrayBuffer(file);
    };

    // Procesar ambos archivos Excel
    processExcelFile(files[0], 'arl');
    processExcelFile(files[1], 'sst');
  }
  displayedColumnsWithEdit: string[] = [...this.displayedColumnsTable4, 'edit'];

  openEditDialog(element: any): void {
    Swal.fire({
      title: 'Editar Reporte',
      text: '¿Qué acción deseas realizar?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Editar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/formulario-reporte', element.consecutivoSistema_id]);
      }
    });
  }
  displayedColumns: string[] = [];
  applyColumnFilter(): void {
    this.dataSourcetable1.filterPredicate = (data, filter) => {
      return this.columnConfigs.every(config => {
        if (!config.filterable || !config.filterValue) {
          return true;
        }
        const value = data[config.key] ? data[config.key].toString().toLowerCase() : '';
        return value.includes(config.filterValue!.toLowerCase());
      });
    };

    this.dataSourcetable1.filter = 'apply';
  }
  editRow(element: any) {
    // Activa el modo de edición en la fila seleccionada
    element.editing = true;
  }

  isFilterable(column: string): boolean {
    const filterableColumns = ['T1', 'T2', 'Total']; // Define las columnas que son filtrables
    return filterableColumns.includes(column);
  }
  applyFilterColumn(column: string, filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();

    this.dataSourcetable1.filterPredicate = (data: any, filter: string) => {
      return data[column]?.toString().toLowerCase().includes(filter);
    };

    this.dataSourcetable1.filter = filterValue;
  }
  isEditable(column: string): boolean {
    return this.editableColumns.includes(column);
  }
  editableColumns: string[] = ['celular_o_telefono_01', 'celular_o_telefono_02', 'correoElectronico'];
  editingRow: any = null; // La fila que está siendo editada
  editedValues: any = {}; // Almacena los valores editados
  updateValue(row: any, column: string, event: any) {
    row[column] = event.target.value;
    this.editedValues[column] = event.target.value;
    this.editingRow = row;
  }
  saveChanges(): void {
    const index = this.dataSourcetable1.data.findIndex(item => item === this.editingRow);
    if (index !== -1) {
      this.dataSourcetable1.data[index] = { ...this.dataSourcetable1.data[index], ...this.editedValues };
      this.dataSourcetable1.data = [...this.dataSourcetable1.data]; // Forzar la actualización de la tabla

      this.incapacidadService.updateIncapacidad(this.editingRow.consecutivoSistema_id, this.editingRow).subscribe(
        response => {
          Swal.fire({ icon: 'success', title: 'Éxito', text: 'Los cambios se han guardado correctamente' });
          this.cancelEditing();
        },
        error => Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron guardar los cambios' })
      );
    }
  }

  cancelEditing() {
    this.editingRow = null;
    this.editedValues = {};
  }

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
}