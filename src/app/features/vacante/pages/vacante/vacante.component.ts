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
        console.error('Error en la solicitud:', err);
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
        console.log('Firma limpiada');
      }
    }
  }

  guardarFirma() {
    if (isPlatformBrowser(this.platformId) && this.firmaCanvas) {
      const canvas = this.firmaCanvas.nativeElement;
      this.firmaBase64 = canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, '');
      console.log('Firma guardada en Base64:', this.firmaBase64);
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
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        context.lineWidth = 2;
        context.strokeStyle = '#000';
        context.lineCap = 'round';

        let isDrawing = false;

        canvas.addEventListener('mousedown', (event) => {
          isDrawing = true;
          context.beginPath();
          context.moveTo(event.offsetX, event.offsetY);
        });

        canvas.addEventListener('mousemove', (event) => {
          if (isDrawing) {
            context.lineTo(event.offsetX, event.offsetY);
            context.stroke();
          }
        });

        canvas.addEventListener('mouseup', () => {
          isDrawing = false;
          context.closePath();
        });

        canvas.addEventListener('mouseleave', () => {
          isDrawing = false;
        });
      } else {
        console.error('El contexto 2D no está disponible en el lienzo.');
      }
    }
  }

  abrirCamara() {
    this.mostrarCamara = true;
    this.fotoBase64 = '';

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        const videoElement = this.video.nativeElement;
        videoElement.srcObject = stream;
        videoElement.play();
      })
      .catch((error) => {
        console.error('Error al abrir la cámara:', error);
        alert('No se pudo acceder a la cámara.');
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
    console.log('Foto guardada:', this.fotoBase64);
    alert('¡La foto ha sido guardada exitosamente!');
  }

}
