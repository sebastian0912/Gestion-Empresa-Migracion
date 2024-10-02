import { Component, OnInit } from '@angular/core';
import { NavbarLateralComponent } from '../../components/navbar-lateral/navbar-lateral.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { NavbarSuperiorComponent } from '../../components/navbar-superior/navbar-superior.component';
import { ConfigService } from '../../services/config/config.service';

@Component({
  selector: 'app-cambiar-contrasena',
  standalone: true,
  imports: [
    NavbarLateralComponent,
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    NavbarSuperiorComponent
  ],
  templateUrl: './cambiar-contrasena.component.html',
  styleUrl: './cambiar-contrasena.component.css'
})
export class CambiarContrasenaComponent {
  myForm!: FormGroup;
  hideOldPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  public isMenuVisible = true;

  // Método para manejar el evento del menú
  onMenuToggle(isMenuVisible: boolean): void {
    this.isMenuVisible = isMenuVisible;
  }

  constructor(
    private fb: FormBuilder,
    private configService: ConfigService
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }

  // Función para enviar el formulario
  async onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    this.trimFormFields();

    // Aquí puedes manejar la lógica de cambio de contraseña
    this.configService.cambiarContrasena(this.myForm.value.oldPassword, this.myForm.value.newPassword)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Contraseña cambiada',
          text: 'Tu contraseña ha sido cambiada correctamente, la próxima vez que inicies sesión, utiliza tu nueva contraseña'
        }).then(() => {
          window.location.href = '/home';
        } );
        
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al cambiar la contraseña',
          text: error.message
        });
      });
  }

  private trimFormFields() {
    Object.keys(this.myForm.controls).forEach(field => {
      const control = this.myForm.get(field);
      if (control && control.value && typeof control.value === 'string') {
        control.setValue(control.value.trim());
      }
    });
  }

  toggleOldPasswordVisibility() {
    this.hideOldPassword = !this.hideOldPassword;
  }

  toggleNewPasswordVisibility() {
    this.hideNewPassword = !this.hideNewPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  private passwordsMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmNewPassword = form.get('confirmNewPassword')?.value;
    return newPassword === confirmNewPassword ? null : { mismatch: true };
  }
}
