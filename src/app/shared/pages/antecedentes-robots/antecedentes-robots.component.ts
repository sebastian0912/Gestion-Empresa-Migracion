import { Component, OnInit } from '@angular/core';
import { NavbarLateralComponent } from '../../components/navbar-lateral/navbar-lateral.component';
import { NavbarSuperiorComponent } from '../../components/navbar-superior/navbar-superior.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { RobotsService } from '../../services/robots/robots.service';
import Swal from 'sweetalert2';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-antecedentes-robots',
  standalone: true,
  imports: [
    NavbarLateralComponent,
    NavbarSuperiorComponent,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule

  ],
  templateUrl: './antecedentes-robots.component.html',
  styleUrls: ['./antecedentes-robots.component.css']
})
export class AntecedentesRobotsComponent implements OnInit {
  // FormControl para la cédula
  cedulaControl = new FormControl('');
  
  // DataSource para la tabla
  dataSource = new MatTableDataSource<any>([]);
  
  // Columnas que se mostrarán en la tabla
  displayedColumns: string[] = [
    'hora_registro', 'oficina', 'cedula', 'tipo_documento',
    'estado_adress', 'apellido_adress', 'entidad_adress', 'pdf_adress', 'fecha_adress',
    'estado_policivo', 'anotacion_policivo', 'pdf_policivo',
    'estado_ofac', 'anotacion_ofac', 'pdf_ofac',
    'estado_contraloria', 'anotacion_contraloria', 'pdf_contraloria',
    'estado_sisben', 'tipo_sisben', 'pdf_sisben', 'fecha_sisben',
    'estado_procuraduria', 'anotacion_procuraduria', 'pdf_procuraduria',
    'estado_fondo_pension', 'entidad_fondo_pension', 'pdf_fondo_pension', 'fecha_fondo_pension',
    'estado_union', 'union_pdf', 'fecha_union_pdf'
  ];

  constructor(
    private robotsService: RobotsService,
  ) {}

  ngOnInit(): void {
    // Inicialización si es necesario
  }

  isSidebarHidden = false;

  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
  }

  buscarPorCedula(): void {
    const cedula = this.cedulaControl.value;
    if (cedula) {
      console.log('Buscando por cédula:', cedula);
      this.robotsService.consultarEstadosRobots(cedula).subscribe(
        (response: any) => {
          // Verificar si los arreglos están vacíos
          if (response.con_registros.length === 0 && response.sin_consultar.length === 0) {
            Swal.fire({
              icon: 'info',
              title: 'No hay registros',
              text: 'No se encontraron registros para la cédula ingresada.'
            });
          } else {
            // Mostrar los registros en la tabla
            this.dataSource.data = response.con_registros;
            console.log('Datos recibidos:', this.dataSource.data);
          }
        },
        (error) => {
          console.error('Error:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al consultar los antecedentes de robots.'
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Cédula vacía',
        text: 'Por favor ingrese una cédula para realizar la búsqueda.'
      });
    }
  }

  applyFilters(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
