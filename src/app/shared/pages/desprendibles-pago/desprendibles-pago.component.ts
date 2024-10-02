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

@Component({
  selector: 'app-desprendibles-pago',
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
  templateUrl: './desprendibles-pago.component.html',
  styleUrls: ['./desprendibles-pago.component.css']
})
export class DesprendiblesPagoComponent implements OnInit {
  cedula: string = '';
  displayedColumns: string[] = [
    'no', 'cedula', 'nombre', 'ingreso', 'retiro', 'finca', 'telefono',
    'concepto', 'desprendibles', 'certificaciones', 'cartas_retiro',
    'carta_cesantias', 'entrevista_retiro', 'correo', 'confirmacion_envio'
  ];
  dataSource = new MatTableDataSource<any>();
  originalData: any[] = [];
  user: any
  correo: any;

  public isMenuVisible = true;

  // Método para manejar el evento del menú
  onMenuToggle(isMenuVisible: boolean): void {
    this.isMenuVisible = isMenuVisible;
  }

  overlayVisible = false;
  loaderVisible = false;
  counterVisible = false;


  claves = ["No", "Cedula", "Nombre", "Ingreso", 
    "Retiro", "Finca", "Telefono", "CONCEPTO", 
    "Desprendibles", "Certificaciones", "Cartas_Retiro", 
    "Carta_Cesantias", "Entrevista_Retiro", "Correo", 
    "Confirmacion_Envio"];

  constructor(private pagosService: PagosService) {

  }

  async ngOnInit(): Promise<void> {
    this.user = await this.pagosService.getUser();
    if (this.user) {
      this.correo = this.user.correo_electronico;
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isValidLink(url: string): boolean {
    return typeof url === 'string' && url.startsWith('https://');
  }


  public buscarDesprendibles(cedula: string): void {
    // Mantener la primera letra (si existe) y limpiar el resto
    let cleanedCedula: string;
    
    if (/^[A-Za-z]/.test(cedula)) {
        cleanedCedula = cedula[0].toUpperCase() + cedula.slice(1).replace(/[^\d]/g, '');
    } else {
        cleanedCedula = cedula.replace(/[^\d]/g, '');
    }

    // Convertir todo en mayúsculas
    cleanedCedula = cleanedCedula.toUpperCase();

    this.pagosService.buscarDesprendibles(cleanedCedula).subscribe(
        (response: any) => {
            if (response.message == 'No se encontró el número de cédula') {
                Swal.fire({
                    icon: 'info',
                    title: 'Información',
                    text: 'No se encontraron formas de pago para la cédula ingresada'
                });
                return;
            }

            const desprendibles = response.desprendibles
                .sort((a: any, b: any) => b.id - a.id);

            this.originalData = JSON.parse(JSON.stringify(desprendibles));
            this.dataSource.data = desprendibles;
        },
        (error: any) => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ha ocurrido un error al buscar la información'
            });
        }
    );
}


  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  cargarExcel(event: any): void {
    this.toggleLoader(true, true);
    this.toggleOverlay(true);
  
    const file = event.target.files[0];
    const reader = new FileReader();
  
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array', cellDates: true, cellNF: false, cellText: false });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, dateNF: "dd/mm/yyyy" });
  
      const modifiedRows = this.asignarClaves(rows);
  
      // Validar que no tenga más de 15 columnas y necesariamente las primeras 15
      if (modifiedRows.length > 0 && Object.keys(modifiedRows[0]).length > 15
        || Object.keys(modifiedRows[0]).length < 15) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El archivo no tiene el formato correcto, por favor verifique que tenga 15 columnas y que las primeras 15 sean las correctas'
        });
        this.toggleLoader(false);
        this.toggleOverlay(false);
        return;
      }
  
      // quitar la primera fila que son los títulos
      modifiedRows.shift();
  
      this.resetFileInput();
      // Aquí puedes hacer algo con modifiedRows, como almacenarlo o procesarlo
      this.pagosService.subirExcelDesprendibles(modifiedRows).then((response: any) => {
        if (response.message == 'success') {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Los datos han sido cargados correctamente'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ha ocurrido un error al cargar los datos'
          });
        }
        this.toggleLoader(false);
        this.toggleOverlay(false);
      }).catch((error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ha ocurrido un error al cargar los datos'
        });
        this.toggleLoader(false);
        this.toggleOverlay(false);
      });
    };
  
    this.resetFileInput();
    reader.readAsArrayBuffer(file);
  }
  
  asignarClaves(data: any[]): any[] {
    return data.map((row: any) => {
      let modifiedRow: any = {};
      this.claves.forEach((clave: string, index: number) => {
        modifiedRow[clave] = row[index] !== undefined && row[index] !== null ? row[index] : '-';
      });
      return modifiedRow;
    });
  }

  resetFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
