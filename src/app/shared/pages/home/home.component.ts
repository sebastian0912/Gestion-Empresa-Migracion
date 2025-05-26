import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavbarLateralComponent } from '../../components/navbar-lateral/navbar-lateral.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { NavbarSuperiorComponent } from '../../components/navbar-superior/navbar-superior.component';
import { MatIconModule } from '@angular/material/icon';
import { RobotsService } from '../../services/robots/robots.service';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { OrdenUnionDialogComponent } from '../../components/orden-union-dialog/orden-union-dialog.component';
import { PagosService } from '../../services/pagos/pagos.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavbarLateralComponent,
    NavbarSuperiorComponent,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSort,
    CommonModule,
    MatCardModule,
    DragDropModule,
    MatButtonModule,
    NgIf,
    NgForOf,
    MatTableModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort) sort!: MatSort;
  isSidebarHidden = false;
  paquetesDataSource = new MatTableDataSource<any>();
  displayedPaqueteColumns: string[] = [];
  robotsHome: boolean = false;

  constructor(
    private robotsService: RobotsService,
    private dialog: MatDialog,
    private pagosService: PagosService,
  ) { }

  ngOnInit(): void {
    this.pagosService.getUser().then(user => {
      // si es ADMIN O GERENCIA ES ROBOT
      if (user.rol === 'ADMIN' || user.rol === 'GERENCIA' || user.correo_electronico === 'arhivotualianza@gmail.com') {
                this.robotsHome = true;
      } else {
        this.robotsHome = false;
      }
    });



    this.robotsService.consultarEstadosRobotsPendientesGenerales()
      .pipe(catchError(error => { console.error('Error fetching data', error); return of([]); }))
      .subscribe((data: any[]) => {
        if (data.length > 0) {
          this.displayedPaqueteColumns = Object.keys(data[0]);
          const prioridadIndex = this.displayedPaqueteColumns.indexOf('prioridad');
          if (prioridadIndex !== -1 && !this.displayedPaqueteColumns.includes('descargar')) {
            this.displayedPaqueteColumns.splice(prioridadIndex + 1, 0, 'descargar');
          }
        }
        this.paquetesDataSource.data = data;
      });

    this.robotsService.consultarEstadosRobotsPendientesPorOficina()
      .pipe(catchError(error => { console.error('Error fetching data', error); return of([]); }))
      .subscribe((data: any[]) => {
        const processedData = this.transformData(data);
        this.displayedColumns = ['pendiente', 'Total', ...processedData.columns];
        this.dataSource.data = processedData.rows;
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  transformData(data: any[]): { columns: string[], rows: any[] } {
    const columns: string[] = [];
    const pendientesSet = new Set<string>();

    data.forEach(item => {
      if (item.oficina) {
        columns.push(item.oficina);
        Object.keys(item).forEach(key => {
          if (key !== 'oficina') pendientesSet.add(key);
        });
      }
    });

    const rows = Array.from(pendientesSet).map(pendiente => {
      const row: any = { pendiente };
      let totalFila = 0;
      data.forEach(item => {
        if (item.oficina) {
          const valor = item[pendiente] ?? 0;
          row[item.oficina] = valor;
          totalFila += valor;
        }
      });
      row['Total'] = totalFila;
      return row;
    });

    return { columns, rows };
  }

  getTotalForColumn(column: string): number {
    return this.dataSource.data.reduce((sum, row) => sum + (row[column] ?? 0), 0);
  }

  getTotalForPaqueteColumn(column: string): number {
    return this.paquetesDataSource.data.reduce((sum, row) => sum + (row[column] ?? 0), 0);
  }

  onDropPaquete(event: CdkDragDrop<any[]>) {
    const data = this.paquetesDataSource.data;
    const prevIndex = event.previousIndex;
    const currIndex = event.currentIndex;

    if (prevIndex === currIndex) return;

    const prioridadA = data[prevIndex].prioridad;
    const prioridadB = data[currIndex].prioridad;

    const paqueteA = data[prevIndex].paquete;
    const paqueteB = data[currIndex].paquete;

    data[prevIndex].prioridad = prioridadB;
    data[currIndex].prioridad = prioridadA;

    moveItemInArray(data, prevIndex, currIndex);
    this.paquetesDataSource.data = [...data];

    forkJoin([
      this.robotsService.actualizarPrioridad(paqueteA, prioridadB),
      this.robotsService.actualizarPrioridad(paqueteB, prioridadA)
    ]).subscribe({
      next: () => Swal.fire('Éxito', 'Prioridades actualizadas', 'success'),
      error: () => Swal.fire('Error', 'No se pudo actualizar la prioridad', 'error')
    });
  }

  descargarZip(paquete: string): void {
    Swal.fire({
      title: '¿Deseas unir los archivos PDF en uno solo?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, unir PDF',
      cancelButtonText: 'No, descargar separados'
    }).then(result => {
      if (result.isConfirmed) {
        this.abrirDialogOrden(paquete);
      } else {
        this.descargarZipConUnion(paquete, false);
      }
    });
  }

  abrirDialogOrden(paquete: string): void {
    const antecedentes = [
      { id: 3, name: 'PROCURADURIA' },
      { id: 4, name: 'CONTRALORIA' },
      { id: 5, name: 'OFAC' },
      { id: 6, name: 'POLICIVOS' },
      { id: 7, name: 'ADRES' },
      { id: 8, name: 'SISBEN' },
      { id: 9, name: 'FONDO_PENSION' },
      { id: 10, name: 'MEDIDAS_CORRECTIVAS' },
      { id: 11, name: 'AFP' },
      { id: 12, name: 'RAMA_JUDICIAL' }
    ];

    const dialogRef = this.dialog.open(OrdenUnionDialogComponent, {
      width: '400px',
      data: { antecedentes }
    });

    dialogRef.afterClosed().subscribe((ordenSeleccionado: number[] | null) => {
      if (ordenSeleccionado) {
        this.descargarZipConUnion(paquete, true, ordenSeleccionado);
      }
    });
  }

  descargarZipConUnion(paquete: string, unir: boolean, orden: number[] = []): void {
    Swal.fire({
      title: 'Preparando descarga...',
      text: 'Esto puede tardar unos segundos',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    this.robotsService.descargarZipPaquete(paquete, unir, orden).subscribe({
      next: (blob: Blob) => {
        Swal.close();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `paquete_${paquete}.zip`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        Swal.close();
        Swal.fire('Error', 'No se pudo descargar el archivo.', 'error');
      }
    });
  }
}
