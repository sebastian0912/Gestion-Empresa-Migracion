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
    'codigo_ultimo_contrato',
    'fecha_ultimo_ingreso',
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

  isSidebarHidden = false;

  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
  }

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

  triggerFileInput2(): void {
    const fileInput = document.getElementById('fileInput2') as HTMLInputElement;
    fileInput.click();
  }



  removeSpecialCharacters = (text: string): string => {
    // Expresión regular ampliada para eliminar cualquier emoji, pictogramas y símbolos especiales
    const emojiPattern = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{1F7E0}-\u{1F7EF}]/gu;

    return text.replace(emojiPattern, '');
  };


  // Función para subir archivo de contratación
  cargarExcel(event: any): void {
    this.toggleLoader(true);
    this.toggleOverlay(true);
    console.log(event.target.files[0]);
    console.log("Entro");

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array', cellDates: true, cellNF: false, cellText: false });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, dateNF: "dd/mm/yyyy" });
      json.shift(); // Eliminar la fila de encabezados si es necesario

      const formatDate = (date: string): string => {
        const regex_ddmmyyyy = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
        const regex_mmddyy = /^\d{1,2}\/\d{1,2}\/\d{2}$/;

        if (regex_ddmmyyyy.test(date)) {
          return date;
        } else if (regex_mmddyy.test(date)) {
          const [month, day, year] = date.split('/');
          const fullYear = (parseInt(year, 10) < 50) ? `20${year}` : `19${year}`;
          return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${fullYear}`;
        }
        return date;
      };

      const indicesFechas = [0, 8, 16, 24, 44, 134];

      const rows: string[][] = (json as any[][]).map((row: any[]) => {
        const completeRow = new Array(195).fill('-'); // Inicializar la fila con un array vacío de 195 elementos

        row.forEach((cell, index) => {
          if (index < 195) {
            if (cell == null || cell === '' || cell === '#N/A' || cell === 'N/A' || cell === '#REF!' || cell === '#¡REF!') {
              completeRow[index] = '-';
            } else if (index === 11 || index === 1) {
              completeRow[index] = this.removeSpecialCharacters(
                cell.toString()
                  .replace(/,/g, '')      // Elimina comas
                  .replace(/\./g, '')     // Elimina puntos
                  .replace(/\s/g, '')     // Elimina espacios
                  .replace(/[^0-9xX]/g, '')  // Elimina todo excepto números y 'x' o 'X'
              );
            }
            else if (index === 3) {
              completeRow[index] = this.removeSpecialCharacters(
                cell.toString()
                  .replace(/,/g, '')      // Elimina comas
                  .replace(/\./g, '')     // Elimina puntos
                  .replace(/\s/g, '')     // Elimina espacios
              );
            }

            else if (indicesFechas.includes(index)) {
              completeRow[index] = formatDate(this.removeSpecialCharacters(cell.toString()));
            } else {
              completeRow[index] = this.removeSpecialCharacters(cell.toString());
            }
          }
        });

        return completeRow;
      });

      this.contratacionService.subirContratacion(rows).then((response: any) => {
        if (response.message === 'success') {
          const total = response.actualizados + response.creados;

          this.playSound(true);
          this.toggleLoader(false);
          this.toggleOverlay(false);

          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: `Los datos se han procesado correctamente.
                   Actualizados: ${response.actualizados}
                   Creados: ${response.creados}
                   Total procesados: ${total}.`
          });

          if (response.errores !== undefined || response.errores != null) {
            this.generateErrorExcel(response.errores);
          }
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


  //

  eliminarCaracteresEspeciales(event: any): void {
    // Muestra tu loader o cualquier overlay que uses
    this.toggleLoader(true);
    this.toggleOverlay(true);

    console.log(event.target.files[0]);
    console.log('Entro');

    const file = event.target.files[0];
    const reader = new FileReader();

    // Función que:
    //  1) Separa diacríticos (normalize('NFD'))
    //  2) Elimina esas marcas de acentuación (regex /[\u0300-\u036f]/g)
    //  3) Opcionalmente, elimina otros caracteres que NO sean letras, números, puntuación o espacios
    const limpiarTexto = (input: string): string => {
      // 1. Separamos los acentos de la letra base
      let output = input.normalize('NFD');
      // 2. Eliminamos diacríticos (acentos, ~ de la ñ, etc.)
      output = output.replace(/[\u0300-\u036f]/g, '');
      // 3. (Opcional) Eliminar caracteres extraños que no sean letras, dígitos, puntuación ni espacios:
      //    output = output.replace(/[^\p{L}\p{N}\p{P}\p{Z}]/gu, '');
      //    ^ Descomentar si quieres también quitar símbolos raros/emoji.

      // De esta forma, 'Ñ' -> 'N', 'ñ' -> 'n', 'Á' -> 'A', 'á' -> 'a', etc.
      return output;
    };

    reader.onload = (e: any) => {
      // 1) Leemos el archivo Excel como binario
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, {
        type: 'array',
        cellDates: true,
        cellNF: false,
        cellText: false
      });

      // Tomamos la primera hoja (puedes cambiar si lo deseas)
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // 2) Convertimos la hoja a un array de arrays (AOA) e indicamos a TS que es any[][]
      const jsonAOA = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        raw: false,
        dateNF: 'dd/mm/yyyy'
      }) as any[][];

      // (Opcional) Si quieres quitar la primera fila porque es encabezado:
      // jsonAOA.shift();

      // 3) (Opcional) Función para formatear fechas, si lo deseas:
      const formatDate = (date: string): string => {
        const regex_ddmmyyyy = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
        const regex_mmddyy = /^\d{1,2}\/\d{1,2}\/\d{2}$/;

        if (regex_ddmmyyyy.test(date)) {
          return date;
        } else if (regex_mmddyy.test(date)) {
          const [month, day, year] = date.split('/');
          const fullYear = parseInt(year, 10) < 50 ? `20${year}` : `19${year}`;
          return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${fullYear}`;
        }
        return date;
      };

      // 4) Eliminamos acentos y transformamos Ñ/ñ -> N/n en cada celda
      const cleanedAOA = jsonAOA.map((row: any[]) => {
        return row.map((cell: any) => {
          if (typeof cell === 'string') {
            // Primero quitamos acentos, ñ, etc.
            let sinEspeciales = limpiarTexto(cell);

            // Si la celda es una fecha y quieres formatearla, podrías hacer:
            // sinEspeciales = formatDate(sinEspeciales);

            return sinEspeciales;
          }
          // Si no es string, lo dejas tal cual
          return cell;
        });
      });

      // 5) (Opcional) Reinsertar cabeceras si las removiste:
      // cleanedAOA.unshift(['Col1', 'Col2', 'Col3', ...]);

      // 6) Creamos un nuevo sheet con la data limpia
      const newSheet = XLSX.utils.aoa_to_sheet(cleanedAOA);

      // 7) Creamos un nuevo workbook y le agregamos la hoja limpia
      const newWorkbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(newWorkbook, newSheet, sheetName);

      // 8) Generamos el binario en formato XLSX
      const excelBuffer = XLSX.write(newWorkbook, {
        bookType: 'xlsx',
        type: 'array'
      });

      // 9) Creamos un Blob y forzamos la descarga
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // Nombre del archivo resultado
      link.download = 'ArchivoSinEspeciales.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('Archivo procesado y descargado');
      console.log('jsonAOA Original:', jsonAOA);
      console.log('cleanedAOA:', cleanedAOA);

      // Quita el loader/overlay
      this.toggleLoader(false);
      this.toggleOverlay(false);
    };

    // Leemos el archivo como array buffer
    reader.readAsArrayBuffer(file);

    // Limpia el input type=file, si así lo deseas
    this.resetFileInput();
  }



}
