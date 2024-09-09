import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-ver-pdfs',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    NgClass
  ],
  templateUrl: './ver-pdfs.component.html',
  styleUrls: ['./ver-pdfs.component.css']
})

export class VerPdfsComponent {
  selectedPdf: SafeResourceUrl | null = null;
  selectedCedula: any = null;  // Track selected cédula

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<VerPdfsComponent>,
    private sanitizer: DomSanitizer
  ) { }

  showPdf(base64: string, cedula: any) {
    // Sanitize the base64 string and display it in the iframe
    this.selectedPdf = this.sanitizer.bypassSecurityTrustResourceUrl(base64);
    this.selectedCedula = cedula;  // Set the clicked cédula as selected
  }

  onClose(): void {
    this.dialogRef.close();
  }
}

