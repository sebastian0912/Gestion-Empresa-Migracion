import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IncapacidadService } from '../../services/incapacidad/incapacidad.service';
import { Incapacidad } from '../../../models/incapacidad.model';
import { MatTableDataSource } from '@angular/material/table';
import { NavbarLateralComponent } from '../../components/navbar-lateral/navbar-lateral.component';
import { NavbarSuperiorComponent } from '../../components/navbar-superior/navbar-superior.component';
import { InfoCardComponent } from '../../components/info-card/info-card.component';
import { PagosService } from '../../services/pagos/pagos.service';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, debounceTime } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { NgIf, NgFor, NgSwitch } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { IncapacidadValidator } from './IncapacidadValidator'; // Ruta de la clase que creamos
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { ContratacionService } from '../../services/contratacion/contratacion.service';
import { format } from 'date-fns';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter'; // Importar el adaptador de Moment

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY', // Formato de entrada del usuario
  },
  display: {
    dateInput: 'DD/MM/YYYY', // Formato mostrado en el input
    monthYearLabel: 'MMM YYYY', // Formato mostrado en el selector de mes
    dateA11yLabel: 'DD/MM/YYYY', // Formato para accesibilidad
    monthYearA11yLabel: 'MMMM YYYY', // Formato para accesibilidad en el selector de mes
  },
};
@Component({
  selector: 'app-formulario-incapacidad',
  standalone: true,
  imports: [
    NavbarLateralComponent,
    NavbarSuperiorComponent,
    MatSnackBarModule,
    MatDividerModule,
    InfoCardComponent,
    MatTableModule,
    MatMenuModule,
    MatMomentDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    CommonModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
    FormsModule,
    MatCardModule,
    NgSwitch,
    NgIf,
    NgFor,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }, // Configurar el idioma y la localización
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }, // Configurar el formato de fecha personalizado
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } } // Opcional, para manejar fechas en UTC si es necesario
  ],
  templateUrl: './formulario-incapacidad.component.html',
  styleUrl: './formulario-incapacidad.component.css'
})
export class FormularioIncapacidadComponent implements OnInit {
  overlayVisible = false;
  loaderVisible = false;
  counterVisible = false;
  incapacidadForm: FormGroup;
  cedula: string = '';
  fields: string[] = [
    'Oficina', 'Nombre de quien recibio', 'Tipo de documento', 'Numero de documento', 'Temporal',
    'Numero de contrato', 'Apellido', 'Nombre', 'Edad', 'Sexo', 'Empresa', 'Centro de costo', 'Celular o telefono 01',
    'Celular o telefono 02', 'Correo Electronico', 'Fecha de ingreso temporal', 'Fecha inicio incapacidad', 'Fecha fin incapacidad', 'Tipo incapacidad', 'Codigo diagnostico',
    'Descripcion diagnostico', 'Dias incapacidad', 'Dias temporal', 'Dias eps', 'Nombre eps',
    'Fondo de pensiones', 'Estado incapacidad', 'Prorroga', 'Incapacidad Transcrita', 'Numero de incapacidad',
    'Nit de la IPS', 'IPS punto de atencion', 'Observaciones', 'Tipo de documento doctor atendido', 'Numero de documento doctor',
    'Nombre doctor', 'Estado robot doctor', 'Archivo Incapacidad', 'Historial clinico', 'Dias de diferencia',
    'Fecha de Envio Incapacidad Fisica', 'Centro de costos'
  ];

  fieldMap: { [key: string]: string } = {
    'Oficina': 'Oficina',
    'Nombre de quien recibio': 'nombre_de_quien_recibio',
    'Tipo de documento': 'tipodedocumento',
    'Numero de documento': 'numerodeceduladepersona',
    'Temporal': 'temporal',
    'Numero de contrato': 'numero_de_contrato',
    'Apellido': 'primer_apellido',
    'Nombre': 'primer_nombre',
    'Edad': 'edad',
    'Sexo': 'genero',
    'Empresa': 'empresa',
    'Centro de costos': 'Centro_de_costos',
    'Centro de costo': 'Centro_de_costo',
    'Celular o telefono 01': 'celular',
    'Celular o telefono 02': 'whatsapp',
    'Correo Electronico': 'primercorreoelectronico',
    'Fecha de ingreso temporal': 'fecha_contratacion',
    'Fecha inicio incapacidad': 'fecha_inicio_incapacidad',
    'Fecha fin incapacidad': 'fecha_fin_incapacidad',
    'Tipo incapacidad': 'tipo_incapacidad',
    'Codigo diagnostico': 'codigo_diagnostico',
    'Descripcion diagnostico': 'descripcion_diagnostico',
    'Dias incapacidad': 'dias_incapacidad',
    'Dias temporal': 'Dias_temporal',
    'Dias eps': 'dias_eps',
    'Nombre eps': 'nombre_eps',
    'Fondo de pensiones': 'fondo_de_pension',
    'Estado incapacidad': 'estado_incapacidad',
    'Prorroga': 'prorroga',
    'Incapacidad Transcrita': 'Incapacidad_transcrita',
    'Numero de incapacidad': 'numero_de_incapacidad',
    'Nit de la IPS': 'nit_de_la_IPS',
    'IPS punto de atencion': 'ips_punto_de_atencion',
    'Observaciones': 'observaciones',
    'Tipo de documento doctor atendido': 'tipo_de_documento_doctor_atendido',
    'Numero de documento doctor': 'numero_de_documento_doctor',
    'Nombre doctor': 'nombre_doctor',
    'Estado robot doctor': 'estado_robot_doctor',
    'Archivo Incapacidad': 'archivo_incapacidad',
    'Historial clinico': 'historial_clinico',
    'Dias de diferencia': 'dias_de_diferencia',
    'Fecha de Envio Incapacidad Fisica': 'Fecha_de_Envio_Incapacidad_Fisica',
  };
  codigoDiagnosticoControl = new FormControl();
  epsControlForm = new FormControl();
  IpsControlForm = new FormControl();
  filteredCodigos: Observable<string[]>;
  filteredEps: Observable<string[]>;
  allIps: { nit: string, nombre: string }[] = [];
  allCodigosDiagnostico: { codigo: string, descripcion: string }[] = [];
  epsnombres: { nombre: string }[] = []
  isSubmitButtonDisabled = false;
  ipsControlNit = new FormControl();
  ipsControlNombre = new FormControl();
  filteredIpsNit: Observable<string[]>;
  filteredIpsNombre: Observable<string[]>;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private router: Router, private incapacidadService: IncapacidadService, private contratacionService: ContratacionService) {
    const formGroupConfig: { [key: string]: any } = this.fields.reduce((acc, field) => {
      const formControlName = this.fieldMap[field];

      // Hacer que "Celular o telefono 02" no sea obligatorio
      if (formControlName === 'celular_o_telefono_02') {
        acc[formControlName] = ['']; // No se agrega Validators.required
      } else {
        acc[formControlName] = ['', Validators.required]; // Todos los demás campos son obligatorios
      }

      return acc;
    }, {} as { [key: string]: any });

    this.incapacidadService.traerDatosListas().subscribe(
      response => {
        // Transformar 'ips' para usar 'nombreips' en lugar de 'nombre'
        this.allIps = response.IPSNames.map((item: { nit: string, nombreips: string }) => ({
          nit: item.nit,
          nombre: item.nombreips
        }));
        // Asignar directamente 'codigosDiagnostico' y 'epsnombres'
        this.allCodigosDiagnostico = response.codigos.map((item: { codigo: string, descripcion: string }) => ({
          codigo: item.codigo,
          descripcion: item.descripcion
        }));
        this.epsnombres = response.eps.map((item: { nombreeps: string }) => ({

          nombre: item.nombreeps
        }));
        console.log(this.epsnombres)
        this.setupIPSFilters();
        this.setupCodigoFilters();
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar la información necesaria para el formulario'
        });
      }
    );

    this.incapacidadForm = this.fb.group(formGroupConfig);
    this.incapacidadForm.get('genero')?.disable();
    this.incapacidadForm.get('primer_apellido')?.disable();
    this.incapacidadForm.get('primer_nombre')?.disable();
    this.incapacidadForm.get('tipodedocumento')?.disable();
    this.incapacidadForm.get('numerodeceduladepersona')?.disable();
    this.incapacidadForm.get('temporal')?.disable();
    this.incapacidadForm.get('numero_de_contrato')?.disable();
    this.incapacidadForm.get('edad')?.disable();
    this.incapacidadForm.get('empresa')?.disable();
    this.incapacidadForm.get('Centro_de_costo')?.disable();
    this.incapacidadForm.get('fecha_contratacion')?.disable();
    this.incapacidadForm.get('fondo_de_pension')?.disable();
    this.incapacidadForm.get('fecha_fin_incapacidad')?.valueChanges.subscribe(() => {
      this.calcularDiasIncapacidad();
    });
    this.incapacidadForm.get('Fecha_de_Envio_Incapacidad_Fisica')?.valueChanges.subscribe(() => {
      this.calcularDiferenciaDias();
    });
    this.incapacidadForm.get('prorroga')?.valueChanges.subscribe(() => {
      this.calcularprorroga();
    });
    this.incapacidadForm.get('estado_incapacidad')?.valueChanges.subscribe(() => {
      if (this.incapacidadForm.get('estado_incapacidad')?.value == 'Falsa') {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se puede crear una incapacidad falsa'
        });
      }
    });
    this.filteredEps = this.epsControlForm.valueChanges.pipe(
      startWith(''),
      map(value => this._filterEps(value
      ))
    );

    this.filteredCodigos = this.codigoDiagnosticoControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.filteredIpsNombre = this.ipsControlNombre.valueChanges.pipe(
      startWith(''),
      map(value => this._filterNombre(value || ''))
    );
    this.filteredIpsNit = this.ipsControlNombre.valueChanges.pipe(
      startWith(''),
      map(value => this._filterNit(value || ''))
    );

    // Suscribirse a los cambios en los campos del formulario
    this.incapacidadForm.valueChanges.subscribe((formData) => {
      // Verificar si la sección está activa y si hay algo escrito en los campos relevantes
      if (this.isIncapacidadSectionActive(formData)) {
        // Realizar la validación utilizando el validador
        this.validationErrors = IncapacidadValidator.validateConditions(formData);

        // Verificar si hay errores de validación
        if (this.validationErrors.length > 0) {
          // Verificar si el error específico está presente

        } else {
          this.isSubmitButtonDisabled = false; // Habilitar el botón si no hay errores
        }
      } else {
        this.isSubmitButtonDisabled = false; // Habilitar el botón si la sección no está activa
      }
    });

  }
  private setupIPSFilters() {
    this.filteredIpsNit = this.ipsControlNit.valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      map(value => this._filterNit(value || ''))
    );

    this.filteredIpsNombre = this.ipsControlNombre.valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      map(value => this._filterNombre(value || ''))
    );

    // Actualizar Nombre cuando se selecciona un NIT
    this.ipsControlNit.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      const selected = this.allIps.find(item => item.nit === value);
      if (selected) {
        this.ipsControlNombre.setValue(selected.nombre, { emitEvent: false });
        this.incapacidadForm.get('ips_punto_de_atencion')?.setValue(selected.nombre);
        this.incapacidadForm.get('nit_de_la_IPS')?.setValue(selected.nit);
      }
    });

    // Actualizar NIT cuando se selecciona un Nombre
    this.ipsControlNombre.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      const selected = this.allIps.find(item => item.nombre === value);
      if (selected) {
        this.ipsControlNit.setValue(selected.nit, { emitEvent: false });
        this.incapacidadForm.get('ips_punto_de_atencion')?.setValue(selected.nombre);
        this.incapacidadForm.get('nit_de_la_IPS')?.setValue(selected.nit);
      }
    });
  }

  private setupCodigoFilters() {

    this.filteredCodigos = this.codigoDiagnosticoControl.valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      map(value => this._filter(value || ''))
    );
    this.filteredEps = this.epsControlForm.valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      map(value => this._filterEps(value || ''))
    );

    this.codigoControl.valueChanges.subscribe(value => {
      const selected = this.allCodigosDiagnostico.find(item => item.codigo === value);
      this.descripcionControl.setValue(selected ? selected.descripcion : '');

      const descripcion = selected ? selected.descripcion : '';
      const codigo = selected ? selected.codigo : '';
      const textoSinDescripcion = descripcion.replace(/^descripcion:\s*/i, '');
      this.incapacidadForm.get('descripcion_diagnostico')?.setValue(textoSinDescripcion);
      this.incapacidadForm.get('codigo_diagnostico')?.setValue(codigo)
    });
    this.epsControlForm.valueChanges.subscribe(value => {
      const selected = this.epsnombres.find(item => item.nombre === value);
      this.incapacidadForm.get('nombre_eps')?.setValue(selected ? selected.nombre : '');
    });
  }
  private calcularDiferenciaDias() {
    const actualDate = new Date();
    const fechaEnvio = new Date(this.incapacidadForm.get('Fecha_de_Envio_Incapacidad_Fisica')?.value);

    if (fechaEnvio && actualDate) {
      // Convertir las fechas a medianoche para evitar problemas con horas y minutos
      const actualDateMidnight = new Date(actualDate.getFullYear(), actualDate.getMonth(), actualDate.getDate());
      const fechaEnvioMidnight = new Date(fechaEnvio.getFullYear(), fechaEnvio.getMonth(), fechaEnvio.getDate());

      // Calcular la diferencia en tiempo
      const diferenciaEnTiempo = fechaEnvioMidnight.getTime() - actualDateMidnight.getTime();

      // Calcular la diferencia en días
      const diasDeDiferencia = Math.ceil(diferenciaEnTiempo / (1000 * 3600 * 24));

      // Siempre sumar 1 para incluir ambos días, el de inicio y el de fin
      const diasDeIncapacidad = diasDeDiferencia + 1;

      // Asegurarse de que no se calcule un número negativo
      const diasDiferenciaPositivo = Math.max(diasDeIncapacidad, 0);

      this.incapacidadForm.get('dias_de_diferencia')?.setValue(diasDiferenciaPositivo);
    }
  }
  // Método para verificar si los campos relevantes están llenos
  private areRelevantFieldsFilled(formData: any): boolean {
    // Función auxiliar para verificar si un campo está vacío, nulo o indefinido
    const isFieldEmpty = (field: any) => {
      return field === null || field === undefined || field === '';
    };

    // Verifica si los campos principales tienen algún valor
    if (isFieldEmpty(formData.fecha_inicio_incapacidad)) {
      return false;
    }

    if (isFieldEmpty(formData.fecha_fin_incapacidad)) {
      return false;
    }

    if (isFieldEmpty(formData.codigo_diagnostico)) {
      return false;
    }

    if (isFieldEmpty(formData.fecha_contratacion)) {
      return false;
    }

    if (isFieldEmpty(formData.dias_incapacidad)) {
      return false;
    }

    if (isFieldEmpty(formData.dias_de_diferencia)) {
      return false;
    }

    if (isFieldEmpty(formData.dias_eps)) {
      return false;
    }

    if (isFieldEmpty(formData.prorroga)) {
      return false;
    }

    if (isFieldEmpty(formData.estado_incapacidad)) {
      return false;
    }

    if (isFieldEmpty(formData.Dias_temporal)) {
      return false;
    }

    if (isFieldEmpty(formData.Incapacidad_transcrita)) {
      return false;
    }

    if (isFieldEmpty(formData.descripcion_diagnostico)) {
      return false;
    }

    // Si todos los campos tienen valores, entonces devolver true
    return true;
  }
  calcularprorroga() {
    if (this.incapacidadForm.get('prorroga')?.value == 'SI') {
      const diasincapacidad = this.incapacidadForm.get('dias_incapacidad')?.value
      this.incapacidadForm.get('dias_eps')?.setValue(diasincapacidad);
      this.incapacidadForm.get('Dias_temporal')?.setValue(0);
      this.incapacidadForm.get('dias_incapacidad')?.setValue(diasincapacidad);
    }
    if (this.incapacidadForm.get('prorroga')?.value == 'NO') {
      this.calcularDiasIncapacidad()
    }

  }
  calcularDiasIncapacidad() {
    const fechaInicio = new Date(this.incapacidadForm.get('fecha_inicio_incapacidad')?.value);
    const fechaFin = new Date(this.incapacidadForm.get('fecha_fin_incapacidad')?.value);

    if (fechaInicio && fechaFin) {
      // Convertir fechas a medianoche para evitar problemas con horas
      const fechaInicioMidnight = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), fechaInicio.getDate());
      const fechaFinMidnight = new Date(fechaFin.getFullYear(), fechaFin.getMonth(), fechaFin.getDate());

      // Calcular la diferencia en tiempo
      const diferenciaEnTiempo = fechaFinMidnight.getTime() - fechaInicioMidnight.getTime();

      // Calcular los días de incapacidad, sumando 1 para incluir ambos días de inicio y fin
      const diasIncapacidad = Math.ceil(diferenciaEnTiempo / (1000 * 3600 * 24)) + 1;

      // Asegurarse de que el valor no sea negativo
      const diasIncapacidadPositivos = Math.max(diasIncapacidad, 0);

      // Establecer el valor de los días de incapacidad en el formulario
      this.incapacidadForm.get('dias_incapacidad')?.setValue(diasIncapacidadPositivos);

      // Calcular los días de incapacidad cubiertos por la EPS
      const diasEps = diasIncapacidadPositivos - 2;

      if (diasEps < 0) {
        this.incapacidadForm.get('dias_eps')?.setValue(0);
        this.incapacidadForm.get('Dias_temporal')?.setValue(diasIncapacidadPositivos);
        this.incapacidadForm.get('dias_incapacidad')?.setValue(diasIncapacidadPositivos);
        return;
      } else {
        this.incapacidadForm.get('dias_eps')?.setValue(diasEps);
        this.incapacidadForm.get('Dias_temporal')?.setValue(2);
        this.incapacidadForm.get('dias_incapacidad')?.setValue(diasIncapacidadPositivos);
        return;
      }
    }
  }

  private isUpdating = false;

  codigoControl = new FormControl();
  private ipsMapByNit = new Map<string, string>();
  private ipsMapByNombre = new Map<string, string>();
  descripcionControl = new FormControl({ value: '', disabled: true });
  nombreControl = new FormControl({ value: '', disabled: true });
  validationErrors: string[] = [];
  ngOnInit(): void {
    this.allIps.forEach(item => {
      this.ipsMapByNit.set(item.nit, item.nombre);
      this.ipsMapByNombre.set(item.nombre, item.nit);
    });


    this.allCodigosDiagnostico.forEach(item => {
      this.codigoControl.setValue(item.codigo);
      this.descripcionControl.setValue(item.descripcion);
    });

    // Inicializar los arrays de autocompletar filtrados con debounceTime para reducir la carga de búsqueda
    this.filteredIpsNit = this.ipsControlNit.valueChanges.pipe(
      startWith(''),
      map(value => this._filterNit(value || ''))
    );

    this.filteredIpsNombre = this.ipsControlNombre.valueChanges.pipe(
      startWith(''),
      map(value => this._filterNombre(value || ''))
    );
    this.filteredEps = this.epsControlForm.valueChanges.pipe(
      startWith(''),
      map(value => this._filterEps(value || ''))
    );
    this.filteredCodigos = this.codigoDiagnosticoControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
    this.codigoControl.valueChanges.subscribe(value => {
      const selected = this.allCodigosDiagnostico.find(item => item.codigo === value);
      this.descripcionControl.setValue(selected ? selected.descripcion : '');

      const descripcion = selected ? selected.descripcion : '';
      const codigo = selected ? selected.codigo : '';
      const textoSinDescripcion = descripcion.replace(/^descripcion:\s*/i, '');
      this.incapacidadForm.get('descripcion_diagnostico')?.setValue(textoSinDescripcion);
      this.incapacidadForm.get('codigo_diagnostico')?.setValue(codigo)
    });
    this.epsControlForm.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      const selected = this.epsnombres.find(item => item.nombre === value);
      this.incapacidadForm.get('nombre_eps')?.setValue(selected ? selected.nombre : '');
    });


    this.ipsControlNit.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      const selectedNombre = this.ipsMapByNit.get(value);
      if (selectedNombre) {
        this.ipsControlNombre.setValue(selectedNombre, { emitEvent: false });
        this.incapacidadForm.get('ips_punto_de_atencion')?.setValue(selectedNombre);
        this.incapacidadForm.get('nit_de_la_IPS')?.setValue(value);
      }
    });

    // Actualizar NIT cuando se selecciona un Nombre
    this.ipsControlNombre.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      const selectedNit = this.ipsMapByNombre.get(value);
      if (selectedNit) {
        this.ipsControlNit.setValue(selectedNit, { emitEvent: false });
        this.incapacidadForm.get('ips_punto_de_atencion')?.setValue(value);
        this.incapacidadForm.get('nit_de_la_IPS')?.setValue(selectedNit);
      }
    });
  }
  private _filterEps(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.epsnombres
      .map(item => item.nombre)
      .filter(nombre => nombre.toLowerCase().includes(filterValue));
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allCodigosDiagnostico
      .map(item => item.codigo)
      .filter(codigo => codigo.toLowerCase().includes(filterValue));
  }

  private _filterNit(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allIps.map(item => item.nit).filter(nit => nit.toLowerCase().includes(filterValue));
  }

  // Función de filtro para Nombre
  private _filterNombre(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allIps.map(item => item.nombre).filter(nombre => nombre.toLowerCase().includes(filterValue));
  }

  displayIps(ips: { nit: string, nombre: string }): string {
    return ips ? `${ips.nit} - ${ips.nombre}` : '';
  }

  playSound(success: boolean): void {
    const audio = new Audio(success ? 'Sounds/positivo.mp3' : 'Sounds/negativo.mp3');
    audio.play();
  }

  private isIncapacidadSectionActive(formData: any): boolean {
    const fieldsToCheck = [
      this.fieldMap['Fecha inicio incapacidad'],
      this.fieldMap['Fecha de ingreso temporal'],
      this.fieldMap['Fecha fin incapacidad'],
      this.fieldMap['Prorroga'],
      this.fieldMap['Codigo diagnostico'],
      this.fieldMap['Descripcion diagnostico'],
      this.fieldMap['Dias incapacidad'],
      this.fieldMap['Dias temporal'],
      this.fieldMap['Dias eps'],
      this.fieldMap['Estado incapacidad'],
      this.fieldMap['Incapacidad Transcrita'],
      this.fieldMap['Dias de diferencia']
    ];

    // Verificar si al menos uno de los campos en la sección de "Información de Incapacidad" tiene un valor
    return fieldsToCheck.some(field => formData[field] !== null && formData[field] !== '');
  }


  toggleOverlay(visible: boolean): void {
    this.overlayVisible = visible;
  }

  toggleLoader(visible: boolean, showCounter: boolean = false): void {
    this.loaderVisible = visible;
    this.counterVisible = showCounter;
  }
  onSubmit(): void {
    const fechaInicioStr = this.incapacidadForm.get('fecha_inicio_incapacidad')?.value;
    const fechaFinStr = this.incapacidadForm.get('fecha_fin_incapacidad')?.value;
    if (fechaInicioStr && fechaFinStr) {
      // Normalizar las fechas al formato 'dd-MM-yyyy'
      const normalizedStartDate = format(new Date(fechaInicioStr), 'dd-MM-yyyy');
      const normalizedEndDate = format(new Date(fechaFinStr), 'dd-MM-yyyy');

      // Actualizar las fechas normalizadas en el formulario
      this.incapacidadForm.get('fecha_inicio_incapacidad')?.setValue(normalizedStartDate);
      this.incapacidadForm.get('fecha_fin_incapacidad')?.setValue(normalizedEndDate);

      const nuevaIncapacidad: Incapacidad = this.incapacidadForm.value;

      // Verificar si dias_incapacidad es NaN o indefinido y calcular si es necesario
      if (isNaN(nuevaIncapacidad.dias_incapacidad) || nuevaIncapacidad.dias_incapacidad === undefined) {
        const fechaInicio = new Date(fechaInicioStr);
        const fechaFin = new Date(fechaFinStr);

        // Asegurarse de que ambas fechas sean válidas
        if (!isNaN(fechaInicio.getTime()) && !isNaN(fechaFin.getTime())) {
          const diferenciaEnTiempo = fechaFin.getTime() - fechaInicio.getTime();
          const diasIncapacidad = Math.ceil(diferenciaEnTiempo / (1000 * 3600 * 24));
          nuevaIncapacidad.dias_incapacidad = diasIncapacidad;
        } else {
          //console.error('Fechas inválidas: No se puede calcular días de incapacidad');
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ha ocurrido un error con las fechas que ingresaste, por favor verfica que esten bien'
          });
        }
      }

      this.incapacidadService.createIncapacidad(nuevaIncapacidad).subscribe(
        response => {
          console.log('Incapacidad creada', response);
          Swal.fire({
            icon: 'success',
            title: 'Incapacidad creada',
            text: 'La incapacidad ha sido creada exitosamente'
          });
          this.incapacidadForm.reset();
          this.router.navigate(['/busqueda-incapacidades']);
        },
        error => {
          //console.error('Error al crear la incapacidad', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ha ocurrido un error al crear la incapacidad'
          });
        }
      );

      // Aquí puedes continuar con la lógica para enviar la nueva incapacidad, etc.
    } else {
      //console.error('Fechas no disponibles: No se puede normalizar o calcular días de incapacidad');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ha ocurrido un error con las fechas que ingresaste, por favor verfica que esten bien'
      });
    }

  }
  [key: string]: any;
  sucursalde = ''
  nombredequienrecibio = ''
  empresa = ''
  buscarCedula(cedula: string): void {

    this.cedula = cedula;
    this.toggleLoader(true);

    const storedData = localStorage.getItem('user');

    if (storedData) {
      // Parsea el JSON a un objeto JavaScript
      const dataObject = JSON.parse(storedData);

      // Extrae el valor de `sucursalde`
      this.sucursalde = dataObject.sucursalde;
      this.nombredequienrecibio = dataObject.primer_apellido + ' ' + dataObject.primer_nombre;
      this.empresa = dataObject.sitio_contratacion;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ha ocurrido un error al buscar tus datos, cierra la sesion y vuelve a ingresar'
      });
    }
    this.contratacionService.traerDatosEncontratacion(cedula).subscribe(
      response => {
        this.toggleLoader(false);

        // Acceder a los sub-objetos dentro de la respuesta
        const contratacion = response.contratacion || {};
        const datosBasicos = response.datos_basicos || {};
        const afp = response.afp


        // Iterar sobre el fieldMap y asignar los valores en los controles del formulario
        for (const key in this.fieldMap) {
          let value;

          // Verificar si la clave existe en contratacion o datos_basicos
          if (contratacion[key]) {
            value = contratacion[key];
          } else if (datosBasicos[key]) {
            value = datosBasicos[key];
          }

          if (datosBasicos.tipodedocumento == 'CC' || datosBasicos.tipodedocumento == 'C.C') {
            datosBasicos.tipodedocumento = 'Cedula de ciudadania';
          } else {
            if (datosBasicos.tipodedocumento == 'CE' || datosBasicos.tipodedocumento == 'C.E') {
              datosBasicos.tipodedocumento = 'Cedula de extranjeria';
            } else {
              if (datosBasicos.tipodedocumento == 'PA' || datosBasicos.tipodedocumento == 'P.A') {
                datosBasicos.tipodedocumento = 'Pasaporte';
              }
            }
          }
          if (datosBasicos.genero == 'M') {
            datosBasicos.genero = 'Masculino';
          }
          if (datosBasicos.genero == 'F') {
            datosBasicos.genero = 'Femenino';
          }
          this.incapacidadForm.get('nombre_eps')?.setValue(afp.eps);
          this.incapacidadForm.patchValue({
            'Centro_de_costos': contratacion.centro_costo_carnet,
            'Centro_de_costo': contratacion.centro_de_costos,
            'nombre_eps': afp.eps,
            'fecha_contratacion': contratacion.fecha_contratacion,
            'fondo_de_pension': afp.afc,
            'temporal': contratacion.temporal,
            'numero_de_contrato': contratacion.codigo_contrato,
            'Oficina': this.sucursalde,
            'nombre_de_quien_recibio': this.nombredequienrecibio,
            'empresa': contratacion.centro_de_costos,
            'celular': datosBasicos.celular,
            'tipodedocumento': datosBasicos.tipodedocumento,


            'numerodeceduladepersona': datosBasicos.numerodeceduladepersona,
            'primer_nombre': datosBasicos.primer_nombre,
            'primer_apellido': datosBasicos.primer_apellido,
            'edad': datosBasicos.edadTrabajador,
            'primercorreoelectronico': datosBasicos.primercorreoelectronico,
            'genero': datosBasicos.genero,


            // y así sucesivamente para todos los campos...
          });
        }
      },
      error => {
        this.toggleLoader(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ha ocurrido un error al buscar la cédula'
        });
      }
    );
  }
  onUploadClick(field: string) {
    // Crear un input de tipo file programáticamente
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';

    // Agregar evento para manejar la selección de archivo
    fileInput.onchange = (event: any) => {
      const file: File = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          this.incapacidadForm.get(this.fieldMap[field])?.setValue(base64);
        };
        reader.readAsDataURL(file);
      }
    };

    // Simular clic para abrir el diálogo de archivos
    fileInput.click();
  }

  getFieldType(field: string): string {
    if (field === 'Correo Electronico') {
      return 'email';
    } else if (field === 'Marca Temporal' || field === 'Fecha_de_Envio_Incapacidad_Fisica' || field === 'fecha_inicio_incapacidad') {
      return 'date';
    } else if (field === 'Edad' || field === 'dias_incapacidad' || field === 'Dias_temporal' || field === 'dias_eps' || field === 'dias_de_diferencia') {
      return 'number';
    } else if (field === 'Sexo' || field === 'Tipo de documento') {
      return 'select';
    }
    else {
      return 'text';
    }
  }


  sexos: string[] = ['Masculino', 'Femenino'];
  Prorroga: string[] = ['SI', 'NO'];
  tiposDocumento: string[] = ['Cedula de ciudadania', 'Cedula de extranjeria', 'Pasaporte'];
  tiposDocumentoDoctor: string[] = ['Cedula de ciudadania', 'Cedula de extranjeria', 'Pasaporte', 'Tarjeta de identidad'];
  tiposincapacidad: string[] = ['ENFERMEDAD GENERAL', 'LICENCIA DE MATERNIDAD', 'LICENCIA PATERNIDAD', 'ACCIDENTE DE TRABAJO', 'SOAT / ACCIDENTE DE TRANCITO', 'ENFERMEDAD LABORAL']
  estadoincapacidad: string[] = ['Original', 'Copia', 'Falsa'];
  centrodecosto: string[] = ['Andes',
    'Cartagenita',
    'Facatativa Principal',
    'Facatativa Primera',
    'Fontibon',
    'Funza',
    'Ipanema',
    'Madrid',
    'MonteVerde',
    'Rosal',
    'Soacha',
    'Suba',
    'Tocancipa',
    'Bosa']


  getOptions(field: string): string[] {
    switch (field) {
      case 'Sexo':
        return this.sexos;
      case 'Tipo de documento':
        return this.tiposDocumento;
      case 'Tipo de documento doctor atendido':
        return this.tiposDocumentoDoctor;
      default:
        return [];
    }
  }

  validateForm(): boolean {
    let isValid = true;

    // Loop through each key in the fieldMap to validate each form control
    for (let key in this.fieldMap) {
      const controlName = this.fieldMap[key];
      const control = this.incapacidadForm.get(controlName);

      // Example validation rules (these can be customized as needed)
      if (control) {
        // Check if the control is required and empty
        if (controlName === 'Oficina' || controlName === 'nombre_de_quien_recibio') {
          if (!control.value || control.value.trim() === '') {
            control.setErrors({ required: true });
            isValid = false;
          }
        }

        // Check if a field has a minimum or maximum length
        if (controlName === 'numerodeceduladepersona') {
          if (control.value && control.value.length !== 10) {  // Example: cedula must be 10 digits
            control.setErrors({ length: true });
            isValid = false;
          }
        }

        // Additional custom validations can be added here based on your needs
      }
    }

    return isValid;
  }
  clearErrors() {
    this.validationErrors = [];
  }
}
