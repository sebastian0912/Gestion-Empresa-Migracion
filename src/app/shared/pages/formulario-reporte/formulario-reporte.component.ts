import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IncapacidadService } from '../../services/incapacidad/incapacidad.service';
import { Reporte } from '../../../models/reporte.model';
import { MatTableDataSource } from '@angular/material/table';
import { NavbarLateralComponent } from '../../components/navbar-lateral/navbar-lateral.component';
import { NavbarSuperiorComponent } from '../../components/navbar-superior/navbar-superior.component';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { InfoCardComponent } from '../../components/info-card/info-card.component';
import { PagosService } from '../../services/pagos/pagos.service';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { NgIf, NgFor, NgSwitch } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

import { ContratacionService } from '../../services/contratacion/contratacion.service';
import { EstadisticasAuditoriaComponent } from '../estadisticas-auditoria/estadisticas-auditoria.component';
@Component({
  selector: 'app-formulario-reporte',
  standalone: true,
  imports: [
    NavbarLateralComponent,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
    FormsModule,
    MatCardModule,
    NgFor,
    ReactiveFormsModule,
  ],
  templateUrl: './formulario-reporte.component.html',
  styleUrl: './formulario-reporte.component.css'
})
export class FormularioReporteComponent implements OnInit {
  fields: string[] = [
    'consecutivoSistema_id', 'confirmacion_fecha_de_radicacion', 'fecha_de_recepcion_de_la_incapacidad',
    'fecha_revision_por_parte_de_incapacidades', 'estado_del_documento_incapacidad', 'aquien_corresponde_el_pago',
    'fecha_de_radicado_eps', 'numero_de_radicado', 'a_donde_se_radico', 'quien_radico', 'respuesta_de_la_eps',
    'codigo_respuesta_eps', 'fecha_de_respuesta_eps', 'numero_de_incapacidad_eps', 'dias_pagos_incapacidad',
    'valor_incapacidad', 'numero_transaccion_eps_arl', 'transaccion_empresa_usuaria', 'quien_corresponde_el_pago_final',
    'respuesta_final_incapacidad'
  ];

  isSidebarHidden = false;

  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
  }

  fieldMap: { [key: string]: string } = {
    'Número de consecutivo del sistema': 'consecutivoSistema_id',
    'Fecha de confirmación de radicación': 'confirmacion_fecha_de_radicacion',
    'Fecha de recepción de la incapacidad': 'fecha_de_recepcion_de_la_incapacidad',
    'Fecha de revisión por parte de incapacidades': 'fecha_revision_por_parte_de_incapacidades',
    'Estado del documento de incapacidad': 'estado_del_documento_incapacidad',
    'A quién corresponde el pago': 'aquien_corresponde_el_pago',
    'Fecha de radicado EPS': 'fecha_de_radicado_eps',
    'Número de radicado': 'numero_de_radicado',
    'A dónde se radicó': 'a_donde_se_radico',
    'Quién radicó': 'quien_radico',
    'Respuesta de la EPS': 'respuesta_de_la_eps',
    'Código de respuesta EPS': 'codigo_respuesta_eps',
    'Fecha de respuesta EPS': 'fecha_de_respuesta_eps',
    'Número de incapacidad EPS': 'numero_de_incapacidad_eps',
    'Días pagos incapacidad': 'dias_pagos_incapacidad',
    'Valor incapacidad': 'valor_incapacidad',
    'Número de transacción EPS/ARL': 'numero_transaccion_eps_arl',
    'Transacción empresa usuaria': 'transaccion_empresa_usuaria',
    'Quién corresponde el pago final': 'quien_corresponde_el_pago_final',
    'Respuesta final incapacidad': 'respuesta_final_incapacidad'
  };
  getLabel(field: string): string {
    return Object.keys(this.fieldMap).find(key => this.fieldMap[key] === field) || field;
  }

  ColumnsTable1 = [
    'Tipo_de_documento',
    'Numero_de_documento',
    'consecutivoSistema',
    'numero_de_contrato',
    'nombre',
    'apellido',
    'Oficina',
    'celular_o_telefono_01',
    'celular_o_telefono_02',
    'correoElectronico',
    'Temporal',
    'Dias_temporal',
    'tipo_incapacidad',
    'codigo_diagnostico',
    'descripcion_diagnostico',
    'F_inicio',
    'F_final',
    'Fecha_de_Envio_Incapacidad_Fisica',
    'Incapacidad_transcrita',
    'centrodecosto',

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

    'nombre_de_quien_recibio',
    'nombre_doctor',
    'nombre_eps',

    'numero_de_documento_doctor',
    'numero_de_incapacidad',
    'observaciones',
    'prorroga',
    'responsable_de_envio',
    'sexo',
    'tipo_de_documento_doctor_atendido',
  ];

  columnTitlesTable1 = {
    'oficina': 'Oficina',
    'dias_temporal': 'Días Temporal',
    'f_inicio': 'Fecha de Inicio',
    'fecha_de_envio_incapacidad_fisica': 'Fecha de Envío Incapacidad Física',
    'incapacidad_transitada': 'Incapacidad Transitada',
    'numero_de_documento': 'Número de Documento',
    'temporal': 'Temporal',
    'tipo_de_documento': 'Tipo de Documento',
    'apellido': 'Apellido',
    'celular_o_telefono_01': 'Celular o Teléfono 01',
    'celular_o_telefono_02': 'Celular o Teléfono 02',
    'centro_de_costo': 'Centro de Costo',
    'codigo_diagnostico': 'Código Diagnóstico',
    'consecutivo_sistema': 'Consecutivo Sistema',
    'correo_electronico': 'Correo Electrónico',
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
    'marca_temporal': 'Marca Temporal',
    'nit_de_la_ips': 'NIT de la IPS',
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
  }

  logsColumnsTable1 = [
    'consecutivoSistema_id',
    'que_modifico',
    'nombre',
    'usuario',
    'rol',
    'fecha',

  ]

  logsTitlesTable1 = {
    'Consecutivo sistema': 'consecutivoSistema_id',
    'Que se modifico': 'que_modifico',
    'Nombre de la persona que modifico': 'nombre',
    'Usuario que modifico': 'usuario',
    'Rol de la persona que modifico': 'rol',
    'Fecha de modificacion': 'fecha',

  }

  dataSourcetable1 = new MatTableDataSource<any>();
  dataSourcetable2 = new MatTableDataSource<any>();
  overlayVisible = false;
  loaderVisible = false;
  counterVisible = false;
  reporteForm: FormGroup;
  cedula: string = '';
  query: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private incapacidadService: IncapacidadService,
    private router: Router,
  ) {
    // Configurar el formulario
    this.reporteForm = this.fb.group(this.generateFormGroupConfig());
  }

  ngOnInit(): void {

    this.query = this.route.snapshot.paramMap.get('cedula') || '';
    if (this.query) {
      this.cargarInformacion(true);
      this.loadData();
    } else {
      this.cargarInformacion(true);
      this.loadFromSessionStorage();
    }

    this.setupValueChangeSubscriptions();
  }

  generateFormGroupConfig(): { [key: string]: any } {

    const formGroupConfig: { [key: string]: any } = {};
    this.cargarInformacion(true);
    // Itera sobre las claves de fieldMap para configurar cada control de formulario
    Object.keys(this.fieldMap).forEach(label => {
      const formControlName = this.fieldMap[label];
      formGroupConfig[formControlName] = ['', Validators.required];
    });

    return formGroupConfig;
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

  loadData(): void {
    this.incapacidadService.traerDatosReporte(this.query).subscribe(
      response => {

        this.patchForm(response.data?.[0] || {});
        this.saveToSessionStorage();

      },
      error => {
        this.handleError(error);
        this.cargarInformacion(false);
      }
    );

    this.incapacidadService.traerDatosIncapacidad(this.query).subscribe(
      response => {
        this.dataSourcetable1.data = response.data || [];
        this.saveToSessionStorage();
      },
      error => {
        this.cargarInformacion(false);
        this.handleError(error);
      }
    );

    this.incapacidadService.traerDatosLogs(this.query).subscribe(
      response => {
        this.cargarInformacion(false);
        this.dataSourcetable2.data = response.data || [];
        this.saveToSessionStorage();
      },
      error => {
        this.cargarInformacion(false);
        this.handleError(error);
      }
    );
  }

  patchForm(data: any): void {
    Object.keys(this.fieldMap).forEach(label => {
      const formControlName = this.fieldMap[label];
      if (data.hasOwnProperty(formControlName)) {
        let value = data[formControlName];

        // Convertir a un objeto Date si es un campo de tipo fecha
        if (this.isDateField(formControlName) && value) {
          value = new Date(value); // Convertir el valor a un objeto Date
          if (isNaN(value.getTime())) {
            value = null; // Si la fecha no es válida, establecer como null
          }
        }

        // Asigna el valor al control de formulario
        this.reporteForm.get(formControlName)?.patchValue(value, { emitEvent: false });
      }
    });
  }

  formatDateToMMDDYYYY(date: any): string {
    // Intenta convertir a un objeto Date si no lo es ya
    const parsedDate = date instanceof Date ? date : new Date(date);

    // Validar si parsedDate es una fecha válida
    if (!parsedDate || isNaN(parsedDate.getTime())) {
      return '';  // Devolver cadena vacía si la fecha no es válida
    }

    const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = parsedDate.getDate().toString().padStart(2, '0');
    const year = parsedDate.getFullYear();

    return `${month}/${day}/${year}`;
  }
  isDateField(fieldName: string): boolean {
    const dateFields = [
      'confirmacion_fecha_de_radicacion',
      'fecha_de_recepcion_de_la_incapacidad',
      'fecha_revision_por_parte_de_incapacidades',
      'fecha_de_radicado_eps',
      'fecha_de_respuesta_eps'
    ];
    return dateFields.includes(fieldName);
  }
  setupValueChangeSubscriptions(): void {
    ['confirmacion_fecha_de_radicacion', 'fecha_de_respuesta_eps','fecha_de_radicado_eps', 'fecha_de_recepcion_de_la_incapacidad', 'fecha_revision_por_parte_de_incapacidades', 'fecha_de_radicado_eps', 'fecha_de_respuesta_eps']
      .forEach(field => {
        this.reporteForm.get(field)?.valueChanges.subscribe((value) => {
          if (value && !(value instanceof Date)) {
            const fechaFormateada = this.formatDateToMMDDYYYY(new Date(value));
            if (value) {
              this.reporteForm.get(field)?.setValue(value, { emitEvent: false });
            }
          }
        });
      });
  }

  saveToSessionStorage(): void {
    const dataToSave = {
      query: this.query,
      formData: this.reporteForm.value,
      dataTable1: this.dataSourcetable1.data,
      dataTable2: this.dataSourcetable2.data
    };
    sessionStorage.setItem('reporteData', JSON.stringify(dataToSave));
  }

  loadFromSessionStorage(): void {
    const savedData = sessionStorage.getItem('reporteData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      this.query = parsedData.query;
      this.reporteForm.patchValue(parsedData.formData);
      this.dataSourcetable1.data = parsedData.dataTable1;
      this.dataSourcetable2.data = parsedData.dataTable2;
    }
    this.cargarInformacion(false);
  }

  handleError(error: any): void {
    this.toggleLoader(false);
  }

  toggleLoader(visible: boolean, showCounter: boolean = false): void {
    this.loaderVisible = visible;
    this.counterVisible = showCounter;
  }

  onSubmit(): void {
    ['confirmacion_fecha_de_radicacion', 'fecha_de_respuesta_eps', 'fecha_de_radicado_eps', 'fecha_de_recepcion_de_la_incapacidad', 'fecha_revision_por_parte_de_incapacidades']
      .forEach(field => {
        const dateValue = this.reporteForm.get(field)?.value;
        if (dateValue) {
          // Convertir a una fecha válida si es un objeto Date
          const formattedDate = this.formatDateToMMDDYYYY(dateValue);
          this.reporteForm.get(field)?.setValue(formattedDate, { emitEvent: false });
        }
      });

    // Ahora que las fechas están formateadas, crea el objeto para enviar
    const nuevoReporte: Reporte = this.reporteForm.value;

    this.incapacidadService.createReporte(nuevoReporte).subscribe(
      response => {
        Swal.fire({
          icon: 'success',
          title: 'Reporte actualizado',
          text: 'El reporte ha sido modificado exitosamente',
        });
        this.reporteForm.reset();
        this.router.navigate(['/busqueda-incapacidades']);
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar el reporte',
          text: 'Ocurrió un error al actualizar el reporte, por favor intenta de nuevo.',
        });
      }
    );


  }
  a_donde_se_radicolista = ['Correo', 'Pagina', 'El Afiliado', 'Punto fisico'];
  quien_radico_lista = ['WENDY PIRAJAN', 'ALEJANDRA OVALLE', 'LIGIA HUERTAS'];
  respuesta_final_incapacidadlista = ['Pendiente','Finalizada'];
  quien_corresponde_el_pago_finallista = ['PAGADA', 'NEGADA', 'EMPLEADOR','NO ASUME EMPLEADOR'];
  quien_corresponde_pago = ['Empleador','EPS', 'ARL', 'No Pagar', 'NO CUMPLE CON EL TIEMPO'];
  estado_documento_incapacidadlista = ['TRASLADADA',
    'OK',
    'FALSA',
    'SIN EPICRISIS',
    'SIN INCAPACIDAD',
    'MEDICINA PREPAGADA',
    'ILEGIBLE',
    'INCONSISTENTE-,MAS DE 180 DIAS',
    'MAS DE 540 DIAS',
    'FECHAS INCONSISTENTES',
    'FALTA ORIGINAL',
    'FALTA FURAT',
    'FALTA SOAT'];
  getFieldType(field: string): string {
    const dateFields = ['Marca Temporal', 'Fecha_de_Envio_Incapacidad_Fisica', 'fecha_inicio_incapacidad'];
    const numberFields = ['Edad', 'dias_incapacidad', 'Dias_temporal', 'dias_eps', 'dias_de_diferencia'];
    if (field === 'Correo Electronico') {
      return 'email';
    } else if (dateFields.includes(field)) {
      return 'date';
    } else if (numberFields.includes(field)) {
      return 'number';
    } else if (['Sexo', 'Tipo de documento'].includes(field)) {
      return 'select';
    } else {
      return 'text';
    }
  }

  toTitleCase(text: string, columnTitles: { [key: string]: string }): string {
    if (!text) return '';

    if (columnTitles[text]) {
      return columnTitles[text];
    }

    return text
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

}
