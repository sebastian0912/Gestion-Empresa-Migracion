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
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import Swal from 'sweetalert2';
import { NgFor, NgForOf, NgIf, NgStyle } from '@angular/common';
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
import { VetadosService } from '../../services/vetados/vetados.service';

@Component({
  selector: 'app-seleccion',
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
  templateUrl: './seleccion.component.html',
  styleUrl: './seleccion.component.css'
})
export class SeleccionComponent implements OnInit {
  cedula: string = ''; // Variable to store the cedula input
  codigoContrato: string = ''; // Variable to store the contract code
  infoGeneral: boolean = false;
  seleccion: any;
  infoGeneralC: any;
  vacantes: any[] = [];
  sede: string = '';
  sedeLogin: string = '';
  // Formularios 
  formGroup1: FormGroup;
  formGroup2: FormGroup;
  formGroup3: FormGroup;
  formGroup4: FormGroup;
  filtro: string = '';
  procesoValido: boolean = false;
  infoPersonalForm: FormGroup;
  entrevistaForm: FormGroup;
  observacionesForm: FormGroup;
  vacantesForm: FormGroup;
  mostrarObservacion: boolean = false; // Controla la visibilidad del campo de observación
  observacion: string = ''; // Almacena la observación escrita por el usuario

  typeMap: { [key: string]: number } = {
    eps: 7,
    policivos: 6,
    procuraduria: 3,
    contraloria: 4,
    medidasCorrectivas: 10,
    afp: 19,
    ramaJudicial: 20
  };

  uploadedFiles: { [key: string]: { file: File, fileName: string } } = {}; // Almacenar tanto el archivo como el nombre

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
  filteredExamOptions: string[] = [];



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

  antecedentesEstados: string[] = [
    'Cumple',
    'No Cumple',
    'Sin Buscar'
  ];

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
    private vetadosService: VetadosService
  ) {
    this.formGroup1 = this.fb.group({
      eps: [''],
      afp: [''],
      policivos: [''],
      procuraduria: [''],
      contraloria: [''],
      ramaJudicial: [''],
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


    // forms de ayuda 

    // Inicializamos cada FormGroup de manera independiente
    this.infoPersonalForm = this.fb.group({
      oficina: [{ value: '', disabled: true }],
      tipodedocumento: [{ value: '', disabled: true }],
      numerodecedula: [{ value: '', disabled: true }],
      nombreCompleto: [{ value: '', disabled: true }],
      celular: [''],
      whatsapp: [''],
      genero: [''],
      edad: [{ value: '', disabled: true }],
      fechaNacimiento: [{ value: '', disabled: true }],
      barrio: [''],
      tieneExperienciaFlores: [''],
      referenciado: [''],
      comoSeEntero: ['']
    });

    this.entrevistaForm = this.fb.group({
      presentoEntrevista: [''],
      eps: [''],
      revisionAntecedentes: [''],
      laboresRealizadas: [''],
      empresasLaborado: [''],
      tiempoExperiencia: [''],
      escolaridad: [''],
      numHijos: [''],
      quienLosCuida: ['']
    });

    this.observacionesForm = this.fb.group({
      observacionNovedad: [''],
      observacionEvaluador: ['']
    });

    // Formulario para vacantes
    this.vacantesForm = this.fb.group({
      centroCosto: [{ value: '', disabled: true }],
      cargo: [{ value: '', disabled: true }],
      fechaPruebaEntrevista: [{ value: '', disabled: true }],
      horaPruebaEntrevista: [{ value: '', disabled: true }],
      porQuienPregunta: [''],
      retroalimentacionFinal: ['']
    });

  }

  async ngOnInit(): Promise<void> {
    await this.loadData();

    this.seleccionService.getUser().then(user => {
      if (user) {
        const abreviaciones: { [key: string]: string } = {
          'ADMINISTRATIVOS': 'ADM',
          'ANDES': 'AND',
          'BOSA': 'BOS',
          'CARTAGENITA': 'CAR',
          'FACA_PRIMERA': 'FPR',
          'FACA_PRINCIPAL': 'FPC',
          'FONTIBÓN': 'FON',
          'FORANEOS': 'FOR',
          'FUNZA': 'FUN',
          'MADRID': 'MAD',
          'MONTE_VERDE': 'MV',
          'ROSAL': 'ROS',
          'SOACHA': 'SOA',
          'SUBA': 'SUB',
          'TOCANCIPÁ': 'TOC',
          'USME': 'USM',
        };

        // Asegurarte de que user.sucursalde es string
        const sede: string = user.sucursalde;
        this.sedeLogin = sede;
        this.sede = abreviaciones[sede] || sede;
      }
    });

    // Suscribirse a los cambios en el campo "cargo"
    this.formGroup2.get('cargo')?.valueChanges.subscribe(cargo => {
      this.updateExamOptions(cargo);
    });

    // Suscripción para actualizar el array de selects dinámicos cuando cambia el valor
    this.formGroup3.get('selectedExams')?.valueChanges.subscribe(selectedExams => {
      this.updateSelectedExamsArray(selectedExams);
    });

  }

  updateExamOptions(cargo: string): void {
    const labor = this.laborExams.find(l => l.labor === cargo);
    this.filteredExamOptions = labor ? labor.exams : [];
    this.formGroup3.get('selectedExams')?.setValue([]); // Limpiar la selección actual de exámenes
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

  // Método para mostrar el campo de observación
  mostrarCampoObservacion(): void {
    this.mostrarObservacion = true;
  }

  // Método para enviar la observación
  async enviarObservacion(): Promise<void> {
    if (this.observacion.trim()) {
      let nombre = '';
      await this.contratacionService.getUser().then((data: any) => {
        console.log(data);
        if (data) {
          nombre = `${data.primer_nombre} ${data.primer_apellido} - ${data.rol}`;
        }
      });
      const reporte = {
        cedula: this.cedula,
        observacion: this.observacion,
        centro_costo_carnet: "",
        reportadoPor: nombre, // Ejemplo de un valor calculado o asignado
        nombre: this.infoGeneralC.primer_nombre + " " + this.infoGeneralC.primer_apellido
      };
      this.vetadosService.enviarReporte(reporte, this.sedeLogin).subscribe((response: any) => {
        if (response) {
          console.log('Reporte enviado:', response);
          Swal.fire('Observación Enviada', 'Su observación ha sido enviada: ' + this.observacion, 'success');
          this.mostrarObservacion = false; // Ocultar el campo después de enviar la observación
          this.observacion = ''; // Limpiar el campo de texto
        }
        else {
          Swal.fire('Error', 'Ocurrió un error al enviar la observación', 'error');
        }
      });
    } else {
      Swal.fire('Error', 'Debe escribir una observación antes de enviar.', 'error');
    }
  }

  async loadData(): Promise<void> {
    this.vacantesService.listarVacantes().pipe(
      catchError((error) => {
        Swal.fire('Error', 'Ocurrió un error al cargar las vacantes', 'error');
        return of([]); // Retorna un arreglo vacío para manejar el error y continuar
      })
    ).subscribe((response: any) => {
      if (!response || !response.publicacion) {
        Swal.fire('Error', 'No se encontraron vacantes', 'error');
        return;
      }

      // Filtrar las vacantes basadas en la ubicación y la sedeLogin
      this.vacantes = response.publicacion.filter((vacante: any) => {
        // Extrae la lista de ubicaciones de la vacante y conviértela a un array
        const localizacion = vacante.localizacionDeLaPersona?.split(',').map((loc: string) => loc.trim().toLowerCase()) || [];

        // Verifica si this.sedeLogin está presente en la lista de localizaciones
        const sedeMatch = localizacion.includes(this.sedeLogin.toLowerCase());

        return sedeMatch;
      }).map((vacante: any) => ({
        ...vacante,
      }));
    });
  }


  // Función para escoger una vacante y actualizar los campos del formulario con los datos de la vacante
  escogerVacante(vacante: any): void {
    // Mostrar una alerta de éxito
    Swal.fire('Vacante seleccionada', 'La vacante ha sido almacenada para ejecutarla en su proceso de selección', 'success');

    // Si los datos de la vacante existen, actualizar el formulario directamente
    if (vacante) {
      console.log('Vacante seleccionada:', vacante);
      // imprimir hora de prueba tecnica
      this.formGroup2.patchValue({
        centroCosto: vacante.Localizaciondelavacante || '',
        cargo: vacante.Cargovacante_id || '',
        areaEntrevista: vacante.empresaQueSolicita_id || '',
        fechaPruebaEntrevista: this.formatDate(vacante.fechadePruebatecnica) || '',
        horaPruebaEntrevista: vacante.horadePruebatecnica || '',
        direccionEmpresa: vacante.lugarPrueba || ''
      });

      this.vacantesService.obtenerDetalleLaboral(vacante.Localizaciondelavacante, vacante.finca, vacante.Cargovacante_id).subscribe((response: any) => {
        if (response) {
          console.log('Detalle laboral:', vacante.fechaIngreso);

          let valorT = 0;

          // Verificar si auxilio_transporte NO es "No" ni "NO"
          if (response.auxilio_transporte === "No" || response.auxilio_transporte === "NO") {
            valorT = 0;
          } else {
            // Verificar si valor_transporte es un número válido
            if (!isNaN(parseFloat(response.valor_transporte))) {
              valorT = parseFloat(response.valor_transporte);
            }
          }

          // Convertir fecha de ingreso (DD/MM/YYYY) a un objeto Date válido
          let fechaIngresoConvertida: Date | null = null;
          if (vacante.fechadeIngreso) {
            const partesFecha = vacante.fechadeIngreso.split('/');
            if (partesFecha.length === 3) {
              const dia = parseInt(partesFecha[0], 10);  // Tomamos el primer valor como día
              const mes = parseInt(partesFecha[1], 10) - 1; // Meses en JavaScript son base 0
              const año = parseInt(partesFecha[2], 10);
              fechaIngresoConvertida = new Date(año, mes, dia);  // Crear el objeto Date con el formato adecuado
            }
          }

          this.formGroup4.patchValue({
            empresaUsuaria: vacante.Localizaciondelavacante || '',
            fechaIngreso: fechaIngresoConvertida || null,  // Asegurarse de que se asigne un Date válido
            salario: response.salario || '',
            auxTransporte: valorT,
            rodamiento: response.rodamiento || '',
            auxMovilidad: response.auxMovilidad || '',
            bonificacion: response.bonificacion || ''
          });
        }
      });









    }
  }

  // Método para convertir la fecha de "dd/mm/yyyy" a formato "yyyy-mm-dd"
  formatDate(dateString: string): string | null {
    if (!dateString) return null;

    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  }



  filtrarVacantes() {
    if (!this.filtro) return this.vacantes;

    const filtroLower = this.filtro.toLowerCase();
    return this.vacantes.filter(vacante =>
      ['Cargovacante_id', 'localizacionDeLaPersona', 'empresaQueSolicita_id']
        .some(key => vacante[key]?.toLowerCase().includes(filtroLower))
    );

  }


  async buscarCedula() {
    forkJoin({
      seleccion: this.contratacionService.traerDatosSeleccion(this.cedula),
      infoGeneral: this.contratacionService.buscarEncontratacion(this.cedula),
      vetado: this.vetadosService.listarReportesVetadosPorCedula(this.cedula)
    }).subscribe(
      async ({ seleccion, infoGeneral, vetado }) => {
        if (seleccion && seleccion.procesoSeleccion && Array.isArray(seleccion.procesoSeleccion)) {
          this.seleccion = seleccion.procesoSeleccion.reduce((prev: { id: number; }, current: { id: number; }) =>
            current.id > prev.id ? current : prev, { id: 0 });
        } else {
          Swal.fire({
            title: '¡Error!',
            text: 'Datos de selección no válidos',
            icon: 'error',
            confirmButtonText: 'Ok'
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
            confirmButtonText: 'Ok'
          });
        }

        // Mueve verificarSeleccion aquí para que luego de asignar código de contrato se haga la llamada
        await this.verificarSeleccion();

        await this.infoGeneralCandidato();
        this.procesoValido = true;

        if (vetado) {
          console.log('Vetado:', vetado);
        }
      },
      (err) => {
        console.error(err);
        Swal.fire({
          title: 'Atención',
          text: 'No se encontró la cédula ingresada, no ha llenado el formulario, se podrá continuar con el proceso, pero se debe indicar que a la persona que llene el formulario',
          icon: 'warning',
          confirmButtonText: 'Ok'
        });

        // Generar el código de contrato si no se encuentra la cédula
        this.seleccionService.generarCodigoContratacion(this.sede, this.cedula).subscribe((response: any) => {
          this.codigoContrato = response.codigo_contrato;
          this.procesoValido = true;
          Swal.fire({
            title: '¡Código de contrato generado!',
            text: 'El código de contrato generado es ' + response.codigo_contrato,
            icon: 'success',
            confirmButtonText: 'Ok'
          });
        });
      }
    );
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

  async infoGeneralCandidato() {
    if (this.infoGeneralC) {
      // Llenar el formulario de Info Personal con los datos de this.infoGeneralC
      this.infoPersonalForm.patchValue({
        oficina: this.sedeLogin || 'No disponible',
        tipodedocumento: this.infoGeneralC.tipodedocumento || 'No disponible',
        numerodecedula: this.infoGeneralC.numerodeceduladepersona || 'No disponible',
        nombreCompleto: this.getFullName(),
        celular: this.infoGeneralC.celular || '',
        whatsapp: this.infoGeneralC.whatsapp || '',
        genero: this.infoGeneralC.genero || '',
        edad: this.calcularEdad(this.infoGeneralC.fecha_nacimiento) || '',
        fechaNacimiento: this.convertirAFecha(this.infoGeneralC.fecha_nacimiento),
        barrio: this.infoGeneralC.barrio || '',
        tieneExperienciaFlores: this.infoGeneralC.tiene_experiencia_laboral || '',
        referenciado: this.infoGeneralC.referenciado || '',
        comoSeEntero: this.infoGeneralC.como_se_entero || ''
      });

      // Llenar el formulario de Entrevista con los datos de this.infoGeneralC
      this.entrevistaForm.patchValue({
        presentoEntrevista: this.infoGeneralC.presento_entrevista || '',
        eps: this.infoGeneralC.eps || '',
        revisionAntecedentes: this.infoGeneralC.revision_antecedentes || '',
        laboresRealizadas: this.infoGeneralC.labores_realizadas || '',
        empresasLaborado: this.infoGeneralC.empresas_laborado || '',
        tiempoExperiencia: this.infoGeneralC.tiempo_experiencia || '',
        escolaridad: this.infoGeneralC.escolaridad || '',
        numHijos: this.infoGeneralC.num_hijos_dependen_economicamente || '',
        quienLosCuida: this.infoGeneralC.quien_los_cuida || ''
      });

      // Llenar el formulario de Observaciones con los datos de this.infoGeneralC
      this.observacionesForm.patchValue({
        observacionNovedad: this.infoGeneralC.observacion_novedad || '',
        observacionEvaluador: this.infoGeneralC.observacion_evaluador || ''
      });


    }

    if (this.seleccion) {
      // Llenar el formulario de vacantes con los datos de this.seleccion
      this.vacantesForm.patchValue({
        centroCosto: this.seleccion.centro_costo_entrevista || '',
        cargo: this.seleccion.cargo || '',
        fechaPruebaEntrevista: this.seleccion.fecha_prueba_entrevista || '',
        horaPruebaEntrevista: this.seleccion.hora_prueba_entrevista || '',
        porQuienPregunta: '',  // Campo vacío que debe ser llenado por el usuario
        retroalimentacionFinal: ''  // Campo vacío que debe ser llenado por el usuario
      });
    }
  }

  async verificarSeleccion() {
    // Si existe un proceso de selección, llenar el formulario con los datos
    if (this.seleccion) {
      console.log('Proceso de selección encontrado:', this.seleccion);
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

          // Ahora que ya se ha asignado this.codigoContrato, puedes llamar a obtenerDocumentosPorTipo
          if (this.codigoContrato) {
            this.gestionDocumentalService.obtenerDocumentosPorTipo(this.cedula, this.codigoContrato, 2)
              .subscribe({
                next: (infoGestionDocumentalAntecedentes: any[]) => {
                  if (infoGestionDocumentalAntecedentes) {
                    // Iterar sobre los documentos y mapearlos a los campos correctos
                    infoGestionDocumentalAntecedentes.forEach((documento: any) => {
                      const typeKey = Object.keys(this.typeMap).find(key => this.typeMap[key] === documento.type);
                      if (typeKey) {
                        // Aquí almacenamos el archivo con su URL para visualizarlo luego
                        this.uploadedFiles[typeKey] = {
                          fileName: documento.title,
                          file: documento.file_url // Guardar la URL para acceder al archivo más tarde
                        };
                      }
                    });
                  }
                },
                error: (err: any) => {
                  if (err.error.error === "No se encontraron documentos") {
                    Swal.fire({
                      title: '¡Atención!',
                      text: 'No se encontraron documentos de antecedentes',
                      icon: 'warning',
                      confirmButtonText: 'Ok'
                    });
                  } else {
                    console.error('Error al obtener antecedentes:', err);
                    Swal.fire({
                      title: '¡Error!',
                      text: 'No se pudieron obtener los documentos de antecedentes',
                      icon: 'error',
                      confirmButtonText: 'Ok'
                    });
                  }
                }
              });
          }



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





  abrirModal(): void {
    this.dialog.open(LeerInfoCandidatoComponent, {
      minWidth: '80vw',
      minHeight: '60vh',
      maxHeight: '80vh',
      data: {
        seleccion: this.seleccion,
        infoGeneralC: this.infoGeneralC,
      },
    });
  }

  // Método para abrir un archivo en una nueva pestaña
  verArchivo(campo: string) {
    const archivo = this.uploadedFiles[campo];

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
          console.log('Archivos a subir:', this.uploadedFiles);
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
  // Método para subir todos los archivos almacenados en uploadedFiles
  subirTodosLosArchivos(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      console.log('Subiendo archivos...', this.uploadedFiles);
      const totalFiles = Object.keys(this.uploadedFiles).length; // Total de archivos a subir
      let filesUploaded = 0; // Contador de archivos subidos

      Object.keys(this.uploadedFiles).forEach((campo) => {
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







  //--------------------------------------------------------------------------------}

  // Método para calcular el porcentaje de llenado de un FormGroup
  getPercentage(formGroup: FormGroup): number {
    const totalFields = Object.keys(formGroup.controls).length;
    const filledFields = Object.values(formGroup.controls).filter(control => {
      const value = control.value;

      // Ignorar campos vacíos y arreglos vacíos
      if (Array.isArray(value)) {
        return value.length > 0; // Solo contar como lleno si el arreglo tiene elementos
      }

      return value !== null && value !== undefined && value !== ''; // Considerar los valores no vacíos
    }).length;

    return Math.round((filledFields / totalFields) * 100);
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





}
