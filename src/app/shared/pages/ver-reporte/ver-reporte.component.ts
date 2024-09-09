import { Component, OnInit } from '@angular/core';
import { NavbarSuperiorComponent } from '../../components/navbar-superior/navbar-superior.component';
import { NavbarLateralComponent } from '../../components/navbar-lateral/navbar-lateral.component';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ContratacionService } from '../../services/contratacion/contratacion.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table'; // Import MatTableDataSource
import { VerPdfsComponent } from '../../components/ver-pdfs/ver-pdfs.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateRangeDialogComponent } from '../../components/date-rang-dialog/date-rang-dialog.component';
import Swal from 'sweetalert2';
DateRangeDialogComponent
@Component({
  selector: 'app-ver-reporte',
  standalone: true,
  imports: [
    NavbarSuperiorComponent,
    NavbarLateralComponent,
    MatButtonModule,
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './ver-reporte.component.html',
  styleUrl: './ver-reporte.component.css'
})
export class VerReporteComponent implements OnInit {
  reportes: any[] = [];
  displayedColumns: string[] = ['fecha','nombre', 'sede', 'cantidadContratosTuAlianza', 'cantidadContratosApoyoLaboral', 'cedulas', 'traslados', 'cruce', 'sst', 'nota'];
  dataSource = new MatTableDataSource<any>(); // Table 1 Data Source
  
  filterValues: any = {
    nombre: '',
    sede: ''
  };

  consolidadoDataSource = new MatTableDataSource<any>(); // Table 2 Data Source
  consolidadoDisplayedColumns: string[] = [
    'fecha', 'sede', 'cantidadContratosTuAlianza', 
    'cantidadContratosApoyoLaboral', 'totalIngresos', 
    'cedulas', 'traslados', 'sst', 'notas'
  ];

  constructor(
    private contratacionService: ContratacionService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.obtenerReportes();
    this.dataSource.filterPredicate = this.createFilter(); // Ensure filter applies to the first table
  }

  async obtenerReportes(): Promise<void> {
    await this.contratacionService.obtenerTodosLosReportes().subscribe(
      (response) => {
        this.reportes = response.reportes;
        this.dataSource.data = this.reportes; // First table's data
        this.consolidadoDataSource.data = this.generateConsolidatedData(this.reportes); // Consolidated table data
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al obtener los reportes',
          text: 'Ocurrió un error al obtener los reportes, por favor intenta de nuevo.'
        });
      }
    );
  }

  // Apply filter only for the first table
  applyFilter(filterKey: string, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.filterValues[filterKey] = inputElement.value.trim().toLowerCase();
    this.dataSource.filter = JSON.stringify(this.filterValues); // Trigger the filter
  }

  // Custom filter for filtering by nombre and sede
  createFilter(): (data: any, filter: string) => boolean {
    return (data: any, filter: string): boolean => {
      const searchTerms = JSON.parse(filter);
      const nombreMatches = data.nombre.toLowerCase().includes(searchTerms.nombre);
      const sedeMatches = data.sede.toLowerCase().includes(searchTerms.sede);
      return nombreMatches && sedeMatches; // Return true if both match
    };
  }

  // Modal handling for the PDFs
  openCedulasModal(cedulas: any[]): void {
    const dialogRef = this.dialog.open(VerPdfsComponent, {
      minWidth: '90vw',
      maxHeight: '70vh',
      data: { cedulas: cedulas }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Modal cerrado');
    });
  }

  // PDF/Excel Document viewing and downloading
  verDocumento(base64: string, fileName: string = 'CruceSubido.xlsx'): void {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const mimeType = base64.split(';')[0].split(':')[1];
    const blob = new Blob([byteArray], { type: mimeType });

    if (mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      const downloadLink = document.createElement('a');
      const url = URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else {
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl);
    }
  }

  // Function to generate consolidated data for second table
  generateConsolidatedData(reportes: any[]): any[] {
    const consolidado: any[] = [];
    const groupedBySede = this.groupBy(reportes, 'sede');
    
    Object.keys(groupedBySede).forEach(sede => {
      const reportsForSede = groupedBySede[sede];
      const totalContratosTuAlianza = reportsForSede.reduce((sum: any, report: { cantidadContratosTuAlianza: any; }) => sum + (report.cantidadContratosTuAlianza || 0), 0);
      const totalContratosApoyoLaboral = reportsForSede.reduce((sum: any, report: { cantidadContratosApoyoLaboral: any; }) => sum + (report.cantidadContratosApoyoLaboral || 0), 0);
      const totalCedulas = reportsForSede.reduce((sum: any, report: { cedulas: string | any[]; }) => sum + (report.cedulas?.length || 0), 0);
      const totalTraslados = reportsForSede.reduce((sum: any, report: { traslados: string | any[]; }) => sum + (report.traslados?.length || 0), 0);
      const sstOk = reportsForSede.some((report: { sst: string | null; }) => report.sst !== null && report.sst !== 'No se ha cargado SST');
      const notas = reportsForSede.map((report: { nota: any; }) => report.nota).filter((nota: any) => nota).join(', ');

      consolidado.push({
        fecha: reportsForSede[0].fecha,
        sede,
        cantidadContratosTuAlianza: totalContratosTuAlianza,
        cantidadContratosApoyoLaboral: totalContratosApoyoLaboral,
        totalIngresos: totalContratosTuAlianza + totalContratosApoyoLaboral,
        cedulas: totalCedulas,
        traslados: totalTraslados,
        sst: sstOk,
        notas
      });
    });

    return consolidado;
  }

  // Helper function to group by sede
  groupBy(array: any[], key: string): any {
    return array.reduce((result, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
      return result;
    }, {});
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }


  openDateRangeDialog(): void {

    const dialogRef = this.dialog.open(DateRangeDialogComponent, { width: '550px' });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Fecha de inicio:', result);
        this.contratacionService.obtenerReportesPorFechas(result.start, result.end).subscribe(
          (response) => {
            console.log('Reportes por fechas:', response);
            this.reportes = response.reportes;
            this.dataSource.data = this.reportes; // First table's data
            this.consolidadoDataSource.data = this.generateConsolidatedData(this.reportes); // Consolidated table data
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al obtener los reportes',
              text: 'Ocurrió un error al obtener los reportes, por favor intenta de nuevo.'
            });
          }
        );
      }
    });

  }


}
