import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RobotRecord } from '../../model/robotRecord';
import { FormControl } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardTitle } from "@angular/material/card";
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-robot-table',
  standalone: true,
  templateUrl: './robot-table.component.html',
  styleUrls: ['./robot-table.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatCard,
    MatCardTitle,
    MatListModule,
    MatIconModule
]
})
export class RobotTableComponent implements OnInit {
  // Propiedades para mostrar el filtro activo (verde)
  get isNombreFiltrando(): boolean {
    return !!this.nombreFilter.value;
  }
  get isEstadoFiltrando(): boolean {
    return Array.isArray(this.estadoFilter.value) && this.estadoFilter.value.length > 0;
  }
  get isRobotFiltrando(): boolean {
    return !!this.robotFilter.value;
  }
  get isPaginaFiltrando(): boolean {
    return Array.isArray(this.paginaFilter.value) && this.paginaFilter.value.length > 0;
  }
  get isFechaFiltrando(): boolean {
    return !!this.fechaDesde.value || !!this.fechaHasta.value;
  }
  get isIdFiltrando(): boolean {
    return !!this.idFilter.value;
  }
  displayedColumns: string[] = ['cola', 'nombre', 'estado', 'nombreRobot', 'pagina', 'fecha', 'hora', 'id'];
  dataSource = new MatTableDataSource<RobotRecord>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  nombreFilter = new FormControl('');
  estadoFilter = new FormControl<string[] | null>([]);
  paginaFilter = new FormControl<string[] | null>([]);
  fechaDesde = new FormControl();
  fechaHasta = new FormControl();
  robotFilter = new FormControl('');
  idFilter = new FormControl('');

  showNombreFilterCard = false;
  showEstadoFilterCard = false;
  showRobotFilterCard = false;
  showPaginaFilterCard = false;
  showFechaFilterCard = false;
  showIdFilterCard = false;
  toggleNombreFilterCard() {
    this.showNombreFilterCard = !this.showNombreFilterCard;
  }
  toggleEstadoFilterCard() {
    this.showEstadoFilterCard = !this.showEstadoFilterCard;
  }
  toggleRobotFilterCard() {
    this.showRobotFilterCard = !this.showRobotFilterCard;
  }
  togglePaginaFilterCard() {
    this.showPaginaFilterCard = !this.showPaginaFilterCard;
  }
  toggleFechaFilterCard() {
    this.showFechaFilterCard = !this.showFechaFilterCard;
  }
  toggleIdFilterCard() {
    this.showIdFilterCard = !this.showIdFilterCard;
  }

  allData: RobotRecord[] = []; // Will be populated with API data

  ngOnInit(): void {
    // Mock data for testing - replace with API call later
    // 20 registros de prueba
    const estados: Array<'Activo' | 'Inactivo' | 'Pendiente'> = ['Activo', 'Inactivo', 'Pendiente'];
    const robots = ['Robot_A', 'Robot_B', 'Robot_C', 'Robot_D'];
    const paginas: Array<'Adres' | 'Policivo' | 'OFAC' | 'Contraloria' | 'Sisben' | 'Procuraduria' | 'Pension' | 'Union'> = [
      'Policivo', 'Contraloria', 'Procuraduria', 'Union', 'Adres', 'OFAC', 'Sisben', 'Pension'
    ];
    const nombres = [
      'Juan Perez', 'Maria Lopez', 'Carlos Ruiz', 'Ana Torres', 'Luis Gomez',
      'Sofia Castro', 'Miguel Diaz', 'Lucia Vargas', 'Pedro Sanchez', 'Elena Rios',
      'Jorge Silva', 'Valeria Mora', 'Andres Pardo', 'Camila Ortiz', 'Ricardo Luna',
      'Paula Reyes', 'Hugo Salas', 'Diana Cruz', 'Oscar Peña', 'Gabriela Soto'
    ];
    const horas = [
      '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
      '16:00', '16:30', '17:00', '17:30'
    ];
    const baseDate = new Date();
    this.allData = Array.from({ length: 20 }, (_, i) => ({
      cola: i + 1,
      nombre: nombres[i],
      estado: estados[i % estados.length],
      nombreRobot: robots[i % robots.length],
      pagina: paginas[i % paginas.length],
      fecha: new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() - i),
      hora: horas[i],
      id: 100 + i
    }));
    this.allData.sort((a, b) => a.cola - b.cola);
    this.dataSource.data = this.allData;
    // Configurar paginación y ordenamiento después de la inicialización de la vista
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      if (this.paginator) {
        this.paginator.pageSize = 10;
      }
    });

    this.nombreFilter.valueChanges.subscribe(() => this.applyFilters());
    this.estadoFilter.valueChanges.subscribe(() => this.applyFilters());
    this.paginaFilter.valueChanges.subscribe(() => this.applyFilters());
    this.fechaDesde.valueChanges.subscribe(() => this.applyFilters());
    this.fechaHasta.valueChanges.subscribe(() => this.applyFilters());
    this.robotFilter.valueChanges.subscribe(() => this.applyFilters());
    this.idFilter.valueChanges.subscribe(() => this.applyFilters());
  }

  applyFilters() {
    const nombre = this.nombreFilter.value?.toLowerCase() || '';
    const estados = this.estadoFilter.value || [];
    const paginas = this.paginaFilter.value || [];
    const desde = this.fechaDesde.value;
    const hasta = this.fechaHasta.value;
    const robot = this.robotFilter.value?.toLowerCase() || '';
    const id = this.idFilter.value?.toString() || '';

    let filtered = this.allData.filter(record => {
      return record.nombre.toLowerCase().includes(nombre)
        && (estados.length === 0 || estados.includes(record.estado))
        && (paginas.length === 0 || paginas.includes(record.pagina))
        && (!desde || record.fecha >= desde)
        && (!hasta || record.fecha <= hasta)
        && record.nombreRobot.toLowerCase().includes(robot)
        && (id === '' || record.id.toString().includes(id));
    });
    // Si hay un sort activo, aplicar el ordenamiento manualmente
    if (this.sort && this.sort.active && this.sort.direction !== '') {
      const active = this.sort.active;
      const direction = this.sort.direction;
      filtered = filtered.slice().sort((a: any, b: any) => {
        let valueA = a[active];
        let valueB = b[active];
        // Para fechas, comparar como fechas
        if (active === 'fecha') {
          valueA = new Date(valueA).getTime();
          valueB = new Date(valueB).getTime();
        } else if (typeof valueA === 'string' && typeof valueB === 'string') {
          valueA = valueA.toLowerCase();
          valueB = valueB.toLowerCase();
        }
        if (valueA < valueB) return direction === 'asc' ? -1 : 1;
        if (valueA > valueB) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    this.dataSource.data = filtered;
  }

  clearFilters() {
    this.nombreFilter.setValue('');
    this.estadoFilter.setValue([]);
    this.paginaFilter.setValue([]);
    this.fechaDesde.setValue(null);
    this.fechaHasta.setValue(null);
    this.robotFilter.setValue('');
    this.idFilter.setValue('');
  }
}
