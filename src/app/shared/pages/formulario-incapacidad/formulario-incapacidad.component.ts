import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
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
import { Observable, of } from 'rxjs';
import { map, startWith, debounceTime, first } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { NgIf, NgFor, NgSwitch, isPlatformBrowser } from '@angular/common';
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
import { takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatListModule } from '@angular/material/list';
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
    MatListModule,
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
  currentRole: string = '';
  counterVisible = false;
  incapacidadForm: FormGroup = this.fb.group({});
  cedula: string = '';
  fields: string[] = [
    'Oficina', 'Nombre de quien recibio', 'Tipo de documento', 'Numero de documento', 'Temporal del contrato',
    'Numero de contrato', 'Apellido', 'Nombre', 'Edad', 'Sexo', 'Empresa', 'Centro de costo', 'Celular o telefono 01',
    'Celular o telefono 02', 'Correo Electronico', 'Fecha de ingreso temporal', 'Fecha inicio incapacidad', 'Fecha fin incapacidad', 'Tipo incapacidad', 'Codigo diagnostico',
    'Descripcion diagnostico', 'Dias incapacidad', 'Dias temporal', 'Dias eps', 'Nombre eps',
    'Fondo de pensiones', 'Estado incapacidad', 'Prorroga', 'Incapacidad Transcrita', 'Numero de incapacidad',
    'Nit de la IPS', 'IPS punto de atencion', 'Observaciones', 'Tipo de documento doctor atendido', 'Numero de documento doctor',
    'Nombre doctor', 'Estado robot doctor', 'Archivo Incapacidad', 'Historial clinico', 'Dias de diferencia',
    'Fecha de Envio Incapacidad Fisica', 'Centro de costos', 'Vigente', 'A quien corresponde el pago', 'Estado del documento Incapacidad'
  ];
  nombreepspersona: string = '';
  fieldMap: { [key: string]: string } = {
    'Oficina': 'Oficina',
    'Nombre de quien recibio': 'nombre_de_quien_recibio',
    'Tipo de documento': 'tipodedocumento',
    'Numero de documento': 'numerodeceduladepersona',
    'Temporal del contrato': 'temporal_contrato',
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
    'Vigente': 'vigente',
    'Historial clinico': 'historial_clinico',
    'Dias de diferencia': 'dias_de_diferencia',
    'Fecha de Envio Incapacidad Fisica': 'Fecha_de_Envio_Incapacidad_Fisica',
    'A quien corresponde el pago': 'correspondeelpago',
    'Estado del documento Incapacidad': 'estado_documento_incapacidad',
  };
  files: Record<string, File[]> = {
    'Historial clinico': [],
    'Archivo Incapacidad': []
  };
  codigoDiagnosticoControl = new FormControl();
  epsControlForm = new FormControl();
  IpsControlForm = new FormControl();
  filteredCodigos: Observable<string[]> = of([]);
  filteredEps: Observable<string[]> = of([]);
  allIps: { nit: string, nombre: string }[] = [];
  allCodigosDiagnostico: { codigo: string, descripcion: string }[] = [];
  epsnombres: { nombre: string }[] = []
  isSubmitButtonDisabled = false;
  ipsControlNit = new FormControl();
  ipsControlNombre = new FormControl();
  filteredIpsNit: Observable<string[]> = of([]);
  filteredIpsNombre: Observable<string[]> = of([]);
  private unsubscribe$ = new Subject<void>();
  observacionesControl = new FormControl();
  quiencorrespondepagoControl = new FormControl();
  filteredObservaciones: Observable<string[]> = of([]);
  filteredQuiencorrespondepago: Observable<string[]> = of([]);
  nombredelarchvio = ''
  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private router: Router, private incapacidadService: IncapacidadService, private contratacionService: ContratacionService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    // Inicializar el formulario

    this.initializeForm();

    // Cargar datos de listas desde el servicio
    this.loadDataForForm();

    // Configurar filtros y validaciones para el formulario
    this.setupFormFilters();
    this.setupFormValidations();
  }
  private initializeForm(): void {
    // Configuración del formulario utilizando los campos y el mapeo
    const formGroupConfig = this.fields.reduce((acc, field) => {
      const formControlName = this.fieldMap[field];
      acc[formControlName] = formControlName === 'whatsapp' || formControlName === 'vigente' || formControlName === 'observaciones' ? [''] : ['', Validators.required];
      return acc;
    }, {} as { [key: string]: any });

    this.incapacidadForm = this.fb.group(formGroupConfig);

    // Deshabilitar los campos iniciales
    this.disableInitialFields();
  }
  async getUser(): Promise<any> {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }
  private disableInitialFields(): void {
    const fieldsToDisable = [
      'primer_apellido', 'primer_nombre', 'tipodedocumento', 'numerodeceduladepersona',
      'temporal_contrato', 'numero_de_contrato', 'edad', 'empresa', 'Centro_de_costo',
      'fecha_contratacion', 'fondo_de_pension', 'dias_eps', 'dias_incapacidad',
      'Dias_temporal', 'descripcion_diagnostico', 'dias_de_diferencia'
    ];

    fieldsToDisable.forEach(field => this.incapacidadForm.get(field)?.disable());
  }

  private undisableInitialFields(): void {
    const fieldsToDisable = [
      'primer_apellido', 'primer_nombre', 'tipodedocumento', 'numerodeceduladepersona',
      'temporal_contrato', 'numero_de_contrato', 'edad', 'empresa', 'Centro_de_costo',
      'fecha_contratacion', 'fondo_de_pension',
    ];

    fieldsToDisable.forEach(field => this.incapacidadForm.get(field)?.enable());
  }
  private loadDataForForm(): void {
    this.toggleLoader(true, true);
    this.toggleOverlay(true);
    this.incapacidadService.traerDatosListas().subscribe(
      response => {
        // Transformar los datos y asignar a los arreglos
        this.allIps = response.IPSNames.map((item: { nit: string, nombreips: string }) => ({
          nit: item.nit,
          nombre: item.nombreips
        }));
        this.allCodigosDiagnostico = response.codigos.map((item: { codigo: string, descripcion: string }) => ({
          codigo: item.codigo,
          descripcion: item.descripcion
        }));
        this.epsnombres = response.eps.map((item: { nombreeps: string }) => ({
          nombre: item.nombreeps
        }));
        this.setupIPSFilters();
        this.setupCodigoFilters();
        this.toggleLoader(false, false);
        this.toggleOverlay(false);
      },
      error => this.handleServiceError('No se pudo cargar la información necesaria para el formulario')
    );
  }

  private handleServiceError(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message
    });
  }

  private setupFormFilters(): void {
    this.filteredObservaciones = this.observacionesControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterObservaciones(value || ''))
    );
    // Configuración de los filtros para los campos del formulario
    this.filteredEps = this.epsControlForm.valueChanges.pipe(
      startWith(''),
      map(value => this._filterEps(value))
    );

    this.filteredCodigos = this.codigoDiagnosticoControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this.filteredIpsNombre = this.ipsControlNombre.valueChanges.pipe(
      startWith(''),
      map(value => this._filterNombre(value || ''))
    );

    this.filteredIpsNit = this.ipsControlNit.valueChanges.pipe(
      startWith(''),
      map(value => this._filterNit(value || ''))
    );
  }
  observaciones: string = '';
  quienpaga: string = '';
  observacionesincapacidad: string[] = [
    'TRASLAPADA',
    'PRESCRITA',
    'OK',
    'FALSA',
    'SIN EPICRISIS',
    'SIN INCAPACIDAD',
    'MEDICINA PREPAGADA',
    'ILEGIBLE',
    'INCONSISTENTE -, MAS DE 180 DIAS',
    'MAS DE 540 DIAS',
    'FECHAS INCONSISTENTES',
    'LICENCIA DE MATERNIDAD',
    'LICENCIA DE PATERNIDAD',
    'INCAPACIDAD DE 1 DIA ARL',
    'FALTA ORIGINAL',
    'FALTA FURAT',
    'FALTA SOAT',
    'INCAPACIDAD 1 DIA ARL PRORROGA',
    'INCAPACIDAD DE 1 Y 2 DIAS EPS   SI NO ES PROROGA',
    'INCAPACIDAD 1 Y 2 DIAS PRORROGA ',
    'No cumple con el tiempo decreto 780'

  ];
  private _filterObservaciones(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.observacionesincapacidad.filter(option => option.toLowerCase().includes(filterValue));
  }
  private setupFormValidations(): void {
    // Suscripciones a los cambios de valores de los campos del formulario
    this.incapacidadForm.get('fecha_contratacion')?.valueChanges.pipe(
      distinctUntilChanged(),
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      this.applyValidation()
    });
    this.incapacidadForm.get('fecha_inicio_incapacidad')?.valueChanges.pipe(
      distinctUntilChanged(),
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      this.calcularDiasIncapacidad();
      this.calcularprorroga();
      this.applyValidation()
    });
    this.incapacidadForm.get('tipo_incapacidad')?.valueChanges.pipe(distinctUntilChanged(),
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      this.calcularprorroga();
      this.applyValidation();
    });

    this.incapacidadForm.get('fecha_fin_incapacidad')?.valueChanges.pipe(
      distinctUntilChanged(),
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      this.calcularDiasIncapacidad();
      this.calcularprorroga();
    });

    this.incapacidadForm.get('Fecha_de_Envio_Incapacidad_Fisica')?.valueChanges.pipe(
      distinctUntilChanged(),
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      this.calcularDiferenciaDias();
    });

    this.incapacidadForm.get('prorroga')?.valueChanges.pipe(
      distinctUntilChanged(),
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      this.calcularprorroga();
      this.applyValidation();
    });
    this.incapacidadForm.get('observaciones')?.valueChanges.pipe(
      distinctUntilChanged(),
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      this.applyValidation();
    });

    this.incapacidadForm.get('estado_incapacidad')?.valueChanges.pipe(
      distinctUntilChanged(),
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      this.applyValidation();
      if (this.incapacidadForm.get('estado_incapacidad')?.value === 'Falsa') {
        this.handleServiceError('No se puede crear una incapacidad falsa');
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
  applyValidation() {

    console.log('Applying validation');
    const formData = this.incapacidadForm.getRawValue(); // Obtener todos los valores actuales del formulario

    if (this.isIncapacidadSectionActive(formData)) {
      // Desestructuración del objeto devuelto por validateConditions
      const { errors, quienpaga, observaciones } = IncapacidadValidator.validateConditions(formData);

      this.validationErrors = errors;
      this.quienpaga = quienpaga;
      console.log('Quien paga', quienpaga);
      if (observaciones === "No cumple con el tiempo decreto 780 de 2016") {
        this.incapacidadForm.get('observaciones')?.setValue(observaciones, { emitEvent: false });
      }

      // Actualizar el campo de "observaciones" en el formulario
      this.incapacidadForm.get('correspondeelpago')?.setValue(quienpaga, { emitEvent: false });

      // Deshabilitar el botón de envío si hay errores de validación
      this.isSubmitButtonDisabled = this.validationErrors.length > 0;


    } else {
      this.isSubmitButtonDisabled = false; // Habilitar el botón si la sección no está activa
    }
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
    if (isFieldEmpty(formData.Oficina)) {
      return false;
    }
    if (isFieldEmpty(formData.temporal)) {
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
    } if (this.incapacidadForm.get('prorroga')?.value == 'NO' && this.incapacidadForm.get('tipo_incapacidad')?.value == 'ACCIDENTE DE TRABAJO') {
      const diasincapacidad = this.incapacidadForm.get('dias_incapacidad')?.value
      this.incapacidadForm.get('dias_eps')?.setValue(diasincapacidad - 1);
      this.incapacidadForm.get('Dias_temporal')?.setValue(1);
      this.incapacidadForm.get('dias_incapacidad')?.setValue(diasincapacidad);
      this.incapacidadForm.get('nombre_eps')?.setValue('ARL SURA');
    }

    if (this.incapacidadForm.get('prorroga')?.value == 'NO' && this.incapacidadForm.get('tipo_incapacidad')?.value == 'ENFERMEDAD GENERAL') {
      this.calcularDiasIncapacidad();
      this.incapacidadForm.get('nombre_eps')?.setValue(this.nombreepspersona);
    }
    if (this.incapacidadForm.get('prorroga')?.value == 'SI' && this.incapacidadForm.get('tipo_incapacidad')?.value == 'ENFERMEDAD GENERAL') {
      const diasincapacidad = this.incapacidadForm.get('dias_incapacidad')?.value
      this.incapacidadForm.get('nombre_eps')?.setValue(this.nombreepspersona);
      this.incapacidadForm.get('dias_eps')?.setValue(diasincapacidad);
      this.incapacidadForm.get('Dias_temporal')?.setValue(0);
      this.incapacidadForm.get('dias_incapacidad')?.setValue(diasincapacidad);
    } if (this.incapacidadForm.get('prorroga')?.value == 'SI' && this.incapacidadForm.get('tipo_incapacidad')?.value == 'ACCIDENTE DE TRABAJO') {
      const diasincapacidad = this.incapacidadForm.get('dias_incapacidad')?.value
      this.incapacidadForm.get('nombre_eps')?.setValue('ARL SURA');
      this.incapacidadForm.get('dias_eps')?.setValue(diasincapacidad);
      this.incapacidadForm.get('Dias_temporal')?.setValue(0);
      this.incapacidadForm.get('dias_incapacidad')?.setValue(diasincapacidad);
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
  async ngOnInit(): Promise<void> {

    const user = await this.getUser();
    this.currentRole = (user.rol || 'user').toUpperCase().replace(/-/g, '_');
    if (this.currentRole === 'INCAPACIDADADMIN') {
      this.undisableInitialFields();
    }
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
    // Evitar múltiples envíos
    if (!this.areRelevantFieldsFilled(this.incapacidadForm.getRawValue())) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor llena los campos obligatorios'
      });
      return;
    } else {
      this.unsubscribe$.next();
      this.toggleLoader(true, true);
      this.toggleOverlay(true);


      // Asegúrate de habilitar todos los controles antes de enviar
      Object.keys(this.incapacidadForm.controls).forEach((controlName) => {
        this.incapacidadForm.get(controlName)?.enable();
      });

      if (this.incapacidadForm.get('tipodedocumento')?.value == 'Cedula de ciudadania') {
        this.incapacidadForm.get('tipodedocumento')?.setValue('CC');
      }
      if (this.incapacidadForm.get('tipodedocumento')?.value == 'Cedula de extranjeria') {
        this.incapacidadForm.get('tipodedocumento')?.setValue('CE');
      }
      if (this.incapacidadForm.get('tipodedocumento')?.value == 'Pasaporte') {
        this.incapacidadForm.get('tipodedocumento')?.setValue('PA');
      }


      if (this.incapacidadForm.get('tipo_de_documento_doctor_atendido')?.value == 'Cedula de ciudadania') {
        this.incapacidadForm.get('tipo_de_documento_doctor_atendido')?.setValue('CC');
      }
      if (this.incapacidadForm.get('tipo_de_documento_doctor_atendido')?.value == 'Cedula de extranjeria') {
        this.incapacidadForm.get('tipo_de_documento_doctor_atendido')?.setValue('CE');
      }
      if (this.incapacidadForm.get('tipo_de_documento_doctor_atendido')?.value == 'Pasaporte') {
        this.incapacidadForm.get('tipo_de_documento_doctor_atendido')?.setValue('PA');
      }
      const fechaInicioStr = this.incapacidadForm.get('fecha_inicio_incapacidad')?.value;
      const fechaFinStr = this.incapacidadForm.get('fecha_fin_incapacidad')?.value;
      const fechaEnvioStr = this.incapacidadForm.get('Fecha_de_Envio_Incapacidad_Fisica')?.value;

      if (fechaInicioStr && fechaFinStr) {
        // Normalizar las fechas al formato 'dd-MM-yyyy'
        const normalizedStartDate = format(new Date(fechaInicioStr), 'dd-MM-yyyy');
        const normalizedEndDate = format(new Date(fechaFinStr), 'dd-MM-yyyy');
        const normalizedFechaEnvio = format(new Date(fechaEnvioStr), 'dd-MM-yyyy');

        // Actualizar las fechas normalizadas en el formulario
        this.incapacidadForm.patchValue({
          fecha_inicio_incapacidad: normalizedStartDate,
          fecha_fin_incapacidad: normalizedEndDate,
          Fecha_de_Envio_Incapacidad_Fisica: normalizedFechaEnvio,
        });

        const nuevaIncapacidad: Incapacidad = this.incapacidadForm.value;

        if (isNaN(nuevaIncapacidad.dias_incapacidad) || nuevaIncapacidad.dias_incapacidad === undefined) {
          const fechaInicio = new Date(fechaInicioStr);
          const fechaFin = new Date(fechaFinStr);

          if (!isNaN(fechaInicio.getTime()) && !isNaN(fechaFin.getTime())) {
            const diferenciaEnTiempo = fechaFin.getTime() - fechaInicio.getTime();
            const diasIncapacidad = Math.ceil(diferenciaEnTiempo / (1000 * 3600 * 24)) + 1; // Incluye ambos días
            nuevaIncapacidad.dias_incapacidad = diasIncapacidad;
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ha ocurrido un error con las fechas que ingresaste, por favor verifica que estén bien'
            });
            this.toggleLoader(false, false);
            this.toggleOverlay(false);
            return;
          }
        }


        // Envía la incapacidad al servicio
        this.incapacidadService.createIncapacidad(nuevaIncapacidad).pipe(first()).subscribe(
          response => {
            this.toggleLoader(false, false);
            this.toggleOverlay(false);
            Swal.fire({
              icon: 'success',
              title: 'Incapacidad creada',
              text: 'La incapacidad ha sido creada exitosamente'

            }).then(() => {

              this.incapacidadForm.reset();
              for (const key in this.fieldMap) {
                this.incapacidadForm.get(key)?.setValue('');
              }
              this.files = {
                'Historial clinico': [],
                'Archivo Incapacidad': []
              };
              this.validationErrors = [];
              this.isSubmitButtonDisabled = false;
              this.resetPage();
            });

          },
          error => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ha ocurrido un error al crear la incapacidad'
            });
            this.loaderVisible = false;
            this.disableCertainFields();
            this.toggleLoader(false, false);
            this.toggleOverlay(false);
          }
        );

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ha ocurrido un error con las fechas que ingresaste, por favor verifica que estén bien'
        });
        this.loaderVisible = false;
        this.disableCertainFields();
        this.toggleLoader(false, false);
        this.toggleOverlay(false);
      }
    }
  }
  resetPage(): void {
    this.router.navigate(['/formulario-incapacicades']);
  }
  // Método auxiliar para deshabilitar campos específicos
  disableCertainFields(): void {
    this.incapacidadForm.get('genero')?.disable();
    this.incapacidadForm.get('primer_apellido')?.disable();
    this.incapacidadForm.get('primer_nombre')?.disable();
    this.incapacidadForm.get('tipodedocumento')?.disable();
    this.incapacidadForm.get('numerodeceduladepersona')?.disable();
    this.incapacidadForm.get('temporal_contrato')?.disable();
    this.incapacidadForm.get('numero_de_contrato')?.disable();
    this.incapacidadForm.get('edad')?.disable();
    this.incapacidadForm.get('empresa')?.disable();
    this.incapacidadForm.get('Centro_de_costo')?.disable();
    this.incapacidadForm.get('fecha_contratacion')?.disable();
    this.incapacidadForm.get('fondo_de_pension')?.disable();
    this.isSubmitButtonDisabled = false; // Rehabilitar el botón
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
          this.incapacidadForm.get('temporal_contrato')?.setValue(contratacion.temporal);
          this.incapacidadForm.get('numero_de_contrato')?.setValue(contratacion.codigo_contrato);
          this.incapacidadForm.get('Oficina')?.setValue(this.convertToTitleCaseAndRemoveAccents(this.sucursalde));
          this.incapacidadForm.get('nombre_de_quien_recibio')?.setValue(this.nombredequienrecibio);
          this.incapacidadForm.get('empresa')?.setValue(contratacion.empresaUsuaraYCCentrodeCosto);
          this.incapacidadForm.get('celular')?.setValue(datosBasicos.celular);
          this.incapacidadForm.get('tipodedocumento')?.setValue(datosBasicos.tipodedocumento);
          this.incapacidadForm.get('numerodeceduladepersona')?.setValue(cedula);
          this.nombreepspersona = afp.eps;
          this.incapacidadForm.get('primer_nombre')?.setValue(datosBasicos.primer_nombre + ' ' + datosBasicos.segundo_nombre);
          this.incapacidadForm.get('primer_apellido')?.setValue(datosBasicos.primer_apellido + ' ' + datosBasicos.segundo_apellido);
          this.incapacidadForm.get('edad')?.setValue(datosBasicos.edadTrabajador);
          this.incapacidadForm.get('primercorreoelectronico')?.setValue(datosBasicos.primercorreoelectronico);
          this.incapacidadForm.get('genero')?.setValue(datosBasicos.genero);
          this.incapacidadForm.get('Centro_de_costos')?.setValue(contratacion.centro_costo_carnet);
          this.incapacidadForm.get('Centro_de_costo')?.setValue(contratacion.centro_de_costos);
          this.incapacidadForm.get('fecha_contratacion')?.setValue(contratacion.fecha_contratacion);
          this.incapacidadForm.get('fondo_de_pension')?.setValue(afp.afc);

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
          this.addFile(field, file);
          const base64 = reader.result as string;
          this.nombredelarchvio = file.name;
          this.incapacidadForm.get(this.fieldMap[field])?.setValue(base64);
        };
        reader.readAsDataURL(file);
      }
    };

    // Simular clic para abrir el diálogo de archivos
    fileInput.click();
  }

  removeFile(field: string, file: File): void {
    const index = this.files[field].indexOf(file);
    if (index >= 0) {
      this.files[field].splice(index, 1); // Eliminar el archivo de la lista si se encuentra
    }
  }

  addFile(field: string, file: File): void {
    if (!this.files[field]) {
      this.files[field] = [];  // Si el campo no existe, inicializar como un array vacío
    }
    this.files[field].push(file); // Añadir el archivo al campo especificado
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

  estadoincapacidad: string[] = ['Original', 'Falsa', 'Copia']
  centrodecosto: string[] = [
    'Andes',
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
    'Bosa',
    'Bogota']
  vigentelist: string[] = ['Si', 'No']
  convertToTitleCaseAndRemoveAccents(value: string): string {
    if (value === null || value === undefined) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No hay oficina afiliada a tu cuenta, por favor contacta a tu administrador'
      });
      return '';
    } else {
      if (value === 'FACA_PRINCIPAL') {
        value = 'FACATATIVA PRINCIPAL'
      } if (value === 'FACA_CENTRO') {
        value = 'FACATATIVA CENTRO'
      }
      const valueWithoutAccents = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');


      const valueWithSpaces = valueWithoutAccents.replace(/_/g, ' ');

      return valueWithSpaces.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
    }
  }


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
  getFiles(field: string): File[] {
    return this.files[field] || [];
  }
  clearErrors() {
    this.validationErrors = [];
  }
}
