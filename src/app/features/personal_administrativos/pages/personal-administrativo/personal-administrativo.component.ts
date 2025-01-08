import { Component, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NavbarLateralComponent } from '../../../../shared/components/navbar-lateral/navbar-lateral.component';
import { NavbarSuperiorComponent } from '../../../../shared/components/navbar-superior/navbar-superior.component';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ContratacionService } from '../../../../shared/services/contratacion/contratacion.service';
import Swal from 'sweetalert2';
import { PersonalAdministrativosService } from '../../service/personal_administrativos/personal-administrativos.service';

@Component({
  selector: 'app-personal-administrativo',
  standalone: true,
  imports: [
    MatIconModule,
    MatCardModule,
    NavbarLateralComponent,
    NavbarSuperiorComponent,
    MatButtonModule,
    MatFormFieldModule,
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    NgIf
  ],
  templateUrl: './personal-administrativo.component.html',
  styleUrl: './personal-administrativo.component.css'
})
export class PersonalAdministrativoComponent {
  isSidebarHidden = false;
  firmaBase64: string = '';
  nombreCompleto: string = '';
  cedulaEncontrada: boolean = false;
  form = new FormGroup({
    codigo_contrato: new FormControl('')
  });
  private firmaCanvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild('firmaCanvas') set firmaCanvasElement(canvas: ElementRef<HTMLCanvasElement> | undefined) {
    if (canvas) {
      this.firmaCanvas = canvas;
      this.inicializarFirmaCanvas();
    }
  }

  constructor(
    private contratacionService: ContratacionService,
    private personalAdministrativosService: PersonalAdministrativosService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
  }

  imprimirDocumento() {
    const codigo_contrato = this.form.get('codigo_contrato')?.value;

    if (!codigo_contrato) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Debe ingresar un número de documento válido.',
      });
      return;
    }

    this.contratacionService.checkContract(codigo_contrato).subscribe({
      next: (response) => {
        if (response.exists === true) {
          this.nombreCompleto = `${response.nombre_completo}`;
          this.cedulaEncontrada = true;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se encontraron datos con el codigo de contrato ingresado.',
          });
        }
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al buscar los datos. Por favor, intente nuevamente.',
        });
      },
    });
  }

  limpiarFirma() {
    if (isPlatformBrowser(this.platformId) && this.firmaCanvas) {
      const canvas = this.firmaCanvas.nativeElement;
      const context = canvas.getContext('2d');
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        this.firmaBase64 = '';
      }
    }
  }

  guardarFirma() {
    if (isPlatformBrowser(this.platformId) && this.firmaCanvas) {
      const canvas = this.firmaCanvas.nativeElement;
      this.firmaBase64 = canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, '');
      this.personalAdministrativosService.guardar_firma(this.form.get('codigo_contrato')?.value, this.firmaBase64).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Firma Guardada',
            text: 'La firma ha sido guardada exitosamente.',
            confirmButtonText: 'Aceptar',
          }).then(() => {
            this.limpiarFirma();
            this.form.reset();
            this.nombreCompleto = '';
            this.cedulaEncontrada = false;
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al guardar la firma. Por favor, intente nuevamente.',
          });
        },
      });
    }
  }

  private inicializarFirmaCanvas() {
    if (isPlatformBrowser(this.platformId) && this.firmaCanvas) {
      const canvas = this.firmaCanvas.nativeElement;
      const context = canvas.getContext('2d');
      if (context) {
        // Ajustar tamaño del canvas dinámicamente
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // Configurar el estilo de dibujo
        context.lineWidth = 2;
        context.strokeStyle = '#000';
        context.lineCap = 'round';

        let isDrawing = false;

        // Funciones reutilizables para manejar el inicio, movimiento y fin del dibujo
        const startDrawing = (x: number, y: number) => {
          isDrawing = true;
          context.beginPath();
          context.moveTo(x, y);
        };

        const draw = (x: number, y: number) => {
          if (isDrawing) {
            context.lineTo(x, y);
            context.stroke();
          }
        };

        const stopDrawing = () => {
          isDrawing = false;
          context.closePath();
        };

        // Eventos de ratón
        canvas.addEventListener('mousedown', (event) => {
          startDrawing(event.offsetX, event.offsetY);
        });

        canvas.addEventListener('mousemove', (event) => {
          draw(event.offsetX, event.offsetY);
        });

        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseleave', stopDrawing);

        // Eventos táctiles
        canvas.addEventListener('touchstart', (event) => {
          const touch = event.touches[0];
          const rect = canvas.getBoundingClientRect();
          startDrawing(touch.clientX - rect.left, touch.clientY - rect.top);
          event.preventDefault(); // Evitar desplazamiento
        });

        canvas.addEventListener('touchmove', (event) => {
          const touch = event.touches[0];
          const rect = canvas.getBoundingClientRect();
          draw(touch.clientX - rect.left, touch.clientY - rect.top);
          event.preventDefault(); // Evitar desplazamiento
        });

        canvas.addEventListener('touchend', stopDrawing);
        canvas.addEventListener('touchcancel', stopDrawing);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo inicializar el canvas para la firma. Por favor, intente nuevamente.',
        });
      }
    }
  }



}


