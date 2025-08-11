import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavbarLateralComponent } from '../../components/navbar-lateral/navbar-lateral.component';
import { NavbarSuperiorComponent } from '../../components/navbar-superior/navbar-superior.component';
import { InfoCardComponent } from '../../components/info-card/info-card.component';
import { RobotsService } from '../../services/robots/robots.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  StandardFilterTable,
  ColumnDefinition,
} from '../../components/standard-filter-table/standard-filter-table';

@Component({
  selector: 'app-antecedentes-robots',
  standalone: true,
  templateUrl: './antecedentes-robots.component.html',
  styleUrls: ['./antecedentes-robots.component.css'],
  imports: [
    NavbarLateralComponent,
    NavbarSuperiorComponent,
    InfoCardComponent,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    CommonModule,
    MatDialogModule,
    StandardFilterTable,
  ],
})
export class AntecedentesRobotsComponent implements OnInit {
  /** ---------- CONTROLES ---------- */
  cedulaControl = new FormControl('');

  /** ---------- TABLA PRINCIPAL ---------- */
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'encontrado',
    'cedula',
    'hora_registro',
    'oficina',
    'tipo_documento',
    'estado_adress',
    'apellido_adress',
    'entidad_adress',
    'pdf_adress',
    'fecha_adress',
    'estado_policivo',
    'anotacion_policivo',
    'pdf_policivo',
    'estado_ofac',
    'anotacion_ofac',
    'pdf_ofac',
    'estado_contraloria',
    'anotacion_contraloria',
    'pdf_contraloria',
    'estado_sisben',
    'tipo_sisben',
    'pdf_sisben',
    'fecha_sisben',
    'estado_procuraduria',
    'anotacion_procuraduria',
    'pdf_procuraduria',
    'estado_fondo_pension',
    'entidad_fondo_pension',
    'pdf_fondo_pension',
    'fecha_fondo_pension',
    'estado_union',
    'union_pdf',
    'fecha_union_pdf',
  ];

  /** ---------- NUEVA TABLA STANDARD (Robots) ---------- */
  robotTableData: any[] = [];
  robotColumnDefs: ColumnDefinition[] = [
    {
      name: 'cola',
      header: 'Cola',
      type: 'number',
      width: '80px',
      filterable: false,
    },
    { name: 'nombre', header: 'Nombre', type: 'text', width: '180px' },
    {
      name: 'estado',
      header: 'Estado',
      type: 'select',
      options: ['Activo', 'Inactivo', 'Pendiente'],
      width: '130px',
    },
    { name: 'nombreRobot', header: 'Robot', type: 'text', width: '140px' },
    {
      name: 'pagina',
      header: 'Página',
      type: 'select',
      options: [
        'Adres',
        'Policivo',
        'OFAC',
        'Contraloria',
        'Sisben',
        'Procuraduria',
        'Pension',
        'Union',
      ],
      width: '150px',
    },
    { name: 'fecha', header: 'Fecha', type: 'date', width: '130px' },
    { name: 'hora', header: 'Hora', type: 'text', width: '100px' },
    { name: 'id', header: 'ID', type: 'number', width: '90px' },
  ];

  /** ---------- OTROS ---------- */
  isSidebarHidden = false;
  private readonly claves = ['cedula', 'tipo_documento', 'paquete'];

  constructor(
    private robotsService: RobotsService,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.initRobotMockData();
  }

  /* ---------- SIDEBAR ---------- */
  toggleSidebar(): void {
    this.isSidebarHidden = !this.isSidebarHidden;
  }

  /* ---------- BÚSQUEDA INDIVIDUAL ---------- */
  buscarPorCedula(): void {
    const cedula = this.cedulaControl.value?.trim();
    if (!cedula) {
      Swal.fire({
        icon: 'warning',
        title: 'Cédula vacía',
        text: 'Ingrese una cédula.',
      });
      return;
    }
    this.robotsService.consultarEstadosRobots(cedula).subscribe({
      next: (r) => this.pintarRespuestaEnTabla(r, cedula),
      error: () => this.pintarRespuestaEnTabla(null, cedula),
    });
  }

  /* ---------- PEGAR LISTA DIRECTO EN TABLA ---------- */
  onTablePaste(evt: ClipboardEvent): void {
    const txt = evt.clipboardData?.getData('text') ?? '';
    if (!txt) {
      return;
    }
    evt.preventDefault(); // no pegar texto crudo
    if (txt.includes('\n') || txt.includes('\t') || txt.includes(',')) {
      this.procesarCedulasPegadas(txt); // lista de cédulas
    } else {
      this.cedulaControl.setValue(txt.trim());
      this.buscarPorCedula(); // cédula única
    }
  }

  procesarCedulasPegadas(texto: string): void {
    this.dataSource.data = [];
    const cedulas = texto
      .split(/[\n,\t;]+/)
      .map((c) => c.trim())
      .filter(Boolean);
    cedulas.forEach((c) =>
      this.robotsService.consultarEstadosRobots(c).subscribe({
        next: (r) => this.pintarRespuestaEnTabla(r, c),
        error: () => this.pintarRespuestaEnTabla(null, c),
      })
    );
  }

  /* ---------- AGREGAR FILA CON ✔ / ❌ ---------- */
  private pintarRespuestaEnTabla(
    res: any | null,
    cedulaFallback: string
  ): void {
    const row =
      res && (res.con_registros?.length || res.sin_consultar?.length)
        ? {
            ...(res.con_registros?.[0] ?? res.sin_consultar?.[0]),
            encontrado: true,
          }
        : { cedula: cedulaFallback, encontrado: false };
    this.dataSource.data = [...this.dataSource.data, row];
  }

  /* ---------- FILTRO DE TABLA ---------- */
  applyFilters(ev: Event): void {
    this.dataSource.filter = (ev.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
  }

  /* ---------- INPUT FILE (EXCEL) ---------- */
  triggerFileInput(): void {
    (document.getElementById('fileInput') as HTMLInputElement).click();
  }

  /** ---------- CARGAR EXCEL (sin cambios funcionales) ---------- */
  cargarExcel(evt: any): void {
    const file = evt.target.files[0];
    if (!file) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Seleccione un archivo',
      });
      return;
    }

    Swal.fire({
      title: 'Cargando...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const wb = XLSX.read(new Uint8Array(e.target.result), {
          type: 'array',
          cellDates: true,
        });
        const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
          header: 1,
          raw: false,
        });
        if (!rows.length) {
          Swal.fire({ icon: 'error', title: 'Archivo vacío' });
          return;
        }
        const mod = this.asignarClaves(rows);
        if (Object.keys(mod[0]).length !== this.claves.length) {
          Swal.fire({ icon: 'error', title: 'Formato incorrecto' });
          return;
        }
        this.robotsService.enviarEstadosRobots(mod).subscribe({
          next: (r) =>
            Swal.fire(
              r.message === 'success'
                ? { icon: 'success', title: 'Éxito' }
                : { icon: 'error', title: 'Error' }
            ),
          error: () => Swal.fire({ icon: 'error', title: 'Error' }),
          complete: () => Swal.close(),
        });
      } catch (_) {
        Swal.fire({ icon: 'error', title: 'Error al procesar' });
      }
    };
    reader.readAsArrayBuffer(file);
  }

  /* ---------- UTIL ---------- */
  private asignarClaves(data: any[]): any[] {
    return data
      .filter((r) =>
        r.some((c: any) => c !== null && c !== undefined && c !== '')
      )
      .map((r) => {
        const obj: any = {};
        r.forEach((c: any, i: number) => {
          if (i < this.claves.length) {
            obj[this.claves[i]] = c || 'N/A';
          }
        });
        return obj;
      });
  }

  private initRobotMockData(): void {
    const estados: Array<'Activo' | 'Inactivo' | 'Pendiente'> = [
      'Activo',
      'Inactivo',
      'Pendiente',
    ];
    const robots = ['Robot_A', 'Robot_B', 'Robot_C', 'Robot_D'];
    const paginas: Array<
      | 'Adres'
      | 'Policivo'
      | 'OFAC'
      | 'Contraloria'
      | 'Sisben'
      | 'Procuraduria'
      | 'Pension'
      | 'Union'
    > = [
      'Policivo',
      'Contraloria',
      'Procuraduria',
      'Union',
      'Adres',
      'OFAC',
      'Sisben',
      'Pension',
    ];
    const nombres = [
      'Juan Perez',
      'Maria Lopez',
      'Carlos Ruiz',
      'Ana Torres',
      'Luis Gomez',
      'Sofia Castro',
      'Miguel Diaz',
      'Lucia Vargas',
      'Pedro Sanchez',
      'Elena Rios',
      'Jorge Silva',
      'Valeria Mora',
      'Andres Pardo',
      'Camila Ortiz',
      'Ricardo Luna',
      'Paula Reyes',
      'Hugo Salas',
      'Diana Cruz',
      'Oscar Peña',
      'Gabriela Soto',
    ];
    const horas = [
      '08:00',
      '08:30',
      '09:00',
      '09:30',
      '10:00',
      '10:30',
      '11:00',
      '11:30',
      '12:00',
      '12:30',
      '13:00',
      '13:30',
      '14:00',
      '14:30',
      '15:00',
      '15:30',
      '16:00',
      '16:30',
      '17:00',
      '17:30',
    ];
    const baseDate = new Date();
    this.robotTableData = Array.from({ length: 20 }, (_, i) => ({
      cola: i + 1,
      nombre: nombres[i],
      estado: estados[i % estados.length],
      nombreRobot: robots[i % robots.length],
      pagina: paginas[i % paginas.length],
      fecha: new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate() - i
      ),
      hora: horas[i],
      id: 100 + i,
    }));
    this.robotTableData.sort((a, b) => a.cola - b.cola);
  }
}
