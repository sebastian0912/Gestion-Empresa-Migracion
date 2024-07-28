import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart, ChartConfiguration, registerables, ChartTypeRegistry } from 'chart.js';
import { Subscription } from 'rxjs';
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

  constructor(private seguimientoHvService: SeguimientoHvService) { }

  ngOnInit(): void {
    this.cargarYMostrarDatos();
  }

  ngAfterViewInit(): void {
    this.cargarYMostrarDatos();
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    this.destroyCharts();
  }

  cargarYMostrarDatos(): void {
    this.dataSubscription = this.seguimientoHvService.buscarSeguimientoHvGeneral().subscribe((response: any) => {
      console.log(response);
      this.procesarDatos(response);
    }, (error: any) => {
      console.error('Error al cargar los datos:', error);
    });
  }

  procesarDatos(datos: any): void {
    const gruposDefinidos: GruposDefinidos = {
      "Hoja de Vida": ["codigo_hoja_de_vida", "foto_hoja_de_vida", "nombre_y_cedula_hoja_de_vida", "correo_electronico_hoja_de_vida", "direccion_hoja_de_vida", "referencia_hoja_de_vida", "firma_carnet_hoja_de_vida"],
      "Ficha Técnica": ["foto", "infolaboral_FT", "firma_trabajador", "huella", "referencia", "firma_carnet_FT", "firma_loker_FT", "fecha_de_ingreso_FT", "empleador_FT"],
      "Documento de identidad o Cédula": ["ampliada_al_150", "huellaCedula", "sello", "legible"],
      "Antecedentes(inferior a 15 días)": ["procuraduria_vigente", "fecha_procuraduria", "contraloria_vigente", "fecha_contraloria", "ofac_lista_clinton", "fecha_ofac", "policivos_vigente", "fecha_policivos", "medidas_correstivas", "fecha_medidas_correstivas"],
      "Adres": ["adres", "fecha_adres"],
      "Sisben": ["sisben", "fecha_sisben"],
      "Elite": ["formatoElite", "cargoElite"],
      "Contrato": ["nombres_trabajador_contrato", "no_cedula_contrato", "direccion", "correo_electronico", "fecha_de_ingreso_contrato", "salario_contrato", "empresa_usuaria", "cargo_contrato", "descripcion_temporada", "firma_trabajador_contrato", "firma_testigos", "sello_temporal"],
      "Entrega de Documentos": ["autorizacion_dscto_casino", "forma_de_pago", "autorizacion_funerario", "huellas_docs", "firma_cedula_docs", "fecha_de_recibido_docs"],
      "Entrevista de Ingreso": ["entrevista_ingreso"],
      "Arl": ["centro_de_costo_arl", "clase_de_riesgo", "cedula_arl", "nombre_trabajador_arl", "fecha_de_ingreso_arl"],
      "Exámenes": ["temporal", "fecha_no_mayor_a_15_dias", "nombres_trabajador_examenes", "cargo", "cedula_examenes", "apto", "salud_ocupacional", "colinesterasa", "planilla_colinesterasa", "otros"],
      "Afp": ["certificado_afp", "ruaf", "nombre_trabajador_ruaf", "cedula_ruaf", "fecha_cerRuaf15menor", "historia"],
      "Eps": ["fecha_radicado_eps", "nombre_y_cedula_eps", "salario_eps"],
      "Caja": ["fecha_radicado_caja", "nombre_y_cedula_caja", "salario_caja"],
      "Seguridad": ["nombre_y_cedula_seguridad", "fecha_radicado_seguridad"],
      "Otro si Clausulas adicionales JDA": ["firma_clausulas_add", "sello_temporal_clausulas_add"],
      "Adición Contrato (otro si)": ["firma_add_contrato", "sello_temporal_add_contrato"],
      "Autorización Tratamiento de Datos JDA": ["autorizaciontratamientosDatosJDA"],
      "Carta de Descuento Flor": ["cartadescuentoflor"],
      "Formato de timbre en hora de ingreso y salida": ["formato_timbre"],
      "Carta autorización correo electrónico": ["cartaaurotiracioncorreo"]
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

    this.generarCheckboxes(Object.keys(agrupadosPorResponsable), 'checkboxes-container');
    this.generarCheckboxes(Object.keys(agrupadosPorGrupo), 'checkboxes-container-groups');

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

  generarCheckboxes(labels: string[], containerId: string): void {
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

  generarGraficoBarras(chartId: string, labels: string[], data1: number[], data2: number[]): void {
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

  generarGraficoCircular(chartId: string, data: number[]): void {
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

  agregarEventListeners(agrupadosPorResponsable: any, agrupadosPorGrupo: any): void {
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
