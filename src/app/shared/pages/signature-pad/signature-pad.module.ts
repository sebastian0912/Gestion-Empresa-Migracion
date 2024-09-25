import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignaturePadComponent } from './signature-pad.component'; // Asegúrate de importar el componente

@NgModule({
  declarations: [SignaturePadComponent], // Declara el componente aquí
  imports: [CommonModule], // Importa CommonModule o cualquier otro módulo que necesites
  exports: [SignaturePadComponent] // Exporta el componente para que pueda ser utilizado en otros módulos
})
export class SignaturePadModule { }
