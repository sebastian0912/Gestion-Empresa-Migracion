import { Component } from '@angular/core';
import { NavbarLateralComponent } from '../../components/navbar-lateral/navbar-lateral.component';
import { NavbarSuperiorComponent } from '../../components/navbar-superior/navbar-superior.component';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-envio-paquete-documentacion',
  standalone: true,
  imports: [
    NavbarLateralComponent,
    NavbarSuperiorComponent,
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './envio-paquete-documentacion.component.html',
  styleUrl: './envio-paquete-documentacion.component.css'
})
export class EnvioPaqueteDocumentacionComponent {
  myForm: FormGroup;

  sedes = [
    "FACA_PRINCIPAL",
    "FACA_CENTRO",
    "FACA_PQ",
    "ROSAL",
    "CARTAGENITA",
    "MADRID",
    "FUNZA",
    "SOACHA",
    "FONTIBÓN",
    "SUBA",
    "TOCANCIPÁ",
    "BOSA",
    "BOGOTÁ"
  ];

  conceptos = [
    "Hojas de vida",
    "Incapacidades",
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {

    this.myForm = this.fb.group({
      valor: ['', Validators.required],
      concepto: ['', Validators.required],
      sede: ['', Validators.required],
      nombrePersonaEnvio: ['', Validators.required],
      comentarioEnvio: ['', Validators.required]
    });

  }


  async onSubmit() {
    if (this.myForm.invalid) {
      return;
    }   



  }

}
