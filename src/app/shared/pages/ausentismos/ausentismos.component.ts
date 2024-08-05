import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NavbarLateralComponent } from '../../components/navbar-lateral/navbar-lateral.component';
import { NavbarSuperiorComponent } from '../../components/navbar-superior/navbar-superior.component';
import { InfoCardComponent } from '../../components/info-card/info-card.component';
import { PagosService } from '../../services/pagos/pagos.service';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { NgIf } from '@angular/common';
import { ContratacionService } from '../../services/contratacion/contratacion.service';

@Component({
  selector: 'app-ausentismos',
  standalone: true,
  imports: [
    NavbarLateralComponent,
    NavbarSuperiorComponent,
    InfoCardComponent,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatCardModule,
    NgIf
  ],
  templateUrl: './ausentismos.component.html',
  styleUrls: ['./ausentismos.component.css']
})
export class AusentismosComponent implements OnInit {
  cedula: string = '';
  displayedColumns: string[] = [
    'numerodeceduladepersona',
    'nombre_completo',
    'primercorreoelectronico',
    'celular',
    'telefono_conyugue',
    'telefono_familiar_emergencia',
    'telefono_madre',
    'telefono_padre',
    'telefono_referencia_familiar1',
    'telefono_referencia_familiar2',
    'telefono_referencia_personal1',
    'telefono_referencia_personal2',
    'acciones'
  ];
  dataSource = new MatTableDataSource<any>();
  originalData: any[] = [];
  correo: string | null = null;

  overlayVisible = false;
  loaderVisible = false;
  counterVisible = false;

  constructor(
    private pagosService: PagosService,
    private contratacionService: ContratacionService
  ) { }

  async ngOnInit(): Promise<void> {
    const user = await this.pagosService.getUser();
    if (user) {
      this.correo = user.correo_electronico;
    } 
  }

  // Funciones para mostrar y ocultar el loader
  playSound(success: boolean): void {
    const audio = new Audio(success ? 'Sounds/positivo.mp3' : 'Sounds/negativo.mp3');
    audio.play();
  }

  toggleOverlay(visible: boolean): void {
    this.overlayVisible = visible;
  }

  toggleLoader(visible: boolean, showCounter: boolean = false): void {
    this.loaderVisible = visible;
    this.counterVisible = showCounter;
  }

  public buscarFormasPago(cedula: string): void {
    // Eliminar espacios en blanco, comas, puntos y guiones
    const cleanedCedula = cedula.replace(/[^\d]/g, '');

    this.contratacionService.buscarEncontratacion(cleanedCedula).subscribe(
      (response: any) => {
        if (response.message == 'success') {
          // Procesar datos de forma inmutable y optimizada
          const data = response.data.map((item: any) => ({
            ...item,
            nombre_completo: `${item.primer_nombre} ${item.segundo_nombre} ${item.primer_apellido} ${item.segundo_apellido}`,
            editing: false
          }));
          this.originalData = JSON.parse(JSON.stringify(data)); // Hacer una copia profunda de los datos originales
          this.dataSource.data = data;
        }
      },
      (error: any) => {
        if (error.error.message.startsWith('No se encontraron datos ')) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se encontraron datos para la cédula ingresada'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ha ocurrido un error al buscar la información'
          });
        }
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleEdit(element: any): void {
    element.editing = !element.editing;

    if (!element.editing) {
      // Guardar cambios
      const editedData = {
        numerodeceduladepersona: element.numerodeceduladepersona,
        celular: element.celular,
        primercorreoelectronico: element.primercorreoelectronico
      };
      this.contratacionService.editarContratacion_Cedula_Correo(element.numerodeceduladepersona, element.primercorreoelectronico, element.celular).then((response: any) => {
        if (response.message === 'success') {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'La información ha sido actualizada correctamente'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ha ocurrido un error al actualizar la información'
          });
        }
      }).catch((error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ha ocurrido un error al actualizar la información'
        });
      });
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }


  // Función para subir archivo de contratación
  cargarExcel(event: any): void {
    this.toggleLoader(true);
    this.toggleOverlay(true);

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array', cellDates: true, cellNF: false, cellText: false });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, dateNF: "dd/mm/yyyy" });
      // Omite la primera fila (encabezados)
      json.shift();

      // Convertir todos los valores a cadena de texto y manejar las fechas
      const rows: string[][] = (json as any[][]).map((row: any[]) => {
        // Asegurarse de que todas las filas tengan exactamente 195 columnas
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

      this.contratacionService.subirContratacion(rows).then((response: any) => {
        if (response.message === 'success') {
          this.playSound(true);
          this.toggleLoader(false);
          this.toggleOverlay(false);
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Los datos se han procesado correctamente.'
          });
          this.generateErrorExcel(response.errores);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al procesar los datos, inténtelo de nuevo.'
          });
          this.playSound(false);
          this.toggleLoader(false);
          this.toggleOverlay(false);
        }
      }).catch((error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Ocurrió un error al procesar los datos: ${error.message}`
        });
        this.playSound(false);
        this.toggleLoader(false);
        this.toggleOverlay(false);
      });
    };

    reader.readAsArrayBuffer(file);
    this.resetFileInput();
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

  isExcelDate(serial: number): boolean {
    // Verifica si el número está dentro del rango de fechas de Excel
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

  resetFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

}
