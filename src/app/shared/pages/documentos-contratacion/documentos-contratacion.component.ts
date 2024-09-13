import { Component, OnInit, Injectable } from '@angular/core';
import { FingerprintReader, SampleFormat } from '@digitalpersona/devices';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { IncapacidadService } from '../../services/incapacidad/incapacidad.service';
import { Incapacidad } from '../../../models/incapacidad.model';
import { MatTableDataSource } from '@angular/material/table';
import { NavbarLateralComponent } from '../../components/navbar-lateral/navbar-lateral.component';
import { NavbarSuperiorComponent } from '../../components/navbar-superior/navbar-superior.component';
import { InfoCardComponent } from '../../components/info-card/info-card.component';
import { PagosService } from '../../services/pagos/pagos.service';
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
import { format } from 'date-fns';
import { MatGridListModule } from '@angular/material/grid-list';  // Importa MatGridListModule
import { MatListModule } from '@angular/material/list'; // Módulo de MatList

@Component({
  selector: 'app-documentos-contratacion',
  standalone: true,
  imports: [NavbarLateralComponent,
    NavbarSuperiorComponent,
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
    ReactiveFormsModule,],
  templateUrl: './documentos-contratacion.component.html',
  styleUrl: './documentos-contratacion.component.css'
})
export class DocumentosContratacionComponent implements OnInit {
  formFicha: FormGroup;
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
  constructor(private fb: FormBuilder) {
    this.formFicha = this.fb.group({
    });
  }


  ngOnInit(): void {
    this.formFicha = this.fb.group({
      personalInfo: this.fb.group({
        primerApellido: ['', Validators.required],
        segundoApellido: [''],
        nombres: ['', Validators.required],
        numerodeidentifacion: ['', Validators.required],

        fechaExpedicionylugardeexpedicion: [''],
        fechaNacimientoylugardenacimiento: [''],
        direccion: [''],
        municipioBarrio: [''],
        celular: [''],
        diestroZurdo: [''],
        rh: [''],
        estadoCivil: [''],
        numerodehijos: [''],
        correoelectronico: [''],
        eps: [''],
        afp: [''],
        afc: [''],
        cajaCompensacion: [''],
        planFunerario: [''],
      }),
      familiarInfo: this.fb.group({
        nombreapellidoPadre: [''],
        direccionPadre: [''],
        vivepadre: [''],
        ocupacionPadre: [''],
        telefonoPadre: [''],
        barrioMunicipioPadre: [''],
        nombreapellidoMadre: [''],
        direccionMadre: [''],
        viveMadre: [''],
        ocupacionMadre: [''],
        telefonoMadre: [''],
        barrioMunicipioMadre: [''],
        nombreapellidoConyuge: [''],
        direccionConyuge: [''],
        viveConyuge: [''],
        ocupacionConyuge: [''],
        telefonoConyuge: [''],
        familiarCasodeEmergencia: [''],
        parentescoCasodeEmergencia: [''],
        telefonoCasodeEmergencia: [''],
        ocupacionCasoEmergencia: [''],
        barrioMunicipioCasodeEmergencia: [''],
        direccionfamiliarCasodeEmergencia: [''],
      }),
      academicInfo: this.fb.group({
        gradoEscolaridad: [''],
        isTecnologo: [''],
        isUniversidad: [''],
        isEspecializacion: [''],
        isOtros: [''],
        institucion: [''],
        anoFinalizacion: [''],
        tituloObtenido: ['']
      }),
      dotacionInfo: this.fb.group({
        tallachaqueta: [''],
        tallaPantalon: [''],
        tallaOverol: [''],
        isOtros: [''],
        institucion: [''],
        anoFinalizacion: [''],
        tituloObtenido: ['']
      }),
    comments: this.fb.group({
        comentariosPersonales: [''],
        comentariosFamiliares: [''],
        comentariosLaborales: ['']
      }),
      contractorInfo: this.fb.group({
        nombreContratante: [''],
      })
    });
  }




  onSubmit(): void {
  }

}
