import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { NavbarLateralComponent } from '../../components/navbar-lateral/navbar-lateral.component';
import { NavbarSuperiorComponent } from '../../components/navbar-superior/navbar-superior.component';
import { InfoCardComponent } from '../../components/info-card/info-card.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import Swal from 'sweetalert2';
import { NgClass, NgFor, NgForOf, NgIf, NgStyle } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { ContratacionService } from '../../services/contratacion/contratacion.service';
import { catchError, elementAt, forkJoin, of } from 'rxjs';
import { LeerInfoCandidatoComponent } from '../../components/leer-info-candidato/leer-info-candidato.component';
import { MatDialog } from '@angular/material/dialog';
import { VacantesService } from '../../services/vacantes/vacantes.service';
import { MatMenuModule } from '@angular/material/menu';
import { SeleccionService } from '../../services/seleccion/seleccion.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { GestionDocumentalService } from '../../services/gestion-documental/gestion-documental.service';

@Component({
  selector: 'app-contratacion',
  standalone: true,
  imports: [
    NavbarLateralComponent,
    NavbarSuperiorComponent,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatCardModule,
    NgIf,
    NgFor,
    NgForOf,
    NgStyle,
    MatExpansionModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule
  ],
  templateUrl: './contratacion.component.html',
  styleUrl: './contratacion.component.css'
})
export class ContratacionComponent implements OnInit {
  procesoValido: boolean = false;
  codigoContrato: string = ''; // Variable to store the contract code
  sede: string = '';
  sedeLogin: string = '';
  cedula: string = ''; // Variable to store the cedula input
  nombreEmpresa: string = ''; // Variable to store the company name
  // Formularios 
  formGroup1!: FormGroup;
  formGroup2!: FormGroup;
  formGroup3!: FormGroup;
  formGroup4!: FormGroup;

  // Formularios de ayuda
  datosPersonales!: FormGroup;
  datosPersonalesParte2!: FormGroup;
  datosTallas!: FormGroup;
  datosConyugue!: FormGroup;
  datosPadre!: FormGroup;
  datosMadre!: FormGroup;
  datosReferencias!: FormGroup;
  datosExperienciaLaboral!: FormGroup;
  datosHijos!: FormGroup;
  datosParte3Seccion1!: FormGroup;
  datosParte3Seccion2!: FormGroup;
  datosParte4!: FormGroup;

  pagoTransporteForm!: FormGroup;
  referenciasForm!: FormGroup;
  huellaForm: FormGroup;

  // Variables de ayuda
  filteredExamOptions: string[] = [];

  trasladosForm!: FormGroup;

  seleccion: any;
  infoGeneralC: any;
  infoGeneral: boolean = false;
  epsList: string[] = [
    'ALIANSALUD',
    'ASMET SALUD',
    'CAJACOPI',
    'CAPITAL SALUD',
    'CAPRESOCA',
    'COMFAMILIARHUILA',
    'COMFAORIENTE',
    'COMPENSAR',
    'COOSALUD',
    'DUSAKAWI',
    'ECOOPSOS',
    'FAMISANAR',
    'FAMILIAR DE COLOMBIA',
    'MUTUAL SER',
    'NUEVA EPS',
    'PIJAOS SALUD',
    'SALUD TOTAL',
    'SANITAS',
    'SAVIA SALUD',
    'SOS',
    'SURA',
    'No Tiene',
    'Sin Buscar',
  ];

  afpList: string[] = [
    'PORVENIR',
    'COLFONDOS',
    'PROTECCION',
    'COLPENSIONES'
  ];

  laborExams = [
    { labor: 'ADMINISTRACIÓN', exams: ['Exámen Ingreso', 'Visiometria'] },
    { labor: 'RECEPCIONISTA', exams: ['Exámen Ingreso', 'Visiometria'] },
    { labor: 'SST, JEFE, EJECUTIVOS', exams: ['Exámen Ingreso', 'Visiometria'] },
    { labor: 'SERVICIOS GENERALES (MANIPULADORES DE ALIMENTOS)', exams: ['Exámen Ingreso', 'Visiometria', 'Frotis de uñas', 'Frotis de garganta', 'Coprológico'] },
    { labor: 'MENSAJERO MOTORIZADO', exams: ['Exámen Ingreso', 'Optometría', 'Audiometría'] },
    { labor: 'ORNATOS (LABORES EN PISO)', exams: ['Exámen Ingreso', 'Visiometria', 'Audiometría'] },
    { labor: 'ORNATOS (LABORES EN ALTURAS)', exams: ['Exámen Ingreso', 'Glicemia Basal', 'Perfil lípidico', 'Optometría', 'Audiometría'] },
    { labor: 'ORNATOS ASPERSION', exams: ['Exámen Ingreso', 'Colinesterasa'] },
    { labor: 'ALMACENISTA SIN EXPOSICION A AGROQUIMICOS', exams: ['Exámen Ingreso', 'Visiometria'] },
    { labor: 'ALMACENISTA TRABAJO ALTURA', exams: ['Exámen Ingreso', 'Glicemia Basal', 'Perfil lípidico', 'Optometría', 'Audiometría'] },
    { labor: 'ALMACENISTA CON EXPOSICION A AGROQUIMICOS', exams: ['Exámen Ingreso', 'Colinesterasa'] },
    { labor: 'CASINO', exams: ['Exámen Ingreso', 'Visiometria', 'Frotis de uñas', 'Frotis de garganta', 'Coprológico'] },
    { labor: 'JEFE Y AUXILIARES', exams: ['Exámen Ingreso', 'Visiometria'] },
    { labor: 'OPERARIO DE PRUEBAS DE EFICACIA', exams: ['Exámen Ingreso', 'Colinesterasa', 'Visiometria', 'Audiometría', 'Espirometría'] },
    { labor: 'ASISTENTE PRUEBAS DE EFICACIA', exams: ['Exámen Ingreso', 'Colinesterasa', 'Visiometria', 'Audiometría', 'Espirometría'] },
    { labor: 'JEFE DE PRUEBAS DE EFICACIA', exams: ['Exámen Ingreso', 'Colinesterasa', 'Optometría', 'Audiometría', 'Espirometría', 'Cuadro hematico', 'Creatinina', 'TGO'] },
    { labor: 'OPERARIO DE MICROBIOLOGÍA', exams: ['Exámen Ingreso', 'Colinesterasa', 'Visiometria', 'Espirometría'] },
    { labor: 'SUPERVISOR DE MICROBIOLOGÍA', exams: ['Exámen Ingreso', 'Colinesterasa', 'Visiometria', 'Espirometría'] },
    { labor: 'JEFE DE MICROBIOLOGÍA', exams: ['Exámen Ingreso', 'Colinesterasa', 'Optometría', 'Espirometría'] },
    { labor: 'DIRECCIÓN DE INVESTIGACIÓN Y DESARROLLO', exams: ['Exámen Ingreso', 'Colinesterasa', 'Optometría', 'Espirometría', 'Cuadro hematico', 'Creatinina', 'TGO'] },
    { labor: 'ASISTENTE DE INVESTIGACIÓN Y DESARROLLO', exams: ['Exámen Ingreso', 'Visiometria', 'Espirometría'] },
    { labor: 'JEFE DE INVESTIGACIÓN Y DESARROLLO', exams: ['Exámen Ingreso', 'Colinesterasa', 'Visiometria', 'Espirometría'] },
    { labor: 'EJECUTIVO DE ENTOMOLOGÍA', exams: ['Exámen Ingreso', 'Colinesterasa', 'Visiometria', 'Espirometría'] },
    { labor: 'EJECUTIVO DE PROYECTOS ESPECIALES', exams: ['Exámen Ingreso', 'Colinesterasa', 'Visiometria', 'Espirometría'] },
    { labor: 'PASANTE PROFESIONAL', exams: ['Exámen Ingreso', 'Colinesterasa', 'Visiometria', 'Espirometría'] },
    { labor: 'PASANTE SENA', exams: ['Exámen Ingreso', 'Colinesterasa', 'Visiometria', 'Espirometría'] },
    { labor: 'EJECUTIVO DE PCR', exams: ['Exámen Ingreso', 'Colinesterasa', 'Visiometria', 'Espirometría', 'Cuadro hematico', 'Creatinina', 'TGO'] },
    { labor: 'DIRECTOR DE LABORATORIO INVITRO', exams: ['Exámen Ingreso', 'Colinesterasa'] },
    { labor: 'LABORATORIO (BLOQUE EXPERIMENTAL ACAROS)', exams: ['Exámen Ingreso', 'Optometría', 'Espirometría'] },
    { labor: 'ACAROS (FUMIGADORES)', exams: ['Exámen Ingreso', 'Colinesterasa', 'Optometría'] },
    { labor: 'PRODUCCIÓN DE BIOCONTROLADORES (TRABAJO ALTURAS- ESCALERAS > 1,5 METROS)', exams: ['Exámen Ingreso', 'Glicemia Basal', 'Perfil lípidico', 'Optometría', 'Audiometría', 'Espirometría'] },
    { labor: 'PRODUCCIÓN DE BIOCONTROLADORES', exams: ['Exámen Ingreso', 'Optometría', 'Audiometría', 'Espirometría'] },
    { labor: 'FUMIGACIÓN UNIDAD EXPERIMENTAL ACAROS', exams: ['Exámen Ingreso', 'Colinesterasa'] },
    { labor: 'CALDERA (OPERARIO Y AYUDANTE)', exams: ['Exámen Ingreso', 'Visiometria', 'Audiometría', 'Espirometría'] },
    { labor: 'ELECTRICISTAS Y AYUDANTES', exams: ['Exámen Ingreso', 'Glicemia Basal', 'Perfil lípidico', 'Optometría', 'Audiometría'] },
    { labor: 'MANTENIMIENTO EN PISO', exams: ['Exámen Ingreso', 'Visiometria'] },
    { labor: 'MECÁNICO', exams: ['Exámen Ingreso', 'Visiometria', 'Audiometría', 'Espirometría'] },
    { labor: 'MECATRÓNICO', exams: ['Exámen Ingreso', 'Glicemia Basal', 'Perfil lípidico', 'Optometría', 'Audiometría'] },
    { labor: 'OBRAS CIVILES Y AYUDANTES', exams: ['Exámen Ingreso', 'Glicemia Basal', 'Perfil lípidico', 'Optometría', 'Audiometría'] },
    { labor: 'OP. SIERRA ELÉCTRICA', exams: ['Exámen Ingreso', 'Visiometria', 'Audiometría', 'Espirometría'] },
    { labor: 'SOLDADORES, AYUDANTES Y TRONZADORA', exams: ['Exámen Ingreso', 'Glicemia Basal', 'Perfil lípidico', 'Optometría', 'Audiometría', 'Espirometría'] },
    { labor: 'SUPERVISOR DE MANTENIMIENTO', exams: ['Exámen Ingreso', 'Optometría', 'Audiometría', 'Espirometría'] },
    { labor: 'SUPERVISOR DE MANTENIMIENTO ALTURAS', exams: ['Exámen Ingreso', 'Glicemia Basal', 'Perfil lípidico', 'Optometría', 'Audiometría'] },
    { labor: 'TRABAJO EN ALTURAS', exams: ['Exámen Ingreso', 'Glicemia Basal', 'Perfil lípidico', 'Optometría', 'Audiometría'] },
    { labor: 'TRACTORISTA', exams: ['Exámen Ingreso', 'Optometría', 'Audiometría'] },
    { labor: 'CONDUCTORES', exams: ['Exámen Ingreso', 'Optometría', 'Audiometría'] },
    { labor: 'BOMBERO GASOLINA', exams: ['Exámen Ingreso', 'Audiometría', 'Espirometría'] },
    { labor: 'ENVASE DE AGUA POTABLE', exams: ['Exámen Ingreso', 'Visiometria', 'Frotis de uñas', 'Frotis de garganta', 'Coprológico'] },
    { labor: 'PLANTA DE AGUA POTABLE', exams: ['Exámen Ingreso', 'Perfil lípidico', 'Visiometria', 'Optometría', 'Audiometría', 'Frotis de uñas', 'Frotis de garganta', 'Coprológico'] },
    { labor: 'ING CIVIL', exams: ['Exámen Ingreso', 'Glicemia Basal', 'Perfil lípidico', 'Optometría', 'Audiometría'] },
    { labor: 'COORDINADOR MANTENIMIENTO', exams: ['Exámen Ingreso', 'Optometría'] },
    { labor: 'EJECUTIVO ING RIEGO', exams: ['Exámen Ingreso', 'Glicemia Basal', 'Perfil lípidico', 'Optometría', 'Audiometría'] },
    { labor: 'SOLDADORES PISO', exams: ['Exámen Ingreso', 'Optometría', 'Audiometría', 'Espirometría'] },
    { labor: 'ELECTRICISTAS PISO', exams: ['Exámen Ingreso'] },
    { labor: 'DEVITALIZACION (FOSFINA)', exams: ['Exámen Ingreso'] },
    { labor: 'DEVITALIZACION', exams: ['Exámen Ingreso', 'Audiometría'] },
    { labor: 'DESINFECCION POSCOSECHAS', exams: ['Exámen Ingreso'] },
    { labor: 'FUMIGACION UNIDAD EXPERIMENTAL ACAROS', exams: ['Exámen Ingreso', 'Colinesterasa'] },
    { labor: 'RIESGO QUÍMICO (AGROQUIMICOS), ASPERJADORES, SUPERVISORES, BOMBEROS, ALMACENISTA', exams: ['Exámen Ingreso', 'Colinesterasa', 'Visiometria'] },
    { labor: 'RIESGO QUÍMICO (AGROQUIMICOS) BOMBEROS', exams: ['Exámen Ingreso', 'Colinesterasa', 'Visiometria', 'Audiometría'] },
    { labor: 'JEFATURA MIPE', exams: ['Exámen Ingreso', 'Colinesterasa'] },
    { labor: 'RIEGO', exams: ['Exámen Ingreso', 'Visiometria'] },
    { labor: 'RIEGO (BOMBERO)', exams: ['Exámen Ingreso', 'Visiometria', 'Audiometría'] },
    { labor: 'MONTACARGAS', exams: ['Exámen Ingreso', 'Optometría', 'Audiometría'] },
    { labor: 'MONTACARGA - TRABAJO EN ALTURAS', exams: ['Exámen Ingreso', 'Glicemia Basal', 'Perfil lípidico', 'Optometría', 'Audiometría'] },
    { labor: 'MONTACARGA ELECTRICO', exams: ['Exámen Ingreso', 'Optometría'] },
    { labor: 'OPERARIO POSCOSECHA', exams: ['Exámen Ingreso', 'Visiometria'] },
    { labor: 'TINTURADO', exams: ['Exámen Ingreso', 'Visiometria', 'Audiometría', 'Espirometría'] },
    { labor: 'OP ASPIRADORA Y/O SOPLADORA', exams: ['Exámen Ingreso', 'Visiometria', 'Audiometría'] },
    { labor: 'ACAROS', exams: ['Exámen Ingreso', 'Optometría', 'Espirometría'] },
    { labor: 'CABLE MOTOR', exams: ['Exámen Ingreso', 'Visiometria', 'Audiometría', 'Espirometría'] },
    { labor: 'CALIDAD', exams: ['Exámen Ingreso', 'Optometría'] },
    { labor: 'CHAMANEO Y/O SAHUMERIO', exams: ['Exámen Ingreso', 'Visiometria', 'Espirometría'] },
    { labor: 'GUADAÑADORES', exams: ['Exámen Ingreso', 'Visiometria', 'Audiometría'] },
    { labor: 'HORMONADO', exams: ['Exámen Ingreso', 'Visiometria'] },
    { labor: 'MONITORES', exams: ['Exámen Ingreso', 'Optometría'] },
    { labor: 'MOTONIVELADORA', exams: ['Exámen Ingreso', 'Visiometria', 'Audiometría'] },
    { labor: 'OPERARIO CULTIVO', exams: ['Exámen Ingreso', 'Visiometria'] },
    { labor: 'TERMONEBULIZADORA', exams: ['Exámen Ingreso', 'Visiometria', 'Audiometría'] },
    { labor: 'OP. TRABAJO DE SUELOS - COMPOST', exams: ['Exámen Ingreso', 'Visiometria', 'Audiometría'] },
    { labor: 'TRABAJO DE SUELOS', exams: ['Exámen Ingreso', 'Visiometria'] },
    { labor: 'TRABAJO DE SUELOS-MOTOCULTOR', exams: ['Exámen Ingreso', 'Visiometria', 'Audiometría'] },
    { labor: 'TRABAJO DE SUELOS-DESBROZADORA', exams: ['Exámen Ingreso', 'Visiometria', 'Audiometría', 'Espirometría'] },
    { labor: 'OP MAQUINA PLANA', exams: ['Exámen Ingreso', 'Visiometria'] },
    { labor: 'SEGURIDAD FISICA Y ESCOLTAS', exams: ['Exámen Ingreso', 'Optometría', 'Audiometría', 'Sicometrico'] },

    //--------------------------------------------------------------------------------

    { labor: 'AGRICULTOR Y VARIOS', exams: ['Examen Médico', 'Osteomuscular', 'Quimico (Respiratorio - Dermatologico)', 'Cardiovascular'] },
    { labor: 'BRIGADISTAS', exams: ['Examen Médico', 'Osteomuscular', 'Cardiovascular'] },
    { labor: 'OPERARIO APLICADOR DE FOSFINAS', exams: ['Examen Médico', 'Osteomuscular', 'Quimico (Respiratorio - Dermatologico)', 'Cardiovascular', 'Espirometría', 'Cuadro Hemático'] },
    { labor: 'OPERARIO PLANTA TRATAMIENTO DE AGUA POTABLE', exams: ['Examen Médico', 'Osteomuscular', 'Quimico (Respiratorio - Dermatologico)', 'Cardiovascular', 'Trabajo en alturas (Incluye test para detección de fobia a las alturas: El AQ (Acrophobia Questionnaire) de Cohen)', 'Visiometría', 'Audiometría', 'Espirometría', 'Perfil Lipídico', 'Cuadro Hemático', 'Electrocardiograma (Sólo aplica para mayores de 45 años)', 'Glicemia'] },
    { labor: 'OPERARIO TERMONEBULIZADORA', exams: ['Examen Médico', 'Osteomuscular', 'Quimico (Respiratorio - Dermatologico)', 'Cardiovascular', 'Visiometría', 'Audiometría', 'Espirometría'] },
    { labor: 'OPERARIO TRABAJO EN ALTURAS', exams: ['Examen Médico', 'Osteomuscular', 'Quimico (Respiratorio - Dermatologico)', 'Cardiovascular', 'Trabajo en alturas (Incluye test para detección de fobia a las alturas: El AQ (Acrophobia Questionnaire) de Cohen)', 'Visiometría', 'Audiometría', 'Perfil Lipídico', 'Cuadro Hemático', 'Electrocardiograma (Sólo aplica para mayores de 45 años)', 'Glicemia'] },
    { labor: 'OPERARIO DE ASPIRADORA', exams: ['Examen Médico', 'Osteomuscular', 'Quimico (Respiratorio - Dermatologico)', 'Cardiovascular', 'Audiometría'] },
    { labor: 'OPERARIO DE SOPLADO', exams: ['Examen Médico', 'Osteomuscular', 'Quimico (Respiratorio - Dermatologico)', 'Cardiovascular', 'Audiometría'] },
    { labor: 'OPERARIO FOGONEO', exams: ['Examen Médico', 'Osteomuscular', 'Quimico (Respiratorio - Dermatologico)', 'Cardiovascular', 'Espirometría'] },
    { labor: 'AUXILIAR DE INVENTARIOS', exams: ['Examen Médico', 'Osteomuscular', 'Quimico (Respiratorio - Dermatologico)', 'Cardiovascular', 'Trabajo en alturas (Incluye test para detección de fobia a las alturas: El AQ (Acrophobia Questionnaire) de Cohen)', 'Visiometría', 'Audiometría', 'Perfil Lipídico', 'Cuadro Hemático', 'Electrocardiograma (Sólo aplica para mayores de 45 años)', 'Glicemia'] },
    { labor: 'JEFE DE RIEGO', exams: ['Examen Médico', 'Osteomuscular', 'Quimico (Respiratorio - Dermatologico)', 'Cardiovascular', 'Espirometría', 'Colinesterasa'] },
    { labor: 'JEFE DE FUMIGACIÓN', exams: ['Examen Médico', 'Osteomuscular', 'Quimico (Respiratorio - Dermatologico)', 'Cardiovascular', 'Colinesterasa'] },
    { labor: 'FUMIGADOR O ASPERJADOR', exams: ['Examen Médico', 'Osteomuscular', 'Quimico (Respiratorio - Dermatologico)', 'Cardiovascular', 'Colinesterasa'] },
    { labor: 'BOMBERO DE FUMIGACION', exams: ['Examen Médico', 'Osteomuscular', 'Quimico (Respiratorio - Dermatologico)', 'Cardiovascular', 'Colinesterasa'] },
    { labor: 'BOMBERO DE RIEGO', exams: ['Examen Médico', 'Osteomuscular', 'Quimico (Respiratorio - Dermatologico)', 'Cardiovascular', 'Espirometría', 'Colinesterasa'] },
    { labor: 'AUDITOR MIPE', exams: ['Examen Médico', 'Osteomuscular', 'Quimico (Respiratorio - Dermatologico)', 'Cardiovascular', 'Colinesterasa'] },
    { labor: 'AUDITOR MIRFE', exams: ['Examen Médico', 'Osteomuscular', 'Quimico (Respiratorio - Dermatologico)', 'Espirometría', 'Colinesterasa'] },
    { labor: 'OPERARIO VALVULERO', exams: ['Examen Médico', 'Osteomuscular', 'Quimico (Respiratorio - Dermatologico)', 'Cardiovascular', 'Colinesterasa'] },
    { labor: 'HORMONERO', exams: ['Examen Médico', 'Osteomuscular', 'Quimico (Respiratorio - Dermatologico)', 'Cardiovascular', 'Colinesterasa'] },
    { labor: 'OPERARIO DESINFECCIÓN SUELOS', exams: ['Examen Médico', 'Osteomuscular', 'Quimico (Respiratorio - Dermatologico)', 'Tegumentaria', 'Cardiovascular', 'Espirometría', 'Hemograma'] },
    { labor: 'OPERARIO APLICADOR DE HERBICIDA', exams: ['Examen Médico', 'Osteomuscular', 'Quimico (Respiratorio - Dermatologico)', 'Cardiovascular', 'Espirometría', 'Cuadro Hemático'] },
    { labor: 'OPERARIO PREPARACIÓN STS', exams: ['Examen Médico', 'Osteomuscular', 'Quimico (Respiratorio - Dermatologico)', 'Cardiovascular'] },
    { labor: 'PREPARACIÓN HIDRATACIÓN', exams: ['Examen Médico', 'Osteomuscular', 'Quimico (Respiratorio - Dermatologico)', 'Cardiovascular', 'Espirometría'] },
    { labor: 'OPERARIO ARMADO Y COSIDO DE CARTON', exams: ['Examen Médico', 'Osteomuscular', 'Quimico (Respiratorio - Dermatologico)', 'Cardiovascular', 'Audiometría'] },
    { labor: 'AUXILIAR DE BODEGA CARTON', exams: ['Examen Médico', 'Osteomuscular', 'Quimico (Respiratorio - Dermatologico)', 'Cardiovascular', 'Trabajo en alturas (Incluye test para detección de fobia a las alturas: El AQ (Acrophobia Questionnaire) de Cohen)', 'Visiometría', 'Audiometría', 'Perfil Lipídico', 'Cuadro Hemático', 'Electrocardiograma (Sólo aplica para mayores de 45 años)', 'Glicemia'] },
    { labor: 'JEFE DE ALMACEN', exams: ['Examen Médico', 'Osteomuscular', 'Quimico (Respiratorio - Dermatologico)', 'Cardiovascular', 'Espirometría', 'Colinesterasa', 'ALT (Alanina Trasaminasa)', 'AST (Aspartato Trasaminasa)', 'Hemograma'] },
    { labor: 'ALMACENISTA DE PRODUCTOS QUIMICOS / DOSIFICADOR DE QUIMICOS', exams: ['Examen Médico', 'Osteomuscular', 'Quimico (Respiratorio - Dermatologico)', 'Cardiovascular', 'Espirometría', 'Colinesterasa', 'ALT (Alanina Trasaminasa)', 'AST (Aspartato Trasaminasa)', 'Hemograma'] },
    { labor: 'PLOMERO', exams: ['Examen Médico', 'Osteomuscular', 'Quimico (Respiratorio - Dermatologico)', 'Cardiovascular', 'Audiometría'] },
    { labor: 'SOLDADOR Y ORNAMENTADOR', exams: ['Examen Médico', 'Osteomuscular', 'Quimico (Respiratorio - Dermatologico)', 'Cardiovascular', 'Visiometría', 'Audiometría', 'Espirometría'] },
    { labor: 'ELECTRICISTA / TÉCNICO ELÉCTRICO', exams: ['Examen Médico', 'Osteomuscular', 'Quimico (Respiratorio - Dermatologico)', 'Cardiovascular', 'Trabajo en alturas (Incluye test para detección de fobia a las alturas: El AQ (Acrophobia Questionnaire) de Cohen)', 'Visiometría', 'Audiometría', 'Perfil Lipídico', 'Cuadro Hemático', 'Electrocardiograma (Sólo aplica para mayores de 45 años)', 'Glicemia'] },
    { labor: 'OPERARIO DE COMPOST', exams: ['Examen Médico', 'Osteomuscular', 'Quimico (Respiratorio - Dermatologico)', 'Cardiovascular'] },
    { labor: 'OPERARIO DE MUESTRAS POZOS SEPTICOS', exams: ['Examen Médico', 'Osteomuscular', 'Quimico (Respiratorio - Dermatologico)', 'Cardiovascular', 'HEPATITIS A Y B', 'TETANO VACUNA T-D'] },
    { labor: 'OPERARIO DE RESPEL', exams: ['Examen Médico', 'Osteomuscular', 'Quimico (Respiratorio - Dermatologico)', 'Cardiovascular', 'Espirometría', 'Colinesterasa'] },
    { labor: 'CONDUCTOR TODO TIPO DE VEHICULOS: TRACTOR, RETRO ESCABADORA, CAMIONES, TRACTOR', exams: ['Examen Médico', 'Osteomuscular', 'Quimico (Respiratorio - Dermatologico)', 'Cardiovascular', 'Visiometría', 'Audiometría', 'Perfil Lipídico', 'Cuadro Hemático', 'Glicemia', 'Exámen médico integral definido para conductores'] },
    { labor: 'OPERARIO DE MONTACARGAS', exams: ['Examen Médico', 'Osteomuscular', 'Quimico (Respiratorio - Dermatologico)', 'Cardiovascular', 'Trabajo en alturas (Incluye test para detección de fobia a las alturas: El AQ (Acrophobia Questionnaire) de Cohen)', 'Visiometría', 'Audiometría', 'Espirometría', 'Perfil Lipídico', 'Cuadro Hemático', 'Glicemia', 'Exámen médico integral definido para conductores'] },
    { labor: 'ANALISTA', exams: ['Examen Médico', 'Osteomuscular', 'Cardiovascular'] },
    { labor: 'AUXILIAR ADMINISTRATIVO', exams: ['Examen Médico', 'Osteomuscular', 'Cardiovascular'] },
    { labor: 'COORDINADOR RIESGO QUIMICO / ASEGURAMIENTO RIESGO QUIMICO', exams: ['Examen Médico', 'Osteomuscular', 'Quimico (Respiratorio - Dermatologico)', 'Cardiovascular', 'Colinesterasa'] },
    { labor: 'COORDINADOR', exams: ['Examen Médico', 'Osteomuscular', 'Cardiovascular'] },
    { labor: 'DIRECTOR', exams: ['Examen Médico', 'Osteomuscular', 'Cardiovascular'] },
    { labor: 'GERENTE', exams: ['Examen Médico', 'Osteomuscular', 'Cardiovascular'] },
    { labor: 'JEFE', exams: ['Examen Médico', 'Osteomuscular', 'Quimico (Respiratorio - Dermatologico)', 'Cardiovascular'] },
    { labor: 'TECNICOS', exams: ['Examen Médico', 'Osteomuscular', 'Cardiovascular'] },
    { labor: 'OPERARIO MEZCLADOR DE TROMPO', exams: ['Examen Médico', 'Osteomuscular', 'Audiometría', 'Espirometría'] },
    { labor: 'PINTADO / TINTURADO', exams: ['Examen Médico', 'Osteomuscular', 'Quimico (Respiratorio - Dermatologico)', 'Tegumentaria', 'Visiometría', 'Audiometría', 'Espirometría'] },
    { labor: 'COORDINADOR MIPE', exams: ['Examen Médico', 'Osteomuscular'] },
    { labor: 'ESTIBADOR NO TRIPULADO', exams: ['Examen Médico', 'Visiometría'] },
    { labor: 'MANTENIMIENTO DE CABINAS DE PINTADO', exams: ['Examen Médico', 'Osteomuscular', 'Tegumentaria', 'Cardiovascular', 'Visiometría', 'Audiometría', 'Espirometría'] }
  ];

  examOptions: string[] = [
    'Colinesterasa', 'Glicemia Basal', 'Perfil lípidico', 'Visiometria', 'Optometría',
    'Audiometría', 'Espirometría', 'Sicometrico', 'Frotis de uñas', 'Frotis de garganta',
    'Cuadro hematico', 'Creatinina', 'TGO', 'Coprológico', 'Osteomuscular',
    'Quimico (Respiratorio - Dermatologico)', 'Tegumentaria', 'Cardiovascular', 'Trabajo en alturas',
    'Visiometría', 'Audiometría', 'Espirometría', 'Perfil Lipídico', 'Cuadro Hemático', 'Colinesterasa',
    'Electrocardiograma (Sólo aplica para mayores de 45 años)', 'Glicemia', 'PT PTT (Prueba de coagulación)',
    'ALT (Alanina Trasaminasa)', 'AST (Aspartato Trasaminasa)', 'Hemograma', 'Frotis de Garganta',
    'KOH (Detección de hongos en uñas)', 'Coprológico', 'Exámen médico integral definido para conductores',
    'HEPATITIS A Y B', 'TETANO VACUNA T-D'
  ];

  typeMap: { [key: string]: number } = {
    eps: 7,
    policivos: 6,
    procuraduria: 3,
    contraloria: 4,
    medidasCorrectivas: 10,
    afp: 11,
    ramaJudicial: 12,
    sisben: 8,
    ofac: 5,
    personal1: 16,
    personal2: 16,
    familiar1: 17,
    familiar2: 17,
    traslado: 18,
  };

  antecedentesEstados: string[] = [
    'Cumple',
    'No Cumple',
    'Sin Buscar'
  ];

  uploadedFiles: { [key: string]: { file: File, fileName: string } } = {}; // Almacenar tanto el archivo como el nombre

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Ejecutar el código relacionado con localStorage solo si estamos en un navegador
      const cedula = localStorage.getItem('cedula');
      console.log('Cédula en localStorage:', cedula);
      if (cedula) {
        // Asignar la cédula al campo del formulario
        this.cedula = cedula;
        // Llamar a la función buscarCedula con el valor de la cédula
        this.buscarCedula();

        // Limpiar la cédula del local storage
        localStorage.removeItem('cedula');
      }
    }


    // Cargar lista completa de exámenes disponibles
    this.filteredExamOptions = [
      'Exámen Ingreso',
      'Colinesterasa',
      'Glicemia Basal',
      'Perfil lípidico',
      'Visiometria',
      'Optometría',
      'Audiometría',
      'Espirometría',
      'Sicometrico',
      'Frotis de uñas',
      'Frotis de garganta',
      'Cuadro hematico',
      'Creatinina',
      'TGO',
      'Coprológico',
      'Osteomuscular',
      'Quimico (Respiratorio - Dermatologico)',
      'Tegumentaria',
      'Cardiovascular',
      'Trabajo en alturas (Incluye test para detección de fobia a las alturas: El AQ (Acrophobia Questionnaire) de Cohen)',
      'Electrocardiograma (Sólo aplica para mayores de 45 años)',
      'Examen Médico',
      'HEPATITIS A Y B',
      'TETANO VACUNA T-D',
      'Exámen médico integral definido para conductores'
    ];

    // Suscribirse a los cambios en el campo "cargo"
    this.formGroup2.get('cargo')?.valueChanges.subscribe(cargo => {
      this.updateExamOptions(cargo);
    });

    // Inicializar con el primer cargo (si aplica)
    const cargoInicial = this.formGroup2.get('cargo')?.value;
    if (cargoInicial) {
      this.updateExamOptions(cargoInicial);
    }

  }

  isSidebarHidden = false;

  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
  }

  constructor(
    private fb: FormBuilder,
    private contratacionService: ContratacionService,
    public dialog: MatDialog,
    private vacantesService: VacantesService,
    private seleccionService: SeleccionService,
    private gestionDocumentalService: GestionDocumentalService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

    this.datosPersonales = this.fb.group({
      tipodedocumento: [''],
      numerodeceduladepersona: [''],
      primer_apellido: [''],
      segundo_apellido: [''],
      primer_nombre: [''],
      segundo_nombre: [''],
      genero: [''],
      primercorreoelectronico: [''],
      celular: [''],
      whatsapp: [''],
      departamento: [''],
      municipio: [''],
      estado_civil: [''],
      direccion_residencia: [''],
      barrio: [''],
      fecha_expedicion_cc: [''],
      departamento_expedicion_cc: [''],
      municipio_expedicion_cc: [''],
      lugar_nacimiento_municipio: [''],
      lugar_nacimiento_departamento: [''],
      rh: [''],
      zurdo_diestro: [''],
      hacecuantoviveenlazona: [''],
      lugar_anterior_residencia: [''],
      hace_cuanto_se_vino_y_porque: [''],
      zonas_del_pais: [''],
      donde_le_gustaria_vivir: [''],
      fecha_nacimiento: [''],
      estudia_actualmente: [''],
      familiar_emergencia: [''],
      parentesco_familiar_emergencia: [''],
      direccion_familiar_emergencia: [''],
      barrio_familiar_emergencia: [''],
      telefono_familiar_emergencia: [''],
      ocupacion_familiar_emergencia: ['']
    });

    this.datosPersonalesParte2 = this.fb.group({
      escolaridad: [''],
      estudiosExtra: [''],
      nombre_institucion: [''],
      ano_finalizacion: [''],
      titulo_obtenido: ['']
    });

    this.datosTallas = this.fb.group({
      chaqueta: [''],
      pantalon: [''],
      camisa: [''],
      calzado: ['']
    });

    this.datosConyugue = this.fb.group({
      nombre_conyugue: [''],
      apellido_conyugue: [''],
      num_doc_identidad_conyugue: [''],
      vive_con_el_conyugue: [''],
      direccion_conyugue: [''],
      telefono_conyugue: [''],
      barrio_municipio_conyugue: [''],
      ocupacion_conyugue: ['']
    });

    this.datosPadre = this.fb.group({
      nombre_padre: [''],
      vive_padre: [''],
      ocupacion_padre: [''],
      direccion_padre: [''],
      telefono_padre: [''],
      barrio_padre: ['']
    });

    this.datosMadre = this.fb.group({
      nombre_madre: [''],
      vive_madre: [''],
      ocupacion_madre: [''],
      direccion_madre: [''],
      telefono_madre: [''],
      barrio_madre: ['']
    });

    this.datosReferencias = this.fb.group({
      nombre_referencia_personal1: [''],
      telefono_referencia_personal1: [''],
      ocupacion_referencia_personal1: [''],
      tiempo_conoce_referencia_personal1: [''],
      nombre_referencia_personal2: [''],
      telefono_referencia_personal2: [''],
      ocupacion_referencia_personal2: [''],
      tiempo_conoce_referencia_personal2: [''],
      nombre_referencia_familiar1: [''],
      telefono_referencia_familiar1: [''],
      ocupacion_referencia_familiar1: [''],
      parentesco_referencia_familiar1: [''],
      nombre_referencia_familiar2: [''],
      telefono_referencia_familiar2: [''],
      ocupacion_referencia_familiar2: [''],
      parentesco_referencia_familiar2: ['']
    });

    this.datosExperienciaLaboral = this.fb.group({
      nombre_expe_laboral1_empresa: [''],
      direccion_empresa1: [''],
      telefonos_empresa1: [''],
      nombre_jefe_empresa1: [''],
      fecha_retiro_empresa1: [''],
      motivo_retiro_empresa1: [''],
      cargo_empresa1: [''],
      empresas_laborado: [''],
      labores_realizadas: [''],
      rendimiento: [''],
      porqueRendimiento: [''],
      personas_a_cargo: [''],
      como_es_su_relacion_familiar: ['']
    });

    this.datosHijos = this.fb.group({
      num_hijos_dependen_economicamente: [''],
      quien_los_cuida: [''],
      hijosArray: this.fb.array([]) // Inicializamos el FormArray vacío
    });

    this.datosParte3Seccion1 = this.fb.group({
      personas_con_quien_convive: [''],
      familia_con_un_solo_ingreso: [''],
      como_se_entero: ['']
    });

    this.datosParte3Seccion2 = this.fb.group({
      tipo_vivienda: [''],
      num_habitaciones: [''],
      num_personas_por_habitacion: [''],
      tipo_vivienda_2p: [''],
      caractteristicas_vivienda: [''],
      servicios: [''],
      expectativas_de_vida: ['']
    });

    this.datosParte4 = this.fb.group({
      actividadesDi: [''],
      experienciaSignificativa: [''],
      motivacion: ['']
    });

    //--------------------------------------------------------------------------------

    this.formGroup1 = this.fb.group({
      eps: [''],
      afp: [''],
      policivos: [''],
      procuraduria: [''],
      contraloria: [''],
      ramaJudicial: [''],
      sisben: [''],
      ofac: [''],
      medidasCorrectivas: [''],
      area_aplica: ['']
    });

    this.formGroup2 = this.fb.group({
      centroCosto: [''],
      cargo: [''],
      areaEntrevista: [''],
      fechaPruebaEntrevista: [''],
      horaPruebaEntrevista: [''],
      direccionEmpresa: ['']
    });

    this.formGroup3 = this.fb.group({
      ips: [''],
      ipsLab: [''],
      selectedExams: [[]], // Lista de exámenes seleccionados
      selectedExamsArray: this.fb.array([]) // FormArray dinámico para apto/no apto
    });

    this.formGroup4 = this.fb.group({
      empresaUsuaria: [''],
      fechaIngreso: [null],
      salario: [''],
      auxTransporte: [''],
      rodamiento: [''],
      auxMovilidad: [''],
      bonificacion: ['']
    });

    this.pagoTransporteForm = this.fb.group(
      {
        semanasCotizadas: [''],
        formaPago: [''],
        otraFormaPago: [''],
        numeroPagos: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        validacionNumeroCuenta: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        seguroFunerario: [''],
        Ccostos: [''],
        // subcentro: [''],
        // grupo: [''],
        // categoria: [''],
        // operacion: [''],
        // sublabor: [''],
        salario: [''],
        auxilioTransporte: [''],
        // ruta: [''],
        // valorTransporte: [''],
        // horasExtras: [''],
        porcentajeARL: [''],
      },
      { validators: this.matchNumbersValidator } // Aquí se aplica el validador al grupo
    );

    // Escuchar cambios en ambos campos y revalidar
    this.pagoTransporteForm.get('numeroPagos')?.valueChanges.subscribe(() => {
      this.pagoTransporteForm.updateValueAndValidity(); // Actualiza el estado del grupo
    });
    this.pagoTransporteForm.get('validacionNumeroCuenta')?.valueChanges.subscribe(() => {
      this.pagoTransporteForm.updateValueAndValidity(); // Actualiza el estado del grupo
    });

    this.referenciasForm = this.fb.group({
      familiar1: [''],
      familiar2: [''],
      personal1: [''],
      personal2: [''],
    });

    // Inicializar el FormGroup de traslados
    this.trasladosForm = this.fb.group({
      opcion_traslado_eps: [''],
      eps_a_trasladar: [''],
      traslado: [''],
    });

    // Personal administrativo
    this.huellaForm = this.fb.group({
      cedula: [''],
    });

  }

  // Validador personalizado para verificar que los campos sean iguales
  matchNumbersValidator(group: AbstractControl): { [key: string]: boolean } | null {
    const numeroPagos = group.get('numeroPagos')?.value;
    const validacionNumeroCuenta = group.get('validacionNumeroCuenta')?.value;

    // Si ambos campos tienen valores y no coinciden, retorna un error
    if (numeroPagos && validacionNumeroCuenta && numeroPagos !== validacionNumeroCuenta) {
      return { numbersNotMatch: true };
    }

    return null; // Sin errores
  }

  descargarArchivo() {
    let archivo: string;
    console.log('Empresa:', this.nombreEmpresa);

    if (this.nombreEmpresa === 'APOYO LABORAL TS SAS') {
      console.log('Descargando archivo de APOYO LABORAL TS SAS');
      archivo = 'APOYO_LABORAL_CARTA_AUTORIZACION_TRASLADO_2024.pdf';
    } else if (this.nombreEmpresa === 'TU ALIANZA SAS') {
      console.log('Descargando archivo de TU ALIANZA SAS');
      archivo = 'TU_ALIANZA_CARTA_AUTORIZACION_TRASLADO_2024.pdf';
    } else {
      Swal.fire({
        title: '¡Error!',
        text: 'Sucedio un problema.',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
      return;
    }

    const url = `./public/comun/Docs/${archivo}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = archivo;
    link.click();
  }

  onFileSelected(event: Event, key: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.uploadedFiles[key] = { file, fileName: file.name };
    }
  }

  async validarCampos() {
    // Helper para formatear fechas en dd/mm/yyyy
    const formatFecha = (fecha: string | Date | null): string => {
      if (!fecha) return '';
      const dateObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
      const dia = String(dateObj.getDate()).padStart(2, '0');
      const mes = String(dateObj.getMonth() + 1).padStart(2, '0'); // Meses comienzan en 0
      const anio = dateObj.getFullYear();
      return `${dia}/${mes}/${anio}`;
    };

    // Helper para formatear fecha y hora local en dd/mm/yyyy hh:mm:ss
    const formatFechaHora = (fecha: string | Date): string => {
      const dateObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
      const dia = String(dateObj.getDate()).padStart(2, '0');
      const mes = String(dateObj.getMonth() + 1).padStart(2, '0');
      const anio = dateObj.getFullYear();
      const horas = String(dateObj.getHours()).padStart(2, '0');
      const minutos = String(dateObj.getMinutes()).padStart(2, '0');
      const segundos = String(dateObj.getSeconds()).padStart(2, '0');
      return `${dia}/${mes}/${anio} ${horas}:${minutos}:${segundos}`;
    };

    // Obtener datos del local storage
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const nombreQuienValidoInformacion = `${userData.primer_nombre || ''} ${userData.primer_apellido || ''}`.trim();

    // Obtén los valores del formulario y formatea las fechas
    const payload = {
      numeroCedula: this.cedula, // Asegúrate de obtener la cédula del formulario o componente
      codigoContrato: this.codigoContrato, // Asegúrate de obtener el código de contrato
      nombreQuienValidoInformacion, // Usa el nombre completo obtenido del local storage
      fechaHoraValidacion: formatFechaHora(new Date()), // Formatea la fecha con hora local
      primerApellido: this.datosPersonales.get('primer_apellido')?.value,
      segundoApellido: this.datosPersonales.get('segundo_apellido')?.value,
      primerNombre: this.datosPersonales.get('primer_nombre')?.value,
      segundoNombre: this.datosPersonales.get('segundo_nombre')?.value,
      fechaNacimiento: formatFecha(this.datosPersonales.get('fecha_nacimiento')?.value),
      fechaExpedicionCC: formatFecha(this.datosPersonales.get('fecha_expedicion_cc')?.value),
    };

    console.log('Payload:', payload);

    // Llama al servicio
    try {
      const response = await this.contratacionService.validarInformacionContratacion(payload);
      console.log('Respuesta del servidor:', response);
      Swal.fire({
        title: '¡Información validada!',
        text: 'La información ha sido validada correctamente.',
        icon: 'success',
        confirmButtonText: 'Ok',
      });
    } catch (error) {
      console.error('Error al enviar la información:', error);
      Swal.fire({
        title: '¡Error!',
        text: 'Hubo un error al enviar la información.',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    }
  }

  get hijosArray(): FormArray {
    return this.datosHijos.get('hijosArray') as FormArray;
  }

  // Método para agregar un hijo al FormArray
  agregarHijo(hijo: any) {
    const hijoForm = this.fb.group({
      nombre: [hijo.nombre || ''],
      sexo: [hijo.sexo || ''],
      fecha_nacimiento: [hijo.fecha_nacimiento || ''],
      no_documento: [hijo.no_documento || ''],
      estudia_o_trabaja: [hijo.estudia_o_trabaja || ''],
      curso: [hijo.curso || '']
    });
    this.hijosArray.push(hijoForm);
  }

  // Método para llenar el FormArray con el arreglo de hijos
  llenarDatosHijos(hijos: any[]) {
    this.hijosArray.clear(); // Limpiamos el FormArray antes de llenarlo
    hijos.forEach(hijo => this.agregarHijo(hijo));
  }

  async buscarCedula() {
    // Mostrar un Swal de carga
    const loadingSwal = Swal.fire({
      title: 'Cargando',
      text: 'Por favor espera mientras se procesan los datos...',
      icon: 'info',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(); // Muestra el spinner
      },
    });

    forkJoin({
      seleccion: this.contratacionService.traerDatosSeleccion(this.cedula),
      infoGeneral: this.contratacionService.buscarEncontratacion(this.cedula),

    }).subscribe(
      async ({ seleccion, infoGeneral }) => {
        Swal.close(); // Cierra el Swal de carga al completar

        if (seleccion && seleccion.procesoSeleccion && Array.isArray(seleccion.procesoSeleccion)) {
          this.seleccion = seleccion.procesoSeleccion.reduce((prev: { id: number }, current: { id: number }) =>
            current.id > prev.id ? current : prev, { id: 0 });
        } else {
          Swal.fire({
            title: '¡Error!',
            text: 'Datos de selección no válidos',
            icon: 'error',
            confirmButtonText: 'Ok',
          });
        }

        if (infoGeneral && infoGeneral.data) {
          this.infoGeneralC = infoGeneral.data[0];
          this.infoGeneral = true;
        } else {
          Swal.fire({
            title: '¡Error!',
            text: 'Datos generales no válidos',
            icon: 'error',
            confirmButtonText: 'Ok',
          });
        }

        // Llamar las siguientes funciones
        await this.verificarSeleccion();
        await this.infoGeneralCandidato();
        this.procesoValido = true;
      },
      (err: any) => {
        Swal.close(); // Cierra el Swal de carga si hay error

        Swal.fire({
          title: 'Atención',
          text: 'No se encontró la cédula ingresada, no ha llenado el formulario, se podrá continuar con el proceso, pero se debe indicar que a la persona que llene el formulario',
          icon: 'warning',
          confirmButtonText: 'Ok',
        });
      }

    );
  }

  async infoGeneralCandidato() {
    if (this.infoGeneralC) {
      // Llenar el formulario de Info Personal con los datos de this.infoGeneralC
      this.datosPersonales.patchValue({
        tipodedocumento: this.infoGeneralC.tipodedocumento || 'No disponible',
        numerodeceduladepersona: this.infoGeneralC.numerodeceduladepersona || 'No disponible',
        primer_apellido: this.infoGeneralC.primer_apellido || '',
        segundo_apellido: this.infoGeneralC.segundo_apellido || '',
        primer_nombre: this.infoGeneralC.primer_nombre || '',
        segundo_nombre: this.infoGeneralC.segundo_nombre || '',
        genero: this.infoGeneralC.genero || '',
        primercorreoelectronico: this.infoGeneralC.primercorreoelectronico || '',
        celular: this.infoGeneralC.celular || '',
        whatsapp: this.infoGeneralC.whatsapp || '',
        departamento: this.infoGeneralC.departamento || '',
        municipio: this.infoGeneralC.municipio || '',
        estado_civil: this.infoGeneralC.estado_civil || '',
        direccion_residencia: this.infoGeneralC.direccion_residencia || '',
        barrio: this.infoGeneralC.barrio || '',
        fecha_expedicion_cc: this.convertirAFecha(this.infoGeneralC.fecha_expedicion_cc),
        departamento_expedicion_cc: this.infoGeneralC.departamento_expedicion_cc || '',
        municipio_expedicion_cc: this.infoGeneralC.municipio_expedicion_cc || '',
        lugar_nacimiento_municipio: this.infoGeneralC.lugar_nacimiento_municipio || '',
        lugar_nacimiento_departamento: this.infoGeneralC.lugar_nacimiento_departamento || '',
        rh: this.infoGeneralC.rh || '',
        zurdo_diestro: this.infoGeneralC.zurdo_diestro || '',
        hacecuantoviveenlazona: this.infoGeneralC.hacecuantoviveenlazona || '',
        lugar_anterior_residencia: this.infoGeneralC.lugar_anterior_residencia || '',
        hace_cuanto_se_vino_y_porque: this.infoGeneralC.hace_cuanto_se_vino_y_porque || '',
        zonas_del_pais: this.infoGeneralC.zonas_del_pais || '',
        donde_le_gustaria_vivir: this.infoGeneralC.donde_le_gustaria_vivir || '',
        fecha_nacimiento: this.convertirAFecha(this.infoGeneralC.fecha_nacimiento),
        estudia_actualmente: this.infoGeneralC.estudia_actualmente || '',
        familiar_emergencia: this.infoGeneralC.familiar_emergencia || '',
        parentesco_familiar_emergencia: this.infoGeneralC.parentesco_familiar_emergencia || '',
        direccion_familiar_emergencia: this.infoGeneralC.direccion_familiar_emergencia || '',
        barrio_familiar_emergencia: this.infoGeneralC.barrio_familiar_emergencia || '',
        telefono_familiar_emergencia: this.infoGeneralC.telefono_familiar_emergencia || '',
        ocupacion_familiar_emergencia: this.infoGeneralC.ocupacion_familiar_emergencia || ''
      });

      this.datosPersonalesParte2.patchValue({
        escolaridad: this.infoGeneralC.escolaridad || 'No disponible',
        estudiosExtra: this.infoGeneralC.estudiosExtra || 'No disponible',
        nombre_institucion: this.infoGeneralC.nombre_institucion || '',
        ano_finalizacion: this.infoGeneralC.ano_finalizacion || '',
        titulo_obtenido: this.infoGeneralC.titulo_obtenido || ''
      });

      this.datosTallas.patchValue({
        chaqueta: this.infoGeneralC.chaqueta || 'No disponible',
        pantalon: this.infoGeneralC.pantalon || 'No disponible',
        camisa: this.infoGeneralC.camisa || 'No disponible',
        calzado: this.infoGeneralC.calzado || 'No disponible'
      });

      this.datosConyugue.patchValue({
        nombre_conyugue: this.infoGeneralC.nombre_conyugue || '',
        apellido_conyugue: this.infoGeneralC.apellido_conyugue || '',
        num_doc_identidad_conyugue: this.infoGeneralC.num_doc_identidad_conyugue || '',
        vive_con_el_conyugue: this.infoGeneralC.vive_con_el_conyugue || '',
        direccion_conyugue: this.infoGeneralC.direccion_conyugue || '',
        telefono_conyugue: this.infoGeneralC.telefono_conyugue || '',
        barrio_municipio_conyugue: this.infoGeneralC.barrio_municipio_conyugue || '',
        ocupacion_conyugue: this.infoGeneralC.ocupacion_conyugue || ''
      });

      this.datosPadre.patchValue({
        nombre_padre: this.infoGeneralC.nombre_padre || '',
        vive_padre: this.infoGeneralC.vive_padre || '',
        ocupacion_padre: this.infoGeneralC.ocupacion_padre || '',
        direccion_padre: this.infoGeneralC.direccion_padre || '',
        telefono_padre: this.infoGeneralC.telefono_padre || '',
        barrio_padre: this.infoGeneralC.barrio_padre || ''
      });

      this.datosMadre.patchValue({
        nombre_madre: this.infoGeneralC.nombre_madre || '',
        vive_madre: this.infoGeneralC.vive_madre || '',
        ocupacion_madre: this.infoGeneralC.ocupacion_madre || '',
        direccion_madre: this.infoGeneralC.direccion_madre || '',
        telefono_madre: this.infoGeneralC.telefono_madre || '',
        barrio_madre: this.infoGeneralC.barrio_madre || ''
      });

      this.datosReferencias.patchValue({
        nombre_referencia_personal1: this.infoGeneralC.nombre_referencia_personal1 || '',
        telefono_referencia_personal1: this.infoGeneralC.telefono_referencia_personal1 || '',
        ocupacion_referencia_personal1: this.infoGeneralC.ocupacion_referencia_personal1 || '',
        tiempo_conoce_referencia_personal1: this.infoGeneralC.tiempo_conoce_referencia_personal1 || '',
        nombre_referencia_personal2: this.infoGeneralC.nombre_referencia_personal2 || '',
        telefono_referencia_personal2: this.infoGeneralC.telefono_referencia_personal2 || '',
        ocupacion_referencia_personal2: this.infoGeneralC.ocupacion_referencia_personal2 || '',
        tiempo_conoce_referencia_personal2: this.infoGeneralC.tiempo_conoce_referencia_personal2 || '',
        nombre_referencia_familiar1: this.infoGeneralC.nombre_referencia_familiar1 || '',
        telefono_referencia_familiar1: this.infoGeneralC.telefono_referencia_familiar1 || '',
        ocupacion_referencia_familiar1: this.infoGeneralC.ocupacion_referencia_familiar1 || '',
        parentesco_referencia_familiar1: this.infoGeneralC.parentesco_referencia_familiar1 || '',
        nombre_referencia_familiar2: this.infoGeneralC.nombre_referencia_familiar2 || '',
        telefono_referencia_familiar2: this.infoGeneralC.telefono_referencia_familiar2 || '',
        ocupacion_referencia_familiar2: this.infoGeneralC.ocupacion_referencia_familiar2 || '',
        parentesco_referencia_familiar2: this.infoGeneralC.parentesco_referencia_familiar2 || ''
      });

      this.datosExperienciaLaboral.patchValue({
        nombre_expe_laboral1_empresa: this.infoGeneralC.nombre_expe_laboral1_empresa || '',
        direccion_empresa1: this.infoGeneralC.direccion_empresa1 || '',
        telefonos_empresa1: this.infoGeneralC.telefonos_empresa1 || '',
        nombre_jefe_empresa1: this.infoGeneralC.nombre_jefe_empresa1 || '',
        fecha_retiro_empresa1: this.convertirAFecha(this.infoGeneralC.fecha_retiro_empresa1) || '',
        motivo_retiro_empresa1: this.infoGeneralC.motivo_retiro_empresa1 || '',
        cargo_empresa1: this.infoGeneralC.cargo_empresa1 || '',
        empresas_laborado: this.infoGeneralC.empresas_laborado || '',
        labores_realizadas: this.infoGeneralC.labores_realizadas || '',
        rendimiento: this.infoGeneralC.rendimiento || '',
        porqueRendimiento: this.infoGeneralC.porqueRendimiento || '',
        personas_a_cargo: this.infoGeneralC.personas_a_cargo || '',
        como_es_su_relacion_familiar: this.infoGeneralC.como_es_su_relacion_familiar || ''
      });

      this.datosParte3Seccion1.patchValue({
        personas_con_quien_convive: this.infoGeneralC.personas_con_quien_convive || '',
        familia_con_un_solo_ingreso: this.infoGeneralC.familia_con_un_solo_ingreso || '',
        como_se_entero: this.infoGeneralC.como_se_entero || ''
      });

      this.datosParte3Seccion2.patchValue({
        tipo_vivienda: this.infoGeneralC.tipo_vivienda || '',
        num_habitaciones: this.infoGeneralC.num_habitaciones || '',
        num_personas_por_habitacion: this.infoGeneralC.num_personas_por_habitacion || '',
        tipo_vivienda_2p: this.infoGeneralC.tipo_vivienda_2p || '',
        caractteristicas_vivienda: this.infoGeneralC.caracteristicas_vivienda || '',
        servicios: this.infoGeneralC.servicios || '',
        expectativas_de_vida: this.infoGeneralC.expectativas_de_vida || ''
      });

      this.datosParte4.patchValue({
        actividadesDi: this.infoGeneralC.actividadesDi || '',
        experienciaSignificativa: this.infoGeneralC.experienciaSignificativa || '',
        motivacion: this.infoGeneralC.motivacion || ''
      });

      this.datosHijos.patchValue({
        num_hijos_dependen_economicamente: this.infoGeneralC.num_hijos_dependen_economicamente || '',
        quien_los_cuida: this.infoGeneralC.quien_los_cuida || ''
      });

      // Llenar el arreglo de hijos si está disponible
      if (this.infoGeneralC.hijos && Array.isArray(this.infoGeneralC.hijos)) {
        this.llenarDatosHijos(this.infoGeneralC.hijos);
      }
    }


  }

  // Obtener el nombre completo
  getFullName(): string {
    const { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido } = this.infoGeneralC || {};
    return `${primer_nombre || ''} ${segundo_nombre || ''} ${primer_apellido || ''} ${segundo_apellido || ''}`.trim();
  }

  // Convertir un número de días en una fecha válida (basado en el 1 de enero de 1900)
  convertirAFecha(fecha: string): Date | null {
    // Si la fecha es un número de días (solo contiene dígitos)
    if (/^\d+$/.test(fecha)) {
      const diasDesde1900 = Number(fecha);
      const fechaBase = new Date(1900, 0, 1); // 1 de enero de 1900
      fechaBase.setDate(fechaBase.getDate() + diasDesde1900);

      if (isNaN(fechaBase.getTime())) {
        return null;
      }

      return fechaBase;

      // Si la fecha está en formato "DD/MM/YYYY"
    } else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(fecha)) {
      const [dia, mes, anio] = fecha.split('/').map(Number);
      if (!dia || !mes || !anio) {
        return null;
      }

      const fechaValida = new Date(anio, mes - 1, dia);

      if (isNaN(fechaValida.getTime())) {
        return null;
      }

      return fechaValida;

    } else {
      return null;
    }
  }

  // Calcular edad a partir del número de días desde 1 de enero de 1900
  calcularEdad(fecha: string): number {
    const fechaNacimiento = this.convertirAFecha(fecha);
    if (!fechaNacimiento) {
      return NaN; // Si la fecha no es válida
    }

    const today = new Date();
    let age = today.getFullYear() - fechaNacimiento.getFullYear();

    // Restar un año si aún no ha pasado el cumpleaños este año
    const monthDiff = today.getMonth() - fechaNacimiento.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < fechaNacimiento.getDate())) {
      age--;
    }
    return age;
  }

  llenarDocumentos() {
    forkJoin({
      tipo2: this.gestionDocumentalService.obtenerDocumentosPorTipo(this.cedula, this.codigoContrato, 2),
      tipo16: this.gestionDocumentalService.obtenerDocumentosPorTipo(this.cedula, this.codigoContrato, 16),
      tipo17: this.gestionDocumentalService.obtenerDocumentosPorTipo(this.cedula, this.codigoContrato, 17)
    }).subscribe({
      next: async (resultados) => {
        // Manejo de resultados para tipo 2
        if (resultados.tipo2) {
          for (const documento of resultados.tipo2) {
            const typeKey = Object.keys(this.typeMap).find(key => this.typeMap[key] === documento.type);
            if (typeKey) {
              const file = await this.urlToFile(documento.file_url, documento.title || 'Documento sin título');
              this.uploadedFiles[typeKey] = {
                fileName: documento.title || 'Documento sin título',
                file
              };
            }
          }
        } else {
          Swal.fire({
            title: '¡Atención!',
            text: 'No se encontraron documentos de antecedentes (tipo 2)',
            icon: 'warning',
            confirmButtonText: 'Ok'
          });
        }
  
        // Manejo de resultados para tipo 16 (personal1 y personal2)
        if (resultados.tipo16) {
          let personalIndex = 1; // Índice para asignar personal1 y personal2
          for (const documento of resultados.tipo16) {
            const typeKey = `personal${personalIndex}`;
            if (typeKey in this.typeMap) {
              const file = await this.urlToFile(documento.file_url, documento.title || 'Documento sin título');
              this.uploadedFiles[typeKey] = {
                fileName: documento.title || 'Documento sin título',
                file
              };
              personalIndex++; // Incrementar para manejar personal2
            }
          }
        } else {
          Swal.fire({
            title: '¡Atención!',
            text: 'No se encontraron documentos de referencias personales',
            icon: 'warning',
            confirmButtonText: 'Ok'
          });
        }
  
        // Manejo de resultados para tipo 17 (familiar1 y familiar2)
        if (resultados.tipo17) {
          let familiarIndex = 1; // Índice para asignar familiar1 y familiar2
          for (const documento of resultados.tipo17) {
            const typeKey = `familiar${familiarIndex}`;
            if (typeKey in this.typeMap) {
              const file = await this.urlToFile(documento.file_url, documento.title || 'Documento sin título');
              this.uploadedFiles[typeKey] = {
                fileName: documento.title || 'Documento sin título',
                file
              };
              familiarIndex++; // Incrementar para manejar familiar2
            }
          }
        } else {
          Swal.fire({
            title: '¡Atención!',
            text: 'No se encontraron documentos de referencias familiares',
            icon: 'warning',
            confirmButtonText: 'Ok'
          });
        }
      },
      error: (err) => {
        console.error('Error al obtener documentos:', err);
        Swal.fire({
          title: '¡Error!',
          text: 'Ocurrió un error al obtener los documentos',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    });
  }

  async verificarSeleccion() {
    // Si existe un proceso de selección, llenar el formulario con los datos
    if (this.seleccion) {
      // Mostrar el diálogo de confirmación
      Swal.fire({
        title: '¡Atención!',
        html: 'Este usuario ya tiene un proceso de selección con el código de contrato <b>' + this.seleccion.codigo_contrato + '</b>. ¿Deseas crear otro o seguir con este?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Crear otro',
        cancelButtonText: 'Seguir con este'
      }).then((result) => {
        if (result.isConfirmed) {
          this.seleccionService.generarCodigoContratacion(this.sede, this.cedula).subscribe((response: any) => {
            this.codigoContrato = response.codigo_contrato;
            Swal.fire({
              title: '¡Código de contrato generado!',
              text: 'El código de contrato generado es ' + response.codigo_contrato,
              icon: 'success',
              confirmButtonText: 'Ok'
            });
          });

        } else {
          this.codigoContrato = this.seleccion.codigo_contrato;
          this.vacantesService.obtenerVacante(this.seleccion.vacante).subscribe((response: any) => {
            this.nombreEmpresa = response.publicacion[0].empresaQueSolicita_id;
            //this.vacante = response.publicacion[0]
          });
          this.llenarDocumentos();

          // Llenar los campos del formulario de Datos Generales (formGroup1)
          this.formGroup1.patchValue({
            eps: this.seleccion.eps || '',
            afp: this.seleccion.afp || '',
            policivos: this.seleccion.policivos || '',
            procuraduria: this.seleccion.procuraduria || '',
            contraloria: this.seleccion.contraloria || '',
            ramaJudicial: this.seleccion.rama_judicial || '',
            medidasCorrectivas: this.seleccion.medidas_correctivas || '',
            area_aplica: this.seleccion.area_aplica || ''
          });


          // Llenar los campos del formulario con los datos de la selección
          this.formGroup2.patchValue({
            centroCosto: this.seleccion.centro_costo_entrevista || '',
            cargo: this.seleccion.cargo || '',
            areaEntrevista: this.seleccion.area_entrevista || '',
            fechaPruebaEntrevista: this.seleccion.fecha_prueba_entrevista || '',
            horaPruebaEntrevista: this.seleccion.hora_prueba_entrevista || '',
            direccionEmpresa: this.seleccion.direccion_empresa || ''
          });

          // Llenar los campos del formulario de Examen de Salud Ocupacional (formGroup3)
          this.formGroup3.patchValue({
            ips: this.seleccion.ips || '',
            ipsLab: this.seleccion.ipslab || '',
            selectedExams: this.seleccion.examenes ? this.seleccion.examenes.split(', ') : [],
          });

          // Obtener los valores de los exámenes seleccionados y los estados de aptitud
          const selectedExamsArray: string[] = this.formGroup3.get('selectedExams')?.value || [];
          const aptosExamenesArray: string[] = this.seleccion.aptosExamenes ? this.seleccion.aptosExamenes.split(', ') : [];

          // Crear el FormArray para los estados de aptitud
          const formArray = this.fb.array(
            selectedExamsArray.map((_, index) =>
              this.fb.group({
                aptoStatus: [aptosExamenesArray[index] || '', Validators.required]
              })
            )
          );

          // Establecer el FormArray en el formulario
          this.formGroup3.setControl('selectedExamsArray', formArray);





          // Llenar los campos del formulario de Contratación (formGroup4)
          this.formGroup4.patchValue({
            empresaUsuaria: this.seleccion.empresa_usuario || '',
            fechaIngreso: this.seleccion.fecha_ingreso_usuario || '',
            salario: this.seleccion.salario || '',
            auxTransporte: this.seleccion.aux_transporte || '',
            rodamiento: this.seleccion.rodamiento || '',
            auxMovilidad: this.seleccion.aux_movilidad || '',
            bonificacion: this.seleccion.bonificacion || ''
          });
        }
      });

    } else {
      console.log('No tiene proceso de selección');
    }
  }


  urlToFile(url: string, fileName: string): Promise<File> {
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`No se pudo descargar el archivo: ${response.statusText}`);
        }
        return response.blob();
      })
      .then(blob => {
        const extension = fileName.split('.').pop() || 'txt';
        const mimeType = blob.type || `application/${extension}`;
        return new File([blob], fileName, { type: mimeType });
      })
      .catch(error => {
        console.error('Error al descargar el archivo:', error);
        throw error;
      });
  }

  // Método para abrir un archivo en una nueva pestaña
  verArchivo(campo: string) {
    const archivo = this.uploadedFiles[campo];
    console.log('Ver archivo:', archivo);

    if (archivo && archivo.file) {
      if (typeof archivo.file === 'string') {
        // Asegurarse de que la URL esté correctamente codificada para evitar problemas
        const fileUrl = encodeURI(archivo.file);
        // Abrir el archivo en una nueva pestaña
        window.open(fileUrl, '_blank');
      } else if (archivo.file instanceof File) {
        // Crear una URL temporal para el archivo si es un objeto File
        const fileUrl = URL.createObjectURL(archivo.file);
        window.open(fileUrl, '_blank');

        // Revocar la URL después de que el archivo ha sido abierto para liberar memoria
        setTimeout(() => {
          URL.revokeObjectURL(fileUrl);
        }, 100);
      }
    } else {
      Swal.fire('Error', 'No se pudo encontrar el archivo para este campo', 'error');
    }
  }

  // Método que se ejecuta cuando se selecciona un archivo
  subirArchivo(event: any, campo: string) {
    const file = event.target.files[0]; // Obtén el archivo seleccionado
    if (file) {
      // Verificar si el nombre del archivo tiene más de 100 caracteres
      if (file.name.length > 100) {
        Swal.fire('Error', 'El nombre del archivo no debe exceder los 100 caracteres', 'error');
        return; // Salir de la función si la validación falla
      }

      // Si la validación es exitosa, almacenar el archivo
      this.uploadedFiles[campo] = { file: file, fileName: file.name }; // Guarda el archivo y el nombre
      //Swal.fire('Archivo subido', `Archivo ${file.name} subido para ${campo}`, 'success');
    }
  }

  // Método para imprimir los datos del formulario y subir todos los archivos
  imprimirVerificacionesAplicacion(): void {
    // Mostrar Swal de cargando
    Swal.fire({
      title: 'Cargando...',
      text: 'Estamos guardando los datos y subiendo los archivos.',
      icon: 'info',
      allowOutsideClick: false,
      showConfirmButton: false, // No mostrar botón hasta que termine el proceso
      willOpen: () => {
        Swal.showLoading(); // Mostrar el indicador de carga
      }
    });

    // Llamar al servicio para guardar los datos del formulario (Parte 1)
    this.seleccionService
      .crearSeleccionParteUnoCandidato(this.formGroup1.value, this.cedula, this.codigoContrato)
      .subscribe(
        (response) => {
          console.log('Respuesta exitosa Parte 1:', response);
          if (response.message === 'success') {
            // si this.uploadedFiles esta vacio
            if (Object.keys(this.uploadedFiles).length === 0) {
              Swal.close(); // Cerrar el Swal de carga
              Swal.fire({
                title: '¡Éxito!',
                text: 'Datos guardados exitosamente',
                icon: 'success',
                confirmButtonText: 'Ok'
              });
            }
            else {
              // Si la respuesta es exitosa, proceder a subir los archivos
              this.subirTodosLosArchivos().then((allFilesUploaded) => {
                console.log('Todos los archivos subidos:', allFilesUploaded);
                if (allFilesUploaded) {
                  Swal.close();
                  // Cerrar el Swal de carga y mostrar el mensaje de éxito
                  Swal.fire({
                    title: '¡Éxito!',
                    text: 'Datos y archivos guardados exitosamente',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                  });
                }
              }).catch((error) => {
                // Cerrar el Swal de carga y mostrar el mensaje de error en caso de fallo al subir archivos
                Swal.fire({
                  title: 'Error',
                  text: `Hubo un error al subir los archivos: ${error}`,
                  icon: 'error',
                  confirmButtonText: 'Ok'
                });
              });
            }
          }
        },
        (error) => {
          // Cerrar el Swal de carga y mostrar el mensaje de error en caso de fallo al guardar los datos
          Swal.fire({
            title: 'Error',
            text: 'Hubo un error al guardar los datos del formulario',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        }
      );
  }

  // Método para subir todos los archivos almacenados en uploadedFiles
  subirTodosLosArchivos(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Filtrar archivos válidos
      const archivosAEnviar = Object.keys(this.uploadedFiles)
        .filter(key => {
          const fileData = this.uploadedFiles[key];
          // Solo incluir archivos con un objeto `file` válido
          return fileData && fileData.file;
        })
        .map(key => ({
          key,
          ...this.uploadedFiles[key],
          typeId: this.typeMap[key] // Asignar el tipo documental (typeId)
        }));

      // Si no hay archivos para subir
      if (archivosAEnviar.length === 0) {
        console.log('No hay archivos que enviar');
        resolve(true); // Resolver inmediatamente si no hay archivos
        return;
      }

      // Crear promesas para cada archivo
      const promesasDeSubida = archivosAEnviar.map(({ key, file, fileName, typeId }) => {
        return new Promise<void>((resolveSubida, rejectSubida) => {
          if (file && typeId) {
            this.gestionDocumentalService
              .guardarDocumento(fileName, this.cedula, typeId, file)
              .subscribe({
                next: () => {
                  console.log(`Archivo ${fileName} (${key}) subido correctamente`);
                  resolveSubida(); // Resolver la promesa de este archivo
                },
                error: (error) => {
                  console.error(`Error al subir archivo ${fileName} (${key}):`, error);
                  rejectSubida(`Error al subir archivo ${key}: ${error.message}`);
                }
              });
          } else {
            rejectSubida(`Archivo ${key} no tiene datos válidos`);
          }
        });
      });

      // Esperar a que todas las subidas terminen
      Promise.all(promesasDeSubida)
        .then(() => {
          console.log('Todos los archivos se subieron correctamente');
          resolve(true); // Resolver cuando todos los archivos hayan sido procesados
        })
        .catch((error) => {
          console.error('Ocurrió un error durante la subida de archivos:', error);
          reject(error); // Rechazar si hay errores en alguna subida
        });
    });
  }

  // Método para subir solo los archivos de referencias personales y familiares
  subirReferenciasArchivos(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      console.log('Subiendo archivos de referencias...', this.uploadedFiles);

      // Filtrar los campos relevantes: personal1, personal2, familiar1, familiar2
      const referenciasKeys = ['personal1', 'personal2', 'familiar1', 'familiar2'];
      const archivosFiltrados = Object.keys(this.uploadedFiles).filter(key => referenciasKeys.includes(key));

      const totalFiles = archivosFiltrados.length; // Total de archivos relevantes a subir
      let filesUploaded = 0; // Contador de archivos subidos

      if (totalFiles === 0) {
        resolve(true); // No hay archivos relevantes que subir, resolver inmediatamente
        return;
      }

      archivosFiltrados.forEach((campo) => {
        const { file, fileName } = this.uploadedFiles[campo]; // Obtén el archivo y su nombre
        const title = fileName; // El título será el nombre del archivo PDF

        // Obtener el tipo correspondiente del mapa
        const type = this.typeMap[campo] || 3; // Si no hay tipo definido para el campo, se usa 3 como valor predeterminado

        // Llamar al servicio para subir cada archivo
        this.gestionDocumentalService
          .guardarDocumento(title, this.cedula, type, file)
          .subscribe(
            (response) => {
              filesUploaded += 1;

              // Si todos los archivos se han subido, resolvemos la promesa
              if (filesUploaded === totalFiles) {
                resolve(true); // Todos los archivos se subieron correctamente
              }
            },
            (error) => {
              console.error(error);
              reject(`Error al subir el archivo para ${campo}`);
            }
          );
      });
    });
  }

  subirArchivoTraslados(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      console.log('Subiendo archivos de referencias...', this.uploadedFiles);

      // Filtrar los campos relevantes: personal1, personal2, familiar1, familiar2
      const referenciasKeys = ['traslado'];
      const archivosFiltrados = Object.keys(this.uploadedFiles).filter(key => referenciasKeys.includes(key));

      const totalFiles = archivosFiltrados.length; // Total de archivos relevantes a subir
      let filesUploaded = 0; // Contador de archivos subidos

      if (totalFiles === 0) {
        resolve(true); // No hay archivos relevantes que subir, resolver inmediatamente
        return;
      }

      archivosFiltrados.forEach((campo) => {
        const { file, fileName } = this.uploadedFiles[campo]; // Obtén el archivo y su nombre
        const title = fileName; // El título será el nombre del archivo PDF

        // Obtener el tipo correspondiente del mapa
        const type = this.typeMap[campo] || 3; // Si no hay tipo definido para el campo, se usa 3 como valor predeterminado

        // Llamar al servicio para subir cada archivo
        this.gestionDocumentalService
          .guardarDocumento(title, this.cedula, type, file, this.codigoContrato)
          .subscribe(
            (response) => {
              filesUploaded += 1;

              // Si todos los archivos se han subido, resolvemos la promesa
              if (filesUploaded === totalFiles) {
                resolve(true); // Todos los archivos se subieron correctamente
              }
            },
            (error) => {
              console.error(error);
              reject(`Error al subir el archivo para ${campo}`);
            }
          );
      });
    });
  }

  // Método para imprimir los datos de los formularios
  imprimirEntrevistaPrueba(): void {
    this.seleccionService.crearSeleccionParteDosCandidato(this.formGroup2.value, this.cedula, this.codigoContrato).subscribe(
      response => {
        if (response.message === 'success') {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Datos guardados exitosamente',
            icon: 'success',
            confirmButtonText: 'Ok'
          });
        }
      },
      error => {
        Swal.fire({
          title: '¡Error!',
          text: 'Error al guardar los datos',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    );
  }

  // Método para imprimir los datos de los formularios
  imprimirSaludOcupacional(): void {
    // Clonar el valor del formulario para no modificar el original
    const formData = { ...this.formGroup3.value };

    // Convertir los arrays a cadenas de texto separadas por comas
    formData.selectedExams = formData.selectedExams.join(', ');

    // Convertir selectedExamsArray a una cadena, extrayendo los valores de la propiedad que necesites
    formData.selectedExamsArray = formData.selectedExamsArray
      .map((item: { aptoStatus: any; }) => item.aptoStatus || 'Sin especificar') // Ajusta a la propiedad que desees
      .join(', ');

    console.log('Examen de Salud Ocupacional:', formData);

    this.seleccionService.crearSeleccionParteTresCandidato(formData, this.cedula, this.codigoContrato).subscribe(
      response => {
        console.log('Respuesta exitosa Parte 3:', response);
        if (response.message === 'success') {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Datos guardados exitosamente',
            icon: 'success',
            confirmButtonText: 'Ok'
          });
        }
      },
      error => {
        Swal.fire({
          title: '¡Error!',
          text: 'Error al guardar los datos',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    );
  }



  // Método para imprimir los datos de los formularios
  imprimirContratacion(): void {
    console.log('Contratación:', this.formGroup4.value);

    this.seleccionService.crearSeleccionParteCuatroCandidato(this.formGroup4.value, this.cedula, this.codigoContrato).subscribe(
      response => {
        console.log('Respuesta exitosa Parte 4:', response);
      },
      error => {
        console.error('Error en la solicitud Parte 4:', error);
      }
    );
  }

  // Método para determinar el color de fondo del encabezado según el porcentaje
  getPanelColor(percentage: number): string {
    if (percentage <= 20) {
      return '#ff6666'; // Fondo rojo intenso
    } else if (percentage > 20 && percentage <= 40) {
      return '#ffcc99'; // Fondo naranja claro
    } else if (percentage > 40 && percentage <= 60) {
      return '#fff5cc'; // Fondo amarillo claro
    } else if (percentage > 60 && percentage <= 80) {
      return '#d9f2d9'; // Fondo verde claro
    } else if (percentage > 80 && percentage < 100) {
      return '#a3e4a3'; // Fondo verde medio
    } else {
      return '#66ff66'; // Fondo verde intenso (100% completo)
    }
  }


  // Método para calcular el porcentaje de llenado de un FormGroup
  getPercentage(formGroup: FormGroup): number {
    const totalFields = Object.keys(formGroup.controls).length;
    const filledFields = Object.entries(formGroup.controls).filter(([key, control]) => {
      const value = control.value;

      // Ignorar el campo 'otraFormaPago'
      if (key === 'otraFormaPago') {
        return false;
      }

      // Ignorar campos vacíos y arreglos vacíos
      if (Array.isArray(value)) {
        return value.length > 0; // Solo contar como lleno si el arreglo tiene elementos
      }

      return value !== null && value !== undefined && value !== ''; // Considerar los valores no vacíos
    }).length;

    return Math.round((filledFields / totalFields) * 100);
  }


  updateExamOptions(cargo: string): void {
    const labor = this.laborExams.find(l => l.labor === cargo);
    const preselectedExams = labor ? labor.exams : [];

    // Preseleccionar los exámenes correspondientes al cargo
    this.formGroup3.get('selectedExams')?.setValue(preselectedExams);

    // Actualizar el FormArray
    this.updateSelectedExamsArray(preselectedExams);
  }

  get selectedExamsArray() {
    return this.formGroup3.get('selectedExamsArray') as FormArray;
  }

  // Método para actualizar el FormArray de acuerdo a los exámenes seleccionados
  updateSelectedExamsArray(selectedExams: string[]): void {
    this.selectedExamsArray.clear(); // Limpiar el array antes de agregar los nuevos controles
    selectedExams.forEach(() => {
      this.selectedExamsArray.push(this.fb.group({
        aptoStatus: ['', Validators.required]
      }));
    });
  }




  cargarPagoTransporte() {
    // Verificar si el formulario es válido antes de enviar
    if (this.pagoTransporteForm.invalid) {
      console.error('Formulario inválido, por favor revise los datos.');
      return;
    }

    // Construir los datos que se enviarán al servicio
    const data = {
      numero_de_cedula: this.cedula, // Cédula del candidato
      codigo_contrato: this.codigoContrato, // Código de contrato
      semanas_cotizadas: this.pagoTransporteForm.get('semanasCotizadas')?.value,
      forma_pago: this.pagoTransporteForm.get('formaPago')?.value,
      numero_pagos: this.pagoTransporteForm.get('numeroPagos')?.value,
      validacion_numero_cuenta: this.pagoTransporteForm.get('validacionNumeroCuenta')?.value,
      seguro_funerario: this.pagoTransporteForm.get('seguroFunerario')?.value,
      centro_de_costos: this.pagoTransporteForm.get('Ccostos')?.value,
      salario_contratacion: this.pagoTransporteForm.get('salario')?.value,
      valor_transporte: this.pagoTransporteForm.get('auxilioTransporte')?.value,
      porcentaje_arl: this.pagoTransporteForm.get('porcentajeARL')?.value
    };
    console.log('Pago de Transporte:', data);

    // Llamar al servicio para guardar o actualizar los datos
    this.contratacionService.guardarOActualizarContratacion(data).then((response: any) => {
      console.log('Respuesta exitosa:', response);
      // Aquí puedes manejar la respuesta si es necesario
    }).catch((error: any) => {
      console.error('Error al guardar o actualizar:', error);
      // Aquí puedes manejar el error si es necesario
    });
  }


  cargarReferencias() {
    console.log('Referencias Personales:', this.referenciasForm.value);

    // Mostrar Swal de carga
    Swal.fire({
      title: 'Cargando...',
      text: 'Estamos procesando las referencias y subiendo los archivos. Por favor, espera.',
      icon: 'info',
      allowOutsideClick: false, // Evitar que el usuario cierre el Swal
      didOpen: () => {
        Swal.showLoading(); // Mostrar el indicador de carga
      }
    });

    // Llamar al método para subir solo los archivos relevantes
    this.subirReferenciasArchivos()
      .then((allFilesUploaded) => {
        if (allFilesUploaded) {
          Swal.close(); // Cerrar el Swal de carga
          // Mostrar mensaje de éxito
          Swal.fire({
            title: '¡Éxito!',
            text: 'Referencias y archivos guardados exitosamente.',
            icon: 'success',
            confirmButtonText: 'Ok'
          });
        }
      })
      .catch((error) => {
        Swal.close(); // Cerrar el Swal de carga
        // Mostrar mensaje de error si algo falla
        Swal.fire({
          title: 'Error',
          text: `Hubo un error al subir los archivos: ${error}`,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      });
  }



  onTrasladoChange(event: any) {
    const trasladoSeleccionado = event.value;
    if (trasladoSeleccionado === 'no') {
      // Si el usuario selecciona "No", reseteamos el campo de EPS
      this.trasladosForm.get('epsDestino')?.reset();
    }
  }

  cargarTraslados() {
    console.log('Información de Traslados:', this.trasladosForm.value);
    const cedula = this.cedula;
    const codigoContrato = this.codigoContrato;
    // agregar this.cedula y this.codigoContrato a la información del traslado
    this.trasladosForm.value.numerodeceduladepersona = cedula;
    this.trasladosForm.value.codigo_contrato = codigoContrato;
    (async () => {
      try {
        const response = await this.contratacionService.actualizarProcesoContratacion(this.trasladosForm.value);
        console.log('Respuesta exitosa:', response);
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    })();


    // Mostrar Swal de carga
    Swal.fire({
      title: 'Cargando...',
      icon: 'info',
      text: 'Estamos procesando la solicitud de traslado y subiendo el archivo. Por favor, espera.',
      allowOutsideClick: false, // Evitar que el usuario cierre el Swal
      didOpen: () => {
        Swal.showLoading(); // Mostrar el indicador de carga
      }
    });

    // Llamar al método para subir solo los archivos relevantes
    this.subirArchivoTraslados()
      .then((allFilesUploaded) => {
        if (allFilesUploaded) {
          Swal.close(); // Cerrar el Swal de carga
          // Mostrar mensaje de éxito
          Swal.fire({
            title: '¡Éxito!',
            text: 'Solicitud de traslado guardado exitosamente.',
            icon: 'success',
            confirmButtonText: 'Ok'
          });
        }
      })
      .catch((error) => {
        Swal.close(); // Cerrar el Swal de carga
        // Mostrar mensaje de error si algo falla
        Swal.fire({
          title: 'Error',
          text: `Hubo un error al subir los archivos: ${error}`,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      });
  }


  generacionDocumentos() {
    console.log('Generación de documentos:', this.cedula, this.codigoContrato);
    // Guardar cedula y codigoContrato en el localStorage separados
    localStorage.setItem('cedula', this.cedula);
    localStorage.setItem('codigoContrato', this.codigoContrato);
    // empresa 
    this.guardarFormulariosEnLocalStorage();
    // Redirige a la página de generación de documentos
    window.location.href = "/generar-documentos";
  }

  guardarFormulariosEnLocalStorage() {
    const formularios = {
      datosPersonales: this.datosPersonales.value,
      datosPersonalesParte2: this.datosPersonalesParte2.value,
      datosTallas: this.datosTallas.value,
      datosConyugue: this.datosConyugue.value,
      datosPadre: this.datosPadre.value,
      datosMadre: this.datosMadre.value,
      datosReferencias: this.datosReferencias.value,
      datosExperienciaLaboral: this.datosExperienciaLaboral.value,
      datosHijos: this.datosHijos.value,
      datosParte3Seccion1: this.datosParte3Seccion1.value,
      datosParte3Seccion2: this.datosParte3Seccion2.value,
      datosParte4: this.datosParte4.value,
      selecionparte1: this.formGroup1.value,
      selecionparte2: this.formGroup2.value,
      selecionparte3: this.formGroup3.value,
      selecionparte4: this.formGroup4.value,
      pagoTransporte: this.pagoTransporteForm.value,
      empresa: this.nombreEmpresa,
      cedulaPersonalAdministrativo: this.huellaForm.value,
    };

    // Guardar en localStorage como un único objeto JSON
    localStorage.setItem('formularios', JSON.stringify(formularios));
    console.log('Formularios guardados en localStorage');
  }


  registrarHuella(tipo: string): void {
    console.log(`Registrando huella del ${tipo}`);
  }



}
