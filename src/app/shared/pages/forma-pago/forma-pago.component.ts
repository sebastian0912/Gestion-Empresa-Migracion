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
  selector: 'app-forma-pago',
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
  templateUrl: './forma-pago.component.html',
  styleUrls: ['./forma-pago.component.css']
})
export class FormaPagoComponent implements OnInit {
  cedula: string = '';
  displayedColumns: string[] = ['contrato', 'cedula', 'nombre', 'centrodecosto', 'concepto', 'formadepago', 'valor', 'banco', 'fechadepago', 'acciones'];
  dataSource = new MatTableDataSource<any>();
  originalData: any[] = [];
  user : any
  correo : any

  overlayVisible = false;
  loaderVisible = false;
  counterVisible = false;

  constructor(private pagosService: PagosService) {

  }

  async ngOnInit(): Promise<void> {
    this.user = await this.pagosService.getUser();
    if (this.user) {
      this.correo = this.user.correo_electronico;
    }
  }

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
    const cleanedCedula = cedula.replace(/[^\d]/g, '');

    this.pagosService.buscarFormasPago(cleanedCedula).subscribe(
      (response: any) => {
        if (response.message == 'No se encontró el número de cédula') {
          Swal.fire({
            icon: 'info',
            title: 'Información',
            text: 'No se encontraron formas de pago para la cédula ingresada'
          });
          return;
        }

        const formasDePago = response.formasdepago
          .sort((a: any, b: any) => b.id - a.id)
          .slice(0, 4)
          .map((item: any) => ({ ...item, editing: false }));

        this.originalData = JSON.parse(JSON.stringify(formasDePago));
        this.dataSource.data = formasDePago;
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleEdit(element: any): void {
    if (this.correo === "contaduria.rtc@gmail.com" ||
      this.correo === "ghumana.rtc@gmail.com") {

      element.editing = !element.editing;

      if (!element.editing) {
        this.pagosService.editarFormaPago(
          element.id,
          element.banco,
          element.nombre,
          element.centrodecosto,
          element.concepto,
          element.contrato,
          element.fechadepago,
          element.formadepago,
          element.valor
        ).then((response: any) => {
          if (response.status === 'success') {
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
      } else {
        const index = this.dataSource.data.indexOf(element);
        this.dataSource.data[index] = { ...this.originalData[index], editing: true };
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No tienes permisos para editar esta información'
      });
    }
  }

  eliminarFormaPago(element: any): void {
    if (this.correo === "contaduria.rtc@gmail.com" ||
      this.correo === "ghumana.rtc@gmail.com") {

      Swal.fire({
        title: '¿Estás seguro de eliminar esta información?',
        text: 'No podrás revertir esta acción',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.pagosService.eliminarFormaPago(element.id).then((response: any) => {
            if (response.message == 'success') {
              Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'La información ha sido eliminada correctamente'
              });
              const index = this.dataSource.data.indexOf(element);
              this.dataSource.data.splice(index, 1);
              this.dataSource._updateChangeSubscription();
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ha ocurrido un error al eliminar la información'
              });
            }
          }).catch((error: any) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ha ocurrido un error al eliminar la información'
            });
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No tienes permisos para eliminar esta información'
          });
        }
      });
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  resetFileInput(event: any): void {
    event.target.value = '';
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

      if (modifiedRows.length > 0 && (Object.keys(modifiedRows[0]).length > 10 || Object.keys(modifiedRows[0]).length < 10)) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El archivo no tiene el formato corresdfsffsddcto, por favor verifique que tenga 10 columnas y que las primeras 10 sean las correctas'
        });
        this.toggleLoader(false);
        this.toggleOverlay(false);
        return;
      }

      this.pagosService.subirExcelFormasPago(modifiedRows).then((response: any) => {
        if (response.message == 'success') {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Los datos han sidsfdsfdso cargados correctamente'
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

    reader.readAsArrayBuffer(file);
  }



  claves = ["NroDes", "Contrato", "Cedula", "Nombre", "CentrodeCosto", "Concepto", "FormadePago", "Valor", "Banco", "FECHADEPAGO"];

  asignarClaves(data: any[]): any[] {

    return data.map((row: any) => {
      let modifiedRow: any = {};
      row.forEach((cell: any, index: number) => {
        if (index < this.claves.length) {
          modifiedRow[this.claves[index]] = cell !== null ? cell : 'N/A';
        }
      });
      return modifiedRow;
    });
  }


}


