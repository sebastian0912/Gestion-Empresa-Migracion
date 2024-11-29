import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { NavbarLateralComponent } from '../../components/navbar-lateral/navbar-lateral.component';
import { NavbarSuperiorComponent } from '../../components/navbar-superior/navbar-superior.component';
import { InfoCardComponent } from '../../components/info-card/info-card.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MatNativeDateModule } from '@angular/material/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import jsPDF from 'jspdf';
import 'jspdf-autotable';    // Importar la extensión para tablas
import html2canvas from 'html2canvas';
import AutoTableDrawPageData from "jspdf-autotable";
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { NgIf, NgFor, NgSwitch } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { ContratacionService } from '../../services/contratacion/contratacion.service';
import { differenceInSeconds, format } from 'date-fns';
import { MatGridListModule } from '@angular/material/grid-list';  // Importa MatGridListModule
import { MatListModule } from '@angular/material/list'; // Módulo de MatList
import { SignaturePadModule } from '../signature-pad/signature-pad.module'; // Importa el componente standalone
import e from 'express';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';


declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => void;
  }
}

@Component({
  selector: 'app-documentos-contratacion',
  standalone: true,

  imports: [NavbarLateralComponent,
    NavbarSuperiorComponent,
    SignaturePadModule,
    MatSnackBarModule,
    NgxExtendedPdfViewerModule,
    MatDividerModule,
    InfoCardComponent,
    MatTableModule,
    MatMenuModule,
    MatGridListModule  ,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    CommonModule,
    MatButtonModule,

    MatDatepickerModule,
    MatListModule ,
    MatIconModule,
    FormsModule,
    MatCardModule,
    NgSwitch,
    NgIf,
    NgFor,
    ReactiveFormsModule,
  ],
  templateUrl: './documentos-contratacion.component.html',
  styleUrl: './documentos-contratacion.component.css'
})
export class DocumentosContratacionComponent implements OnInit {


  @ViewChild('signaturePad') signaturePad: any;
  fichaTecnicaForm: FormGroup;
  contratoForm: FormGroup;
  HojaVidaForm: FormGroup;
  entregaDeDocumentosForm: FormGroup;
  pruebaLecturaForm: FormGroup;
  pruebaSSTForm: FormGroup;
  autorizacionDatosForm: FormGroup;
  trasladosForm: FormGroup;
  iscontratocomplete = false;
  isfichacomplete = false;
  isEntregaDocumentosComplete = false;
  isHojaVidaComplete = false;
  isPruebaLecturaComplete = true;
  isPruebaSSTComplete = true;
  isAutorizacionDatosComplete = false;
  isTrasladosComplete = false;
  counterVisible = false;
  loaderVisible = false;
  fingerprintCaptured: boolean = false;
  signaturePadOptions: Object = {
    minWidth: 2,
    canvasWidth: 500,
    canvasHeight: 200
  };

  FieldsfichaTecnica = [
    'primerApellido',
    'segundoApellido',
    'nombres',
    'numerodeIdentificacion',
    'fechaExpedicionylugardeexpedicion',
    'fechaNacimientoylugardenacimiento',
    'direccion',
    'municipioBarrio',
    'celular',
    'diestroZurdo',
    'rh',
    'estadoCivil',
    'numerodehijos',
    'correoelectronico',
    'eps',
    'afp',
    'afc',
    'cajaCompensacion',
    'planFunerario',

    'gradoEscolaridad',
    'isTecnologo',
    'isUniversidad',
    'isEspecializacion',
    'isOtros',
    'institucion',
    'anoFinalizacion',
    'tituloObtenido',

    'nombreapellidoPadre',
    'direccionPadre',
    'vivepadre',
    'ocupacionPadre',
    'telefonoPadre',
    'barrioMunicipioPadre',
    'nombreapellidoMadre',
    'direccionMadre',
    'viveMadre',
    'ocupacionMadre',
    'telefonoMadre',
    'barrioMunicipioMadre',
    'nombreapellidoConyuge',
    'direccionConyuge',
    'viveConyuge',
    'ocupacionConyuge',
    'telefonoConyuge',

    'apellidosynombresHijos1',
    'fechaNacimientoHijos1',
    'numerodeIdentificacionHijos1',
    'sexoHijo1',
    'edadHijo1',
    'estudiaTrabajaHijo1',
    'cursoHijo1',
    'apellidosynombresHijos2',
    'fechaNacimientoHijos2',
    'numerodeIdentificacionHijos2',
    'sexoHijo2',
    'edadHijo2',
    'estudiaTrabajaHijo2',
    'cursoHijo2',
    'apellidosynombresHijos3',
    'fechaNacimientoHijos3',
    'numerodeIdentificacionHijos3',
    'sexoHijo3',
    'edadHijo3',
    'estudiaTrabajaHijo3',
    'cursoHijo3',
    'apellidosynombresHijos4',
    'fechaNacimientoHijos4',
    'numerodeIdentificacionHijos4',
    'sexoHijo4',
    'edadHijo4',
    'estudiaTrabajaHijo4',
    'cursoHijo4',
    'apellidosynombresHijos5',
    'fechaNacimientoHijos5',
    'numerodeIdentificacionHijos5',
    'sexoHijo5',
    'edadHijo5',
    'estudiaTrabajaHijo5',
    'cursoHijo5',
    'apellidosynombresHijos6',
    'fechaNacimientoHijos6',
    'numerodeIdentificacionHijos6',
    'sexoHijo6',
    'edadHijo6',
    'estudiaTrabajaHijo6',
    'cursoHijo6',
    'tallachaqueta',
    'tallaPantalon',
    'tallaOverol',
    'noCalzado',
    'noBotasCuacho',
    'noZapatones',
    'noBotasMaterial',
    'nombreEmpresa1',
    'direccionEmpresa1',
    'telefonoEmpresa1',
    'jefeInmediato1',
    'cargoJefeInmediato1',
    'fechaRetiro1',
    'nombreEmpresa2',
    'direccionEmpresa2',
    'telefonoEmpresa2',
    'jefeInmediato2',
    'cargoJefeInmediato2',
    'fechaRetiro2',
  ]
  fieldsContrato: { [key: string]: string } = {
    representadoPor: 'Representado por',
    NombredelTrabajador: 'Nombre del Trabajador',
    fechaDeNacimiento: 'Fecha de Nacimiento',
    domicilioDelTrabajador: 'Domicilio del Trabajador',
    fechaDeInciacion: 'Fecha de Iniciación',
    salarioMensualOrdinario: 'Salario Mensual Ordinario',
    periodoDePagoSalario: 'Periodo de Pago Salario',
    subsidioDeTransporte: 'Subsidio de Transporte',
    formaDePago: 'Forma de Pago',
    nombreEmpresaUsuarioa: 'Nombre Empresa Usuaria',
    cargo:'Cargo',
    descripciondelaObraMotivotemporal: 'Descripción de la Obra/ Motivo temporal',
    domicilioDelPatrono: 'Domicilio del Patrono',
    TipoYNoidentificacion: 'Tipo y No. identificación',
    correoelectronico: 'Correo electrónico',

    diadeTestigosContrato: 'Día de Testigos Contrato',
    firmaDelTrabajador: 'Firma del Trabajador',
    numeroDeidentificacionTrabajador: 'Número de identificación trabajador',
    testigo1NombreYcedula: 'Testigo 1 Nombre y cédula',
    firmaTestigo1: 'Firma Testigo 1',
    firmaTestigo2: 'Firma Testigo 2',
    testigo2NombreYcedula: 'Testigo 2 Nombre y cédula',
  };
  fieldEntregaDocumento: { [key: string]: string } = {
    descuentoCasino: 'Descuento Casino',
    formadepago: 'Forma de pago',
    numerodecuenta: 'Número de cuenta o celular',
    codigoTarjeta: 'Código Tarjeta',
    aceptoCambioSinPrevioAviso: 'Acepto Cambio Sin Previo Aviso',
    planFuneral: 'Plan Funeral',
    FirmadeAceptacion: 'Firma de Aceptación',
    numeroDeIndentificacion: 'Número de Identificación',
    fechadeRecibido: 'Fecha de Recibido',
    firmadeResponsabledeSocializacion: 'Firma de Responsable de Socialización',
    nombreDeResponsable: 'Nombre de Responsable',
    huellaIndiceDerecho: 'Huella Indice Derecho',
    huellaPulgarDerecho: 'Huella Pulgar Derecho',
  }
  codigopagina: string = '';
  descuentoCasinoOptions: string[] = ['Si', 'No'];
  fieldTratamientoDatos: { [key: string]: string } = {
    firmaDeAutorizacion: 'Firma de Autorización',
    numerodeidentificacion: 'Número de identificación',
    fechadeAutorizacion: 'Fecha de Autorización',
  }
  fieldHojaDeVida: { [key: string]: string } = {
    EmpleoCargoAlQueAspira: 'Empleo/Cargo al que Aspira',
    //informacion general
    apellidoDelAspirante: 'Apellido del Aspirante',
    nombreDelAspirante: 'Nombre del Aspirante',
    fechadeNacimiento: 'Fecha de Nacimiento',
    lugarDeNacimiento: 'Lugar de Nacimiento',
    direccionDeDomicilio: 'Dirección de Domicilio',
    barrio: 'Barrio',
    ciudad: 'Ciudad',
    correoElectronico: 'Correo Electrónico',
    nacionalidad: 'Nacionalidad',
    profesionOcupacion: 'Profesión/Ocupación',
    estadoCivil: 'Estado Civil',
    anosDeExperiencia: 'Años de Experiencia',
    tipoDeDocumento: 'Tipo de Documento',
    numeroDeDocumento: 'Número de Documento',
    expedidoEn: 'Expedido en',
    tieneVehiculo: 'Tiene Vehículo',

    //informacion laboral
    estidiosRealizados: 'Estudios Realizados',
    experioenciaLaboral: 'Experiencia Laboral',
    habilidadesQuePosee: 'Habilidades que Posee',

    //informacion personal
    estaTrabajandoActualmente: 'Está Trabajando Actualmente',
    enQueEmpresa: 'En qué Empresa',
    empleadoOIdependiente: 'Empleado o Independiente',
    tipoDeContrato: 'Tipo de Contrato',
    trabajoAntesenEstaEmpresa: 'Trabajó antes en esta Empresa?',

    solicitoEmplesoAntesEnEstaEmpresa: 'Solicitó Empleo antes en esta Empresa?',
    fechadeSolicitud: 'Fecha de Solicitud',
    conoceAlguienEnLaEmpresa: 'Conoce a alguien en la Empresa?',
    nombreDeLaPersona: 'Nombre de la Persona',
    dependenciaDeLaEmpresa: 'Dependencia de la Empresa',
    tienePareienesTrabajandoEnLaEmpresa: 'Tiene Parientes Trabajando en la Empresa?',
    nombreDelPariente: 'Nombre del Pariente',
    parentescodelPariente: 'Parentesco',
    comoTuvoConocimientoDeLaVacante: 'Cómo tuvo Conocimiento de la Vacante?',
    aceptariaTrabajarEnOtraCiudad: 'Aceptaría Trabajar en Otra Ciudad?',
    viveEncasa: 'Vive en Casa',
    nombredelarendador: 'Nombre del Arrendador',
    telefonoDelArrendador: 'Teléfono del Arrendador',
    haceCuantotiempoRecideenEsteLugar: 'Hace Cuanto tiempo Reside en Este Lugar?',
    actualmenteTieneUnIngresoAdicional: 'Actualmente Tiene un Ingreso Adicional?',
    describaloeIndiqueElValor: 'Describalo e Indique el Valor',
    cuantoSumanSusObligacionesMensuales: 'Cuanto Suma sus Obligaciones Mensuales?',
    porQueConceptos: 'Por qué Conceptos?',
    cuantoessiAspiracionSalarial: 'Cuánto es su Aspiración Salarial?',
    cualessiPrincipalAficion: 'Cuál es su Principal Afición?',
    practicaAlgunDeporte: 'Practica algún Deporte?',
    cualDeporte: 'Cuál Deporte?',
    algunasveceshaObtenidoDistincionesoReconomientos: 'Algunas veces ha Obtenido Distinciones o Reconocimientos?',
    cuales: 'Cuáles?',
    //informacionFamiliar
    nombreEsposaOcompalnera: 'Nombre Esposa o Compañera',
    profesionOcupacionuOficio: 'Profesión/Ocupación u Oficio',
    empresadodnetrabaja: 'Empresa donde Trabaja',
    cargoActual: 'Cargo Actual',
    direccionDeCompanera: 'Dirección',
    telefonoDeCompanera: 'Teléfono',
    ciudaddeCompanera: 'Ciudad',
    numerodepersonasquedepenbdendeusted: 'Número de Personas que Dependen de Usted',
    parentescoDeLasPersonas: 'Parentesco',
    edadesDeLasPersonas: 'Edades',

    nombreDelPadre: 'Nombre del Padre',
    profesionOcupacionPadre: 'Profesión/Ocupación',
    telefonosDelPadre: 'Teléfonos',
    nombreDelamadre: 'Nombre de la Madre',
    profesionOcupacionMadre: 'Profesión/Ocupación',
    telefonosDeLaMadre: 'Teléfonos',
    nombresHermanos: 'Nombres de Hermanos',
    profesionOcupacionHermanos: 'Profesión/Ocupación',
    telefonosHermanos: 'Teléfonos',

    //educacionyaptitudes
    estudios1:' Estudio 1',
    anoDeFinalizacion1:'Año de finalizacion del estudio 1',
    tituloObtenido1:'Título Obtenido 1',
    nombredelaInstitucion1:'Nombre de la Institución 1',
    ciudadEstudio1: 'Ciudad estudio 1',
    estudios2: 'Estudio 2',
    anoDeFinalizacion2: 'Año de finalizacion del estudio 2',
    tituloObtenido2: 'Título Obtenido 2',
    nombredelaInstitucion2: 'Nombre de la Institución 2',
    ciudadEstudio2: 'Ciudad estudio 2',
    estudios3: 'Estudio 3',
    anoDeFinalizacion3: 'Año de finalizacion del estudio 3',
    tituloObtenido3: 'Título Obtenido 3',
    nombredelaInstitucion3: 'Nombre de la Institución 3',
    ciudadEstudio3: 'Ciudad estudio 3',
    cursaCursosActualmente: 'Cursa Cursos Actualmente',
    queTipoDeEstudios: 'Qué Tipo de Estudios?',
    duracionDeestudios: 'Duración de Estudios',
    anosemestrequecursa: 'Año/Semestre que Cursa',
    nombredelaInstitucionextra: 'Nombre de la Institución',
    sistemasQueDomina: 'Sistemas que Domina',
    programasQueDomina: 'Programas que Domina',
    calificacionProgramas: 'Calificación programas',
    idiomasQueHabla: 'Idiomas que Habla',
    idiomasQueEscribe: 'Idiomas que Escribe',
    calificacionIdiomas: 'Calificación Idiomas',

    // experiencia laboral
    nombredeLaUltimaEmpresa: 'Nombre de la Última Empresa',
    actividadEconomicaUltimaEmpresa: 'Actividad Económica',
    direccionEmpresaUltimaEmpresa: 'Dirección Empresa',
    telefonoEmpresaUltimaEmpresa: 'Teléfono Empresa',
    cargoDesempenadoUltimaEmpresa: 'Cargo Desempeñado',
    areaDelCargoUltimaEmpresa: 'Área del Cargo',
    fechadeingresoUltimaEmpresa: 'Fecha de Ingreso',
    fechadeRetiroUltimaEmpresa: 'Fecha de Retiro',
    sueldoIncialUltimaEmpresa: 'Sueldo Inicial',
    sueldoFinalUltimaEmpresa: 'Sueldo Final',
    funcionesRealizadasUltimaEmpresa: 'Funciones Realizadas',
    nombredeSuJefeInmediatoUltimaEmpresa: 'Nombre de su Jefe Inmediato',
    cargoJefeInmediatoUltimaEmpresa: 'Cargo Jefe Inmediato',
    logrosObtenidosUltimaEmpresa: 'Logros Obtenidos',
    tipoDeContratoEmpresaUltimaEmpresa: 'Tipo de Contrato',
    horarioDeTrabajoUltimaEmpresa: 'Horario de Trabajo',
    motivoRetiroUltimaEmpresa: 'Motivo Retiro',
    nombreDeLaEmpresaAnterior: 'Nombre de la Empresa Anterior',
    actividadEconomicaAnterior: 'Actividad Económica',
    direccionEmpresaAnterior: 'Dirección Empresa',
    telefonoEmpresaAnterior: 'Teléfono Empresa',
    cargodesempenadoAnterior: 'Cargo Desempeñado',
    areaDelCargoAnterior: 'Área del Cargo',
    fechadeingresoAnterior: 'Fecha de Ingreso',
    fechadeRetiroAnterior: 'Fecha de Retiro',
    sueldoIncialAnterior: 'Sueldo Inicial',
    sueldoFinalAnterior: 'Sueldo Final',
    funcionesRealizadasAnterior: 'Funciones Realizadas',
    nombredeSuJefeInmediatoAnterior: 'Nombre de su Jefe Inmediato',
    cargoJefeInmediatoAnterior: 'Cargo Jefe Inmediato',
    logrosObtenidosAnterior: 'Logros Obtenidos',
    tipoDeContratoEmpresaAnterior: 'Tipo de Contrato',
    horarioDeTrabajoAnterior: 'Horario de Trabajo',
    motivoRetiroAnterior: 'Motivo Retiro',

    //referencias personales
    nombreReferencia1: 'Nombre Referencia 1',
    ocupacionReferencia1: 'Ocupación Referencia 1',
    telefonoReferencia1: 'Teléfono Referencia 1',
    direccionReferencia1: 'Dirección Referencia 1',
    nombreReferencia2: 'Nombre Referencia 2',
    ocupacionReferencia2: 'Ocupación Referencia 2',
    telefonoReferencia2: 'Teléfono Referencia 2',
    autorizoPedirInformacionDeMiHojaDeVida: 'Autorizo Pedir Información de mi Hoja de Vida sin ninguna restriccion',
    firmaSolicitante: 'Firma Solicitante',
  }

  fieldMapFichaTecnica: { [key: string]: string } = {
    codigo: 'Código',
    fechadeemicion: 'Fecha de emisión',
    oficina: 'Oficina',
    codigoContrato: 'Código de contrato',
    //informacion basica
    primerApellido: 'Primer Apellido',
    segundoApellido: 'Segundo Apellido',
    nombres: 'Nombres',
    tipodeidenticicacion: 'Tipo de identificación',
    numerodeIdentificacion: 'Número de identificación',
    fechaExpedicion: 'Fecha de expedición',
    departamentoExpedicion: 'Departamento de expedición',
    municipioExpedicion: 'Municipio de expedición',
    genero: 'Género',
    fechaNacimiento: 'Fecha de nacimiento',
    departamentoDeNacimiento: 'Departamento de nacimiento',
    municipioDeNacimiento: 'Municipio de nacimiento',
    estadoCivil: 'Estado civil',
    direccion: 'Dirección de Domicilio',
    barrio: 'Barrio',
    ciudadDominicilio: 'Ciudad de domicilio',
    departamentoDomicilio: 'Departamento de domicilio',
    celular: 'Celular',
    peso: 'Peso',
    diestroZurdo: 'Diestro o zurdo',
    rh: 'RH',
    correoelectronico: 'Correo electrónico',
    sisbenestrato: 'Sisben estrato',
    // informacion laboral
    empresagrupoelite: 'Empresa Grupo Elite',
    codigoCompania: 'Código Compañía',
    fechadeIngreso: 'Fecha de Ingreso',
    sueldoBasico: 'Sueldo Básico',
    sucursal: 'Sucursal',
    centrodeCosto: 'Centro de Costo',
    subCentrodeCosto: 'Sub Centro de Costo',
    salarioIntegral: 'Salario Integral',
    paradero: 'Paradero',
    usaRuta: 'Usa Ruta',
    nombredelaRuta: 'Nombre de la Ruta',
    tipoVinculacion: 'Tipo de Vinculación',
    auxilioTransporte: 'Auxilio de Transporte',
    valorAuxilioTransporte: 'Valor Auxilio de Transporte',
    CiudadLabor: 'Ciudad Labor',
    clasificador2Categoria: 'Clasificador 2 Categoría',
    clasificador3Operacion: 'Clasificador 3 Operacion',
    clasificador4Sublador: 'Clasificador 4 Sublador',
    clasificador2empresaTemporal: 'Clasificador 2 Empresa Temporal',
    clasificador6grupo: 'Clasificador 6 Grupo',
    clasificador7Subempresafactura: 'Clasificador 7 Subempresa Factura',
    grupoForaneo: 'Grupo Foraneo',
    jefeInmediato: 'Jefe Inmediato',
    horasExtras: 'Horas Extras',
    soloHorasDominicales: 'Solo Horas Dominicales',
    soloHorasFestivas: 'Solo Horas Festivas',
    solorRecargoNocturnos: 'Solo Recargo Nocturnos',
    tipoContrato: 'Tipo de Contrato',
    duracionContrato: 'Duración de Contrato',
    franjaVerde: 'Franja Verde',
    banco: 'Banco',
    cuenta: 'Cuenta',
    beneficioCacninoFumigacion: 'Beneficio Canino Fumigación',
    //informacion salud y prestaciones
    eps: 'EPS',
    afp: 'A.F.P (Pension)',
    afc: 'A.F.C (Cesantías)',
    cajaCompensacion: 'Caja de Compensación familiar',
    administradoreReisgosLaborales: 'Administrador de Riesgos Laborales',
    porcentajeARL: 'Porcentaje ARL',
    pensionado: 'Pensionado',
    numeroderesolucion: 'Número de resolución',
    numerodesemanasCotizadas: 'Número de semanas cotizadas',

    //informacion de requerida para el ingreso
    cargoNuevo: 'Cargo Nuevo',
    codigoQueReemplaza: 'Código que reemplaza',

    //informacuion contactode emergencia
    apellidosYnombresEmergencia: 'Apellidos y Nombres',
    numerodeContactoEmergencia: 'Número de contacto',
    //informacion academica
    gradoEscolaridad: 'Grado de escolaridad',
    tituloObtenido: 'Título obtenido',
    institucion: 'Institución',
    anoFinalizacion: 'Año de finalización',
    // informacion familiar
    nombreapellidoPadre: 'Nombre y apellido del padre',
    direccionPadre: 'Dirección del padre',
    vivepadre: 'Vive padre',
    ocupacionPadre: 'Ocupación',
    telefonoPadre: 'Teléfono',
    barrioMunicipioPadre: 'Barrio o municipio',
    nombreapellidoMadre: 'Nombre y apellido de la madre',
    direccionMadre: 'Dirección de la madre',
    viveMadre: 'Vive madre',
    ocupacionMadre: 'Ocupación',
    telefonoMadre: 'Teléfono',
    barrioMunicipioMadre: 'Barrio o municipio',
    nombreapellidoConyuge: 'Nombre y apellido del conyuge',
    direccionConyuge: 'Dirección del conyuge',
    viveConyuge: 'Vive conyuge',
    ocupacionConyuge: 'Ocupación',
    telefonoConyuge: 'Teléfono',

    //informacion de hijos
    apellidosynombresHijos1: 'Apellidos y nombres hijo 1',
    fechaNacimientoHijos1: 'Fecha de nacimiento hijo 1',
    numerodeIdentificacionHijos1: 'Número de identificación hijo 1',
    sexoHijo1: 'Sexo hijo 1',
    edadHijo1: 'Edad hijo 1',
    estudiaTrabajaHijo1: 'Estudia o trabaja hijo 1',
    cursoHijo1: 'Curso hijo 1',
    viveconeltrabajadorhijo1: 'Vive con el trabajador hijo 1',
    estudiaenlafundacionhijo1: 'Estudia en la fundación hijo 1',
    poseeAlgunaDiscapacidadHijo1: 'Posee alguna discapacidad hijo 1',
    esEmpleadoDelasEmpresasHijo1: 'Es empleado de las empresa hijo 1',
    nombreOtroPadreHijo1: 'Nombre del otro padre hijo 1',
    documentoIdentidadOtroPadreHijo1: 'Documento de identidad del otro padre hijo 1',
    otroPadreTrabajaenLaCompaniaHijo1: 'El otro padre trabaja en la compañía hijo 1',
    esHijastroHijo1: 'Es hijastro hijo 1',
    custodiaLegalHijo1: 'Custodia legal hijo 1',

    apellidosynombresHijos2: 'Apellidos y nombres hijo 2',
    fechaNacimientoHijos2: 'Fecha de nacimiento hijo 2',
    numerodeIdentificacionHijos2: 'Número de identificación hijo 2',
    sexoHijo2: 'Sexo hijo 2',
    edadHijo2: 'Edad hijo 2',
    estudiaTrabajaHijo2: 'Estudia o trabaja hijo 2',
    cursoHijo2: 'Curso hijo 2',
    viveconeltrabajadorhijo2: 'Vive con el trabajador hijo 2',
    estudiaenlafundacionhijo2: 'Estudia en la fundación hijo 2',
    poseeAlgunaDiscapacidadHijo2: 'Posee alguna discapacidad hijo 2',
    esEmpleadoDelasEmpresasHijo2: 'Es empleado de las empresa hijo 2',
    nombreOtroPadreHijo2: 'Nombre del otro padre hijo 2',
    documentoIdentidadOtroPadreHijo2: 'Documento de identidad del otro padre hijo 2',
    otroPadreTrabajaenLaCompaniaHijo2: 'El otro padre trabaja en la compañía hijo 2',
    esHijastroHijo2: 'Es hijastro hijo 2',
    custodiaLegalHijo2: 'Custodia legal hijo 2',
    apellidosynombresHijos3: 'Apellidos y nombres hijo 3',
    fechaNacimientoHijos3: 'Fecha de nacimiento hijo 3',
    numerodeIdentificacionHijos3: 'Número de identificación hijo 3',
    sexoHijo3: 'Sexo hijo 3',
    edadHijo3: 'Edad hijo 3',
    estudiaTrabajaHijo3: 'Estudia o trabaja hijo 3',
    cursoHijo3: 'Curso hijo 3',
    viveconeltrabajadorhijo3: 'Vive con el trabajador hijo 3',
    estudiaenlafundacionhijo3: 'Estudia en la fundación hijo 3',
    poseeAlgunaDiscapacidadHijo3: 'Posee alguna discapacidad hijo 3',
    esEmpleadoDelasEmpresasHijo3: 'Es empleado de las empresa hijo 3',
    nombreOtroPadreHijo3: 'Nombre del otro padre hijo 3',
    documentoIdentidadOtroPadreHijo3: 'Documento de identidad del otro padre hijo 3',
    otroPadreTrabajaenLaCompaniaHijo3: 'El otro padre trabaja en la compañía hijo 3',
    esHijastroHijo3: 'Es hijastro hijo 3',
    custodiaLegalHijo3: 'Custodia legal hijo 3',
    apellidosynombresHijos4: 'Apellidos y nombres hijo 4',
    fechaNacimientoHijos4: 'Fecha de nacimiento hijo 4',
    numerodeIdentificacionHijos4: 'Número de identificación hijo 4',
    sexoHijo4: 'Sexo hijo 4',
    edadHijo4: 'Edad hijo 4',
    estudiaTrabajaHijo4: 'Estudia o trabaja hijo 4',
    cursoHijo4: 'Curso hijo 4',
    viveconeltrabajadorhijo4: 'Vive con el trabajador hijo 4',
    estudiaenlafundacionhijo4: 'Estudia en la fundación hijo 4',
    poseeAlgunaDiscapacidadHijo4: 'Posee alguna discapacidad hijo 4',
    esEmpleadoDelasEmpresasHijo4: 'Es empleado de las empresa hijo 4',
    nombreOtroPadreHijo4: 'Nombre del otro padre hijo 4',
    documentoIdentidadOtroPadreHijo4: 'Documento de identidad del otro padre hijo 4',
    otroPadreTrabajaenLaCompaniaHijo4: 'El otro padre trabaja en la compañía hijo 4',
    esHijastroHijo4: 'Es hijastro hijo 4',
    custodiaLegalHijo4: 'Custodia legal hijo 4',
    apellidosynombresHijos5: 'Apellidos y nombres hijo 5',
    fechaNacimientoHijos5: 'Fecha de nacimiento hijo 5',
    numerodeIdentificacionHijos5: 'Número de identificación hijo 5',
    sexoHijo5: 'Sexo hijo 5',
    edadHijo5: 'Edad hijo 5',
    estudiaTrabajaHijo5: 'Estudia o trabaja hijo 5',
    cursoHijo5: 'Curso hijo 5',
    viveconeltrabajadorhijo5: 'Vive con el trabajador hijo 5',
    estudiaenlafundacionhijo5: 'Estudia en la fundación hijo 5',
    poseeAlgunaDiscapacidadHijo5: 'Posee alguna discapacidad hijo 5',
    esEmpleadoDelasEmpresasHijo5: 'Es empleado de las empresa hijo 5',
    nombreOtroPadreHijo5: 'Nombre del otro padre hijo 5',
    documentoIdentidadOtroPadreHijo5: 'Documento de identidad del otro padre hijo 5',
    otroPadreTrabajaenLaCompaniaHijo5: 'El otro padre trabaja en la compañía hijo 5',
    esHijastroHijo5: 'Es hijastro hijo 5',
    custodiaLegalHijo5: 'Custodia legal hijo 5',
    apellidosynombresHijos6: 'Apellidos y nombres hijo 6',
    fechaNacimientoHijos6: 'Fecha de nacimiento hijo 6',
    numerodeIdentificacionHijos6: 'Número de identificación hijo 6',
    sexoHijo6: 'Sexo hijo 6',
    edadHijo6: 'Edad hijo 6',
    estudiaTrabajaHijo6: 'Estudia o trabaja hijo 6',
    cursoHijo6: 'Curso hijo 6',
    viveconeltrabajadorhijo6: 'Vive con el trabajador hijo 6',
    estudiaenlafundacionhijo6: 'Estudia en la fundación hijo 6',
    poseeAlgunaDiscapacidadHijo6: 'Posee alguna discapacidad hijo 6',
    esEmpleadoDelasEmpresasHijo6: 'Es empleado de las empresa hijo 6',
    nombreOtroPadreHijo6: 'Nombre del otro padre hijo 6',
    documentoIdentidadOtroPadreHijo6: 'Documento de identidad del otro padre hijo 6',
    otroPadreTrabajaenLaCompaniaHijo6: 'El otro padre trabaja en la compañía hijo 6',
    esHijastroHijo6: 'Es hijastro hijo 6',
    custodiaLegalHijo6: 'Custodia legal hijo 6',

    //informacion dotacion
    tallachaqueta: 'Talla chaqueta',
    tallaPantalon: 'Talla pantalón',
    tallaOverol: 'Talla overol',
    noCalzado: 'No. Calzado',
    noBotasCuacho: 'No. Botas cuacho',
    noZapatones: 'No. Zapatones',
    noBotasMaterial: 'No. Botas material',

    // referencias emrpesa
    nombreEmpresa1: 'Nombre empresa 1',
    direccionEmpresa1: 'Dirección empresa 1',
    telefonoEmpresa1: 'Teléfono empresa 1',
    jefeInmediato1: 'Jefe inmediato 1',
    cargo1:'Cargo',
    fechaDeRetiro1: 'Fecha de retiro 1',
    motivoDeRetiro1: 'Motivo de retiro 1',
    nombreEmpresa2: 'Nombre empresa 2',
    direccionEmpresa2: 'Dirección empresa 2',
    telefonoEmpresa2: 'Teléfono empresa 2',
    jefeInmediato2: 'Jefe inmediato 2',
    cargo2: 'Cargo',
    fechaDeRetiro2: 'Fecha de retiro 2',
    motivoDeRetiro2: 'Motivo de retiro 2',

    //referencias personales
    nombreReferenciapersonal1: 'Nombre de la persona de referencia 1',
    telefonoReferenciapersonal1: 'Teléfono referencia 1',
    ocupacionReferenciapersonal1: 'Ocupación referencia 1',
    nombreReferenciapersonal2: 'Nombre de la persona de referencia 2',
    telefonoReferenciapersonal2: 'Teléfono referencia 2',
    ocupacionReferenciapersonal2: 'Ocupación referencia 2',

    //referencias familiares
    nombreReferenciaFamiliar1: 'Nombre de la referencia familiar 1',
    telefonoReferenciaFamiliar1: 'Teléfono referencia 1',
    ocupacionReferenciaFamiliar1: 'Ocupación referencia 1',
    nombreReferenciaFamiliar2: 'Nombre de la referencia familiar 2',
    telefonoReferenciaFamiliar2: 'Teléfono referencia 2',
    ocupacionReferenciaFamiliar2: 'Ocupación referencia 2',
    // informacion ya firma
    nombreyapellidos: 'Nombre y apellidos',
    firma: 'Firma',
    numerodeidentificacion: 'Número de identificación',
    huella: 'Indice de derecho',
    comentariosdelasreferecnaspersonales: 'Comentarios de las referencias personales',
    comentariosdelasreferenciasfamiliares: 'Comentarios de las referencias familiares',
    comentariosdelasreferenciaslabores: 'Comentarios de las referencias laborales',
    nombreycedulaDeQuienContrata: 'Nombre y cedula de quien contrata',
    firmaDequienContrata: 'Firma de quien contrata',
    //Entrega carne de la empresa
    tipoDeentrega: 'Tipo de entrega',
    fechaDeEntrega: 'Fecha de entrega',
    firmaEntrega: 'Firma de entrega',

    //actadeEntregaLocker
    nodeLocker: 'No. de locker',
    fechaEntregaLocker: 'Fecha de entrega locker',
    firmaEntregaLocker: 'Firma de entrega locker',
  };
  nombredelaTemporal: string = '';
  data = [
    {
      empresaUsuaria: 'THE ELITE FLOWER S.A.S C.I.',
      fechasDePago: '01 y 16 de cada mes',
      valorAlmuerzo: 1849
    },
    {
      empresaUsuaria: 'FUNDACIÓN FERNANDO BORRERO CAICEDO',
      fechasDePago: '06 y 21 de cada mes',
      valorAlmuerzo: 1849
    },
    {
      empresaUsuaria: 'FANTASY FLOWER S.A.S',
      fechasDePago: '06 y 21 de cada mes',
      valorAlmuerzo: 1849
    },
    {
      empresaUsuaria: 'MERCEDES S.A.S EN REORGANIZACIÓN',
      fechasDePago: '06 y 21 de cada mes',
      valorAlmuerzo: 1849
    },
    {
      empresaUsuaria: 'WAYUU FLOWERS S.A.S',
      fechasDePago: '06 y 21 de cada mes',
      valorAlmuerzo: 1849
    }
  ];
  formasdepagoOptions = [
    'Daviplata',
    'Davivienda cta ahorros',
    'Bancolombia',
    'Colpatria cta ahorros',
    'Otra'
  ];

  constructor(private fb: FormBuilder) {
    this.fichaTecnicaForm = this.fb.group({});
    Object.keys(this.fieldMapFichaTecnica).forEach((key) => {
      this.fichaTecnicaForm.addControl(key, this.fb.control(''));
    });
    this.contratoForm = this.fb.group({});
    Object.keys(this.fieldsContrato).forEach((key) => {
      this.contratoForm.addControl(key, this.fb.control(''));
    });
    this.entregaDeDocumentosForm = this.fb.group({});
    Object.keys(this.fieldEntregaDocumento).forEach((key) => {
      this.entregaDeDocumentosForm.addControl(key, this.fb.control(''));
    });
    this.trasladosForm = this.fb.group({});
    Object.keys(this.fieldTratamientoDatos).forEach((key) => {
      this.trasladosForm.addControl(key, this.fb.control(''));
    });
    this.HojaVidaForm = this.fb.group({});
    Object.keys(this.fieldHojaDeVida).forEach((key) => {
      this.HojaVidaForm.addControl(key, this.fb.control(''));
    });
    this.pruebaLecturaForm = this.fb.group({});
    Object.keys(this.fieldMapFichaTecnica).forEach((key) => {
      this.pruebaLecturaForm.addControl(key, this.fb.control(''));
    });
    this.pruebaSSTForm = this.fb.group({});
    Object.keys(this.fieldMapFichaTecnica).forEach((key) => {
      this.pruebaSSTForm.addControl(key, this.fb.control(''));
    });
    this.autorizacionDatosForm = this.fb.group({});
    Object.keys(this.fieldMapFichaTecnica).forEach((key) => {
      this.autorizacionDatosForm.addControl(key, this.fb.control(''));
    });
  }

  ngOnInit() {
    // Asegurar que TypeScript sepa que DigitalPersonaSDK tiene un tipo específico

  }

  onPdfPagesLoaded(event: any) {
    console.log('PDF pages loaded:', event);
  }

  onPdfDownloaded(event: any) {
    console.log('PDF downloaded:', event);
  }

  // Convert Base64 to Blob and create an Object URL

  getFieldType(key: string): string {
    // Define una lógica para determinar el tipo de campo basado en el nombre de la clave
    if (key.toLowerCase().includes('fecha')) {
      return 'date';
    } else if (key.toLowerCase().includes('telefono') || key.toLowerCase().includes('celular')) {
      return 'tel';
    } else if (key.toLowerCase().includes('email') || key.toLowerCase().includes('correo')) {
      return 'email';
    } else {
      return 'text';
    }
  }
  message: string = '';
  fingerprintImagePD: string | null = null;
  fingerprintImageID: string | null = null;
  captureFingerprintID() {
    // Verifica si window.myElectron y window.myElectron.fingerprint están disponibles
    if (window.electron.fingerprint) {
      window.electron.fingerprint.get()
        .then((result: { success: boolean; data?: string; error?: string }) => {
          if (result.success) {
            this.message = 'Huella capturada exitosamente.';
            this.fingerprintImageID = `data:image/png;base64,${result.data}`;
            this.fichaTecnicaForm.get('huella')?.setValue(this.fingerprintImageID);
            this.contratoForm.get('huella')?.setValue(this.fingerprintImageID);

          } else {
            this.message = `Error al capturar huella: ${result.error || 'Error desconocido.'}`;
            console.error(this.message);
          }
        })
        .catch((error: any) => {
          this.message = `Error al capturar huella: ${error.error || 'Error de comunicación con el módulo Electron.'}`;
          console.error(this.message);
        });
    } else {
      const errorMessage = 'Electron o fingerprint no están disponibles en window.';
      console.error(errorMessage);
      this.message = errorMessage;
    }
  }
  convertbase64toimage(textBase: string) {
    var byteCharacters = atob(textBase);
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    var blob = new Blob([byteArray], { type: 'image/png' });
    var url = URL.createObjectURL(blob);
    return url;
  }

  captureFingerprintPD() {
    // Verifica si window.myElectron y window.myElectron.fingerprint están disponibles
    if (window.electron.fingerprint) {
      window.electron.fingerprint.get()
        .then((result: { success: boolean; data?: string; error?: string }) => {
          if (result.success) {
            this.message = 'Huella capturada exitosamente.';
            this.fingerprintImagePD = `data:image/png;base64,${result.data}`;
            this.entregaDeDocumentosForm.get('huellaPulgarDerecho')?.setValue(this.fingerprintImagePD);
          } else {
            this.message = `Error al capturar huella: ${result.error || 'Error desconocido.'}`;
            console.error(this.message);
          }
        })
        .catch((error: any) => {
          this.message = `Error al capturar huella: ${error.error || 'Error de comunicación con el módulo Electron.'}`;
          console.error(this.message);
        });
    } else {
      const errorMessage = 'Electron o fingerprint no están disponibles en window.';
      console.error(errorMessage);
      this.message = errorMessage;
    }
  }


  signatureDataURLTrabajador: string = '';  // Aquí almacenamos la firma como base64
  signatureDataURLTestigo1: string = '';
  signatureDataURLTestigo2: string = '';
  onSignatureSavedtrabajador(dataURL: string) {
    this.signatureDataURLTrabajador = dataURL;  // Guardamos la firma en la variable
    console.log('Firma recibida:', this.signatureDataURLTrabajador);
    this.fichaTecnicaForm.get('firma')?.setValue(this.signatureDataURLTrabajador);
  }
  onSignatureSavedTestigo1(dataURL: string) {
    this.signatureDataURLTestigo1 = dataURL;  // Guardamos la firma en la variable
    console.log('Firma recibida:', this.signatureDataURLTestigo1);
    this.contratoForm.get('firmaTestigo1')?.setValue(this.signatureDataURLTestigo1);
  }
  onSignatureSavedTestigo2(dataURL: string) {
    this.signatureDataURLTestigo2 = dataURL;  // Guardamos la firma en la variable
    console.log('Firma recibida:', this.signatureDataURLTestigo2);
    this.contratoForm.get('firmaTestigo2')?.setValue(this.signatureDataURLTestigo2);
  }

  renderPage(pdf: PDFDocumentProxy, pageNumber: number) {
    pdf.getPage(pageNumber).then((page: PDFPageProxy) => {
      const scale = 1.5;
      const viewport = page.getViewport({ scale });

      const canvas = document.getElementById('pdf-canvas') as HTMLCanvasElement;
      const context = canvas.getContext('2d');

      // Check if the context is null
      if (!context) {
        console.error("Failed to get 2D context");
        return;
      }

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };

      page.render(renderContext);
    });
  }



  onSubmit(nombredelfocumento:string): void {
    if (!this.signatureDataURLTrabajador) {
      alert('Por favor, asegúrese de firmar antes de enviar.');
      return;
    }

    if (nombredelfocumento == 'fichatecnica') {
    this.generateFichaTecnicaPDF();
    }
    if(nombredelfocumento == 'contrato'){
      this.generateContratoPDF();
    }
    if (nombredelfocumento == 'entregaDocumentos'){
      this.generateEntregaDeDocumentacionPDF();
    }
    if (nombredelfocumento == 'hojadevida'){
    this.generateHojaDeVidaPDF();
    }


    // Aquí puedes manejar el envío del formulario, incluyendo la firma
    console.log('Formulario enviado:', this.fichaTecnicaForm.value);
  }


  generateFichaTecnicaPDF() {
    const doc = new jsPDF();

    // Título del documento
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('FICHA TÉCNICA DEL TRABAJADOR', 10, 15);

    let finalY = 30;

    // Sección: Información Personal
    doc.setFontSize(11);
    doc.text('INFORMACIÓN PERSONAL', 10, finalY - 5);
    finalY += 5;

    doc.autoTable({
      startY: finalY,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 1 },
      headStyles: { fillColor: [0, 120, 215], textColor: 255 },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 35 },
        2: { cellWidth: 60 },
        3: { cellWidth: 40 }
      },
      head: [['1er Apellido', '2do Apellido', 'Nombres', 'No. de Identificación']],
      body: [
        [this.fichaTecnicaForm.get('primerApellido')?.value, this.fichaTecnicaForm.get('segundoApellido')?.value, this.fichaTecnicaForm.get('nombres')?.value, this.fichaTecnicaForm.get('numerodeIdentificacion')?.value]
      ]
    });

    finalY = (doc as any).lastAutoTable.finalY + 10;

    // Otra fila de información personal
    doc.autoTable({
      startY: finalY,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 1 },
      headStyles: { fillColor: [0, 120, 215], textColor: 255 },
      head: [['Fecha y Lugar de Expedición', 'Fecha y Lugar de Nacimiento', 'Celular', 'Email']],
      body: [
        [this.fichaTecnicaForm.get('fechaExpedicionylugardeexpedicion')?.value, this.fichaTecnicaForm.get('fechaNacimientoylugardenacimiento')?.value, this.fichaTecnicaForm.get('celular')?.value, this.fichaTecnicaForm.get('correoelectronico')?.value]
      ]
    });

    finalY = (doc as any).lastAutoTable.finalY + 10;

    // Tercera fila de información personal
    doc.autoTable({
      startY: finalY,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 1 },
      headStyles: { fillColor: [0, 120, 215], textColor: 255 },
      head: [['Dirección', 'Mun/Bar.', 'Estado Civil', 'RH']],
      body: [
        [this.fichaTecnicaForm.get('direccion')?.value, this.fichaTecnicaForm.get('municipioBarrio')?.value, this.fichaTecnicaForm.get('estadoCivil')?.value, this.fichaTecnicaForm.get('rh')?.value]
      ]
    });

    finalY = (doc as any).lastAutoTable.finalY + 10;

    // Sección EPS, AFP, AFC y Caja de Compensación
    doc.autoTable({
      startY: finalY,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 1 },
      headStyles: { fillColor: [0, 120, 215], textColor: 255 },
      head: [['EPS', 'AFP', 'AFC', 'Caja de Compensación']],
      body: [
        [this.fichaTecnicaForm.get('eps')?.value, this.fichaTecnicaForm.get('afp')?.value, this.fichaTecnicaForm.get('afc')?.value, this.fichaTecnicaForm.get('cajaCompensacion')?.value]
      ]
    });

    finalY = (doc as any).lastAutoTable.finalY + 10;

    // Nota
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('*Dejo constancia de que elegí voluntariamente la afiliación...', 10, finalY);

    finalY += 10;

    // Sección: Información Académica
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMACIÓN ACADÉMICA', 10, finalY - 5);
    finalY += 5;

    doc.autoTable({
      startY: finalY,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 1 },
      headStyles: { fillColor: [0, 120, 215], textColor: 255 },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 20 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 }
      },
      head: [['Grado Escolar', 'Técnico', 'Universidad', 'Especialización', 'Otros']],
      body: [
        [this.fichaTecnicaForm.get('gradoEscolaridad')?.value, this.fichaTecnicaForm.get('isTecnologo')?.value ? 'Sí' : 'No', this.fichaTecnicaForm.get('isUniversidad')?.value ? 'Sí' : 'No', this.fichaTecnicaForm.get('isEspecializacion')?.value ? 'Sí' : 'No', this.fichaTecnicaForm.get('isOtros')?.value ? 'Sí' : 'No']
      ]
    });

    finalY = (doc as any).lastAutoTable.finalY + 10;

    // Sección: Información Familiar
    doc.setFontSize(11);
    doc.text('INFORMACIÓN FAMILIAR', 10, finalY - 5);
    finalY += 5;

    doc.autoTable({
      startY: finalY,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 1 },
      headStyles: { fillColor: [0, 120, 215], textColor: 255 },
      head: [['Nombre y Apellido (Padre)', 'Teléfono', 'Ocupación', 'Barrio/Municipio']],
      body: [
        [this.fichaTecnicaForm.get('nombreapellidoPadre')?.value, this.fichaTecnicaForm.get('telefonoPadre')?.value, this.fichaTecnicaForm.get('ocupacionPadre')?.value, this.fichaTecnicaForm.get('barrioMunicipioPadre')?.value]
      ]
    });

    finalY = (doc as any).lastAutoTable.finalY + 10;

    // Sección: Información de Hijos
    doc.setFontSize(11);
    doc.text('INFORMACIÓN DE HIJOS', 10, finalY - 5);
    finalY += 5;

    // Agregando información de los hijos de manera dinámica (hasta 6 hijos)
    let hijosDataBasica = [];
    let hijosDataVinculacion = [];
    let hijosDataAdicional = [];

    // Recolectando información de los hijos en diferentes categorías
    for (let i = 1; i <= 6; i++) {
      const nombreHijo = this.fichaTecnicaForm.get(`apellidosynombresHijos${i}`)?.value;
      const fechaNacimientoHijo = this.fichaTecnicaForm.get(`fechaNacimientoHijos${i}`)?.value;
      const identificacionHijo = this.fichaTecnicaForm.get(`numerodeIdentificacionHijos${i}`)?.value;
      const sexoHijo = this.fichaTecnicaForm.get(`sexoHijo${i}`)?.value;
      const edadHijo = this.fichaTecnicaForm.get(`edadHijo${i}`)?.value;
      const estudiaTrabajaHijo = this.fichaTecnicaForm.get(`estudiaTrabajaHijo${i}`)?.value;
      const cursoHijo = this.fichaTecnicaForm.get(`cursoHijo${i}`)?.value;
      const viveconeltrabajadorhijo = this.fichaTecnicaForm.get(`viveconeltrabajadorhijo${i}`)?.value;
      const estudiaenlafundacionhijo = this.fichaTecnicaForm.get(`estudiaenlafundacionhijo${i}`)?.value;
      const poseeAlgunaDiscapacidadHijo = this.fichaTecnicaForm.get(`poseeAlgunaDiscapacidadHijo${i}`)?.value;
      const esEmpleadoDelasEmpresasHijo = this.fichaTecnicaForm.get(`esEmpleadoDelasEmpresasHijo${i}`)?.value;
      const nombreOtroPadreHijo = this.fichaTecnicaForm.get(`nombreOtroPadreHijo${i}`)?.value;
      const documentoIdentidadOtroPadreHijo = this.fichaTecnicaForm.get(`documentoIdentidadOtroPadreHijo${i}`)?.value;
      const otroPadreTrabajaenLaCompaniaHijo = this.fichaTecnicaForm.get(`otroPadreTrabajaenLaCompaniaHijo${i}`)?.value;
      const esHijastroHijo = this.fichaTecnicaForm.get(`esHijastroHijo${i}`)?.value;
      const custodiaLegalHijo = this.fichaTecnicaForm.get(`custodiaLegalHijo${i}`)?.value;

      if (nombreHijo) {
        // Datos básicos del hijo
        hijosDataBasica.push([nombreHijo, fechaNacimientoHijo, identificacionHijo, sexoHijo, edadHijo, estudiaTrabajaHijo, cursoHijo]);

        // Datos de vinculación del hijo con el trabajador
        hijosDataVinculacion.push([viveconeltrabajadorhijo, estudiaenlafundacionhijo, poseeAlgunaDiscapacidadHijo, esEmpleadoDelasEmpresasHijo]);

        // Datos adicionales sobre el otro padre o la custodia
        hijosDataAdicional.push([nombreOtroPadreHijo, documentoIdentidadOtroPadreHijo, otroPadreTrabajaenLaCompaniaHijo, esHijastroHijo, custodiaLegalHijo]);
      }
    }

    // Tabla 1: Información básica de los hijos
    if (hijosDataBasica.length > 0) {
      doc.autoTable({
        startY: finalY,
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 1 },
        headStyles: { fillColor: [0, 120, 215], textColor: 255 },
        head: [['Apellidos y Nombres', 'Fecha Nacimiento', 'Identificación', 'Sexo', 'Edad', 'Estudia/Trabaja', 'Curso']],
        body: hijosDataBasica
      });

      finalY = (doc as any).lastAutoTable.finalY + 10;
    }

    // Tabla 2: Información de vinculación de los hijos con el trabajador
    if (hijosDataVinculacion.length > 0) {
      doc.setFontSize(11);
      doc.text('VINCULACIÓN DE LOS HIJOS', 10, finalY - 5);
      finalY += 5;

      doc.autoTable({
        startY: finalY,
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 1 },
        headStyles: { fillColor: [0, 120, 215], textColor: 255 },
        head: [['Vive con el Trabajador', 'Estudia en la Fundación', 'Posee Discapacidad', 'Es Empleado de las Empresas']],
        body: hijosDataVinculacion
      });

      finalY = (doc as any).lastAutoTable.finalY + 10;
    }

    // Tabla 3: Información adicional del otro padre o custodia
    if (hijosDataAdicional.length > 0) {
      doc.setFontSize(11);
      doc.text('INFORMACIÓN ADICIONAL SOBRE LOS PADRES', 10, finalY - 5);
      finalY += 5;

      doc.autoTable({
        startY: finalY,
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 1 },
        headStyles: { fillColor: [0, 120, 215], textColor: 255 },
        head: [['Nombre del Otro Padre', 'Documento de Identidad', 'El Otro Padre Trabaja en la Compañía', 'Es Hijastro', 'Custodia Legal']],
        body: hijosDataAdicional
      });

      finalY = (doc as any).lastAutoTable.finalY + 10;
    }

    finalY = (doc as any).lastAutoTable.finalY + 10;

    // Sección: Información de Dotación
    doc.setFontSize(11);
    doc.text('INFORMACIÓN DE DOTACIÓN', 10, finalY - 5);
    finalY += 5;

    doc.autoTable({
      startY: finalY,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 1 },
      headStyles: { fillColor: [0, 120, 215], textColor: 255 },
      head: [['Talla Chaqueta', 'Talla Pantalón', 'Talla Overol', 'No. Calzado', 'No. Botas Cuacho', 'No. Zapatones', 'No. Botas Material']],
      body: [
        [this.fichaTecnicaForm.get('tallachaqueta')?.value, this.fichaTecnicaForm.get('tallaPantalon')?.value, this.fichaTecnicaForm.get('tallaOverol')?.value, this.fichaTecnicaForm.get('noCalzado')?.value, this.fichaTecnicaForm.get('noBotasCuacho')?.value, this.fichaTecnicaForm.get('noZapatones')?.value, this.fichaTecnicaForm.get('noBotasMaterial')?.value]
      ]
    });

    finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.setFontSize(11);
    doc.text('REFERENCIAS EMPRESA', 10, finalY - 5);
    finalY += 5;
    let referenciasempresa = [];
    doc.autoTable({
      startY: finalY,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 1 },
      headStyles: { fillColor: [0, 120, 215], textColor: 255 },
      head: [['Nombre empresa 1', 'Dirección empresa 1', 'Talla Overol', 'No. Calzado', 'No. Botas Cuacho', 'No. Zapatones', 'No. Botas Material']],
      body: [
        [this.fichaTecnicaForm.get('tallachaqueta')?.value, this.fichaTecnicaForm.get('tallaPantalon')?.value, this.fichaTecnicaForm.get('tallaOverol')?.value, this.fichaTecnicaForm.get('noCalzado')?.value, this.fichaTecnicaForm.get('noBotasCuacho')?.value, this.fichaTecnicaForm.get('noZapatones')?.value, this.fichaTecnicaForm.get('noBotasMaterial')?.value]
      ]
    });

    // firma de documento

    // Signature and Fingerprint side by side
    finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text('FIRMA Y HUELLAS', 10, finalY);
    finalY += 10;

    // Draw a table-like structure for signature and fingerprint
    doc.text('Firma del Trabajador:', 10, finalY + 5);
    doc.addImage(this.signatureDataURLTrabajador, 'PNG', 10, finalY + 10, 50, 30);

    doc.text('Huella Índice Derecho:', 80, finalY + 5);
    doc.addImage(this.fichaTecnicaForm.get('huella')?.value, 'PNG', 80, finalY + 10, 30, 30);


    finalY += 50;

    // Nota final
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('*Dejo constancia de que elegí voluntariamente la afiliación a los servicios indicados.', 10, finalY);

    // Guardar el PDF
    doc.save('Ficha_Tecnica.pdf');
  }
  generateContratoPDF() {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    // Encabezado principal
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('PROCESO DE CONTRATACIÓN', 10, 10);
    doc.text('CONTRATO DE TRABAJO POR OBRA O LABOR', 10, 15);
    doc.setFont('helvetica', 'normal');
    doc.text('Código: AL CO-RE-1', 150, 10);
    doc.text('Versión: 07', 150, 15);
    doc.text('Página: 1 de 3', 150, 20);

    let finalY = 25;

    // Información general
    doc.setFont('helvetica', 'bold');
    doc.text('Representado por:', 10, finalY);
    doc.setFont('helvetica', 'normal');
    doc.text(this.contratoForm.get('representadoPor')?.value, 50, finalY);

    finalY += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('Nombre del Trabajador:', 10, finalY);
    doc.setFont('helvetica', 'normal');
    doc.text(this.contratoForm.get('NombredelTrabajador')?.value, 50, finalY);

    finalY += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('Fecha de Nacimiento:', 10, finalY);
    doc.setFont('helvetica', 'normal');
    doc.text(this.contratoForm.get('fechaDeNacimiento')?.value, 50, finalY);

    finalY += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('Domicilio del Trabajador:', 10, finalY);
    doc.setFont('helvetica', 'normal');
    doc.text(this.contratoForm.get('domicilioDelTrabajador')?.value, 50, finalY);

    finalY += 10;

    // Tabla resumen
    doc.autoTable({
      startY: finalY,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 1 },
      headStyles: { fillColor: [0, 120, 215], textColor: 255 },
      head: [['Campo', 'Valor']],
      body: [
        ['Fecha de Iniciación', this.contratoForm.get('fechaDeInciacion')?.value],
        ['Salario Mensual Ordinario', this.contratoForm.get('salarioMensualOrdinario')?.value],
        ['Periodo de Pago', this.contratoForm.get('periodoDePagoSalario')?.value],
        ['Subsidio de Transporte', this.contratoForm.get('subsidioDeTransporte')?.value],
        ['Forma de Pago', this.contratoForm.get('formaDePago')?.value],
        ['Cargo', this.contratoForm.get('cargo')?.value],
        ['Nombre Empresa Usuaria', this.contratoForm.get('nombreEmpresaUsuarioa')?.value],
        ['Descripción de la Obra/Motivo Temporal', this.contratoForm.get('descripciondelaObraMotivotemporal')?.value],
      ]
    });

    finalY = (doc as any).lastAutoTable.finalY + 10;

    // Clausulado del contrato
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('CLÁUSULAS DEL CONTRATO', 10, finalY);
    finalY += 5;

    doc.setFont('helvetica', 'normal');
    const clausulas = [
      'PRIMERA: El empleador y el trabajador acuerdan que el presente contrato se celebrará conforme a las disposiciones legales vigentes y en base a los términos expresamente descritos en este documento.',
      'SEGUNDA: El trabajador se compromete a cumplir con las obligaciones inherentes a su cargo, siguiendo las instrucciones y políticas establecidas por el empleador.',
      'TERCERA: El salario pactado será pagado conforme a las condiciones estipuladas en este contrato, siendo responsabilidad del empleador respetar las disposiciones legales aplicables.',
      'CUARTA: Ambas partes acuerdan que cualquier modificación a este contrato deberá realizarse por escrito y con la aprobación de ambas partes.',
      'QUINTA: Este contrato podrá ser terminado bajo las condiciones establecidas por la ley, incluyendo pero no limitándose a incumplimientos graves de cualquiera de las partes.',
      'SEXTA: El empleador se reserva el derecho de asignar tareas adicionales al trabajador que sean compatibles con las funciones propias de su cargo.',
      'SÉPTIMA: El trabajador declara haber recibido copia de este contrato y manifiesta su aceptación de los términos aquí descritos.'
    ];

    clausulas.forEach((clausula, index) => {
      const lines = doc.splitTextToSize(`${index + 1}. ${clausula}`, 180);
      doc.text(lines, 10, finalY);
      finalY += lines.length * 5;
      if (finalY > 270) {
        doc.addPage();
        finalY = 10;
      }
    });

    finalY += 10;

    // Firmas
    doc.setFont('helvetica', 'bold');
    doc.text('FIRMAS', 10, finalY);
    finalY += 5;

    doc.setFont('helvetica', 'normal');
    doc.text('Firma del Trabajador:', 10, finalY);
    doc.text(this.contratoForm.get('firmaDelTrabajador')?.value, 50, finalY);

    finalY += 10;
    doc.text('Testigo 1 (Nombre y cédula):', 10, finalY);
    doc.text(this.contratoForm.get('testigo1NombreYcedula')?.value, 50, finalY);

    finalY += 5;
    doc.text('Firma Testigo 1:', 10, finalY);
    doc.text(this.contratoForm.get('firmaTestigo1')?.value, 50, finalY);

    finalY += 10;
    doc.text('Testigo 2 (Nombre y cédula):', 10, finalY);
    doc.text(this.contratoForm.get('testigo2NombreYcedula')?.value, 50, finalY);

    finalY += 5;
    doc.text('Firma Testigo 2:', 10, finalY);
    doc.text(this.contratoForm.get('firmaTestigo2')?.value, 50, finalY);

    finalY += 10;

    // Texto largo (contenido adicional del contrato)
    doc.setFontSize(9);
    const textoLargo = `Entre el EMPLEADOR y el TRABAJADOR arriba indicados, se ha celebrado el contrato regido por las cláusulas que se detallan a continuación. Este contrato regula la relación laboral de acuerdo con la legislación vigente y respetando los derechos y deberes de ambas partes. El TRABAJADOR se compromete a ejecutar las tareas asignadas de manera eficiente, acatando las normas y políticas del EMPLEADOR. Así mismo, se deja constancia de que el salario acordado será de acuerdo con las condiciones especificadas en este contrato y que cualquier modificación al presente documento deberá realizarse por escrito y con el consentimiento de ambas partes. El TRABAJADOR acepta cumplir con las normas de seguridad y conducta establecidas por el EMPLEADOR, además de reportar cualquier incidente o irregularidad que pueda afectar el desarrollo de sus labores. Por último, este contrato podrá darse por terminado bajo las condiciones especificadas en la legislación laboral y conforme a lo pactado por las partes.`;

    const textoLargoLineas = doc.splitTextToSize(textoLargo, 180);
    doc.text(textoLargoLineas, 10, finalY);

    // Guardar el PDF
    doc.save('Contrato_Trabajo.pdf');
  }

  generateHojaDeVidaPDF() {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    // Encabezado principal
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('HOJA DE VIDA', 10, 15);

    let finalY = 25;

    // Sección: Información General
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMACIÓN GENERAL', 10, finalY);
    finalY += 5;

    doc.setFont('helvetica', 'normal');
    doc.autoTable({
      startY: finalY,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [0, 120, 215], textColor: 255 },
      head: [['Campo', 'Valor']],
      body: [
        ['Apellido del Aspirante', this.HojaVidaForm.get('apellidoDelAspirante')?.value],
        ['Nombre del Aspirante', this.HojaVidaForm.get('nombreDelAspirante')?.value],
        ['Fecha de Nacimiento', this.HojaVidaForm.get('fechadeNacimiento')?.value],
        ['Lugar de Nacimiento', this.HojaVidaForm.get('lugarDeNacimiento')?.value],
        ['Dirección de Domicilio', this.HojaVidaForm.get('direccionDeDomicilio')?.value],
        ['Barrio', this.HojaVidaForm.get('barrio')?.value],
        ['Ciudad', this.HojaVidaForm.get('ciudad')?.value],
        ['Correo Electrónico', this.HojaVidaForm.get('correoElectronico')?.value],
        ['Nacionalidad', this.HojaVidaForm.get('nacionalidad')?.value],
        ['Profesión/Ocupación', this.HojaVidaForm.get('profesionOcupacion')?.value],
        ['Estado Civil', this.HojaVidaForm.get('estadoCivil')?.value],
        ['Años de Experiencia', this.HojaVidaForm.get('anosDeExperiencia')?.value],
        ['Tipo de Documento', this.HojaVidaForm.get('tipoDeDocumento')?.value],
        ['Número de Documento', this.HojaVidaForm.get('numeroDeDocumento')?.value],
        ['Expedido en', this.HojaVidaForm.get('expedidoEn')?.value],
        ['Tiene Vehículo', this.HojaVidaForm.get('tieneVehiculo')?.value],
      ]
    });

    finalY = (doc as any).lastAutoTable.finalY + 10;

    // Sección: Información Laboral
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMACIÓN LABORAL', 10, finalY);
    finalY += 5;

    doc.setFont('helvetica', 'normal');
    doc.autoTable({
      startY: finalY,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [0, 120, 215], textColor: 255 },
      head: [['Campo', 'Valor']],
      body: [
        ['Estudios Realizados', this.HojaVidaForm.get('estidiosRealizados')?.value],
        ['Experiencia Laboral', this.HojaVidaForm.get('experioenciaLaboral')?.value],
        ['Habilidades que Posee', this.HojaVidaForm.get('habilidadesQuePosee')?.value],
      ]
    });

    finalY = (doc as any).lastAutoTable.finalY + 10;

    // Sección: Información Familiar
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMACIÓN FAMILIAR', 10, finalY);
    finalY += 5;

    doc.setFont('helvetica', 'normal');
    doc.autoTable({
      startY: finalY,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [0, 120, 215], textColor: 255 },
      head: [['Campo', 'Valor']],
      body: [
        ['Nombre del Padre', this.HojaVidaForm.get('nombreDelPadre')?.value],
        ['Profesión/Ocupación (Padre)', this.HojaVidaForm.get('profesionOcupacionPadre')?.value],
        ['Teléfonos del Padre', this.HojaVidaForm.get('telefonosDelPadre')?.value],
        ['Nombre de la Madre', this.HojaVidaForm.get('nombreDelamadre')?.value],
        ['Profesión/Ocupación (Madre)', this.HojaVidaForm.get('profesionOcupacionMadre')?.value],
        ['Teléfonos de la Madre', this.HojaVidaForm.get('telefonosDeLaMadre')?.value],
        ['Nombres de Hermanos', this.HojaVidaForm.get('nombresHermanos')?.value],
        ['Profesión/Ocupación (Hermanos)', this.HojaVidaForm.get('profesionOcupacionHermanos')?.value],
        ['Teléfonos (Hermanos)', this.HojaVidaForm.get('telefonosHermanos')?.value],
      ]
    });

    finalY = (doc as any).lastAutoTable.finalY + 10;

    // Sección: Educación y Aptitudes
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('EDUCACIÓN Y APTITUDES', 10, finalY);
    finalY += 5;

    doc.setFont('helvetica', 'normal');
    doc.autoTable({
      startY: finalY,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [0, 120, 215], textColor: 255 },
      head: [['Campo', 'Valor']],
      body: [
        ['Sistemas que Domina', this.HojaVidaForm.get('sistemasQueDomina')?.value],
        ['Programas que Domina', this.HojaVidaForm.get('programasQueDomina')?.value],
        ['Idiomas que Habla', this.HojaVidaForm.get('idiomasQueHabla')?.value],
      ]
    });

    finalY = (doc as any).lastAutoTable.finalY + 10;

    // Sección: Referencias Personales
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('REFERENCIAS PERSONALES', 10, finalY);
    finalY += 5;

    doc.setFont('helvetica', 'normal');
    doc.autoTable({
      startY: finalY,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [0, 120, 215], textColor: 255 },
      head: [['Campo', 'Valor']],
      body: [
        ['Nombre Referencia 1', this.HojaVidaForm.get('nombreReferencia1')?.value],
        ['Ocupación Referencia 1', this.HojaVidaForm.get('ocupacionReferencia1')?.value],
        ['Teléfono Referencia 1', this.HojaVidaForm.get('telefonoReferencia1')?.value],
        ['Nombre Referencia 2', this.HojaVidaForm.get('nombreReferencia2')?.value],
        ['Ocupación Referencia 2', this.HojaVidaForm.get('ocupacionReferencia2')?.value],
        ['Teléfono Referencia 2', this.HojaVidaForm.get('telefonoReferencia2')?.value],
      ]
    });

    finalY = (doc as any).lastAutoTable.finalY + 10;

    // Firma y Autorización
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Autorizo Pedir Información de mi Hoja de Vida sin ninguna restricción.', 10, finalY);

    finalY += 10;
    doc.setFont('helvetica', 'normal');
    doc.text('Firma del Solicitante:', 10, finalY
    );
    doc.text(this.HojaVidaForm.get('firmaSolicitante')?.value, 50, finalY);

    // Guardar el PDF
    doc.save('Hoja_De_Vida.pdf');
  }

generateEntregaDeDocumentacionPDF() {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Encabezado principal
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('FORMATO DE ENTREGA DE DOCUMENTOS', 10, 15);

  let finalY = 25;

  // Sección: Información General
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMACIÓN GENERAL', 10, finalY);
  finalY += 5;

  doc.setFont('helvetica', 'normal');
  doc.autoTable({
    startY: finalY,
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 2 },
    headStyles: { fillColor: [0, 120, 215], textColor: 255 },
    head: [['Campo', 'Valor']],
    body: [
      ['Descuento Casino', this.entregaDeDocumentosForm.get('descuentoCasino')?.value],
      ['Forma de Pago', this.entregaDeDocumentosForm.get('formadepago')?.value],
      ['Número de Cuenta o Celular', this.entregaDeDocumentosForm.get('numerodecuenta')?.value],
      ['Código Tarjeta', this.entregaDeDocumentosForm.get('codigoTarjeta')?.value],
      ['Acepto Cambio Sin Previo Aviso', this.entregaDeDocumentosForm.get('aceptoCambioSinPrevioAviso')?.value],
      ['Plan Funeral', this.entregaDeDocumentosForm.get('planFuneral')?.value],
    ]
  });

  finalY = (doc as any).lastAutoTable.finalY + 10;

  // Sección: Firmas y Responsables
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('FIRMAS Y RESPONSABLES', 10, finalY);
  finalY += 5;

  doc.setFont('helvetica', 'normal');
  doc.autoTable({
    startY: finalY,
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 2 },
    headStyles: { fillColor: [0, 120, 215], textColor: 255 },
    head: [['Campo', 'Valor']],
    body: [
      ['Firma de Aceptación', this.entregaDeDocumentosForm.get('FirmadeAceptacion')?.value],
      ['Número de Identificación', this.entregaDeDocumentosForm.get('numeroDeIndentificacion')?.value],
      ['Fecha de Recibido', this.entregaDeDocumentosForm.get('fechadeRecibido')?.value],
      ['Firma de Responsable de Socialización', this.entregaDeDocumentosForm.get('firmadeResponsabledeSocializacion')?.value],
      ['Nombre de Responsable', this.entregaDeDocumentosForm.get('nombreDeResponsable')?.value],
    ]
  });

  finalY = (doc as any).lastAutoTable.finalY + 10;

  // Sección: Huellas
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('HUELLAS', 10, finalY);
  finalY += 5;

  doc.setFont('helvetica', 'normal');
  doc.autoTable({
    startY: finalY,
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 2 },
    headStyles: { fillColor: [0, 120, 215], textColor: 255 },
    head: [['Campo', 'Valor']],
    body: [
      ['Huella Índice Derecho', this.entregaDeDocumentosForm.get('huellaIndiceDerecho')?.value],
      ['Huella Pulgar Derecho', this.entregaDeDocumentosForm.get('huellaPulgarDerecho')?.value],
    ]
  });

  finalY = (doc as any).lastAutoTable.finalY + 20;

  // Nota final
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text('Declaro que he recibido y aceptado los documentos y condiciones indicados en este formato.', 10, finalY);

  // Guardar el PDF
  doc.save('Entrega_Documentos.pdf');

}

}
