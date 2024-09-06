import { Component, OnInit, Injectable } from '@angular/core';
import { FingerprintReader, SampleFormat } from '@digitalpersona/devices';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  fichaForm: FormGroup;
overlayVisible = false;
  loaderVisible = false;
  counterVisible = false;
  informacionPersonal : string[] = [
    'Primer Apellido',
    'Segundo Apellido',
    'Nombres',
    'Fecha de expedición',
    'Lugar de expedición',
    'Fecha de nacimiento',
    'Lugar de nacimiento',
    'Numero de documento',
    'Direccion',
    'Municipio',
    'Barrio',
    'Celular',
    'Email',
    'Eps',
    'Afp',
    'Afc',
    'Caja de compensación',
    'Desea afiliarse a plan funerario'


  ];
  informacionAcademica : string[] = [];
  informacionFamiliar : string[] = [];
  informacionHijos : string[] = [];
  informacionDotacion : string[] = [];
  referenciasLaborales : string[] = [];
  ReferenciasPersonales : string[] = [];
  ReferenciasFamiliares : string[] = [];
  huellaDigital : string = '';
  firma: string = '';






  ngOnInit(): void {}
  constructor(private fb: FormBuilder) {
    this.fichaForm = this.fb.group({
      primerApellido: ['', Validators.required],
      segundoApellido: ['', Validators.required],
      nombres: ['', Validators.required],
      fechaExpedicion: ['', Validators.required],
      lugarExpedicion: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      lugarNacimiento: ['', Validators.required],
      direccion: ['', Validators.required],
      municipio: ['', Validators.required],
      celular: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      diestrado: ['', Validators.required],
      rh: ['', Validators.required],
      estadoCivil: ['', Validators.required],
      eps: ['', Validators.required],
      afp: ['', Validators.required],
      // Agrega más campos según sea necesario
    });
  }
  onSubmit(): void {
    if (this.fichaForm.valid) {
      console.log(this.fichaForm.value);
      // Aquí puedes manejar el envío del formulario
    }
  }
}
