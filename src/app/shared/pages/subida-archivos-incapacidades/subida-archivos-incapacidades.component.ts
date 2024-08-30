import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NavbarLateralComponent } from '../../components/navbar-lateral/navbar-lateral.component';
import { NavbarSuperiorComponent } from '../../components/navbar-superior/navbar-superior.component';
import { InfoCardComponent } from '../../components/info-card/info-card.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { IncapacidadService } from '../../services/incapacidad/incapacidad.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
type ArchivoKeys = 'arl' | 'ss' | 'reporte_incapacidades' | 'movimientos_bancos' | 'factura_elite';
interface Archivo {
  filename: ArchivoKeys; // La clave debe coincidir con una de las definidas en ArchivoKeys
  title: string;
}
@Component({
  selector: 'app-subida-archivos-incapacidades',
  standalone: true,
  imports: [
    NavbarLateralComponent,
    NavbarSuperiorComponent,
    InfoCardComponent,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatCardModule,
    NgIf,
    NgClass,
    NgFor],
  templateUrl: './subida-archivos-incapacidades.component.html',
  styleUrl: './subida-archivos-incapacidades.component.css'
})
export class SubidaArchivosIncapacidadesComponent {

  constructor(private incapacidadService: IncapacidadService, private router: Router) {
  }
  resultsincapacidades: any[] = [];
  resultsarl: any[] = [];
  resultssst: any[] = [];

  user: any
  correo: any
  filteredData: any[] = [];
  isSearchded = false;
  overlayVisible = false;
  loaderVisible = false;
  counterVisible = false;
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

  claves = ["NroDes", "Contrato", "Cedula", "Nombre", "CentrodeCosto", "Concepto", "FormadePago", "Valor", "Banco", "FECHADEPAGO"];

  asignarClaves(data: any[]): any[] {
    if (data.length === 0) return []; // Si el archivo está vacío, retorna un array vacío.

    const headers = data[0]; // La primera fila contiene los nombres de las columnas.
    const rows = data.slice(1); // Omitir la primera fila (encabezados) para procesar las filas de datos.

    // Mapear las filas usando los encabezados como claves
    return rows.map((row: any) => {
      let modifiedRow: any = {};
      headers.forEach((header: string, index: number) => {
        modifiedRow[header] = row[index] !== null ? row[index] : 'N/A'; // Asignar el valor correspondiente o 'N/A' si es null
      });
      return modifiedRow;
    });
  }

  cargarExcel(event: any): void {
    this.toggleLoader(true, true);
    this.toggleOverlay(true);

    const files = event.target.files;

    if (!files.length) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor seleccione al menos un archivo Excel'
      });
      this.toggleLoader(false);
      this.toggleOverlay(false);
      return;
    }

    const fileNames: { [key: string]: string } = {};
    const fileData: { [key: string]: any[] } = {};
    let filesProcessed = 0;

    // Función para procesar cada archivo de Excel
    const processExcelFile = (file: File) => {
      const reader = new FileReader();
      const key = this.identifyFileType(file.name); // Identificar tipo de archivo dinámicamente

      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true, cellNF: false, cellText: false });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convertir la hoja a JSON y usar la primera fila como claves
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, dateNF: "dd/mm/yyyy" });

        // Asignar claves usando los encabezados de la primera fila
        const modifiedRows = this.asignarClaves(rows);

        fileNames[key] = file.name;
        fileData[key] = modifiedRows;
        filesProcessed++;

        // Cuando todos los archivos hayan sido procesados
        if (filesProcessed === files.length) {
          this.incapacidadService.uploadFiles(fileData, fileNames).subscribe(
            (responses: any[]) => { // 'responses' es un array de todas las respuestas de las solicitudes
              // Verificar si todas las respuestas son exitosas
              const allSuccess = responses.every(response => response.status === 'success');

              if (allSuccess) {
                Swal.fire({
                  icon: 'success',
                  title: 'Éxito',
                  text: 'Todos los archivos han sido cargados correctamente'
                });
              } else {
                // Filtrar respuestas fallidas para mostrar mensajes específicos
                const failedResponses = responses.filter(response => response.status !== 'success');
                const messages = failedResponses.map(resp => resp.message).join('\n');

                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: `Ocurrieron errores en algunas solicitudes:\n${messages}`
                });
              }

              this.toggleLoader(false);
              this.toggleOverlay(false);
            },
            (error: any) => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ha ocurrido un error al cargar los archivos'
              });
              this.toggleLoader(false);
              this.toggleOverlay(false);
            }
          );
        }
      };

      reader.readAsArrayBuffer(file);
    };

    // Iterar sobre cada archivo seleccionado
    for (let i = 0; i < files.length; i++) {
      processExcelFile(files[i]);
    }
  }



  // Función para identificar el tipo de archivo según su nombre
  identifyFileType(fileName: string): string {
    if (fileName.toLowerCase().includes('arl')) return 'arl';
    if (fileName.toLowerCase().includes('ss')) return 'sst';
    if (fileName.toLowerCase().includes('reporte')) return 'reporte_incapacidades';
    if (fileName.toLowerCase().includes('movimientos')) return 'movimientos_bancos';
    if (fileName.toLowerCase().includes('factura')) return 'factura_elite';
    return 'unknown'; // Tipo desconocido si no coincide con ningún patrón
  }
  fileList: Archivo[] = [
    { title: 'Cargar ARL', filename: 'arl' },
    { title: 'Cargar SS', filename: 'ss' },
    { title: 'Cargar reporte incapacidades pagas', filename: 'reporte_incapacidades' },
    { title: 'Cargar movimientos bancos', filename: 'movimientos_bancos' },
    { title: 'Cargar factura elite', filename: 'factura_elite' }
  ];


  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  archivos: Record<ArchivoKeys, { nombre: string; headers: string[] }> = {
    arl: {
      nombre: 'arl.xlsx',
      headers: ["CONTRATO", "EMPRESA", "ID EMPRESA", "ID TRABAJADOR", "SEGUNDO APELLIDO", "NOMBRE", "SEXO", "EPS", "AFP",
        "FECHA NACIMIENTO", "CARGO", "CODIGO SUCURSAL", "NOMBRE SUCURSAL", "CODIGO CENTRO DE TRABAJO",
        "NOMBRE CENTRO TRABAJO", "PORCENTAJE COTIZACION", "CÓDIGO ACTIVIDAD ECONÓMICA",
        "DESCRIPCIÓN ACTIVIDAD ECONÓMICA", "CIUDAD", "FECHA INGRESO", "FECHA RETIRO PROGRAMADO",
        "ESTADO COBERTURA", "TIPO AFILIADO", "TASA DE RIESGO INDEPENDIENTE", "TELETRABAJO", "TRABAJO REMOTO",
        "TRABAJO EN CASA", "TIPO DE COTIZANTE"]
    },
    ss: {
      nombre: 'ss.xlsx',
      headers: ["Tipo Id", "No. Identificación", "Razón Social", "Clase Aportante", "Tipo Aportante", "Fecha de pago",
        "Periodo Pensión", "Periodo Salud", "Tipo Planilla", "Clave", "Tipo Id", "No. Identificación", "Nombre",
        "Ciudad", "Depto", "Salario", "Integral", "Tipo Cotizante", "Subtipo cotizante", "Horas Laboradas",
        "Es Extranjero", "Residente Ext.", "Fecha Residencia Ext.", "Código", "Centro de trabajo", "Nombre",
        "Código", "Dirección", "I N G", "Fecha ING", "R E T", "Fecha RET", "T A E", "T D E", "T A P", "T D P",
        "V S P", "Fecha VSP", "V S T", "S L N", "Inicio SLN", "Fin SLN", "I G E", "Inicio IGE", "Fin IGE",
        "L M A", "Inicio LMA", "Fin LMA", "V A C", "Inicio VAC", "Fin VAC", "A V P", "V C T", "Inicio VCT",
        "Fin VCT", "I R L", "Inicio IRL", "Fin IRL", "V I P", "C O R", "Administradora", "Nit", "Código", "Días",
        "IBC", "Tarifa", "Aporte", "Tarifa empleado", "Aporte empleado", "FSP", "FS", "Voluntaria Empleado",
        "Valor no retenido", "Total Empleado", "Tarifa Empleador", "Aporte empleador", "Voluntaria Empleador",
        "Total Empleador", "Total AFP", "AFP Destino", "Administradora", "Nit", "Código", "Días", "IBC", "Tarifa",
        "Aporte", "UPC", "Tarifa empleado", "Aporte empleado", "Tarifa Empleador", "Aporte empleador", "Total EPS",
        "EPS Destino", "Administradora", "Nit", "Código", "Días", "IBC", "Tarifa", "Aporte", "Administradora",
        "Nit", "Código", "Días", "IBC", "Tarifa", "Clase Riesgo", "Aporte", "Días", "IBC", "Tarifa", "Aporte",
        "Tarifa", "Aporte", "Tarifa", "Aporte", "Tarifa", "Aporte", "Exonerado SENA e ICBF", "Total Aportes"] // Reemplaza con los encabezados correspondientes
    },
    reporte_incapacidades: {
      nombre: 'reporte_incapacidades.xlsx',
      headers: ["temporal", "entidad", "TIPO_ID_AFILIADO", "IDENTIFICACION_AFILIADO", "NOMBRES_AFILIADO",
        "NRO_INCAPACIDAD", "FECHA_INICIO", "FECHA_FÍN", "DÍAS_OTORGADOS", "CONTINGENCIA", "DIAGNÓSTICO",
        "IBL", "DÍAS_PAGADOS", "VALOR_PAGADO", "FECHA_PAGO", "NRO_COMPROBANTE_PAGO", "GRUPO DE INCAPACIDADES"]
    },
    movimientos_bancos: {
      nombre: 'movimientos_bancos.xlsx',
      headers: [
        "FECHA",
        "TIPO DOC.",
        "NÚMERO DOC.",
        "CUENTA",
        "CONCEPTO",
        "NOMBRE DEL TERCERO",
        "NOMBRE C. DE COSTO",
        "CUENTA BANCARIA",
        "USUARIO",
        "NOMBRE CUENTA",
        "DEBITO",
        "GRUPO DE INCAPACIDADES"
      ] // Reemplaza con los encabezados correspondientes
    },
    factura_elite: {
      nombre: 'factura_elite.xlsx',
      headers: [
        "Grupo",
        "Cedula",
        "Nombres y Apellidos",
        "Fecha Ingreso",
        "Suma de Dias incapacidad enf gral menor a 2d",
        "Suma de Dias Incapacidad enf grl desde 3d",
        "Verificacion Existencia Incapacidad",
        "Arreglo de Incapacidades registradas",
        "Dias Empresa Usuaria",
        "Dias EPS",
        "Confirmacion Dias Empresa Usuaria",
        "Confirmacion Dias EPS",
        "tabla de indicadores"
      ] // Reemplaza con los encabezados correspondientes
    }
  };
  downloadFile(nombreArchivo: ArchivoKeys) {
    const archivo = this.archivos[nombreArchivo];

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Datos');

    // Agregar los encabezados al worksheet
    worksheet.addRow(archivo.headers);

    // Guardar el archivo Excel
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, archivo.nombre);
    });
  }

}
