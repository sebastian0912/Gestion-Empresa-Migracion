import { Component, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-signature-pad',
  templateUrl: './signature-pad.component.html',
  styleUrls: ['./signature-pad.component.css']
})
export class SignaturePadComponent implements AfterViewInit {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @Output() signatureSaved = new EventEmitter<string>();
  signaturePad!: SignaturePad;

  ngAfterViewInit() {
    const canvasEl = this.canvas.nativeElement;
    this.signaturePad = new SignaturePad(canvasEl);

    // Ajustar el tamaño del lienzo según la ventana
    this.resizeCanvas();
  }

  resizeCanvas() {
    const canvasEl = this.canvas.nativeElement;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvasEl.width = canvasEl.offsetWidth * ratio;
    canvasEl.height = canvasEl.offsetHeight * ratio;
    canvasEl.getContext('2d')?.scale(ratio, ratio);
  }

  clearSignature() {
    this.signaturePad.clear();
  }

  saveSignature() {
    if (this.signaturePad.isEmpty()) {
      alert('Por favor, realice la firma.');
    } else {
      const dataURL = this.signaturePad.toDataURL();
      this.signatureSaved.emit(dataURL);  // Emitir la firma al componente padre
    }
  }

}
