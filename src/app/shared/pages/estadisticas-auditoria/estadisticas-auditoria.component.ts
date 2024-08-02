import { Component, OnInit, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { Chart, ChartConfiguration, registerables, ChartTypeRegistry } from 'chart.js';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
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
import { NgIf } from '@angular/common';
import { SeguimientoHvService } from '../../services/seguimiento-hv/seguimiento-hv.service';
import Swal from 'sweetalert2';

interface GruposDefinidos {
  [key: string]: string[];
}

// Registrar todos los componentes de Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-estadisticas-auditoria',
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
  templateUrl: './estadisticas-auditoria.component.html',
  styleUrls: ['./estadisticas-auditoria.component.css']
})
export class EstadisticasAuditoriaComponent implements OnInit, AfterViewInit, OnDestroy {
  private dataSubscription: Subscription | undefined;
  private charts: { [key: string]: Chart } = {};
  private isBrowser: boolean;

  constructor(
    private seguimientoHvService: SeguimientoHvService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.cargarYMostrarDatos();
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.cargarYMostrarDatos();
    }
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    this.destroyCharts();
  }

  async cargarYMostrarDatos(): Promise<void> {
    this.dataSubscription = this.seguimientoHvService.buscarSeguimientoHvGeneral().subscribe((response: any) => {
      this.procesarDatos(response);
    }, (error: any) => {
      Swal.fire('Error', 'Ocurrió un error al cargar los datos', 'error');
    });
  }

  async procesarDatos(datos: any): Promise<void> {
    const gruposDefinidos: GruposDefinidos = {
      // tu definición de grupos aquí
    };

    const agrupadosPorResponsable = datos.reduce((acc: any, dato: any) => {
      const responsable = dato.responsable || "Desconocido";
      if (!acc[responsable]) acc[responsable] = { total0: 0, total1: 0, edits: 0 };

      Object.entries(dato).forEach(([key, value]) => {
        if (value === "0") acc[responsable].total0++;
        if (value === "1") acc[responsable].total1++;
      });

      if (Array.isArray(dato.ultimas_actualizaciones)) {
        dato.ultimas_actualizaciones.forEach((act: any) => {
          if (act.estado === "EDITADO") acc[responsable].edits++;
        });
      } else if (dato.ultimas_actualizaciones && dato.ultimas_actualizaciones.estado === "EDITADO") {
        acc[responsable].edits++;
      }

      return acc;
    }, {});

    const agrupadosPorGrupo = Object.keys(gruposDefinidos).reduce((acc: any, grupo: string) => {
      acc[grupo] = { total0: 0, total1: 0 };
      datos.forEach((dato: any) => {
        gruposDefinidos[grupo].forEach((campo: string) => {
          if (dato[campo] === "0") acc[grupo].total0++;
          if (dato[campo] === "1") acc[grupo].total1++;
        });
      });
      return acc;
    }, {});

    const total0s = datos.reduce((acc: number, dato: any) => acc + Object.values(dato).filter(val => val === "0").length, 0);
    const total1s = datos.reduce((acc: number, dato: any) => acc + Object.values(dato).filter(val => val === "1").length, 0);

    // Agregando procesamiento de tipo de registro
    const typeCounts = datos.reduce((acc: any, dato: any) => {
      const tipo = dato.tipo || "Desconocido";
      if (tipo === "AL") {
        acc.apoyoLaboral++;
      } else if (tipo === "E1" || tipo === "E2") {
        acc.tuAlianza++;
      }
      return acc;
    }, { tuAlianza: 0, apoyoLaboral: 0 });

    await this.generarCheckboxes(Object.keys(agrupadosPorResponsable), 'checkboxes-container');
    await this.generarCheckboxes(Object.keys(agrupadosPorGrupo), 'checkboxes-container-groups');

    const initialLabels = Object.keys(agrupadosPorResponsable);
    const initialTotal0Data = initialLabels.map(label => agrupadosPorResponsable[label].total0);
    const initialTotal1Data = initialLabels.map(label => agrupadosPorResponsable[label].total1);
    const initialEditsData = initialLabels.map(label => agrupadosPorResponsable[label].edits);

    const groupLabels = Object.keys(agrupadosPorGrupo);
    const groupTotal0Data = groupLabels.map(label => agrupadosPorGrupo[label].total0);
    const groupTotal1Data = groupLabels.map(label => agrupadosPorGrupo[label].total1);

    this.generarGraficoBarras('barChart', initialLabels, initialTotal0Data, initialTotal1Data);
    this.generarGraficoCircular('pieChart', [total0s, total1s]);
    this.generarGraficoBarras('editBarChart', initialLabels, initialEditsData, []);
    this.generarGraficoBarras('groupBarChart', groupLabels, groupTotal0Data, groupTotal1Data);

    // Generar el nuevo gráfico circular de tipos de registro
    this.generarGraficoCircular('typePieChart', [typeCounts.tuAlianza, typeCounts.apoyoLaboral]);

    this.agregarEventListeners(agrupadosPorResponsable, agrupadosPorGrupo);
  }

  async generarCheckboxes(labels: string[], containerId: string): Promise<void> {
    if (this.isBrowser) {
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = '';
        labels.forEach(label => {
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.id = label;
          checkbox.value = label;
          checkbox.checked = true;

          const labelElement = document.createElement('label');
          labelElement.htmlFor = label;
          labelElement.appendChild(document.createTextNode(label));

          const div = document.createElement('div');
          div.appendChild(checkbox);
          div.appendChild(labelElement);
          container.appendChild(div);
        });
      }
    }
  }

  generarGraficoBarras(chartId: string, labels: string[], data1: number[], data2: number[]): void {
    if (this.isBrowser) {
      const ctx = (document.getElementById(chartId) as HTMLCanvasElement).getContext('2d');
      if (ctx) {
        if (this.charts[chartId]) {
          this.charts[chartId].destroy();
        }
        const config: ChartConfiguration<'bar'> = {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: '0s',
                data: data1,
                backgroundColor: '#FF6384',
                borderColor: '#FF6384',
                borderWidth: 1
              },
              {
                label: '1s',
                data: data2,
                backgroundColor: '#36A2EB',
                borderColor: '#36A2EB',
                borderWidth: 1
              }
            ]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        };
        this.charts[chartId] = new Chart(ctx, config);
      }
    }
  }

  generarGraficoCircular(chartId: string, data: number[]): void {
    if (this.isBrowser) {
      const ctx = (document.getElementById(chartId) as HTMLCanvasElement).getContext('2d');
      if (ctx) {
        if (this.charts[chartId]) {
          this.charts[chartId].destroy();
        }
        const config: ChartConfiguration<'pie'> = {
          type: 'pie',
          data: {
            labels: chartId === 'pieChart' ? ['0s', '1s'] : ['Tu Alianza', 'Apoyo Laboral'],
            datasets: [{
              data: data,
              backgroundColor: ['#FF6384', '#36A2EB']
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: chartId === 'pieChart' ? 'Distribución General de 0s y 1s' : 'Distribución de Tipos de Registro'
              }
            }
          }
        };
        this.charts[chartId] = new Chart(ctx, config as ChartConfiguration<keyof ChartTypeRegistry>);
      }
    }
  }

  agregarEventListeners(agrupadosPorResponsable: any, agrupadosPorGrupo: any): void {
    if (this.isBrowser) {
      document.getElementById('updateChartButton')?.addEventListener('click', this.debounce(() => {
        const selectedResponsables = Array.from(document.querySelectorAll('#checkboxes-container input:checked')).map(input => (input as HTMLInputElement).value);
        const filteredLabels = selectedResponsables;
        const filteredTotal0Data = filteredLabels.map(label => agrupadosPorResponsable[label].total0);
        const filteredTotal1Data = filteredLabels.map(label => agrupadosPorResponsable[label].total1);

        const barChart = this.charts['barChart'];
        if (barChart) {
          barChart.data.labels = filteredLabels;
          barChart.data.datasets[0].data = filteredTotal0Data;
          barChart.data.datasets[1].data = filteredTotal1Data;
          barChart.update();
        }
      }, 300));

      document.getElementById('updateEditChartButton')?.addEventListener('click', this.debounce(() => {
        const selectedResponsables = Array.from(document.querySelectorAll('#checkboxes-container-edits input:checked')).map(input => (input as HTMLInputElement).value);
        const filteredLabels = selectedResponsables;
        const filteredEditsData = filteredLabels.map(label => agrupadosPorResponsable[label].edits);

        const editBarChart = this.charts['editBarChart'];
        if (editBarChart) {
          editBarChart.data.labels = filteredLabels;
          editBarChart.data.datasets[0].data = filteredEditsData;
          editBarChart.update();
        }
      }, 300));

      document.getElementById('updateGroupChartButton')?.addEventListener('click', this.debounce(() => {
        const selectedGrupos = Array.from(document.querySelectorAll('#checkboxes-container-groups input:checked')).map(input => (input as HTMLInputElement).value);
        const filteredLabels = selectedGrupos;
        const filteredTotal0Data = filteredLabels.map(label => agrupadosPorGrupo[label].total0);
        const filteredTotal1Data = filteredLabels.map(label => agrupadosPorGrupo[label].total1);

        const groupBarChart = this.charts['groupBarChart'];
        if (groupBarChart) {
          groupBarChart.data.labels = filteredLabels;
          groupBarChart.data.datasets[0].data = filteredTotal0Data;
          groupBarChart.data.datasets[1].data = filteredTotal1Data;
          groupBarChart.update();
        }
      }, 300));
    }
  }

  debounce(func: Function, wait: number): (...args: any[]) => void {
    let timeout: any;
    return (...args: any[]): void => {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  private destroyCharts(): void {
    Object.keys(this.charts).forEach(chartId => {
      if (this.charts[chartId]) {
        this.charts[chartId].destroy();
      }
    });
  }
}
