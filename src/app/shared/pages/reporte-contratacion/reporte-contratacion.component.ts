import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidatorFn } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { NavbarLateralComponent } from '../../components/navbar-lateral/navbar-lateral.component';
import { NavbarSuperiorComponent } from '../../components/navbar-superior/navbar-superior.component';
import { ContratacionService } from '../../services/contratacion/contratacion.service';
import moment from 'moment';

@Component({
  selector: 'app-reporte-contratacion',
  standalone: true,
  imports: [
    NavbarLateralComponent,
    NavbarSuperiorComponent,
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './reporte-contratacion.component.html',
  styleUrls: ['./reporte-contratacion.component.css']
})
export class ReporteContratacionComponent {
  reporteForm!: FormGroup;
  sedes: string[] = [
    'Facatativa', 'Facatativa Centro', 'Facatativa PQ', 'Cartagenita', 'Rosal',
    'Madrid', 'Funza', 'Fontibon', 'Soacha', 'Suba', 'Suba Gaitana', 'Tocancipa', 'Bosa'
  ];

  cedulasEscaneadasFileName: string = '';
  cruceDiarioFileName: string = '';
  induccionSSOFileName: string = '';
  trasladosFileName: string = '';

  filesToUpload: { [key: string]: File[] } = {};
  processingErrors: string[] = [];

  constructor(
    private fb: FormBuilder,
    private jefeAreaService: ContratacionService
  ) {}

  ngOnInit() {
    this.reporteForm = this.fb.group({
      sede: [null, Validators.required],
      contratosHoy: [null, Validators.required],
      cedulasEscaneadas: [false],
      cruceDiario: [false],
      induccionSSO: [false],
      traslados: [false],
      cantidadContratosTuAlianza: [null],
      cantidadContratosApoyoLaboral: [null],
      notas: ['']
    });
  }

  onContratosHoyChange(event: any) {
    if (event.value === 'si') {
      // Mostrar los campos adicionales
    } else {
      // Reiniciar los campos adicionales
      this.reporteForm.patchValue({
        cedulasEscaneadas: false,
        cruceDiario: false,
        induccionSSO: false,
        traslados: false,
        cantidadContratosTuAlianza: null,
        cantidadContratosApoyoLaboral: null,
        notas: ''
      });
      this.filesToUpload = {};
      this.cedulasEscaneadasFileName = '';
      this.cruceDiarioFileName = '';
      this.induccionSSOFileName = '';
      this.trasladosFileName = '';
    }
  }

  onCheckboxChange(event: any, controlName: string) {
    this.reporteForm.get(controlName)?.setValue(event.checked);
    if (!event.checked) {
      this.filesToUpload[controlName] = [];
      this.updateFileName([], controlName);
    }
  }

  onFilesSelected(event: any, controlName: string) {
    const files = Array.from(event.target.files) as File[];
    if (files.length > 0) {
      this.filesToUpload[controlName] = files;
      this.updateFileName(files, controlName);
    }
  }

  onFileSelected(event: any, controlName: string) {
    const file = event.target.files[0];
    if (file) {
      this.updateFileName([file], controlName);
      this.filesToUpload[controlName] = [file];
    }
  }

  updateFileName(files: File[], controlName: string) {
    const fileNames = files.map(file => file.name).join(', ');
    switch (controlName) {
      case 'cedulasEscaneadas':
        this.cedulasEscaneadasFileName = fileNames;
        break;
      case 'cruceDiario':
        this.cruceDiarioFileName = fileNames;
        break;
      case 'induccionSSO':
        this.induccionSSOFileName = fileNames;
        break;
      case 'traslados':
        this.trasladosFileName = fileNames;
        break;
    }
  }

  async processExcel(file: File) {
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      const bstr: string = e.target.result;
      const workbook = XLSX.read(bstr, { type: 'binary' });
      await this.processContratacion(workbook);
    };
    reader.readAsBinaryString(file);
  }

  async processContratacion(workbook: XLSX.WorkBook): Promise<void> {
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      range: 1,
      raw: true, // Leer los valores originales
      defval: ''
    });
  
    const rows: string[][] = (data as any[][]).map((row: any[]) =>
      row.map((cell, index) => {
        if ((index === 0 || index === 8 || index === 16 || index === 24 || index === 134) && this.isExcelDate(cell)) {
          return this.excelSerialToJSDate2(cell);
        }
        return cell.toString();
      })
    );
  
    let response: any;
  
    try {
      response = await this.jefeAreaService.subirContratacion(rows);
      if (response.message !== 'success') {
        throw new Error('Error en la carga de contratación');
      } else {
        this.generateErrorExcel(response.errores);
        // cerrar aviso de carga despues de 2 segundos
        setTimeout(() => {
          Swal.close();
        }, 1000);
      }
    } catch (error) {
      this.processingErrors.push('Cruce diario Excel');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al procesar el Cruce diario Excel, inténtelo de nuevo.'
      });
  
      if (response && response.errores && response.errores.length > 0) {
        this.generateErrorExcel(response.errores);
      }
    }
  }
  
  generateErrorExcel(errores: any[]): void {
    const worksheetData = [
      ['Registro', 'Campo', 'Error']
    ];
  
    errores.forEach((error: any) => {
      worksheetData.push([error.registro, error.campo, error.error]);
    });
  
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook: XLSX.WorkBook = { Sheets: { 'Errores': worksheet }, SheetNames: ['Errores'] };
  
    // Generar el archivo Excel
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
    // Guardar el archivo
    this.saveAsExcelFile(excelBuffer, 'Errores_Contratacion');
  }
  
  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url: string = window.URL.createObjectURL(data);
  
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.xlsx`;
    link.click();
  
    window.URL.revokeObjectURL(url);
  }

  isValidDate(dateString: string): boolean {
    return moment(dateString, 'DD/MM/YYYY', true).isValid();
  }

  isExcelDate(serial: number): boolean {
    return serial > 25569 && serial < 2958465;
  }

  excelSerialToJSDate2(serial: number): string {
    const utcDays = Math.floor(serial - 25569);
    const date = new Date(utcDays * 86400 * 1000);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  }

  convertToBase64(file: File, controlName: string) {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      console.log(`${controlName} in Base64:`, base64);
      this.reporteForm.get(controlName)?.setValue(base64);
    };
    reader.readAsDataURL(file);
  }

  async processFile(file: File, controlName: string) {
    try {
      Swal.fire({
        title: `Procesando ${controlName}`,
        html: 'Por favor espera...',
        allowOutsideClick: false,
        willClose: () => {
          Swal.hideLoading();
        },
        didOpen: () => {
          Swal.showLoading();
        }
      });

      if (controlName === 'cruceDiario') {
        await this.processExcel(file);
      } else {
        this.convertToBase64(file, controlName);
      }

      Swal.close();
    } catch (error) {
      this.processingErrors.push(controlName);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Ocurrió un error al procesar ${controlName}, inténtelo de nuevo.`
      });
    }
  }

  async onSubmit() {
    if (this.reporteForm.valid) {
      this.processingErrors = [];
      for (const key of Object.keys(this.filesToUpload)) {
        if (this.reporteForm.get(key)?.value) {
          const files = this.filesToUpload[key];
          for (const file of files) {
            await this.processFile(file, key);
          }
        }
      }
      if (this.processingErrors.length > 0) {
        Swal.fire({
          icon: 'error',
          title: 'Errores durante la carga',
          html: `Ocurrieron errores al procesar los siguientes elementos: <ul>${this.processingErrors.map(err => `<li>${err}</li>`).join('')}</ul>`
        });
      } else {
        Swal.fire('Success', 'Form submitted successfully!', 'success');
      }
    } else {
      Swal.fire('Error', 'Please fill in all required fields.', 'error');
    }
  }
}
