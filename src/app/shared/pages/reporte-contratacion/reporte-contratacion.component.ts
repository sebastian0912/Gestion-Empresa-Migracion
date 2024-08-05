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
import moment from 'moment';
import { ContratacionService } from '../../services/contratacion/contratacion.service';

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
export class ReporteContratacionComponent implements OnInit {
  reporteForm!: FormGroup;
  sedes: string[] = [
    'Facatativa', 'Facatativa PQ', 'Cartagenita', 'Rosal',
    'Madrid', 'Funza', 'Fontibon', 'Soacha', 'Suba', 'Tocancipa', 'Bosa'
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
  ) { }

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

  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

  async processCedulasEscaneadas(files: File[]) {
    for (const file of files) {
      const base64 = await this.convertToBase64(file);
      const cedula = file.name.split(' - ')[0];
      const data = {
        numero_cedula: cedula,
        cedula_escaneada_delante: base64
      };
      await this.jefeAreaService.cargarCedula(data);
      await this.delay(100); // Espera de medio segundo
    }
  }

  async processTraslados(files: File[]) {
    for (const file of files) {
      const [cedula, eps] = file.name.split(' - ');
      const base64 = await this.convertToBase64(file);
      const data = {
        numero_cedula: cedula,
        eps_a_trasladar: eps.replace('.pdf', ''),
        solicitud_traslado: base64
      };
      await this.jefeAreaService.enviarTraslado(data);
      await this.delay(100); // Espera de medio segundo
    }
  }

  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async onSubmit() {
    if (this.reporteForm.valid) {
      this.processingErrors = [];
      const processes = [
        { key: 'cedulasEscaneadas', name: 'Cédulas Escaneadas', process: this.processCedulasEscaneadas.bind(this) },
        { key: 'cruceDiario', name: 'Cruce diario Excel', process: this.processExcelFiles.bind(this) },
        { key: 'induccionSSO', name: 'Inducción Seguridad y Salud en el trabajo', process: this.processFileList.bind(this) },
        { key: 'traslados', name: 'Traslados', process: this.processTraslados.bind(this) }
      ];

      for (const { key, name, process } of processes) {
        if (this.reporteForm.get(key)?.value) {
          Swal.fire({
            icon: 'info',
            title: `Procesando ${name}`,
            html: 'Por favor espera...',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
          const files = this.filesToUpload[key];
          try {
            await process(files);
          } catch (error) {
            this.processingErrors.push(name);
          }
        }
        this.delay(1000); // Espera de medio segundo
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

  async processFileList(files: File[]) {
    for (const file of files) {
      await this.processFile(file);
    }
  }

  async processFile(file: File) {
    try {

      const base64 = await this.convertToBase64(file);

    } catch (error) {
      this.processingErrors.push('archivo');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Ocurrió un error al procesar el archivo, inténtelo de nuevo.`
      });
    }
  }

  async processExcelFiles(files: File[]) {
    for (const file of files) {
      await this.processExcel(file);
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
    let response: any;

    try {
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, dateNF: "dd/mm/yyyy" });
      json.shift();

      const rows: string[][] = (json as any[][]).map((row: any[]) => {
        const completeRow = new Array(195).fill('-');

        row.forEach((cell, index) => {
          if (index < 195) {
            if (cell == null || cell === '') {
              completeRow[index] = '-';
            } else if ((index === 0 || index === 8 || index === 16 || index === 24 || index === 134) && this.isExcelDate(cell)) {
              completeRow[index] = this.excelSerialToJSDate2(cell);
            } else if (index === 11 || index === 1) {
              completeRow[index] = cell.toString().replace(/,/g, '').replace(/\./g, '').replace(/\s/g, '');
            } else {
              completeRow[index] = cell.toString();
            }
          }
        });

        return completeRow;
      });

      response = await this.jefeAreaService.subirContratacion(rows);
      if (response.message !== 'success') {
        this.processingErrors.push('Cruce diario Excel');
        
      }
      this.generateErrorExcel(response.errores);
      

    } catch (error) {
      this.processingErrors.push('Cruce diario Excel');


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

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

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
}
