import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidatorFn, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NavbarLateralComponent } from '../../components/navbar-lateral/navbar-lateral.component';
import { NavbarSuperiorComponent } from '../../components/navbar-superior/navbar-superior.component';

@Component({
  selector: 'app-recibir-paquete-documentacion',
  standalone: true,
  imports: [
    NavbarLateralComponent,
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    NavbarSuperiorComponent
  ],
  templateUrl: './recibir-paquete-documentacion.component.html',
  styleUrl: './recibir-paquete-documentacion.component.css'
})
export class RecibirPaqueteDocumentacionComponent {
  myForm!: FormGroup;

  public isMenuVisible = true;

  // Método para manejar el evento del menú
  onMenuToggle(isMenuVisible: boolean): void {
    this.isMenuVisible = isMenuVisible;
  }

  constructor(
    private fb: FormBuilder,    

  ) {
    this.myForm = this.fb.group({
      codigoProducto: ['', Validators.required],
      cantidad: ['', Validators.required],
      comentariosEnvio: ['', Validators.required],
    });
  }

  private trimFormFields() {
    const trimControl = (control: AbstractControl) => {
      if (control && control.value && typeof control.value === 'string') {
        control.setValue(control.value.trim());
      }
    };

    const trimGroup = (group: FormGroup) => {
      Object.keys(group.controls).forEach(field => {
        const control = group.get(field);
        if (control) {
          if (control instanceof FormArray) {
            control.controls.forEach(arrayControl => {
              if (arrayControl instanceof FormGroup) {
                trimGroup(arrayControl);
              } else {
                trimControl(arrayControl);
              }
            });
          } else {
            trimControl(control);
          }
        }
      });
    };

    trimGroup(this.myForm);
  }

  async onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    this.trimFormFields();

    const formValues = this.myForm.value;
    

  }

}
