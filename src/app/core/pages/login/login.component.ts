import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { AuthService } from '../../service/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgClass,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  rightPanelActive: boolean = false;
  loginForm: FormGroup;
  registerForm: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  showLoginPassword: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      secondName: [''],
      firstLastName: ['', Validators.required],
      secondLastName: [''],
      documentNumber: ['', Validators.required],
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  togglePanel(isSignUp: boolean): void {
    this.rightPanelActive = isSignUp;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  toggleLoginPasswordVisibility(): void {
    this.showLoginPassword = !this.showLoginPassword;
  }

  register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const newUser = {
      firstName: this.registerForm.value.firstName,
      secondName: this.registerForm.value.secondName,
      firstLastName: this.registerForm.value.firstLastName,
      secondLastName: this.registerForm.value.secondLastName,
      documentNumber: this.registerForm.value.documentNumber,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
    };

    this.authService.register(newUser).then(response => {
      if (response && response.success) {
        // Navigate to home or show success message
      } else {
        // Show error message
      }
    });
  }

  async login(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loginData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    try {
      this.authService.login(loginData.email, loginData.password).then(response => {
        if (response) {
          if (response.jwt === "Contraseña incorrecta") {
            Swal.fire({
              icon: 'error',
              title: 'Contraseña incorrecta',
              text: 'Por favor, verifique su contraseña e intente de nuevo'
            });
            return;
          } else if (response.jwt === "Usuario no encontrado") {
            Swal.fire({
              icon: 'error',
              title: 'Usuario no encontrado',
              text: 'Por favor, verifique su correo electrónico e intente de nuevo'
            });
            return;
          } else {
            localStorage.setItem('token', response.jwt);
            this.authService.getUser().then(user => {
              localStorage.setItem('user', JSON.stringify(user));
              this.router.navigate(['/home']);
            });
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al iniciar sesión, por favor intente de nuevo, revise que la vpn esté activa'
          });
        }
      }).catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: 'No se pudo establecer conexión con el servidor, por favor verifique su conexión a internet e intente de nuevo'
        });
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error inesperado',
        text: 'Ocurrió un error inesperado, por favor intente de nuevo más tarde'
      });
    }

  }


  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }
}
