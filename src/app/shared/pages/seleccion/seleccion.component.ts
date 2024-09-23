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
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import Swal from 'sweetalert2';
import { NgFor, NgForOf, NgIf, NgStyle } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { ContratacionService } from '../../services/contratacion/contratacion.service';
import { catchError, forkJoin, of } from 'rxjs';
import { LeerInfoCandidatoComponent } from '../../components/leer-info-candidato/leer-info-candidato.component';
import { MatDialog } from '@angular/material/dialog';
import { VacantesService } from '../../services/vacantes/vacantes.service';
import { MatMenuModule } from '@angular/material/menu';
import { SeleccionService } from '../../services/seleccion/seleccion.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

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
    NgStyle,
    MatExpansionModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule
  ],
  templateUrl: './seleccion.component.html',
  styleUrl: './seleccion.component.css'
})
export class SeleccionComponent implements OnInit {
  cedula: string = ''; // Variable to store the cedula input
  codigoContrato: string = ''; // Variable to store the contract code
  infoGeneral: boolean = false;
  seleccion: any;
  infoGeneralC = null;
  vacantes: any[] = [];
  sede: string = '';
  // Formularios 
  formGroup1: FormGroup;
  formGroup2: FormGroup;
  formGroup3: FormGroup;
  formGroup4: FormGroup;
  filtro: string = '';
  procesoValido: boolean = false;
  constructor(
    private fb: FormBuilder,
    private contratacionService: ContratacionService,
    public dialog: MatDialog,
    private vacantesService: VacantesService,
    private seleccionService: SeleccionService
  ) {
    this.formGroup1 = this.fb.group({
      eps: [''],
      afp: [''],
      policivos: [''],
      procuraduria: [''],
      contraloria: [''],
      ramaJudicial: [''],
      medidasCorrectivas: [''],
      areaAplica: ['']
    });

    this.formGroup2 = this.fb.group({
      centroCosto: [''],
      cargo: [''],
      areaEntrevista: [''],
      fechaPruebaEntrevista: [''],
      horaPruebaEntrevista: [''],
      direccionEmpresa: ['']
    });

    this.formGroup3 = this.fb.group({
      examenSaludOcupacional: [''],
      ips: [''],
      laboratorios: [''],
      ipsLab: [''],
      aptoCargo: ['']
    });

    this.formGroup4 = this.fb.group({
      empresaUsuaria: [''],
      fechaIngreso: [''],
      salario: [''],
      auxTransporte: [''],
      rodamiento: [''],
      auxMovilidad: [''],
      bonificacion: ['']
    });
  }



  async ngOnInit(): Promise<void> {
    await this.loadData();

    this.seleccionService.getUser().then(user => {
      if (user) {
        const abreviaciones: { [key: string]: string } = {
          'ADMINISTRATIVOS': 'ADM',
          'ANDES': 'AND',
          'BOSA': 'BOS',
          'CARTAGENITA': 'CAR',
          'FACA_PRIMERA': 'FPR',
          'FACA_PRINCIPAL': 'FPC',
          'FONTIBÓN': 'FON',
          'FORANEOS': 'FOR',
          'FUNZA': 'FUN',
          'MADRID': 'MAD',
          'MONTE_VERDE': 'MV',
          'ROSAL': 'ROS',
          'SOACHA': 'SOA',
          'SUBA': 'SUB',
          'TOCANCIPÁ': 'TOC',
          'USME': 'USM',
        };

        // Asegurarte de que user.sucursalde es string
        const sede: string = user.sucursalde;

        this.sede = abreviaciones[sede] || sede;
      }
    });
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

  // Función para escoger una vacante y actualizar los campos del formulario con los datos de la vacante
  escogerVacante(vacante: any): void {
    // Mostrar una alerta de éxito
    Swal.fire('Vacante seleccionada', 'La vacante ha sido almacenada para ejecutarla en su proceso de selección', 'success');

    // Si los datos de la vacante existen, actualizar el formulario directamente
    if (vacante) {
      // imprimir hora de prueba tecnica
      console.log(vacante);
      this.formGroup2.patchValue({
        centroCosto: vacante.Localizaciondelavacante || '',
        cargo: vacante.Cargovacante_id || '',
        areaEntrevista: vacante.empresaQueSolicita_id || '',
        fechaPruebaEntrevista: this.formatDate(vacante.fechadePruebatecnica) || '',
        horaPruebaEntrevista: vacante.horadePruebatecnica || '',
        direccionEmpresa: vacante.lugarPrueba || ''
      });
    }
  }

  // Método para convertir la fecha de "dd/mm/yyyy" a formato "yyyy-mm-dd"
  formatDate(dateString: string): string | null {
    if (!dateString) return null;

    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  }



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
      infoGeneral: this.contratacionService.buscarEncontratacion(this.cedula),
    }).subscribe(
      ({ seleccion, infoGeneral }) => {
        if (seleccion && seleccion.procesoSeleccion && Array.isArray(seleccion.procesoSeleccion)) {
          // Usar reducción para encontrar el id más alto
          this.seleccion = seleccion.procesoSeleccion.reduce((prev: { id: number; }, current: { id: number; }) =>
            current.id > prev.id ? current : prev, { id: 0 });
        } else {
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
          Swal.fire({
            title: '¡Error!',
            text: 'Datos generales no válidos',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        }
        // Mueve verificarSeleccion aquí
        this.verificarSeleccion();
        this.procesoValido = true;
      },
      (err) => {
        Swal.fire({
          title: 'Atención',
          text: 'No se encontró la cédula ingresada, no ha llenado el formulario, se podra continuar con el proceso, pero se debe indicar que a la persona que llene el formulario',
          icon: 'warning',
          confirmButtonText: 'Ok'
        });

        this.seleccionService.generarCodigoContratacion(this.sede, this.cedula).subscribe((response: any) => {
          this.codigoContrato = response.codigo_contrato;
          this.procesoValido = true;
          Swal.fire({
            title: '¡Código de contrato generado!',
            text: 'El código de contrato generado es ' + response.codigo_contrato,
            icon: 'success',
            confirmButtonText: 'Ok'
          });
        });

      }
    );


  }

  async verificarSeleccion() {
    console.log(this.seleccion);
    // Si existe un proceso de selección, llenar el formulario con los datos
    if (this.seleccion) {
      // Mostrar el diálogo de confirmación
      Swal.fire({
        title: '¡Atención!',
        html: 'Este usuario ya tiene un proceso de selección con el código de contrato <b>' + this.seleccion.codigo_contrato + '</b>. ¿Deseas crear otro o seguir con este?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Crear otro',
        cancelButtonText: 'Seguir con este'
      }).then((result) => {
        if (result.isConfirmed) {
          console.log('Crear otro');
          this.seleccionService.generarCodigoContratacion(this.sede, this.cedula).subscribe((response: any) => {
            this.codigoContrato = response.codigo_contrato;
            Swal.fire({
              title: '¡Código de contrato generado!',
              text: 'El código de contrato generado es ' + response.codigo_contrato,
              icon: 'success',
              confirmButtonText: 'Ok'
            });
          });

        } else {
          this.codigoContrato = this.seleccion.codigo_contrato;
          console.log('Seguir con este');

          // Llenar los campos del formulario de Datos Generales (formGroup1)
          this.formGroup1.patchValue({
            eps: this.seleccion.eps || '',
            afp: this.seleccion.afp || '',
            policivos: this.seleccion.policivos || '',
            procuraduria: this.seleccion.procuraduria || '',
            contraloria: this.seleccion.contraloria || '',
            ramaJudicial: this.seleccion.rama_judicial || '',
            medidasCorrectivas: this.seleccion.medidas_correctivas || '',
            areaAplica: this.seleccion.area_aplica || ''
          });


          // Llenar los campos del formulario con los datos de la selección
          this.formGroup2.patchValue({
            centroCosto: this.seleccion.centro_costo_entrevista || '',
            cargo: this.seleccion.cargo || '',
            areaEntrevista: this.seleccion.area_entrevista || '',
            fechaPruebaEntrevista: this.seleccion.fecha_prueba_entrevista || '',
            horaPruebaEntrevista: this.seleccion.hora_prueba_entrevista || '',
            direccionEmpresa: this.seleccion.direccion_empresa || ''
          });

          // Llenar los campos del formulario de Examen de Salud Ocupacional (formGroup3)
          this.formGroup3.patchValue({
            examenSaludOcupacional: this.seleccion.examen_salud_ocupacional || '',
            ips: this.seleccion.ips || '',
            laboratorios: this.seleccion.delaboratorios || '',
            ipsLab: this.seleccion.ipslab || '',
            aptoCargo: this.seleccion.apto_para_el_cargo || ''
          });

          // Llenar los campos del formulario de Contratación (formGroup4)
          this.formGroup4.patchValue({
            empresaUsuaria: this.seleccion.empresa_usuario || '',
            fechaIngreso: this.seleccion.fecha_ingreso_usuario || '',
            salario: this.seleccion.salario || '',
            auxTransporte: this.seleccion.aux_transporte || '',
            rodamiento: this.seleccion.rodamiento || '',
            auxMovilidad: this.seleccion.aux_movilidad || '',
            bonificacion: this.seleccion.bonificacion || ''
          });




        }
      });

    } else {
      console.log('No tiene proceso de selección');
    }
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

  // Método para imprimir los datos de los formularios
  imprimirVerificacionesAplicacion(): void {
    console.log('Verificaciones y Área de Aplicación:', this.formGroup1.value);

    this.seleccionService.crearSeleccionParteUnoCandidato(this.formGroup2.value, this.cedula, this.codigoContrato).subscribe(
      response => {
        console.log('Respuesta exitosa Parte 1:', response);
      },
      error => {
        console.error('Error en la solicitud Parte 1:', error);
      }
    );
  }

  // Método para imprimir los datos de los formularios
  imprimirEntrevistaPrueba(): void {
    console.log('Entrevista o Prueba Técnica:', this.formGroup2.value);
    console.log('Cedula:', this.cedula);
    console.log('Codigo Contrato:', this.codigoContrato);
    this.seleccionService.crearSeleccionParteDosCandidato(this.formGroup2.value, this.cedula, this.codigoContrato).subscribe(
      response => {
        console.log('Respuesta exitosa Parte 2:', response);
      },
      error => {
        console.error('Error en la solicitud Parte 2:', error);
      }
    );
  }

  // Método para imprimir los datos de los formularios
  imprimirSaludOcupacional(): void {
    console.log('Examen de Salud Ocupacional:', this.formGroup3.value);

    this.seleccionService.crearSeleccionParteTresCandidato(this.formGroup2.value, this.cedula, this.codigoContrato).subscribe(
      response => {
        console.log('Respuesta exitosa Parte 3:', response);
        if (response.message === 'success') {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Datos guardados exitosamente',
            icon: 'success',
            confirmButtonText: 'Ok'
          });
        }
      },
      error => {
        console.error('Error en la solicitud Parte 3:', error);
      }
    );
  }

  // Método para imprimir los datos de los formularios
  imprimirContratacion(): void {
    console.log('Contratación:', this.formGroup4.value);

    this.seleccionService.crearSeleccionParteCuatroCandidato(this.formGroup2.value, this.cedula, this.codigoContrato).subscribe(
      response => {
        console.log('Respuesta exitosa Parte 4:', response);
      },
      error => {
        console.error('Error en la solicitud Parte 4:', error);
      }
    );
  }







  //--------------------------------------------------------------------------------}

  // Método para calcular el porcentaje de llenado de un FormGroup
  getPercentage(formGroup: FormGroup): number {
    const totalFields = Object.keys(formGroup.controls).length;
    const filledFields = Object.values(formGroup.controls).filter(control => control.value).length;
    return Math.round((filledFields / totalFields) * 100);
  }


  // Método para determinar el color de fondo del encabezado según el porcentaje
  getPanelColor(percentage: number): string {
    if (percentage <= 20) {
      return '#ff6666'; // Fondo rojo intenso
    } else if (percentage > 20 && percentage <= 40) {
      return '#ffcc99'; // Fondo naranja claro
    } else if (percentage > 40 && percentage <= 60) {
      return '#fff5cc'; // Fondo amarillo claro
    } else if (percentage > 60 && percentage <= 80) {
      return '#d9f2d9'; // Fondo verde claro
    } else if (percentage > 80 && percentage < 100) {
      return '#a3e4a3'; // Fondo verde medio
    } else {
      return '#66ff66'; // Fondo verde intenso (100% completo)
    }
  }


}
