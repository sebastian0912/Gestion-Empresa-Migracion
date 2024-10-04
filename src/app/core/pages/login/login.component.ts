import { AuthService } from '../../service/auth/auth.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { NgClass, NgIf } from '@angular/common';

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
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  rightPanelActive: boolean = false;
  loginForm: FormGroup;
  registerForm: FormGroup;
  showPassword: boolean = false;
  showLoginPassword: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.registerForm = this.fb.group({
      numero_de_documento: ['', Validators.required],
      primer_nombre: ['', Validators.required],
      segundo_nombre: [''],
      primer_apellido: ['', Validators.required],
      segundo_apellido: [''],
      correo_electronico: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePanel(isSignUp: boolean): void {
    this.rightPanelActive = isSignUp;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleLoginPasswordVisibility(): void {
    this.showLoginPassword = !this.showLoginPassword;
  }

  async register(): Promise<void> {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
  
    const newUser = this.registerForm.value;
    // Crear campo username y colocarle el valor de correo_electronico
    newUser.username = newUser.correo_electronico;
  
    try {
      const response = await this.authService.register(newUser);
      console.log(response);
      if (response && response) {
        Swal.fire({
          icon: 'success',
          title: 'Registro Exitoso',
          text: 'Tu cuenta ha sido creada correctamente'
        });
        this.router.navigate(['/home']);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error en el Registro',
          text: response.message || 'No se pudo crear la cuenta, por favor intente de nuevo'
        });
      }
    } catch (error: any) {
      console.error(error.error);
  
      // Procesar los errores recibidos del servidor
      const processedErrors = this.processErrors(error.error);
  
      Swal.fire({
        icon: 'error',
        title: 'Error en el Registro',
        text: processedErrors || 'Hubo un problema al intentar crear la cuenta.'
      });
    }
  }
  
  /**
   * Función para procesar los errores y excluir el del username.
   * También traduce los mensajes de error al español.
   */
  processErrors(errors: any): string {
    const errorMessages = [];
  
    if (errors.correo_electronico) {
      errorMessages.push('Ya existe un usuario con este correo electrónico.');
    }
    
    if (errors.numero_de_documento) {
      errorMessages.push('Ya existe un usuario con este número de documento.');
    }
  
    // Ignorar el error del username
    // Puedes agregar más campos según tus necesidades
  
    // Unir todos los mensajes de error en una sola cadena
    return errorMessages.join('\n');
  }
  

  login(): void {
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
            }).catch(error => {
              Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo establecer conexión con el servidor, por favor verifique su conexión a internet e intente de nuevo'
              });
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
}