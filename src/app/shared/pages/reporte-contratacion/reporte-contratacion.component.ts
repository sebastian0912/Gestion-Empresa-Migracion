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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DataSource } from '@angular/cdk/collections';
import { MatTableModule } from '@angular/material/table';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
import { MatTableDataSource } from '@angular/material/table';

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
    MatIconModule,
    MatDatepickerModule,
    MatTableModule,
    
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
  arlFileName: string = '';

  filesToUpload: { [key: string]: File[] } = {};
  erroresValidacion = new MatTableDataSource<any>([]);

  isCruceValidado: boolean = false;  // Bandera para el estado de validación del cruce
  datoscruced: any[] = [];
  // Variables para almacenar archivos en base64 y sus nombres
  cedulasBase64: { file_name: string, file_base64: string }[] = [];
  trasladosBase64: { file_name: string, file_base64: string }[] = [];
  cruceBase64: string = '';
  sstBase64: string = '';
  arlBase64: string = '';

  processingErrors: string[] = [];

  constructor(
    private fb: FormBuilder,
    private jefeAreaService: ContratacionService
  ) { }

  ngOnInit() {
    this.reporteForm = this.fb.group({
      sede: [null, Validators.required],
      esDeHoy: [false, Validators.requiredTrue],
      fecha: [null],
      contratosHoy: [null, Validators.required],
      cedulasEscaneadas: [false],
      cruceDiario: [false],
      arl: [false],
      induccionSSO: [false],
      traslados: [false],
      cantidadContratosTuAlianza: [null],
      cantidadContratosApoyoLaboral: [null],
      notas: ['']
    });

    // Validar la fecha solo si "esDeHoy" es falso
    this.reporteForm.get('esDeHoy')?.valueChanges.subscribe(value => {
      if (value) {
        this.reporteForm.get('fecha')?.clearValidators();
        this.reporteForm.get('fecha')?.updateValueAndValidity();
      } else {
        this.reporteForm.get('fecha')?.setValidators([Validators.required]);
        this.reporteForm.get('fecha')?.updateValueAndValidity();
      }
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
        arl: false,
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
      this.arlFileName = '';
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
    const file = event.target.files[0]; // Asegúrate de que se seleccionó un archivo
    if (file) {
      this.updateFileName([file], controlName);  // Actualizar el nombre del archivo mostrado
      this.filesToUpload[controlName] = [file];  // Guardar el archivo seleccionado en filesToUpload
      // No procesamos el archivo ARL aquí, el procesamiento se hará en onSubmit
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
      case 'arl':
        this.arlFileName = fileNames;
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
      let cedula = '';

      // Intentar dividir por ' - ' primero, luego por '-' si falla
      if (file.name.includes(' - ')) {
        cedula = file.name.split(' - ')[0];
      } else if (file.name.includes('-')) {
        cedula = file.name.split('-')[0];
      } else {
        continue; // Salta este archivo si no cumple con el formato esperado
      }

      // Añadir a la lista de archivos en base64 con el nombre original
      this.cedulasBase64.push({ file_name: file.name, file_base64: base64 });

      const data = {
        numero_cedula: cedula.trim(), // Eliminar espacios adicionales
        cedula_escaneada_delante: base64
      };

      await this.jefeAreaService.cargarCedula(data);
      await this.delay(100); // Espera de 100 ms
    }
  }

  async processTraslados(files: File[]) {
    for (const file of files) {
      let cedula = '';
      let eps = '';

      // Intentar dividir por ' - ' primero, luego por '-' si falla
      if (file.name.includes(' - ')) {
        [cedula, eps] = file.name.split(' - ');
      } else if (file.name.includes('-')) {
        [cedula, eps] = file.name.split('-');
      } else {
        continue; // Salta este archivo si no cumple con el formato esperado
      }

      const base64 = await this.convertToBase64(file);

      // Añadir a la lista de traslados en base64 con el nombre original
      this.trasladosBase64.push({ file_name: file.name, file_base64: base64 });
      const data = {
        numero_cedula: cedula.trim(), // Eliminar espacios adicionales
        eps_a_trasladar: eps.replace('.pdf', '').trim(), // Eliminar '.pdf' y espacios adicionales
        solicitud_traslado: base64
      };

      await this.jefeAreaService.enviarTraslado(data);
      await this.delay(100); // Espera de 100 ms
    }
  }

  corregirFecha(fecha: string): string {
    const dateParts = fecha.split(/\/|-/);

    if (dateParts.length === 3) {
      let day = dateParts[0];
      let month = dateParts[1];
      let year = dateParts[2];

      // Convertir año corto a largo
      if (year.length === 2) {
        const currentYear = new Date().getFullYear();
        const century = Math.floor(currentYear / 100);
        year = (year >= "50" ? century - 1 : century) + year;
      }

      // Asegurar que el día y el mes sean de dos dígitos
      day = day.padStart(2, '0');
      month = month.padStart(2, '0');

      // Retornar fecha en formato dd/mm/yyyy
      return `${day}/${month}/${year}`;
    }

    return fecha; // Retornar la fecha sin cambios si no coincide con el patrón
  }

  async validarCruce() {
    const files = this.filesToUpload['cruceDiario'];
  
    if (!files || files.length === 0) {
      Swal.fire('Error', 'Debe cargar un archivo antes de validar', 'error');
      return;
    }
  
    Swal.fire({
      icon: 'info',
      title: 'Cargando...',
      text: 'Iniciando el proceso de validación',
      didOpen: () => {
        Swal.showLoading();
      }
    });
  
    const file = files[0];
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      const bstr: string = e.target.result;
      const workbook = XLSX.read(bstr, { type: 'binary' });
  
      try {
        Swal.update({ text: 'Leyendo el archivo Excel...' });
  
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, dateNF: "dd/mm/yyyy" });
        json.shift();
  
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
          const completeRow = new Array(195).fill('-');
  
          row.forEach((cell, index) => {
            if (index < 195) {
              if (cell == null || cell === '' || cell === '#N/A' || cell === 'N/A' || cell === '#REF!' || cell === '#¡REF!') {
                completeRow[index] = '-';
              } else if (index === 11 || index === 1) {
                completeRow[index] = cell.toString().replace(/,/g, '').replace(/\./g, '').replace(/\s/g, '');
              } else if (indicesFechas.includes(index)) {
                completeRow[index] = formatDate(cell.toString());
              } else {
                completeRow[index] = cell.toString();
              }
            }
          });
  
          return completeRow;
        });
  
        Swal.update({ text: 'Dividiendo los datos en lotes...' });
  
        const batchSize = 700;
        const totalBatches = Math.ceil(rows.length / batchSize);
        const allErrors: any[] = [];
  
        for (let i = 0; i < totalBatches; i++) {
          const batch = rows.slice(i * batchSize, (i + 1) * batchSize);
  
          Swal.update({ text: `Enviando el lote ${i + 1} de ${totalBatches} para validación...` });
  
          await this.jefeAreaService.subirContratacionValidar(batch).then(
            (response) => {
              if (response.status === 'error') {
                console.log(response.errores);
                allErrors.push(...response.errores);
              }
            }
          );
        }

        this.erroresValidacion.data = allErrors;
  
        if (allErrors.length > 0) {
          Swal.update({ text: 'Enviando todos los errores para guardar...' });
          await this.jefeAreaService.enviarErroresValidacion(allErrors).then(
            () => {
              Swal.update({ text: 'Errores guardados exitosamente.' });
            }
          );
        }
  
        Swal.fire('Completado', 'Proceso de validación finalizado correctamente.', 'success');
  
      } catch (error) {
        Swal.fire('Error', 'Error procesando el archivo. Verifique el formato e intente de nuevo.', 'error');
      }
    };
  
    reader.readAsBinaryString(file);
  }
  


  applyFilter(column: string, event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.erroresValidacion.filter = filterValue.trim().toLowerCase();
  }
  




  async processArl(workbook: XLSX.WorkBook): Promise<void> {
    this.arlBase64 = await this.convertToBase64(this.filesToUpload['arl'][0]);

    Swal.fire({
      title: 'Cargando...',
      icon: 'info',
      text: 'Procesando archivo de ARL. Por favor, espere unos segundos.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      // Utiliza XLSX para leer el contenido del archivo ARL
      const sheetArl = workbook.Sheets[workbook.SheetNames[0]];

      // Convertir la hoja ARL a formato JSON, comenzando desde la fila 3 (para omitir encabezados)
      const dataArl = XLSX.utils.sheet_to_json(sheetArl, {
        header: 1, // Leer como un array de arrays
        range: 2,  // Saltar las primeras dos filas
        raw: true, // Leer los valores sin convertir
        defval: '' // Reemplazar valores vacíos con una cadena vacía
      });

      // Convertir los campos que contienen fechas a formato legible
      const rowsArl = (dataArl as any[][]).map(row => {
        if (row[9] && typeof row[9] === 'number') {
          row[9] = this.excelSerialToJSDate(row[9]);
        }
        if (row[10] && typeof row[10] === 'number') {
          row[10] = this.excelSerialToJSDate(row[10]);
        }
        return row;
      });

      const headers = [
        "Fecha de firma de contrato",
        "N° CC",
        "TEM",
        "Código",
        "Empresa Usuaria y Centro de Costo",
        "Tipo de Documento de Identidad",
        "Ingreso,(ing) No Ingres , Sin Confirmar, Cambio de contrato",
        "Cargo (Operario de... y/oficios varios)",
        "Fecha de Ingreso",
        "Descripción de la Obra / Motivo Temporada/// Cambia cada mes",
        "Salario S.M.M.L.V.",
        "Número de Identificación Trabajador",
        "Primer Apellido Trabajador",
        "Segundo Apellido Trabajador",
        "Primer Nombre Trabajador",
        "Segundo Nombre Trabajador",
        "Fecha de Nacimiento (DD/MM/AAAA) Trabajador",
        "Sexo (F - M) Trabajador",
        "Estado civil (SO-UL - CA-SE-VI) Trabajador",
        "Dirección de residencia Trabajador",
        "Barrio Trabajador",
        "Teléfono móvil Trabajador",
        "Correo electrónico E-mail Trabajador",
        "Ciudad de Residencia Trabajador",
        "Fecha Expedición CC Trabajador",
        "Municipio Expedición CC Trabajador",
        "Departamento Expedición CC Trabajador",
        "Lugar de Nacimiento Municipio Trabajador",
        "Lugar de Nacimiento Departamento Trabajador",
        "Rh Trabajador",
        "Zurdo/ Diestro Trabajador",
        "EPS Trabajador",
        "AFP Trabajador",
        "AFC Trabajador",
        "Centro de costo Para el Carné Trabajador",
        "Persona que hace Contratación",
        "Edad Apropiada v",
        "Escolaridad (1-11) Trabajador",
        "Técnico Trabajador",
        "Tecnólogo Trabajador",
        "Universidad Trabajador",
        "Especialización Trabajador",
        "Otros Trabajador",
        "Nombre Institución Trabajador",
        "Año de Finalización Trabajador",
        "Título Obtenido Trabajador",
        "Chaqueta Trabajador",
        "Pantalón Trabajador",
        "Camisa Trabajador",
        "Calzado Trabajador",
        "Familiar en caso de Emergencia",
        "Parentesco Emergencia",
        "Dirección Emergencia",
        "Barrio Emergencia",
        "Teléfono Emergencia",
        "Ocupación Emergencia",
        "Nombre Pareja",
        "Vive Si/No Pareja",
        "Ocupación Pareja",
        "Dirección Pareja",
        "Teléfono Pareja",
        "Barrio Pareja",
        "No de Hijos Dependientes",
        "Nombre Hijo 1",
        "Sexo Hijo 1",
        "Fecha Nacimiento Hijo 1",
        "No de Documento de Identidad Hijo 1",
        "Estudia o Trabaja Hijo 1",
        "Curso Hijo 1",
        "Nombre Hijo 2",
        "Sexo Hijo 2",
        "Fecha Nacimiento Hijo 2",
        "No de Documento de Identidad Hijo 2",
        "Estudia o trabaja Hijo 2",
        "Curso Hijo 2",
        "Nombre Hijo 3",
        "Sexo Hijo 3",
        "Fecha Nacimiento Hijo 3",
        "No de Documento de Identidad Hijo 3",
        "Estudia o trabaja Hijo 3",
        "Curso Hijo 3",
        "Nombre Hijo 4",
        "Sexo Hijo 4",
        "Fecha Nacimiento Hijo 4",
        "No de Documento de Identidad Hijo 4",
        "Estudia o trabaja Hijo 4",
        "Curso Hijo 4",
        "Nombre Hijo 5",
        "Sexo Hijo 5",
        "Fecha Nacimiento Hijo 5",
        "No de Documento de Identidad Hijo 5",
        "Estudia o trabaja Hijo 5",
        "Curso Hijo 5",
        "Nombre Hijo 6",
        "Sexo Hijo 6",
        "Fecha Nacimiento Hijo 6",
        "No de Documento de Identidad Hijo 6",
        "Estudia o trabaja Hijo 6",
        "Curso Hijo 6",
        "Nombre Hijo 7",
        "Sexo Hijo 7",
        "Fecha Nacimiento Hijo 7",
        "No de Documento de Identidad Hijo 7",
        "Estudia o trabaja Hijo 7",
        "Curso Hijo 7",
        "Nombre Padre",
        "Vive Si/No Padre",
        "Ocupación Padre",
        "Dirección Padre",
        "Teléfono Padre",
        "Barrio/Municipio Padre",
        "Nombre Madre",
        "Vive Si/No Madre",
        "Ocupación Madre",
        "Dirección Madre",
        "Teléfono Madre",
        "Barrio/Municipio Madre",
        "Nombre Referencia Personal 1",
        "Teléfono Referencia Personal 1",
        "Ocupación Referencia Personal 1",
        "Nombre Referencia Personal 2",
        "Teléfono Referencia Personal 2",
        "Ocupación Referencia Personal 2",
        "Nombre Referencia Familiar 1",
        "Teléfono Referencia Familiar 1",
        "Ocupación Referencia Familiar 1",
        "Nombre Referencia Familiar 2",
        "Teléfono Referencia Familiar 2",
        "Ocupación Referencia Familiar 2",
        "Nombre Empresa Experiencia Laboral 1",
        "Dirección Empresa Experiencia Laboral 1",
        "Teléfonos Experiencia Laboral 1",
        "Nombre Jefe Inmediato Experiencia Laboral 1",
        "AREA DE EXPERIENCIA Experiencia Laboral 1",
        "Fecha de Retiro Experiencia Laboral 1",
        "Motivo Retiro Experiencia Laboral 1",
        "Nombre Empresa Experiencia Laboral 2",
        "Dirección Empresa Experiencia Laboral 2",
        "Teléfonos Experiencia Laboral 2",
        "Nombre Jefe Inmediato Experiencia Laboral 2",
        "Cargo del Trabajador Experiencia Laboral 2",
        "Fecha de Retiro Experiencia Laboral 2",
        "Motivo Retiro Experiencia Laboral 2",
        "Nombre del Carnet",
        "Desea Plan Funerario",
        "Número Cuenta/Celular",
        "Número Tarjeta/Tipo de Cuenta",
        "Clave para Asignar",
        "Examen Salud Ocupacional",
        "Apto para el Cargo? Sí o No",
        "EXAMEN DE SANGRE",
        "PLANILLA FUMIGACION",
        "Otros Examenes2 (Nombre)",
        "VACUNA COVID",
        "Nombre de la EPS afiliada",
        "EPS A TRASLADAR",
        "Nombre de AFP Afiliado 01",
        "AFP A TRASLADAR",
        "Afiliación Caja de compensación",
        "Nombre de AFP Afiliado 02",
        "Revisión de Fecha de Ingreso ARL",
        "Confirmación de los Ingresos Envío de correos a las Fincas a diario Confirmacion hasta las 12:30",
        "Fecha confirmación Ingreso a las Empresas Usuarias",
        "Afiliación enviada con fecha (Coomeva-Nueva Eps - Sura - S.O.S - Salud Vida -Compensar - Famisanar",
        "Revisión Personal Confirmado Empresas Usuarias VS Nómina los días 14 y los días 29 de cada Mes",
        "Referenciación Personal 1",
        "Referenciación Personal 2",
        "Referenciación Familiar 1",
        "Referenciación Familiar 2",
        "Referenciación Experiencia Laboral 1",
        "Referenciación Experiencia Laboral 2",
        "Revisión Registraduria (Fecha entrega CC)",
        "COMO SE ENTERO DEL EMPLEO",
        "Tiene Experiencia laboral ?",
        "Empresas de flores que ha trabajado (Separarlas con ,)",
        "¿En que area?",
        "Describa paso a paso como es su labora (ser lo mas breve posible)",
        "Califique su rendimiento",
        "¿Por que se da esta auto calificación?",
        "Hace cuanto vive en la zona",
        "Tipo de vivienda",
        "Con quien Vive",
        "Estudia Actualmente",
        "Personas a cargo",
        "Numero de hijosacargo",
        "Quien los cuida?",
        "Como es su relacion Familiar",
        "Segun su Experiencia y desempeño laboral por que motivos lo han felicitado",
        "Ha tenido algun malentendido o situacion conflictiva en algun trabajo, Si si en otro especificar por que:",
        "Esta dispuesto a realizar actividades diferentes al cargo :",
        "Mencione una experiencia significativa en su trabajo",
        "Que proyecto de vida tiene de aqui a 3 años",
        "La vivienda es:",
        "¿Cuál es su motivación?",
        "OBSERVACIONES"
      ];
      


      // Procesar los datos del cruce
      const datosMapeados = this.datoscruced.map((cruceRow: any[]) => {
        const cedulaCruce = cruceRow[1];  // Cédula en el índice 1 del cruce
        const comparativoCruce = cruceRow[8];  // Índice 8 del cruce diario

        // Buscar en ARL por cédula
        const filaArl = rowsArl.find(arlRow => arlRow[3] === cedulaCruce);

        let estadoCedula = 'ALERTA NO ESTA EN ARL';
        let estadoFechas = 'ALERTA NO COINCIDEN';
        let fechaIngresoArl = 'NO DISPONIBLE';
        let fechaIngresoCruce = comparativoCruce || 'NO DISPONIBLE';

        if (filaArl) {
          estadoCedula = 'SATISFACTORIO';  // Se encontró la cédula
          const comparativoArl = filaArl[9];  // Índice 9 en ARL

          // Verificar si las fechas son iguales
          estadoFechas = comparativoCruce === comparativoArl ? 'SATISFACTORIO' : 'ALERTA';
          fechaIngresoArl = comparativoArl || 'NO DISPONIBLE';
        }

        // Generar un objeto para cada fila con los encabezados del cruce diario y la comparación del ARL
        const resultado: { [key: string]: any } = {
          "Numero de Cedula": cedulaCruce,
          "Arl": estadoCedula,
          "ARL_FECHAS": estadoFechas,
          "fechaIngresoArl": fechaIngresoArl,
          "fechaIngresoCruce": fechaIngresoCruce
        };

        // Añadir los campos del cruce diario a los resultados
        headers.forEach((header, index) => {
          resultado[header] = cruceRow[index] || 'NO DISPONIBLE';  // Agregar valor del cruce diario o marcar como NO DISPONIBLE si no hay
        });

        return resultado;
      });

      // Crear el workbook con ExcelJS
      const workbookOut = new ExcelJS.Workbook();
      const worksheet = workbookOut.addWorksheet('Datos');

      // Configurar columnas con titulos
      worksheet.columns = Object.keys(datosMapeados[0]).map(titulo => ({ header: titulo, key: titulo, width: 20 }));

      // Añadir filas al worksheet y aplicar colores
      datosMapeados.forEach(dato => {
        const row = worksheet.addRow(dato);

        if (dato["Arl"] === 'SATISFACTORIO') {
          row.getCell('Arl').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '00FF00' } // Verde
          };
        } else if (dato["Arl"] === 'ALERTA NO ESTA EN ARL') {
          row.getCell('Arl').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF0000' } // Rojo
          };
        }

        if (dato["ARL_FECHAS"] === 'SATISFACTORIO') {
          row.getCell('ARL_FECHAS').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '00FF00' } // Verde
          };
        } else if (dato["ARL_FECHAS"] === 'ALERTA NO COINCIDEN') {
          row.getCell('ARL_FECHAS').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF0000' } // Rojo
          };
        }

        if (dato["fechaIngresoArl"] === 'NO DISPONIBLE') {
          row.getCell('fechaIngresoArl').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF0000' } // Rojo
          };
        }

        if (dato["fechaIngresoCruce"] === 'NO DISPONIBLE') {
          row.getCell('fechaIngresoCruce').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF0000' } // Rojo
          };
        }


      });

      // Crear otra hoja para las cédulas no encontradas en ARL
      const cedulasNoEncontradas = datosMapeados.filter(dato => dato["Arl"] === 'ALERTA NO ESTA EN ARL').map(dato => dato["Numero de Cedula"]);
      const cedulasWorksheet = workbookOut.addWorksheet('Cédulas No Encontradas');
      cedulasWorksheet.columns = [{ header: 'Cédula', key: 'cedula', width: 20 }];
      cedulasNoEncontradas.forEach(cedula => {
        cedulasWorksheet.addRow({ cedula });
      });

      // Exportar el archivo Excel
      workbookOut.xlsx.writeBuffer().then(buffer => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        FileSaver.saveAs(blob, 'ReporteARL.xlsx');
      });

      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Archivo de ARL procesado, comparado y guardado como Excel.',
        confirmButtonText: 'Aceptar'
      });

    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al procesar los datos. Por favor, inténtelo de nuevo.',
        confirmButtonText: 'Aceptar'
      });
    }
  }





  excelSerialToJSDate(serial: number): string {
    const utc_days = Math.floor(serial - 25569);
    const date = new Date(utc_days * 86400 * 1000);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  }

  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async onSubmit() {
    const user = await this.jefeAreaService.getUser();

    // Verificar si el cruce ha sido validado
    if (this.reporteForm.get('cruceDiario')?.value && !this.isCruceValidado) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe validar el cruce diario antes de enviar.',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    // Verificar si "¿Es de hoy?" está desmarcado y si la fecha es obligatoria
    const fechaValida = this.reporteForm.get('fecha')?.value;
    if (!this.reporteForm.get('esDeHoy')?.value && !fechaValida) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe ingresar una fecha si no es de hoy.',
        confirmButtonText: 'Aceptar'
      });
      return;
    }


    // Validar si el formulario completo es válido
    if (this.reporteForm.valid) {
      this.processingErrors = [];
      const processes = [
        { key: 'cedulasEscaneadas', name: 'Cédulas Escaneadas', process: this.processCedulasEscaneadas.bind(this) },
        { key: 'cruceDiario', name: 'Cruce diario Excel', process: this.processExcelFiles.bind(this) },
        { key: 'arl', name: 'Archivo ARL', process: this.proccssArl.bind(this) },
        { key: 'induccionSSO', name: 'Inducción Seguridad y Salud en el trabajo', process: this.processFileList.bind(this) },
        { key: 'traslados', name: 'Traslados', process: this.processTraslados.bind(this) },
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
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: `Ocurrió un error al procesar ${name}, inténtelo de nuevo.`
            });

            this.processingErrors.push(name);
            return;
          }
        }
        await this.delay(1000); // Espera de un segundo
      }

      if (this.processingErrors.length > 0) {
        Swal.fire({
          icon: 'error',
          title: 'Errores durante la carga',
          html: `Ocurrieron errores al procesar los siguientes elementos: <ul>${this.processingErrors.map(err => `<li>${err}</li>`).join('')}</ul>`,
          confirmButtonText: 'Aceptar'
        });
      } else {
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Formulario enviado exitosamente.',
          confirmButtonText: 'Aceptar'
        });

        const reporteData = {
          sede: this.reporteForm.get('sede')?.value,
          contratosHoy: this.reporteForm.get('contratosHoy')?.value,
          cantidadContratosTuAlianza: this.reporteForm.get('cantidadContratosTuAlianza')?.value || 0,
          cantidadContratosApoyoLaboral: this.reporteForm.get('cantidadContratosApoyoLaboral')?.value || 0,
          nota: this.reporteForm.get('notas')?.value,
          cedulas: this.cedulasBase64.length > 0 ? this.cedulasBase64 : 'No se han cargado cédulas',  // Validación de cédulas
          traslados: this.trasladosBase64.length > 0 ? this.trasladosBase64 : 'No se han cargado traslados',  // Validación de traslados
          cruce: this.cruceBase64 !== '' ? this.cruceBase64 : 'No se ha cargado cruce',  // Validación de cruce
          sst: this.sstBase64 !== '' ? this.sstBase64 : 'No se ha cargado SST',  // Validación de SST
          nombre: user.primer_nombre + ' ' + user.primer_apellido,  // Accede a las propiedades del usuario
          arl: this.arlBase64 !== '' ? this.arlBase64 : 'No se ha cargado ARL',  // Validación de ARL
        };

        console.log(reporteData);  // Solo para revisar lo que se enviará al backend

        this.jefeAreaService.cargarReporte(reporteData).then(
          (response) => {
          },
          (error) => {
          }
        );

      }

    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, completa el formulario correctamente.',
        confirmButtonText: 'Aceptar'
      });
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

  async proccssArl(files: File[]) {
    for (const file of files) {
      await this.processExcelFileaRL(file);
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

  async processExcelFileaRL(file: File) {
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      const bstr: string = e.target.result;
      const workbook = XLSX.read(bstr, { type: 'binary' });
      await this.processArl(workbook);
    };
    reader.readAsBinaryString(file);
  }

  async processContratacion(workbook: XLSX.WorkBook): Promise<void> {
    let response: any;
    // copiar el excel en base64
    this.cruceBase64 = await this.convertToBase64(this.filesToUpload['cruceDiario'][0]);

    try {
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, dateNF: "dd/mm/yyyy" });
      json.shift();

      const formatDate = (date: string): string => {
        // Detectar si está en el formato mm/dd/yy o dd/mm/yyyy
        const regex_ddmmyyyy = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
        const regex_mmddyy = /^\d{1,2}\/\d{1,2}\/\d{2}$/;

        if (regex_ddmmyyyy.test(date)) {
          return date; // Ya está en el formato correcto
        } else if (regex_mmddyy.test(date)) {
          // Convertir mm/dd/yy a dd/mm/yyyy
          const [month, day, year] = date.split('/');
          const fullYear = (parseInt(year, 10) < 50) ? `20${year}` : `19${year}`; // Para distinguir siglos
          return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${fullYear}`;
        }
        return date; // Si no cumple ningún formato, se deja como está
      };

      const indicesFechas = [0, 8, 16, 24, 44, 134];

      const rows: string[][] = (json as any[][]).map((row: any[]) => {
        const completeRow = new Array(195).fill('-');

        row.forEach((cell, index) => {
          if (index < 195) {
            if (cell == null || cell === '') {
              completeRow[index] = '-';
            } else if (index === 11 || index === 1) {
              completeRow[index] = cell.toString().replace(/,/g, '').replace(/\./g, '').replace(/\s/g, '');
            } else if (indicesFechas.includes(index)) {
              completeRow[index] = formatDate(cell.toString());
            } else {
              completeRow[index] = cell.toString();
            }
          }
        });

        return completeRow;
      });

      this.datoscruced = rows;
      console.log(rows);
      /* 
      response = await this.jefeAreaService.subirContratacion(rows);
       if (response.message !== 'success') {
         this.processingErrors.push('Cruce diario Excel');
 
       }
       await this.generateErrorExcel(response.errores);
 
       */
    } catch (error) {
      this.processingErrors.push('Cruce diario Excel');

    }
  }

  async generateErrorExcel(errores: any[]): Promise<void> {
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



  // arl


}
