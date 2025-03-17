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
import { NgClass, NgFor, NgForOf, NgIf, NgStyle } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { ContratacionService } from '../../services/contratacion/contratacion.service';
import { catchError, elementAt, forkJoin, of } from 'rxjs';
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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PDFDocument } from 'pdf-lib';

@Component({
  selector: 'app-seleccion',
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
    NgClass,
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
  empresa: string = '';
  vacante: any; // Variable to store the vacancy
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
  idvacante = '';
  examFiles: File[] = []; // Guardamos los archivos PDF por índice

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
    figuraHumana: 31,
    examenesMedicos: 32,
    pensionSemanas: 33
  };

  uploadedFiles: { [key: string]: { file?: File; fileName?: string } } = {
    eps: { fileName: 'No disponible, falta cargar' },
    afp: { fileName: 'No disponible, falta cargar' },
    policivos: { fileName: 'No disponible, falta cargar' },
    procuraduria: { fileName: 'No disponible, falta cargar' },
    contraloria: { fileName: 'No disponible, falta cargar' },
    ramaJudicial: { fileName: 'No disponible, falta cargar' },
    medidasCorrectivas: { fileName: 'No disponible, falta cargar' },
    sisben: { fileName: 'No disponible, falta cargar' },
    ofac: { fileName: 'No disponible, falta cargar' },
    examenesMedicos: { fileName: 'No disponible, falta cargar' },
    figuraHumana: { fileName: 'No disponible, falta cargar' },
    pensionSemanas: { fileName: 'No disponible, falta cargar' },
  };


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
  dataSource: any;
  displayedColumns!: string[];

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
      sisben: [''],
      ofac: [''],
      medidasCorrectivas: [''],
      area_aplica: [''],
      revisionAntecedentes: [''],

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

        // Asegurar que `user.sucursalde` es string
        const sede: string = user.sucursalde;
        this.sedeLogin = sede;
        this.sede = abreviaciones[sede] || sede;
      }
    });

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

  // Actualizar lista de exámenes con su estructura en FormArray
  updateSelectedExamsArray(selectedExams: string[]): void {
    this.selectedExamsArray.clear();
    this.examFiles = new Array(selectedExams.length); // Reset de archivos
    selectedExams.forEach(() => {
      this.selectedExamsArray.push(this.fb.group({
        aptoStatus: ['', Validators.required]
      }));
    });
  }

    // Guardar el archivo PDF seleccionado para cada examen
    onFileSelected(event: any, index: number): void {
      const file = event.target.files[0];
      if (file && file.type === 'application/pdf') {
        this.examFiles[index] = file;
      } else {
        alert('Por favor, seleccione un archivo PDF válido.');
      }
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
      console.log(response);
      if (!response) {
        Swal.fire('Error', 'No se encontraron vacantes', 'error');
        return;
      }

      // Filtrar las vacantes basadas en la ubicación y la sedeLogin
      // Filtrar las vacantes basadas en las oficinas que contratan y la sedeLogin
      this.vacantes = response.filter((vacante: any) => {
        // Verifica si la vacante tiene oficinas que contratan
        if (!vacante.oficinasQueContratan || !Array.isArray(vacante.oficinasQueContratan)) {
          return false;
        }

        // Convertir la sedeLogin a minúsculas para comparación
        const sedeLoginLower = this.sedeLogin.toLowerCase();

        // Buscar si alguna oficina coincide con la sedeLogin
        const sedeMatch = vacante.oficinasQueContratan.some((oficina: any) =>
          oficina.nombre.toLowerCase() === sedeLoginLower
        );

        return sedeMatch;
      }).map((vacante: any) => ({
        ...vacante,
      }));
      console.log(this.vacantes);

    });

  }


  // Función para escoger una vacante y actualizar los campos del formulario con los datos de la vacante
  escogerVacante(vacante: any): void {
    // Mostrar una alerta de éxito
    Swal.fire('Vacante seleccionada', 'La vacante ha sido almacenada para ejecutarla en su proceso de selección', 'success');

    // Si los datos de la vacante existen, actualizar el formulario directamente
    if (vacante) {
      console.log(vacante);
      this.idvacante = vacante.id;
      // imprimir hora de prueba tecnica
      this.formGroup2.patchValue({
        centroCosto: vacante.finca || '',
        cargo: vacante.cargo || '',
        areaEntrevista: vacante.empresaUsuariaSolicita || '',
        fechaPruebaEntrevista: this.formatDate(vacante.fechadePruebatecnica) || '',
        horaPruebaEntrevista: vacante.horadePruebatecnica || '',
        direccionEmpresa: vacante.ubicacionPruebaTecnica || ''
      });

      this.vacantesService.obtenerDetalleLaboral(vacante.empresaUsuariaSolicita, vacante.finca, vacante.cargo).subscribe((response: any) => {
        if (response) {
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
          console.log(vetado);
          // Filtrar elementos que tengan una categoría no nula
          const vetadoFiltrado = vetado.filter((item: any) => item.categoria !== null);

          // Mapear los datos para extraer clasificación y descripción
          const data = vetado.map((item: any) => ({
            cedula: item.cedula,
            nombre_completo: item.nombre_completo,
            clasificacion: item.categoria?.clasificacion || '',
            descripcion: item.categoria?.descripcion || '',
            observacion: item.observacion,
            estado: item.estado,
            sede: item.sede,
            autorizado_por: item.autorizado_por
          }));

          this.dataSource = new MatTableDataSource(data);
          this.displayedColumns = ['cedula', 'nombre_completo', 'clasificacion', 'descripcion', 'observacion', 'estado', 'sede'];
        }
      },
      (err) => {
        if (err.error.message === "No se encontró el proceso de selección para la cédula proporcionada") {
          Swal.fire({
            title: 'Info',
            text: 'El usuario no tiene ningun proceso con nosotros actualmente. Se procede a generar el código de contrato.',
            icon: 'info',
            confirmButtonText: 'Ok',
          }).then((result) => {
            if (result.isConfirmed) {
              // Generar el código de contrato si no se encuentra la cédula
              this.seleccionService.generarCodigoContratacion(this.sede, this.cedula).subscribe((response: any) => {
                this.codigoContrato = response.nuevo_codigo;
                this.procesoValido = true;

                Swal.fire({
                  title: '¡Código de contrato generado!',
                  text: 'El código de contrato generado es ' + response.nuevo_codigo,
                  icon: 'success',
                  confirmButtonText: 'Ok'
                });
              });
            }
          });
        }
        else {
          Swal.fire({
            title: 'Atención',
            text: 'No se encontró la cédula ingresada, no ha llenado el formulario, se podrá continuar con el proceso, pero se debe indicar que a la persona que llene el formulario',
            icon: 'warning',
            confirmButtonText: 'Ok'
          });
        }

      }
    );

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
          console.log(this.seleccion);
          this.vacantesService.obtenerVacante(this.seleccion.vacante).subscribe((response: any) => {
            console.log(response);
            this.empresa = response.temporal;
            this.vacante = response
          });


          // Ahora que ya se ha asignado this.codigoContrato, puedes llamar a obtenerDocumentosPorTipo
          if (this.codigoContrato) {
            this.gestionDocumentalService.obtenerDocumentosPorTipo(this.cedula, this.codigoContrato, 2)
              .subscribe({
                next: (infoGestionDocumentalAntecedentes: any[]) => {
                  if (infoGestionDocumentalAntecedentes) {
                    // Iterar sobre los documentos y mapearlos a los campos correctos
                    infoGestionDocumentalAntecedentes.forEach(async (documento: any) => {
                      const typeKey = Object.keys(this.typeMap).find(key => this.typeMap[key] === documento.type);
                      if (typeKey) {
                        const file = await this.urlToFile(documento.file_url, documento.title || 'Documento sin título');
                        this.uploadedFiles[typeKey] = {
                          fileName: documento.title || 'Documento sin título',
                          file // Asigna el archivo descargado
                        };
                      }
                    });
                  }
                  else {
                    Swal.fire({
                      title: '¡Atención!',
                      text: 'No se encontraron documentos de antecedentes',
                      icon: 'warning',
                      confirmButtonText: 'Ok'
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
        Swal.fire('Error', 'No se pudo descargar el archivo', 'error');
        throw error;
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

// Método que se ejecuta cuando se selecciona un archivo o se genera un PDF en memoria
subirArchivo(event: any | Blob, campo: string, fileName?: string) {
  let file: File;

  if (event instanceof Blob) {
    // Si es un archivo generado en memoria (como el PDF fusionado)
    file = new File([event], fileName || 'archivo.pdf', { type: 'application/pdf' });
  } else {
    // Si es un evento de input file (archivo seleccionado por el usuario)
    file = event.target.files[0];
  }

  if (file) {
    // Verificar si el nombre del archivo tiene más de 100 caracteres
    if (file.name.length > 100) {
      Swal.fire('Error', 'El nombre del archivo no debe exceder los 100 caracteres', 'error');
      return; // Salir de la función si la validación falla
    }

    // Si la validación es exitosa, almacenar el archivo en uploadedFiles
    this.uploadedFiles[campo] = { file: file, fileName: file.name };

    // Mensaje opcional de éxito
    // Swal.fire('Archivo subido', `Archivo ${file.name} subido para ${campo}`, 'success');
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
              const nombres = ["eps", "afp", "policivos", "procuraduria", "contraloria", "ramaJudicial", "medidasCorrectivas", "sisben", "ofac"];
              // Si la respuesta es exitosa, proceder a subir los archivos
              this.subirTodosLosArchivos(nombres).then((allFilesUploaded) => {
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
  subirTodosLosArchivos(keysEspecificos: string[]): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Filtrar los archivos válidos basados en las keys específicas proporcionadas
      let archivosAEnviar = Object.keys(this.uploadedFiles)
        .filter(key => {
          const fileData = this.uploadedFiles[key];
          // Incluir solo las keys específicas y con un objeto `file` válido
          return keysEspecificos.includes(key) && fileData && fileData.file;
        })
        .map(key => ({
          key,
          ...this.uploadedFiles[key],
          typeId: this.typeMap[key] // Asignar el tipo documental (typeId)
        }));


      // Si no hay archivos para subir
      if (archivosAEnviar.length === 0) {
        resolve(true); // Resolver inmediatamente si no hay archivos
        return;
      }

      // Crear promesas para cada archivo
      const promesasDeSubida = archivosAEnviar.map(({ key, file, fileName, typeId }) => {
        return new Promise<void>((resolveSubida, rejectSubida) => {
          if (file && typeId) {
            // Verificar si la clave está entre ["examenesMedicos", "figuraHumana", "pensionSemanas"]
            if (["examenesMedicos", "figuraHumana", "pensionSemanas"].includes(key)) {
              // Si la clave coincide, incluir this.codigoContrato en guardarDocumento
              this.gestionDocumentalService
                .guardarDocumento(fileName, this.cedula, typeId, file, this.codigoContrato)
                .subscribe({
                  next: () => {
                    resolveSubida(); // Resolver la promesa de este archivo
                  },
                  error: (error) => {
                    rejectSubida(`Error al subir archivo ${key}: ${error.message}`);
                  }
                });
            } else {
              // Si no coincide, usar el método normal
              this.gestionDocumentalService
                .guardarDocumento(fileName, this.cedula, typeId, file) // Sin this.codigoContrato
                .subscribe({
                  next: () => {
                    resolveSubida(); // Resolver la promesa de este archivo
                  },
                  error: (error) => {
                    rejectSubida(`Error al subir archivo ${key}: ${error.message}`);
                  }
                });
            }
          } else {
            rejectSubida(`Archivo ${key} no tiene datos válidos`);
          }
        });
      });

      // Esperar a que todas las subidas terminen
      Promise.all(promesasDeSubida)
        .then(() => {
          resolve(true); // Resolver cuando todos los archivos hayan sido procesados
        })
        .catch((error) => {
          reject(error); // Rechazar si hay errores en alguna subida
        });
    });
  }






  // Método para imprimir los datos de los formularios
  imprimirEntrevistaPrueba(): void {
    this.formGroup2.value.vacante = this.idvacante;
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

  // Método para fusionar PDFs y almacenarlo en uploadedFiles["examenesMedicos"]
  async imprimirSaludOcupacional(): Promise<void> {
    if (this.examFiles.length === 0 || this.examFiles.every(file => !file)) {
      Swal.fire({
        title: '¡Advertencia!',
        text: 'Debe subir al menos un archivo PDF.',
        icon: 'warning',
        confirmButtonText: 'Ok'
      });
      return;
    }

    Swal.fire({
      title: 'Procesando...',
      icon: 'info',
      text: 'Generando documento PDF...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      // Crear un nuevo documento PDF
      const mergedPdf = await PDFDocument.create();

      for (const file of this.examFiles) {
        if (file) {
          const fileBuffer = await file.arrayBuffer();
          const pdf = await PDFDocument.load(fileBuffer);
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        }
      }

      // Generar el PDF fusionado en Blob
      const mergedPdfBytes = await mergedPdf.save();
      const pdfBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' });

      // Guardar el archivo fusionado en uploadedFiles["examenesMedicos"]
      this.subirArchivo(pdfBlob, "examenesMedicos", "SaludOcupacional_Combinado.pdf");

      Swal.close(); // Cerrar la alerta de carga

      this.imprimirDocumentos();

    } catch (error) {
      Swal.close();
      Swal.fire({
        title: '¡Error!',
        text: 'Ocurrió un problema al fusionar los archivos PDF.',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
  }

  // Método para imprimir los datos de los formularios
  imprimirContratacion(): void {
    this.seleccionService.crearSeleccionParteCuatroCandidato(this.formGroup4.value, this.cedula, this.codigoContrato).subscribe(
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

  generarRemisionPruebaTecnica() {
    console.log('Generar remisión para prueba técnica');
    // Determinar la ruta del logo y el NIT
    let logoPath = '';
    let codigo = '';
    let version = '';
    let texto = '';
    let qrPath = '';
    console.log(this.empresa);
    if (this.empresa === 'APOYO LABORAL SAS') {
      logoPath = '/logos/Logo_AL.png';
      codigo = 'Código: AL SE-RE-4';
      version = 'Versión: 02';
      texto = 'En el buscador escriba apoyo laboral ts,  dele click en la pestaña de registrarse o más información y diligencie todo el formulario y al final de la página presione click en “siguiente” para terminar.';
      qrPath = '/qrs/QR_APOYO.png';
    } else if (this.empresa === 'TU ALIANZA SAS') {
      logoPath = '/logos/Logo_TA.png';
      codigo = 'Código: TA SE-RE-4';
      version = 'Versión: 02';
      texto = 'En el buscador escriba Tu Alianza SAS,  dele click en la pestaña de registrarse o más información y diligencie todo el formulario y al final de la página presione click en “siguiente” para terminar.';
      qrPath = '/qrs/QR_ALIANZA.png';
    } else {
      return;
    }

    // Crear el documento PDF en formato vertical
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter',
    });

    doc.setProperties({
      title: 'Contrato_Trabajo.pdf',
      creator: this.empresa,
      author: this.empresa,
    });


    // Posiciones iniciales
    const startX = 5;
    const startY = 5;
    const tableWidth = 205;

    // **Cuadro para el logo y NIT**
    doc.setLineWidth(0.1);
    doc.rect(startX, startY, 50, 13); // Cuadro del logo y NIT

    // Agregar logo
    doc.addImage(logoPath, 'PNG', startX + 7, startY + 1.5, 35, 10);

    // Agregar NIT
    doc.setFontSize(7);

    // **Tabla al lado del logo**
    let tableStartX = startX + 50; // Inicio de la tabla al lado del cuadro
    doc.rect(tableStartX, startY, tableWidth - 50, 13); // Borde exterior de la tabla

    // Encabezados
    doc.setFont('helvetica', 'bold');
    doc.text("PROCESO DE SELECCIÓN", tableStartX + 55, startY + 3);
    doc.text("REMISION PARA ENTREVISTA Y/O PRUEBA TECNICA", tableStartX + 43, startY + 7);

    // Líneas divisoras
    let col1 = tableStartX + 30;
    let col2 = tableStartX + 50;
    let col3 = tableStartX + 110;

    doc.line(tableStartX, startY + 4, tableStartX + tableWidth - 50, startY + 4); // Línea horizontal bajo el título
    doc.line(tableStartX, startY + 8, tableStartX + tableWidth - 50, startY + 8); // Línea horizontal bajo el título
    doc.line(col1, startY + 8, col1, startY + 13); // Línea vertical 1
    doc.line(col2, startY + 8, col2, startY + 13); // Línea vertical 2
    doc.line(col3, startY + 8, col3, startY + 13); // Línea vertical 3

    // **Contenido de las columnas**
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text(codigo, tableStartX + 2, startY + 11.5);
    doc.text(version, col1 + 2, startY + 11.5); // Ajustar dentro de columna
    let fechaEmision = this.obtenerFechaActual(); // Obtener la fecha actual formateada
    doc.text(`Fecha Emisión: ${fechaEmision}`, col2 + 5, startY + 11.5);
    doc.text("Página: 1 de 1", col3 + 6, startY + 11.5); // Ajustar dentro de columna

    // linea de extremo a extremo
    doc.line(startX, startY + 13, tableStartX + tableWidth - 50, startY + 13);
    // REMISION PARA ENTREVISTA Y/O PRUEBA TECNICA
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text("REMISION PARA ENTREVISTA Y/O PRUEBA TECNICA", 80, startY + 20);
    // linea de extremo a extremo
    doc.line(startX, startY + 13, tableStartX + tableWidth - 50, startY + 13);
    let fecha = this.getFormattedDate();

    // posicion vertical
    let pos = 30;
    // **Datos del candidato**
    doc.setFontSize(6);

    // **Cuadro para el logo y NIT**
    doc.setLineWidth(0.1);


    // Agregar logo
    doc.addImage(logoPath, 'PNG', startX + 7, startY + 1.5, 35, 10);

    // **Información previa alineada**
    pos = 30; // Ajustar la posición vertical inicial
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');

    // Definir posiciones para las columnas
    const col1X = startX + 5; // Primera columna
    const col2X = startX + 120; // Segunda columna
    const spacer = 55; // Espaciado entre la etiqueta y el valor

    // Primera fila
    doc.text(`Fecha:`, col1X, pos);
    doc.setFont('helvetica', 'normal');
    doc.text(`${this.getFormattedDate()}`, col1X + spacer, pos);

    doc.setFont('helvetica', 'bold');
    doc.text(`Código de Contrato:`, col2X, pos);
    doc.setFont('helvetica', 'normal');
    doc.text(`${this.codigoContrato}`, col2X + spacer, pos);

    // Segunda fila
    pos += 5;
    doc.setFont('helvetica', 'bold');
    doc.text(`Empresa Usuaria:`, col1X, pos);
    doc.setFont('helvetica', 'normal');
    doc.text(`${this.formGroup4.value.empresaUsuaria}`, col1X + spacer, pos);

    doc.setFont('helvetica', 'bold');
    doc.text(`Cargo:`, col2X, pos);
    doc.setFont('helvetica', 'normal');
    doc.text(`${this.formGroup2.value.cargo}`, col2X + spacer, pos);

    // Tercera fila
    pos += 5;
    doc.setFont('helvetica', 'bold');
    doc.text(`Experiencia en el Sector:`, col1X, pos);
    doc.setFont('helvetica', 'normal');
    doc.text(`${this.vacante.experiencia}`, col1X + spacer, pos);

    doc.setFont('helvetica', 'bold');
    doc.text(`¿Cuánto tiempo?:`, col2X, pos);
    doc.setFont('helvetica', 'normal');
    doc.text(`${this.infoGeneralC.tiempo_experiencia}`, col2X + spacer, pos);

    // Añadir más texto como antes
    pos += 12;
    doc.setFont('helvetica', 'bold');
    doc.text(`Respetados Señores:`, col1X, pos);

    pos += 5;
    doc.setFont('helvetica', 'normal');
    doc.text(`Muy comedidamente presentamos al señor (a):`, col1X, pos);
    doc.text(`${this.getFullName()}`, col1X + spacer, pos);

    pos += 5;
    doc.text(`Identificado (a) con cédula de ciudadanía número:`, col1X, pos);
    doc.text(`${this.infoGeneralC.numerodeceduladepersona}`, col1X + spacer, pos);

    pos += 5;
    doc.text(`Para presentar entrevista al área de:`, col1X, pos);
    doc.text(`${this.formGroup2.value.areaEntrevista}`, col1X + spacer, pos);

    pos += 5;
    doc.setFont('helvetica', 'bold');
    doc.text(`EN LAS INSTALACIONES DE LA EMPRESA`, col1X, pos);

    // Convertir la hora
    const hora12 = this.convertTo12HourFormat(this.formGroup2.value.horaPruebaEntrevista);

    pos += 5;

    // Texto "El día"
    doc.setFont('helvetica', 'normal');
    doc.text(`El día`, col1X, pos);

    // Texto con la fecha en negrita
    const textWidth1 = doc.getTextWidth(`El día `); // Obtener el ancho del texto anterior
    doc.setFont('helvetica', 'bold');
    doc.text(`${this.formGroup2.value.fechaPruebaEntrevista}`, col1X + textWidth1, pos);

    // Texto "a las"
    doc.setFont('helvetica', 'normal');
    const textWidth2 = textWidth1 + doc.getTextWidth(`${this.formGroup2.value.fechaPruebaEntrevista} `); // Ancho acumulado
    doc.text(` a las`, col1X + textWidth2, pos);

    // Texto con la hora en formato 12 horas en negrita
    doc.setFont('helvetica', 'bold');
    const textWidth3 = textWidth2 + doc.getTextWidth(` a las `); // Ancho acumulado
    doc.text(`${hora12}`, col1X + textWidth3, pos);


    pos += 5;
    doc.text(`PREGUNTAR POR: `, col1X, pos);
    doc.text(`Gestión Humana`, col1X + spacer, pos);


    // **Tabla: Dirección de la empresa**
    const tableData = [
      ['DIRECCIÓN DE LA EMPRESA'], // Encabezado
      [this.formGroup2.value.direccionEmpresa] // Dirección
    ];

    // Generar tabla con autoTable
    autoTable(doc, {
      startY: pos - 11, // Espaciado antes de la tabla
      margin: { left: 135 }, // Define la posición X inicial (50 mm desde la izquierda)
      head: [], // Sin encabezado adicional
      body: tableData,
      theme: 'grid', // Tema de la tabla
      styles: {
        font: 'helvetica',
        fontSize: 6,
        cellPadding: 1.5,
        halign: 'center' // Centrar el contenido de la tabla
      },
      columnStyles: {
        0: { cellWidth: 65 } // Ancho de la primera columna
      }
    });

    pos += 20;
    // Linea
    doc.setLineWidth(0.2);
    doc.line(10, pos, 50, pos);
    // Nombre del evaluador
    pos += 3.5;
    doc.text(`GESTIÓN HUMANA (Temporal)`, startX + 5, pos);

    // Dividir el texto en líneas con un ancho máximo de 80 mm
    const text = `Para dar inicio al proceso de contratación por favor Regístrese escaneando el QR o a través de facebook o Google así:`;
    // Parámetros de impresión
    const maxWidth = 50;  // Ancho máximo del párrafo (en mm)
    const lineHeight = 2; // Espacio vertical entre líneas

    // Dividimos el texto en líneas según maxWidth
    const lines = doc.splitTextToSize(text, maxWidth);

    // Configuramos la fuente (por ejemplo, Helvetica en bold, tamaño 12)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);

    // Recorremos cada línea para imprimirla
    lines.forEach((line: string | string[], index: number) => {
      const linePosY = startY + (index * lineHeight) + pos - 15;
      doc.text(line, startX + 120, linePosY, {
        align: 'justify',
      });
    });

    doc.setFont('helvetica', 'normal');
    const lines2 = doc.splitTextToSize(texto, maxWidth);
    lines2.forEach((line: string | string[], index: number) => {
      const linePosY = startY + (index * lineHeight) + pos - 5;
      doc.text(line, startX + 120, linePosY, {
        align: 'justify',
      });
    });



    // Agregar QR
    doc.addImage(qrPath, 'PNG', startX + 172, startY + 80, 25, 25);

    // Horario de Atención: LUNES a VIERNES DE 08:00 am - 12:00 pm y  DE 2:00 pm - 5:00 pm --- CENTRADO
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.text(`Horario de Atención: LUNES a VIERNES DE 08:00 am - 12:00 pm y  DE 2:00 pm - 5:00 pm`, 105, 115, {
      align: 'center'
    });

    const direccion = `Facatativá: Carrera 2 # 8 - 156 (Frente a tornillos 7777777) Madrid: Calle 7 # 4 - 49 (Centro) Funza: Calle 9 # 10 a 61 Fontibón: Carrera 112 a # 18 a 05 (Segundo piso Surtimax La Economía) Soacha: Calle 21 a # 3 - 20 (Al lado de la fábrica El Triunfo) Suba: Carrera 103 D # 150 c - 03 (Frente a la entrada del bodytech plaza imperial) Tocancipa: Calle 7 # 7 - 20 (Detrás del Claro). PBX: 7444002-  EXT 1010-1050* Celular: 3126469000`;

    // Ajustar la posición inicial
    pos += 13;

    // Dividir el texto para ajustarse al margen (180)
    const textoDividido = doc.splitTextToSize(direccion, 180);

    // Imprimir el texto línea por línea
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    textoDividido.forEach((line: string) => {
      // Calcular la posición horizontal centrada
      const textWidth = doc.getTextWidth(line);
      const centerX = (210 - textWidth) / 2; // 210 es el ancho de una página A4 en unidades de jsPDF

      doc.text(line, centerX, pos); // Centrar la línea
      pos += 3; // Incrementar la posición vertical para la siguiente línea
    });


    // Guardar el documento
    doc.save('Remision_prueba_tecnica_' + this.getFullName() + '_' + this.codigoContrato + '.pdf');
  }

  getFormattedDate(): string {
    const currentDate = new Date();

    // Opciones de formato
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long', // Nombre completo del día (ej: Tuesday)
      year: 'numeric', // Año con 4 dígitos
      month: 'long', // Nombre completo del mes (ej: September)
      day: 'numeric' // Día del mes (ej: 5)
    };

    // Formatear la fecha
    const formattedDate = currentDate.toLocaleDateString('en-US', options);

    return formattedDate;
  }

  convertTo12HourFormat(time24: string): string {
    const [hours, minutes] = time24.split(':').map(Number); // Dividir la hora en partes
    const suffix = hours >= 12 ? 'PM' : 'AM'; // Determinar AM o PM
    const hours12 = hours % 12 || 12; // Convertir a formato de 12 horas (0 se convierte en 12)
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${suffix}`;
  }


  // Función para formatear la fecha actual
  obtenerFechaActual() {
    const meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const hoy = new Date();
    const dia = hoy.getDate().toString().padStart(2, '0'); // Añadir 0 si es necesario
    const mes = meses[hoy.getMonth()]; // Obtener nombre del mes
    const anio = hoy.getFullYear().toString().slice(-2); // Últimos 2 dígitos del año

    return `${mes} ${dia}-${anio}`;
  }








  imprimirDocumentos() {
    // Mostrar Swal de carga con ícono animado
    Swal.fire({
      title: 'Subiendo archivos...',
      icon: 'info',
      html: 'Por favor, espere mientras se suben los archivos.',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading(); // Mostrar icono de carga animado
      }
    });
    const nombres = ["examenesMedicos", "figuraHumana", "pensionSemanas"];
    // Subir solo los primeros 9 archivos
    this.subirTodosLosArchivos(nombres)
      .then((allFilesUploaded) => {
        if (allFilesUploaded) {
          Swal.close(); // Cerrar el Swal de carga
          // Mostrar mensaje de éxito
          Swal.fire({
            title: '¡Éxito!',
            text: 'Datos y archivos guardados exitosamente',
            icon: 'success',
            confirmButtonText: 'Ok'
          });
        }
      })
      .catch((error) => {
        // Cerrar el Swal de carga y mostrar un mensaje de error
        Swal.close();
        Swal.fire({
          title: 'Error',
          text: `Hubo un error al subir los archivos: ${error}`,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      });
  }



}
