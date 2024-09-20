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
import Swal from 'sweetalert2';
import { NgFor, NgForOf, NgIf } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { ContratacionService } from '../../services/contratacion/contratacion.service';
import { catchError, forkJoin, of } from 'rxjs';
import { LeerInfoCandidatoComponent } from '../../components/leer-info-candidato/leer-info-candidato.component';
import { MatDialog } from '@angular/material/dialog';
import { VacantesService } from '../../services/vacantes/vacantes.service';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-seleccion',
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
    NgIf,
    NgFor,
    NgForOf,
    MatExpansionModule,
    MatMenuModule,
  ],
  templateUrl: './seleccion.component.html',
  styleUrl: './seleccion.component.css'
})
export class SeleccionComponent implements OnInit {
  cedula: string = ''; // Variable to store the cedula input
  infoGeneral: boolean = false;
  seleccion: any;
  infoGeneralC = null;
  vacantes: any[] = [];

  constructor(
    private contratacionService: ContratacionService,
    public dialog: MatDialog,
    private vacantesService: VacantesService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  async loadData(): Promise<void> {
    this.vacantesService.listarVacantes().pipe(
      catchError((error) => {
        Swal.fire('Error', 'Ocurrió un error al cargar las vacantes', 'error');
        return of([]); // Retorna un arreglo vacío para manejar el error y continuar
      })
    ).subscribe((response: any) => {
      this.vacantes = response.publicacion.map((vacante: any) => ({
        ...vacante,
      }));
    });
  }

  // Función para escoger una vacante y almacenarla en LocalStorage
  escogerVacante(vacante: any): void {
    // Almacenar la vacante seleccionada en LocalStorage
    localStorage.setItem('vacanteSeleccionada', JSON.stringify(vacante));
    Swal.fire('Vacante seleccionada', 'La vacante ha sido almacenada para ejecutarla en su proceso de seleccion', 'success');
  }

  filtro: string = '';

  filtrarVacantes() {
    if (!this.filtro) {
      return this.vacantes;
    }
    const filtroLower = this.filtro.toLowerCase();
    return this.vacantes.filter(vacante => {
      return vacante.Cargovacante_id.toLowerCase().includes(filtroLower) ||
             vacante.localizacionDeLaPersona.toLowerCase().includes(filtroLower) ||
             vacante.empresaQueSolicita_id.toLowerCase().includes(filtroLower);
    });
  }

  async buscarCedula() {
    forkJoin({
      seleccion: this.contratacionService.traerDatosSeleccion(this.cedula),
      infoGeneral: this.contratacionService.buscarEncontratacion(this.cedula)
    }).subscribe(
      ({ seleccion, infoGeneral }) => {
        if (seleccion && seleccion.procesoSeleccion && Array.isArray(seleccion.procesoSeleccion)) {
          let id = 0;
          seleccion.procesoSeleccion.forEach((element: { id: number }) => {  // Asegúrate que element tiene un campo 'id'
            if (element.id > id) {
              id = element.id;
              this.seleccion = element;
            }
          });
        } else {
          // Manejo de error si seleccion.procesoSeleccion no es válido
          Swal.fire({
            title: '¡Error!',
            text: 'Datos de selección no válidos',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        }

        if (infoGeneral && infoGeneral.data) {
          this.infoGeneralC = infoGeneral.data[0];
          this.infoGeneral = true;
        } else {
          // Manejo de error si infoGeneral.data no es válido
          Swal.fire({
            title: '¡Error!',
            text: 'Datos generales no válidos',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        }
      },
      (err) => {
        Swal.fire({
          title: '¡Error!',
          text: 'No se encontró la cédula ingresada',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    );
  }




  abrirModal(): void {
    this.dialog.open(LeerInfoCandidatoComponent, {
      minWidth: '80vw',
      minHeight: '60vh',
      maxHeight: '80vh',
      data: {
        seleccion: this.seleccion,
        infoGeneralC: this.infoGeneralC,
      },
    });
  }

}
