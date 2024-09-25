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
  iscontratocomplete = false;
  isfichacomplete = false;
  isEntregaDocumentosComplete = false;
  isHojaVidaComplete = false;
  isPruebaLecturaComplete = false;
  isPruebaSSTComplete = false;
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
    formDePago: 'Forma de Pago',
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
    numerodecuenta: 'Número de cuenta',
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

  constructor(private fb: FormBuilder) {
    this.fichaTecnicaForm = this.fb.group({});
    Object.keys(this.fieldMapFichaTecnica).forEach((key) => {
      this.fichaTecnicaForm.addControl(key, this.fb.control(''));
    });
  }


  ngOnInit() {
    // Asegurar que TypeScript sepa que DigitalPersonaSDK tiene un tipo específico

  }




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

  captureFingerprintPD() {
    // Verifica si window.myElectron y window.myElectron.fingerprint están disponibles
    if (window.electron.fingerprint) {
      window.electron.fingerprint.get()
        .then((result: { success: boolean; data?: string; error?: string }) => {
          if (result.success) {
            this.message = 'Huella capturada exitosamente.';
            this.fingerprintImagePD = `data:image/png;base64,${result.data}`;


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


  signatureDataURL: string = '';  // Aquí almacenamos la firma como base64

  onSignatureSaved(dataURL: string) {
    this.signatureDataURL = dataURL;  // Guardamos la firma en la variable
    console.log('Firma recibida:', this.signatureDataURL);
    this.fichaTecnicaForm.get('firma')?.setValue(this.signatureDataURL);
  }



  onSubmit(): void {
    if (!this.signatureDataURL) {
      alert('Por favor, asegúrese de firmar antes de enviar.');
      return;
    }
    this.generateFichaTecnicaPDF();
    // Aquí puedes manejar el envío del formulario, incluyendo la firma
    console.log('Formulario enviado:', this.fichaTecnicaForm.value);
  }
  generateFichaTecnicaPDF() {
    const doc = new jsPDF();

    // Título del documento
    doc.setFontSize(10);
    doc.text('FICHA TÉCNICA DEL TRABAJADOR', 10, 15);

    let finalY = 30;  // Posición inicial para la primera tabla

    // Sección: Información Personal
    doc.setFontSize(9);
    doc.text('INFORMACIÓN PERSONAL', 10, finalY - 5);

    doc.autoTable({
      startY: finalY,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 0.5 },
      headStyles: { fillColor: [0, 150, 136], textColor: 255 },  // Color de fondo
      head: [['1er Apellido', '2do Apellido', 'Nombres', 'No. de Identificación']],
      body: [
        [this.fichaTecnicaForm.get('primerApellido')?.value, this.fichaTecnicaForm.get('segundoApellido')?.value, this.fichaTecnicaForm.get('nombres')?.value, this.fichaTecnicaForm.get('numerodeIdentificacion')?.value]
      ]
    });

    finalY = (doc as any).lastAutoTable.finalY;

    // Otra fila de información personal
    doc.autoTable({
      startY: finalY,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 0.5 },
      headStyles: { fillColor: [0, 150, 136], textColor: 255 },
      head: [['Fecha y Lugar de Expedición', 'Fecha y Lugar de Nacimiento', 'Celular', 'Email']],
      body: [
        [this.fichaTecnicaForm.get('fechaExpedicionylugardeexpedicion')?.value, this.fichaTecnicaForm.get('fechaNacimientoylugardenacimiento')?.value, this.fichaTecnicaForm.get('celular')?.value, this.fichaTecnicaForm.get('correoelectronico')?.value]
      ]
    });

    finalY = (doc as any).lastAutoTable.finalY;

    // Tercera fila de información personal
    doc.autoTable({
      startY: finalY,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 0.5 },
      headStyles: { fillColor: [0, 150, 136], textColor: 255 },
      head: [['Dirección', 'Mun/Bar.', 'Estado Civil', 'RH']],
      body: [
        [this.fichaTecnicaForm.get('direccion')?.value, this.fichaTecnicaForm.get('municipioBarrio')?.value, this.fichaTecnicaForm.get('estadoCivil')?.value, this.fichaTecnicaForm.get('rh')?.value]
      ]
    });

    finalY = (doc as any).lastAutoTable.finalY;

    // Sección EPS, AFP, AFC y Caja de Compensación
    doc.autoTable({
      startY: finalY,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 0.5 },
      headStyles: { fillColor: [0, 150, 136], textColor: 255 },
      head: [['EPS', 'AFP', 'AFC', 'Caja de Compensación']],
      body: [
        [this.fichaTecnicaForm.get('eps')?.value, this.fichaTecnicaForm.get('afp')?.value, this.fichaTecnicaForm.get('afc')?.value, this.fichaTecnicaForm.get('cajaCompensacion')?.value]
      ]
    });

    finalY = (doc as any).lastAutoTable.finalY + 5;

    // Nota
    doc.setFontSize(7);
    doc.text('*Dejo constancia de que elegí voluntariamente la afiliación...', 10, finalY);

    finalY += 10;

    // Sección: Información Académica
    doc.setFontSize(9);
    doc.text('INFORMACIÓN ACADÉMICA', 10, finalY - 5);

    doc.autoTable({
      startY: finalY,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 0.5 },
      headStyles: { fillColor: [0, 150, 136], textColor: 255 },
      head: [['Grado Escolar', 'Técnico', 'Universidad', 'Especialización', 'Otros']],
      body: [
        [this.fichaTecnicaForm.get('gradoEscolaridad')?.value, this.fichaTecnicaForm.get('isTecnologo')?.value ? 'Sí' : 'No', this.fichaTecnicaForm.get('isUniversidad')?.value ? 'Sí' : 'No', this.fichaTecnicaForm.get('isEspecializacion')?.value ? 'Sí' : 'No', this.fichaTecnicaForm.get('isOtros')?.value ? 'Sí' : 'No']
      ]
    });

    finalY = (doc as any).lastAutoTable.finalY;

    // Sección: Información Familiar
    doc.text('INFORMACIÓN FAMILIAR', 10, finalY - 5);

    doc.autoTable({
      startY: finalY,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 0.5 },
      headStyles: { fillColor: [0, 150, 136], textColor: 255 },
      head: [['Nombre y Apellido (Padre)', 'Teléfono', 'Ocupación', 'Barrio/Municipio']],
      body: [
        [this.fichaTecnicaForm.get('nombreapellidoPadre')?.value, this.fichaTecnicaForm.get('telefonoPadre')?.value, this.fichaTecnicaForm.get('ocupacionPadre')?.value, this.fichaTecnicaForm.get('barrioMunicipioPadre')?.value]
      ]
    });

    finalY = (doc as any).lastAutoTable.finalY;

    // Sección: Información de Hijos
    doc.text('INFORMACIÓN DE HIJOS', 10, finalY - 5);

    doc.autoTable({
      startY: finalY,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 0.5 },
      headStyles: { fillColor: [0, 150, 136], textColor: 255 },
      head: [['Apellidos y Nombres', 'Fecha Nacimiento', 'Identificación', 'Sexo', 'Edad', 'Estudia/Trabaja', 'Curso']],
      body: [
        [this.fichaTecnicaForm.get('apellidosynombresHijos1')?.value, this.fichaTecnicaForm.get('fechaNacimientoHijos1')?.value, this.fichaTecnicaForm.get('numerodeIdentificacionHijos1')?.value, this.fichaTecnicaForm.get('sexoHijo1')?.value, this.fichaTecnicaForm.get('edadHijo1')?.value, this.fichaTecnicaForm.get('estudiaTrabajaHijo1')?.value, this.fichaTecnicaForm.get('cursoHijo1')?.value]
        // Puedes agregar más hijos aquí de manera similar.
      ]
    });

    finalY = (doc as any).lastAutoTable.finalY;

    // Sección: Información de Dotación
    doc.text('INFORMACIÓN DE DOTACIÓN', 10, finalY - 5);

    doc.autoTable({
      startY: finalY,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 0.5 },
      headStyles: { fillColor: [0, 150, 136], textColor: 255 },
      head: [['Talla Chaqueta', 'Talla Pantalón', 'Talla Overol', 'No. Calzado', 'No. Botas Cuacho', 'No. Zapatones', 'No. Botas Material']],
      body: [
        [this.fichaTecnicaForm.get('tallachaqueta')?.value, this.fichaTecnicaForm.get('tallaPantalon')?.value, this.fichaTecnicaForm.get('tallaOverol')?.value, this.fichaTecnicaForm.get('noCalzado')?.value, this.fichaTecnicaForm.get('noBotasCuacho')?.value, this.fichaTecnicaForm.get('noZapatones')?.value, this.fichaTecnicaForm.get('noBotasMaterial')?.value]
      ]
    });

    finalY = (doc as any).lastAutoTable.finalY;

    // Sección: Referencias Personales
    doc.text('REFERENCIAS PERSONALES', 10, finalY - 5);

    doc.autoTable({
      startY: finalY,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 0.5 },
      headStyles: { fillColor: [0, 150, 136], textColor: 255 },
      head: [['Nombre', 'Teléfono', 'Ocupación']],
      body: [
        [this.fichaTecnicaForm.get('nombreReferenciapersonal1')?.value, this.fichaTecnicaForm.get('telefonoReferenciapersonal1')?.value, this.fichaTecnicaForm.get('ocupacionReferenciapersonal1')?.value],
        [this.fichaTecnicaForm.get('nombreReferenciapersonal2')?.value, this.fichaTecnicaForm.get('telefonoReferenciapersonal2')?.value, this.fichaTecnicaForm.get('ocupacionReferenciapersonal2')?.value]
      ]
    });

    finalY = (doc as any).lastAutoTable.finalY;

    // Sección: Referencias Familiares
    doc.text('REFERENCIAS FAMILIARES', 10, finalY - 5);

    doc.autoTable({
      startY: finalY,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 0.5 },
      headStyles: { fillColor: [0, 150, 136], textColor: 255 },
      head: [['Nombre', 'Teléfono', 'Ocupación']],
      body: [
        [this.fichaTecnicaForm.get('nombreReferenciaFamiliar1')?.value, this.fichaTecnicaForm.get('telefonoReferenciaFamiliar1')?.value, this.fichaTecnicaForm.get('ocupacionReferenciaFamiliar1')?.value],
        [this.fichaTecnicaForm.get('nombreReferenciaFamiliar2')?.value, this.fichaTecnicaForm.get('telefonoReferenciaFamiliar2')?.value, this.fichaTecnicaForm.get('ocupacionReferenciaFamiliar2')?.value]
      ]
    });

    finalY = (doc as any).lastAutoTable.finalY;

    // Sección: Referencias Laborales
    doc.text('REFERENCIAS LABORALES', 10, finalY - 5);

    doc.autoTable({
      startY: finalY,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 0.5 },
      headStyles: { fillColor: [0, 150, 136], textColor: 255 },
      head: [['Nombre Empresa', 'Teléfono Empresa', 'Fecha Retiro']],
      body: [
        [this.fichaTecnicaForm.get('nombreEmpresa1')?.value, this.fichaTecnicaForm.get('telefonoEmpresa1')?.value, this.fichaTecnicaForm.get('fechaRetiro1')?.value],
        [this.fichaTecnicaForm.get('nombreEmpresa2')?.value, this.fichaTecnicaForm.get('telefonoEmpresa2')?.value, this.fichaTecnicaForm.get('fechaRetiro2')?.value]
      ]
    });

    finalY = (doc as any).lastAutoTable.finalY + 10;

    // Sección: Firma y Huella
    doc.text('Firma:', 10, finalY);
    const firma = this.fichaTecnicaForm.get('firma')?.value;
    if (firma) {
      const firmaBase64 = firma.replace(/^data:image\/(png|jpg);base64,/, '');
      doc.addImage(firmaBase64, 'PNG', 10, finalY + 5, 40, 15);
    }

    doc.text('Huella:', 80, finalY);
    const huella = this.fingerprintImagePD;
    if (huella) {
      const huellaBase64 = huella.replace(/^data:image\/(png|jpg);base64,/, '');
      doc.addImage(huellaBase64, 'PNG', 80, finalY + 5, 40, 15);
    }

    finalY += 20;

    // Sección: Firma del Responsable
    doc.text('NOMBRE Y CÉDULA DE QUIEN CONTRATA:', 10, finalY);
    doc.text(`${this.fichaTecnicaForm.get('nombreContrata')?.value} C.C. ${this.fichaTecnicaForm.get('cedulaContrata')?.value}`, 10, finalY + 5);

    // Guardar el PDF
    doc.save('Ficha_Tecnica.pdf');
  }




}
