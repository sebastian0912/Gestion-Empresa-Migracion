import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { catchError, filter } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { InfoCardComponent } from '../../components/info-card/info-card.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs';
import FileSaver from 'file-saver';

import { ContratacionService } from '../../services/contratacion/contratacion.service';
import { isPlatformBrowser, NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar-lateral',
  standalone: true,
  imports: [
    RouterLink,
    InfoCardComponent,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgIf
  ],
  templateUrl: './navbar-lateral.component.html',
  styleUrls: ['./navbar-lateral.component.css']
})
export class NavbarLateralComponent implements OnInit {
  overlayVisible = false;
  loaderVisible = false;
  counterVisible = false;

  currentRole: string = '';

  rolePermissions: any = {
    GERENCIA: ['home', 'solicitar-turno', 'atender-turno', 'estadisticas-turnero',
      'visualizar-turnos', 'forma-pago', 'desprendibles-pago', 'arl', 'ausentismos',
      'publicidad', 'vacantes', 'seleccion', 'contratacion', 'reporte-contratacion',
      'seguimiento-auditoria', 'estadisticas-auditoria'],
    RECEPCION: ['home', 'solicitar-turno', 'atender-turno',
      'visualizar-turnos', 'forma-pago', 'desprendibles-pago', 'ausentismos',
      'reporte-contratacion'],
    COORDINADOR: ['home',
      'forma-pago', 'desprendibles-pago', 'ausentismos',
      'reporte-contratacion',
      'seguimiento-auditoria'],
    JEFE_DE_AREA: ['home', 'atender-turno',
      'forma-pago', 'desprendibles-pago', 'ausentismos',
      'seguimiento-auditoria'],
    ADMIN: ['home', 'solicitar-turno', 'atender-turno', 'estadisticas-turnero',
      'visualizar-turnos', 'forma-pago', 'desprendibles-pago', 'arl', 'ausentismos',
      'publicidad', 'vacantes', 'seleccion', 'contratacion', 'reporte-contratacion',
      'seguimiento-auditoria'],
    TESORERIA: ['home', 'forma-pago', 'desprendibles-pago', 'ausentismos'],
    CAROL: ['home', 'forma-pago', 'desprendibles-pago', 'arl', 'ausentismos',
      'seguimiento-auditoria'],
  };

  empleadosProblemas: any[] = [];
  empleadosSinProblemas: any[] = [];

  public isMenuVisible = false;
  currentRoute: string | undefined;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private contratacionService: ContratacionService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.urlAfterRedirects;
    });
  }

  async ngOnInit(): Promise<void> {
    const user = await this.getUser();
    if (user && user.correo_electronico) {
      if (user.correo_electronico === "tuafiliacion@tsservicios.co") {
        this.currentRole = "CAROL";
      } else {
        this.currentRole = (user.rol || 'user').toUpperCase().replace(/-/g, '_');
      }
    } else {
      console.error('No user found in localStorage');
    }
  }

  toggleMenu(): void {
    this.isMenuVisible = !this.isMenuVisible;
  }

  async getUser(): Promise<any> {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  hasPermission(option: string): boolean {
    return this.rolePermissions[this.currentRole]?.includes(option) ?? false;
  }

  cerrarSesion(): void {
    localStorage.clear();
  }

  handleFile(file: File, action: string): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(reader.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });

      switch (action) {
        case 'arl':
          this.processArl(workbook);
          break;
      }



      // Reset the file input value to allow uploading the same file again
      (document.getElementById('fileInput2') as HTMLInputElement).value = '';
    };
    reader.readAsArrayBuffer(file);
  }

  selectFile(action: string): void {
    const fileInput = document.getElementById('fileInput2') as HTMLInputElement;
    fileInput.setAttribute('data-action', action);
    fileInput.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    const action = input.getAttribute('data-action');
    if (file && action) {
      this.handleFile(file, action);
    }
  }

  async processArl(workbook: XLSX.WorkBook): Promise<void> {
    Swal.fire({
      title: 'Cargando...',
      icon: 'info',
      text: 'Procesando archivo de arl. Por favor, espere unos segundos.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      // Procesar el archivo
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        range: 2,
        raw: true, // Leer los valores originales
        defval: ''
      });
      const rows: any[][] = data as any[][];

      // Convertir los campos 9 y 10 a fechas
      const formattedRows = rows.map(row => {
        if (row[9] && typeof row[9] === 'number') {
          row[9] = this.excelSerialToJSDate(row[9]);
        }
        if (row[10] && typeof row[10] === 'number') {
          row[10] = this.excelSerialToJSDate(row[10]);
        }
        return row;
      });

      await this.contratacionService.generarExcelArl(formattedRows)
        .then((response: any) => {
          console.log('Response:', response);
          // Exportar datos a Excel
          this.exportarDatosAExcel(response.resultados, response.cedulas_no_encontradas);

          // Cerrar Swal de carga y mostrar Swal de éxito
          Swal.close();
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Los empleados se han cargado correctamente en el sistema.',
            confirmButtonText: 'Aceptar'
          });
        })
        .catch((error) => {
          Swal.close();
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al procesar los datos. Por favor, inténtelo de nuevo.',
            confirmButtonText: 'Aceptar'
          });
        });

    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al procesar los datos. Por favor, inténtelo de nuevo.',
        confirmButtonText: 'Aceptar'
      });
    }
  }

  exportarDatosAExcel(datos: any[], cedulasNoEncontradas: any[]): void {
    const titulos = [
      "ARL", "ARL Fecha", "ARL_FECHA_INGRESO", "Fecha de ingreso Comparada", "Fecha de firma de contrato", "N° CC", "TEM", "Código", "Empresa Usuaria y Centro de Costo",
      "Tipo de Documento de Identidad", "Ingreso,(ing) No Ingres , Sin Confirmar, Cambio de contrato",
      "Cargo (Operario de... y/oficios varios)", "Fecha de Ingreso", "Descripción de la Obra / Motivo Temporada/// Cambia cada mes",
      "Salario S.M.M.L.V.", "Número de Identificación Trabajador", "Primer Apellido Trabajador",
      "Segundo Apellido Trabajador", "Primer Nombre Trabajador", "Segundo Nombre Trabajador",
      "Fecha de Nacimiento (DD/MM/AAAA) Trabajador", "Sexo (F - M) Trabajador", "Estado civil (SO-UL - CA-SE-VI) Trabajador",
      "Dirección de residencia Trabajador", "Barrio Trabajador", "Teléfono móvil Trabajador", "Correo electrónico E-mail Trabajador",
      "Ciudad de Residencia Trabajador", "Fecha Expedición CC Trabajador", "Municipio Expedición CC Trabajador",
      "Departamento Expedición CC Trabajador", "Lugar de Nacimiento Municipio Trabajador", "Lugar de Nacimiento Departamento Trabajador",
      "Rh Trabajador", "Zurdo/Diestro Trabajador", "EPS Trabajador", "AFP Trabajador", "AFC Trabajador",
      "Centro de costo Para el Carné Trabajador", "Persona que hace Contratación", "Edad Apropiada",
      "Escolaridad (1-11) Trabajador", "Técnico Trabajador", "Tecnólogo Trabajador", "Universidad Trabajador",
      "Especialización Trabajador", "Otros Trabajador", "Nombre Institución Trabajador", "Año de Finalización Trabajador",
      "Título Obtenido Trabajador", "Chaqueta Trabajador", "Pantalón Trabajador", "Camisa Trabajador",
      "Calzado Trabajador", "Familiar en caso de Emergencia", "Parentesco Emergencia", "Dirección Emergencia",
      "Barrio Emergencia", "Teléfono Emergencia", "Ocupación Emergencia", "Nombre Pareja", "Vive Si/No Pareja",
      "Ocupación Pareja", "Dirección Pareja", "Teléfono Pareja", "Barrio Pareja", "No de Hijos Dependientes",
      "Nombre Hijo 1", "Sexo Hijo 1", "Fecha Nacimiento Hijo 1", "No de Documento de Identidad Hijo 1",
      "Estudia o Trabaja Hijo 1", "Curso Hijo 1", "Nombre Hijo 2", "Sexo Hijo 2", "Fecha Nacimiento Hijo 2",
      "No de Documento de Identidad Hijo 2", "Estudia o trabaja Hijo 2", "Curso Hijo 2", "Nombre Hijo 3",
      "Sexo Hijo 3", "Fecha Nacimiento Hijo 3", "No de Documento de Identidad Hijo 3", "Estudia o trabaja Hijo 3",
      "Curso Hijo 3", "Nombre Hijo 4", "Sexo Hijo 4", "Fecha Nacimiento Hijo 4", "No de Documento de Identidad Hijo 4",
      "Estudia o trabaja Hijo 4", "Curso Hijo 4", "Nombre Hijo 5", "Sexo Hijo 5", "Fecha Nacimiento Hijo 5",
      "No de Documento de Identidad Hijo 5", "Estudia o trabaja Hijo 5", "Curso Hijo 5", "Nombre Hijo 6",
      "Sexo Hijo 6", "Fecha Nacimiento Hijo 6", "No de Documento de Identidad Hijo 6", "Estudia o trabaja Hijo 6",
      "Curso Hijo 6", "Nombre Hijo 7", "Sexo Hijo 7", "Fecha Nacimiento Hijo 7", "No de Documento de Identidad Hijo 7",
      "Estudia o trabaja Hijo 7", "Curso Hijo 7", "Nombre Padre", "Vive Si /No Padre", "Ocupación Padre",
      "Dirección Padre", "Teléfono Padre", "Barrio/Municipio Padre", "Nombre Madre", "Vive Si /No Madre",
      "Ocupación Madre", "Dirección Madre", "Teléfono Madre", "Barrio/Municipio Madre", "Nombre Referencia Personal 1",
      "Teléfono* Referencia Personal 1", "Ocupación Referencia Personal 1", "Nombre Referencia Personal 2",
      "Teléfono* Referencia Personal 2", "Ocupación Referencia Personal 2", "Nombre Referencia Familiar 1",
      "Teléfono* Referencia Familiar 1", "Ocupación Referencia Familiar 1", "Nombre Referencia Familiar 2",
      "Teléfono* Referencia Familiar 2", "Ocupación Referencia Familiar 2", "Nombre Empresa Experiencia Laboral 1",
      "Dirección Empresa Experiencia Laboral 1", "Teléfonos* (Obligatorio) Experiencia Laboral 1",
      "Nombre Jefe Inmediato Experiencia Laboral 1", "AREA DE EXPERIENCIA Experiencia Laboral 1",
      "Fecha de Retiro Experiencia Laboral 1", "Motivo Retiro Experiencia Laboral 1", "Nombre Empresa Experiencia Laboral 2",
      "Dirección Empresa Experiencia Laboral 2", "Teléfonos* Experiencia Laboral 2", "Nombre Jefe Inmediato Experiencia Laboral 2",
      "Cargo del Trabajador Experiencia Laboral 2", "Fecha de Retiro Experiencia Laboral 2", "Motivo Retiro Experiencia Laboral 2",
      "Nombre del Carnet", "Desea Plan Funerario", "Número Cuenta/Celular", "Número Tarjeta/ Tipo de Cuenta",
      "Clave para Asignar", "Examen Salud Ocupacional", "Apto para el Cargo? Sí o No", "EXAMEN DE SANGRE",
      "PLANILLA FUMIGACION", "Otros Examenes2 (Nombre)", "VACUNA COVID", "Nombre de la EPS afiliada",
      "EPS A TRASLADAR", "Nombre de AFP Afiliado 01", "AFP A TRASLADAR", "Afiliación Caja de compensación",
      "Nombre de AFP Afiliado 02", "Revisión de Fecha de Ingreso ARL",
      "Confirmación de los Ingresos Envío de correos a las Fincas a diario Confirmacion hasta las 12:30",
      "Fecha confirmación Ingreso a las Empresas Usuarias", "Afiliación enviada con fecha (Coomeva-Nueva Eps - Sura - S.O.S - Salud Vida -Compensar - Famisanar",
      "Revisión Personal Confirmado Empresas Usuarias VS Nómina los días 14 y los días 29 de cada Mes", "Referenciación Personal 1",
      "Referenciación Personal 2", "Referenciación Familiar 1", "Referenciación Familiar 2", "Referenciación Experiencia Laboral 1",
      "Referenciación Experiencia Laboral 2", "Revisión Registraduria (Fecha entrega CC )", "COMO SE ENTERO DEL EMPLEO",
      "Tiene Experiencia laboral ?", "Empresas de flores que ha trabajado (Separarlas con ,)", "¿En que area?",
      "Describa paso a paso como es su labora (ser lo más breve posible)", "Califique su rendimiento",
      "¿Por qué se da esta auto calificación?", "Hace cuanto vive en la zona", "Tipo de vivienda", "Con quien Vive",
      "Estudia Actualmente", "Personas a cargo", "Numero de hijos a cargo", "Quien los cuida?",
      "Como es su relación Familiar", "Según su Experiencia y desempeño laboral por que motivos lo han felicitado",
      "Ha tenido algún malentendido o situación conflictiva en algún trabajo, Si si en otro especificar por qué:",
      "Está dispuesto a realizar actividades diferentes al cargo:", "Mencione una experiencia significativa en su trabajo",
      "Que proyecto de vida tiene de aquí a 3 años", "La vivienda es:", "¿Cuál es su motivación?", "OBSERVACIONES"
    ];

    // Crear un array de objetos con los datos mapeados
    const datosMapeados = datos.map((dato: any) => {
      const mapeado: any = {
        "ARL": dato.ARL,
        "ARL Fecha": dato.ARL_FECHA,
        "ARL_FECHA_INGRESO": dato.ARL_FECHA_INGRESO,
        "Fecha de ingreso Comparada": dato.proceso_contratacion.fechaIngreso,
        "Fecha de firma de contrato": dato.proceso_contratacion.fecha_contratacion,
        "N° CC": dato.datos_generales.numerodeceduladepersona,
        "TEM": dato.proceso_contratacion.temporal,
        "Código": dato.proceso_contratacion.codigo_contrato,
        "Empresa Usuaria y Centro de Costo": dato.proceso_contratacion.centro_de_costos,
        "Tipo de Documento de Identidad": dato.proceso_contratacion.tipodocumento,
        "Ingreso,(ing) No Ingres , Sin Confirmar, Cambio de contrato": dato.proceso_contratacion.ingreso,
        "Cargo (Operario de... y/oficios varios)": dato.proceso_contratacion.cargo,
        "Fecha de Ingreso": dato.proceso_contratacion.fechaIngreso,
        "Descripción de la Obra / Motivo Temporada/// Cambia cada mes": dato.proceso_contratacion.descripcionLabor,
        "Salario S.M.M.L.V.": dato.proceso_contratacion.salarios,
        "Número de Identificación Trabajador": dato.datos_generales.numerodeceduladepersona,
        "Primer Apellido Trabajador": dato.datos_generales.primer_apellido,
        "Segundo Apellido Trabajador": dato.datos_generales.segundo_apellido,
        "Primer Nombre Trabajador": dato.datos_generales.primer_nombre,
        "Segundo Nombre Trabajador": dato.datos_generales.segundo_nombre,
        "Fecha de Nacimiento (DD/MM/AAAA) Trabajador": dato.datos_generales.fecha_nacimiento,
        "Sexo (F - M) Trabajador": dato.datos_generales.genero,
        "Estado civil (SO-UL - CA-SE-VI) Trabajador": dato.datos_generales.estado_civil,
        "Dirección de residencia Trabajador": dato.datos_generales.direccion_residencia,
        "Barrio Trabajador": dato.datos_generales.barrio,
        "Teléfono móvil Trabajador": dato.datos_generales.celular,
        "Correo electrónico E-mail Trabajador": dato.datos_generales.primercorreoelectronico,
        "Ciudad de Residencia Trabajador": dato.datos_generales.barrio,
        "Fecha Expedición CC Trabajador": dato.datos_generales.fecha_expedicion_cc,
        "Municipio Expedición CC Trabajador": dato.datos_generales.municipio_expedicion_cc,
        "Departamento Expedición CC Trabajador": dato.datos_generales.departamento_expedicion_cc,
        "Lugar de Nacimiento Municipio Trabajador": dato.datos_generales.lugar_nacimiento_municipio,
        "Lugar de Nacimiento Departamento Trabajador": dato.datos_generales.lugar_nacimiento_departamento,
        "Rh Trabajador": dato.datos_generales.rh,
        "Zurdo/Diestro Trabajador": dato.datos_generales.zurdo_diestro,
        "EPS Trabajador": dato.proceso_seleccion.eps,
        "AFP Trabajador": dato.proceso_seleccion.afp,
        "AFC Trabajador": dato.proceso_seleccion.afc,
        "Centro de costo Para el Carné Trabajador": dato.proceso_contratacion.centro_de_costos,
        "Persona que hace Contratación": dato.proceso_contratacion.persona_que_hace_contratacion,
        "Edad Apropiada": dato.datos_generales.edadTrabajador,
        "Escolaridad (1-11) Trabajador": dato.datos_generales.escolaridad,
        "Técnico Trabajador": dato.datos_generales.tecnico,
        "Tecnólogo Trabajador": dato.datos_generales.tecnologo,
        "Universidad Trabajador": dato.datos_generales.profesional,
        "Especialización Trabajador": dato.datos_generales.especializacion,
        "Otros Trabajador": dato.datos_generales.otros,
        "Nombre Institución Trabajador": dato.datos_generales.nombre_institucion,
        "Año de Finalización Trabajador": dato.datos_generales.ano_finalizacion,
        "Título Obtenido Trabajador": dato.datos_generales.titulo_obtenido,
        "Chaqueta Trabajador": dato.datos_generales.chaqueta,
        "Pantalón Trabajador": dato.datos_generales.pantalon,
        "Camisa Trabajador": dato.datos_generales.camisa,
        "Calzado Trabajador": dato.datos_generales.calzado,
        "Familiar en caso de Emergencia": dato.datos_generales.familiar_emergencia,
        "Parentesco Emergencia": dato.datos_generales.parentesco_familiar_emergencia,
        "Dirección Emergencia": dato.datos_generales.direccion_familiar_emergencia,
        "Barrio Emergencia": dato.datos_generales.barrio_familiar_emergencia,
        "Teléfono Emergencia": dato.datos_generales.telefono_familiar_emergencia,
        "Ocupación Emergencia": dato.datos_generales.ocupacion_familiar_emergencia,
        "Nombre Pareja": dato.datos_generales.nombre_conyugue,
        "Vive Si/No Pareja": dato.datos_generales.vive_con_el_conyugue,
        "Ocupación Pareja": dato.datos_generales.ocupacion_conyugue,
        "Dirección Pareja": dato.datos_generales.direccion_conyugue,
        "Teléfono Pareja": dato.datos_generales.telefono_conyugue,
        "Barrio Pareja": dato.datos_generales.barrio_municipio_conyugue,
        "No de Hijos Dependientes": dato.datos_generales.num_hijos_dependen_economicamente,
      };

      // Inicializar los campos de los hijos con valores por defecto
      for (let i = 1; i <= 7; i++) {
        mapeado[`Nombre Hijo ${i}`] = "-";
        mapeado[`Sexo Hijo ${i}`] = "-";
        mapeado[`Fecha Nacimiento Hijo ${i}`] = "-";
        mapeado[`No de Documento de Identidad Hijo ${i}`] = "-";
        mapeado[`Estudia o Trabaja Hijo ${i}`] = "-";
        mapeado[`Curso Hijo ${i}`] = "-";
      }

      // Sobrescribir los campos de los hijos si hay datos disponibles
      if (dato.datos_generales.hijos) {
        for (let i = 0; i < dato.datos_generales.hijos.length; i++) {
          const hijo = dato.datos_generales.hijos[i];
          mapeado[`Nombre Hijo ${i + 1}`] = hijo.nombre || "-";
          mapeado[`Sexo Hijo ${i + 1}`] = hijo.sexo || "-";
          mapeado[`Fecha Nacimiento Hijo ${i + 1}`] = hijo.fecha_nacimiento || "-";
          mapeado[`No de Documento de Identidad Hijo ${i + 1}`] = hijo.no_documento || "-";
          mapeado[`Estudia o Trabaja Hijo ${i + 1}`] = hijo.estudia_o_trabaja || "-";
          mapeado[`Curso Hijo ${i + 1}`] = hijo.curso || "-";
        }
      }

      // Continuar con el resto de los campos
      mapeado["Nombre Padre"] = dato.datos_generales.nombre_padre;
      mapeado["Vive Si /No Padre"] = dato.datos_generales.vive_padre;
      mapeado["Ocupación Padre"] = dato.datos_generales.ocupacion_padre;
      mapeado["Dirección Padre"] = dato.datos_generales.direccion_padre;
      mapeado["Teléfono Padre"] = dato.datos_generales.telefono_padre;
      mapeado["Barrio/Municipio Padre"] = dato.datos_generales.barrio_padre;
      mapeado["Nombre Madre"] = dato.datos_generales.nombre_madre;
      mapeado["Vive Si /No Madre"] = dato.datos_generales.vive_madre;
      mapeado["Ocupación Madre"] = dato.datos_generales.ocupacion_madre;
      mapeado["Dirección Madre"] = dato.datos_generales.direccion_madre;
      mapeado["Teléfono Madre"] = dato.datos_generales.telefono_madre;
      mapeado["Barrio/Municipio Madre"] = dato.datos_generales.barrio_madre;
      mapeado["Nombre Referencia Personal 1"] = dato.datos_generales.nombre_referencia_personal1;
      mapeado["Teléfono* Referencia Personal 1"] = dato.datos_generales.telefono_referencia_personal1;
      mapeado["Ocupación Referencia Personal 1"] = dato.datos_generales.ocupacion_referencia_personal1;
      mapeado["Nombre Referencia Personal 2"] = dato.datos_generales.nombre_referencia_personal2;
      mapeado["Teléfono* Referencia Personal 2"] = dato.datos_generales.telefono_referencia_personal2;
      mapeado["Ocupación Referencia Personal 2"] = dato.datos_generales.ocupacion_referencia_personal2;
      mapeado["Nombre Referencia Familiar 1"] = dato.datos_generales.nombre_referencia_familiar1;
      mapeado["Teléfono* Referencia Familiar 1"] = dato.datos_generales.telefono_referencia_familiar1;
      mapeado["Ocupación Referencia Familiar 1"] = dato.datos_generales.ocupacion_referencia_familiar1;
      mapeado["Nombre Referencia Familiar 2"] = dato.datos_generales.nombre_referencia_familiar2;
      mapeado["Teléfono* Referencia Familiar 2"] = dato.datos_generales.telefono_referencia_familiar2;
      mapeado["Ocupación Referencia Familiar 2"] = dato.datos_generales.ocupacion_referencia_familiar2;
      mapeado["Nombre Empresa Experiencia Laboral 1"] = dato.datos_generales.nombre_expe_laboral1_empresa;
      mapeado["Dirección Empresa Experiencia Laboral 1"] = dato.datos_generales.direccion_empresa1;
      mapeado["Teléfonos* (Obligatorio) Experiencia Laboral 1"] = dato.datos_generales.telefonos_empresa1;
      mapeado["Nombre Jefe Inmediato Experiencia Laboral 1"] = dato.datos_generales.nombre_jefe_empresa1;
      mapeado["AREA DE EXPERIENCIA Experiencia Laboral 1"] = dato.datos_generales.cargo_empresa1;
      mapeado["Fecha de Retiro Experiencia Laboral 1"] = dato.datos_generales.fecha_retiro_empresa1;
      mapeado["Motivo Retiro Experiencia Laboral 1"] = dato.datos_generales.motivo_retiro_empresa1;
      mapeado["Nombre Empresa Experiencia Laboral 2"] = dato.datos_generales.nombre_expe_laboral2_empresa;
      mapeado["Dirección Empresa Experiencia Laboral 2"] = dato.datos_generales.direccion_empresa2;
      mapeado["Teléfonos* Experiencia Laboral 2"] = dato.datos_generales.telefonos_empresa2;
      mapeado["Nombre Jefe Inmediato Experiencia Laboral 2"] = dato.datos_generales.nombre_jefe_empresa2;
      mapeado["Cargo del Trabajador Experiencia Laboral 2"] = dato.datos_generales.cargo_empresa2;
      mapeado["Fecha de Retiro Experiencia Laboral 2"] = dato.datos_generales.fecha_retiro_empresa2;
      mapeado["Motivo Retiro Experiencia Laboral 2"] = dato.datos_generales.motivo_retiro_empresa2;
      mapeado["Nombre del Carnet"] = dato.proceso_contratacion.nombreCarnet;
      mapeado["Desea Plan Funerario"] = dato.proceso_contratacion.planfunerario;
      mapeado["Número Cuenta/Celular"] = dato.proceso_contratacion.numeroCuenta_celular;
      mapeado["Número Tarjeta/ Tipo de Cuenta"] = dato.proceso_contratacion.numeroTarjeta_tipo;
      mapeado["Clave para Asignar"] = dato.proceso_contratacion.clave_asignada;
      mapeado["Examen Salud Ocupacional"] = dato.proceso_seleccion.examen_salud_ocupacional;
      mapeado["Apto para el Cargo? Sí o No"] = dato.proceso_seleccion.apto_cargo;
      mapeado["EXAMEN DE SANGRE"] = dato.proceso_seleccion.examen_sangre;
      mapeado["PLANILLA FUMIGACION"] = dato.proceso_seleccion.planilla_fumigacion;
      mapeado["Otros Examenes2 (Nombre)"] = dato.proceso_seleccion.otros_examenes2;
      mapeado["VACUNA COVID"] = dato.proceso_seleccion.vacuna_covid;
      mapeado["Nombre de la EPS afiliada"] = dato.proceso_contratacion.nombre_eps_afiliada;
      mapeado["EPS A TRASLADAR"] = dato.proceso_contratacion.eps_a_trasladar;
      mapeado["Nombre de AFP Afiliado 01"] = dato.proceso_contratacion.nombre_afp;
      mapeado["AFP A TRASLADAR"] = dato.proceso_contratacion.afp_trasladar;
      mapeado["Afiliación Caja de compensación"] = dato.proceso_contratacion.afiliacion_caja_compensacion;
      mapeado["Nombre de AFP Afiliado 02"] = dato.proceso_seleccion.nombre_afp2;
      mapeado["Revisión de Fecha de Ingreso ARL"] = dato.proceso_contratacion.revision_arl;
      mapeado["Confirmación de los Ingresos Envío de correos a las Fincas a diario Confirmacion hasta las 12:30"] = dato.proceso_contratacion.confirmacion_ingreso_correo;
      mapeado["Fecha confirmación Ingreso a las Empresas Usuarias"] = dato.proceso_contratacion.fecha_confirmacion_correo;
      mapeado["Afiliación enviada con fecha (Coomeva-Nueva Eps - Sura - S.O.S - Salud Vida -Compensar - Famisanar"] = dato.proceso_contratacion.afiliacion_enviada;
      mapeado["Revisión Personal Confirmado Empresas Usuarias VS Nómina los días 14 y los días 29 de cada Mes"] = dato.proceso_contratacion.revision_personal;
      mapeado["Referenciación Personal 1"] = dato.datos_generales.referenciacionPersonal1;
      mapeado["Referenciación Personal 2"] = dato.datos_generales.referenciacionPersonal2;
      mapeado["Referenciación Familiar 1"] = dato.datos_generales.referenciacionFamiliar1;
      mapeado["Referenciación Familiar 2"] = dato.datos_generales.referenciacionFamiliar2;
      mapeado["Referenciación Experiencia Laboral 1"] = dato.datos_generales.referenciacionLaboral1;
      mapeado["Referenciación Experiencia Laboral 2"] = dato.datos_generales.referenciacionLaboral2;
      mapeado["Revisión Registraduria (Fecha entrega CC )"] = dato.datos_generales.registroRegistraduria;
      mapeado["COMO SE ENTERO DEL EMPLEO"] = dato.datos_generales.como_se_entero;
      mapeado["Tiene Experiencia laboral ?"] = dato.datos_generales.tiene_experiencia_laboral;
      mapeado["Empresas de flores que ha trabajado (Separarlas con ,)"] = dato.datos_generales.empresas_laborado;
      mapeado["¿En que area?"] = dato.datos_generales.area_experiencia;
      mapeado["Describa paso a paso como es su labora (ser lo más breve posible)"] = dato.datos_generales.labores_realizadas;
      mapeado["Califique su rendimiento"] = dato.datos_generales.rendimiento_laboral;
      mapeado["¿Por qué se da esta auto calificación?"] = dato.datos_generales.porqueRendimiento;
      mapeado["Hace cuanto vive en la zona"] = dato.datos_generales.hacecuantoviveenlazona;
      mapeado["Tipo de vivienda"] = dato.datos_generales.tipo_vivienda;
      mapeado["Con quien Vive"] = dato.datos_generales.personas_con_quien_convive;
      mapeado["Estudia Actualmente"] = dato.datos_generales.estudia_actualmente;
      mapeado["Personas a cargo"] = dato.datos_generales.personas_a_cargo;
      mapeado["Numero de hijosacargo"] = dato.datos_generales.num_hijos_dependen_economicamente;
      mapeado["Quien los cuida?"] = dato.datos_generales.quien_los_cuida;
      mapeado["Como es su relación Familiar"] = dato.datos_generales.como_es_su_relacion_familiar;
      mapeado["Según su Experiencia y desempeño laboral por que motivos lo han felicitado"] = dato.datos_generales.porqueLofelicitarian;
      mapeado["Ha tenido algún malentendido o situación conflictiva en algún trabajo, Si si en otro especificar por qué:"] = dato.datos_generales.malentendido;
      mapeado["Está dispuesto a realizar actividades diferentes al cargo:"] = dato.datos_generales.actividadesDi;
      mapeado["Mencione una experiencia significativa en su trabajo"] = dato.datos_generales.experienciaSignificativa;
      mapeado["Que proyecto de vida tiene de aquí a 3 años"] = dato.datos_generales.expectativas_de_vida;
      mapeado["La vivienda es:"] = dato.datos_generales.tipo_vivienda_2p;
      mapeado["¿Cuál es su motivación?"] = dato.datos_generales.motivacion;
      mapeado["OBSERVACIONES"] = dato.datos_generales.observaciones;

      return mapeado;
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Datos');

    worksheet.columns = titulos.map(titulo => ({ header: titulo, key: titulo, width: 20 }));

    datosMapeados.forEach(dato => {
      const row = worksheet.addRow(dato);

      if (dato["ARL"] === 'SATISFACTORIO') {
        row.getCell('ARL').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '00FF00' } // Verde
        };
      }
      else if (dato["ARL"] === 'ALERTA') {
        row.getCell('ARL').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF0000' } // Rojo
        };
      }

      if (dato["ARL Fecha"] === 'SATISFACTORIO') {
        row.getCell('ARL Fecha').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '00FF00' } // Verde
        };
      }
      else if (dato["ARL Fecha"] === 'ALERTA') {
        row.getCell('ARL Fecha').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF0000' } // Rojo
        };
      }
    });

    const cedulasWorksheet = workbook.addWorksheet('Cédulas No Encontradas');
    cedulasWorksheet.columns = [{ header: 'Cédula', key: 'cedula', width: 20 }];
    cedulasNoEncontradas.forEach(cedula => {
      cedulasWorksheet.addRow({ cedula });
    });

    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, 'ReporteARL.xlsx');
    });
  }

  excelSerialToJSDate(serial: number): string {
    const utc_days = Math.floor(serial - 25569);
    const date = new Date(utc_days * 86400 * 1000);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  }


}
