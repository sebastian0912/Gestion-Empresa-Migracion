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
import { VacanteService } from '../../service/vacante/vacante.service';

@Component({
  selector: 'app-vacante',
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
  templateUrl: './vacante.component.html',
  styleUrl: './vacante.component.css'
})
export class VacanteComponent {
  isSidebarHidden = false;
  firmaBase64: string = '';
  nombreCompleto: string = '';
  cedulaEncontrada: boolean = false;
  accionSeleccionada: 'firma' | 'foto' | null = null;
  form = new FormGroup({
    numeroDocumento: new FormControl('')
  });
  private firmaCanvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild('firmaCanvas') set firmaCanvasElement(canvas: ElementRef<HTMLCanvasElement> | undefined) {
    if (canvas) {
      this.firmaCanvas = canvas;
      this.inicializarFirmaCanvas();
    }
  }
  @ViewChild('video', { static: false }) video!: ElementRef<HTMLVideoElement>;
  mostrarCamara: boolean = false;
  fotoBase64: string = '';

  constructor(
    private contratacionService: ContratacionService,
    private vacanteService: VacanteService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
  }

  imprimirDocumento() {
    const numeroDocumento = this.form.get('numeroDocumento')?.value;

    if (!numeroDocumento) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Debe ingresar un número de documento válido.',
      });
      return;
    }

    this.contratacionService.buscarEncontratacion(numeroDocumento).subscribe({
      next: (response) => {
        if (response?.data?.length > 0) {
          this.cedulaEncontrada = true;
          const datos = response.data[0];
          this.nombreCompleto = `${datos.primer_apellido} ${datos.segundo_apellido} ${datos.primer_nombre} ${datos.segundo_nombre}`;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se encontraron datos con el número de documento ingresado.',
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
      this.vacanteService.guardar_firma({ numerodeceduladepersona: this.form.get('numeroDocumento')?.value, firmaSolicitante: this.firmaBase64 }).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Firma Guardada',
            text: 'La firma ha sido guardada exitosamente.',
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

  // Método para seleccionar la acción
  seleccionarAccion(accion: 'firma' | 'foto') {
    this.accionSeleccionada = accion;
    this.mostrarCamara = false; // Resetear la cámara si estaba activa
    this.fotoBase64 = ''; // Limpiar cualquier foto previa si se cambia la acción
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


  abrirCamara() {
    if (!isPlatformBrowser(this.platformId)) {
      Swal.fire({
        icon: 'warning',
        title: 'No Disponible',
        text: 'Esta funcionalidad no está disponible en el servidor.',
      });
      return;
    }

    this.mostrarCamara = true;
    this.fotoBase64 = '';

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      Swal.fire({
        icon: 'error',
        title: 'Navegador no Compatible',
        text: 'Tu navegador no soporta la captura de video. Por favor, usa un navegador más reciente.',
      });
      return;
    }

    // Solicitar acceso a la cámara
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        const videoElement = this.video.nativeElement as HTMLVideoElement;

        // Asignar el stream al srcObject del elemento <video>
        videoElement.srcObject = stream;

        videoElement.play();
      })
      .catch((error) => {
        let errorMessage = 'No se pudo acceder a la cámara. Por favor, verifica los permisos.';
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Permiso denegado para usar la cámara. Habilítalo en la configuración de tu navegador.';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'No se detectó una cámara en el dispositivo. Conéctala e inténtalo nuevamente.';
        }

        Swal.fire({
          icon: 'error',
          title: 'Error de Cámara',
          text: errorMessage,
        });
      });

  }





  capturarFoto() {
    const videoElement = this.video.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      this.fotoBase64 = canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, '');

      const stream = videoElement.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      this.mostrarCamara = false;
    }
  }

  cerrarCamara() {
    const videoElement = this.video.nativeElement;
    const stream = videoElement.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    videoElement.srcObject = null;
    this.mostrarCamara = false;
  }

  guardarFoto() {
    this.vacanteService.guardar_foto({ numerodeceduladepersona: this.form.get('numeroDocumento')?.value, fotoSolicitante: this.fotoBase64 }).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Foto Guardada',
          text: 'La foto ha sido guardada exitosamente.',
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al guardar la foto. Por favor, intente nuevamente.',
        });
      },
    });

  }

}
