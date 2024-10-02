import { Component, OnInit } from '@angular/core';
import { NavbarLateralComponent } from '../../components/navbar-lateral/navbar-lateral.component';
import { NavbarSuperiorComponent } from '../../components/navbar-superior/navbar-superior.component';
import { MatCardModule } from '@angular/material/card';
import { VetadosService } from '../../services/vetados/vetados.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { AutorizarVetadoComponent } from '../../components/autorizar-vetado/autorizar-vetado.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-vetados-gerencia',
  standalone: true,
  imports: [
    NavbarLateralComponent,
    NavbarSuperiorComponent,
    MatCardModule,
    MatFormFieldModule,
    MatTableModule,
    CommonModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './vetados-gerencia.component.html',
  styleUrls: ['./vetados-gerencia.component.css']
})
export class VetadosGerenciaComponent implements OnInit {

  // Columnas para la primera tabla de reportados
  displayedColumns: string[] = ['cedula', 'nombre_completo', 'estado', 'fecha', 'observacion', 'centro_costo_carnet', 'reportado_por', 'sede', 'acciones'];

  // Columnas para la segunda tabla de todos los vetados
  todosDisplayedColumns: string[] = ['cedula', 'nombre_completo', 'categoriaid', 'categoria_clasificacion', 'categoria_descripcion' , 'estado', 'fecha', 'observacion', 'reportado_por', 'sede', 'autorizado_por'];

  // Fuentes de datos para ambas tablas
  reportadosDataSource = new MatTableDataSource<any>([]);
  todosDataSource = new MatTableDataSource<any>([]);

  constructor(
    private vetadosService: VetadosService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getVetados();
  }

  public isMenuVisible = true;

  // Método para manejar el evento del menú
  onMenuToggle(isMenuVisible: boolean): void {
    this.isMenuVisible = isMenuVisible;
  }

  // Obtener los datos de los vetados
  getVetados() {
    this.vetadosService.listarReportesVetados().subscribe((data: any) => {
      // Separar los datos de reportados y todos los vetados
      this.reportadosDataSource.data = data.reportados;  // Solo los reportados
      console.log('Reportados:', data);
      this.todosDataSource.data = data.revisados;  // Todos los vetados (reportados + revisados)
    });
  }

  // Aplicar filtro a la tabla de reportados
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.reportadosDataSource.filter = filterValue.trim().toLowerCase();
  }

  // Aplicar filtro a la tabla de todos los vetados
  applyFilterTodos(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.todosDataSource.filter = filterValue.trim().toLowerCase();
  }


  // Función para ver los detalles del elemento
  verDetalle(element: any) {
    const dialogRef = this.dialog.open(AutorizarVetadoComponent, {
      minWidth: '850px',
      data: { element }
    });
  
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        (await this.vetadosService.actualizarReporte(element, result)).subscribe((data: any) => {
          this.getVetados();
        });
      }
    });

  }

  // Función para eliminar el registro (por ahora solo imprime)
  eliminar(element: any) {
    console.log('Eliminar registro:', element);
    this.vetadosService.eliminarReporte(element.id).subscribe((data: any) => {
      console.log('Registro eliminado:', data);
      this.getVetados();
    });
  }




}
