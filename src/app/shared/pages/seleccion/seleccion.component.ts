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
import { catchError, elementAt, forkJoin, of } from 'rxjs';
import { LeerInfoCandidatoComponent } from '../../components/leer-info-candidato/leer-info-candidato.component';
import { MatDialog } from '@angular/material/dialog';
import { VacantesService } from '../../services/vacantes/vacantes.service';
import { MatMenuModule } from '@angular/material/menu';
import { SeleccionService } from '../../services/seleccion/seleccion.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { GestionDocumentalService } from '../../services/gestion-documental/gestion-documental.service';

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
  infoGeneralC: any;
  vacantes: any[] = [];
  sede: string = '';
  sedeLogin: string = '';
  // Formularios 
  formGroup1: FormGroup;
  formGroup2: FormGroup;
  formGroup3: FormGroup;
  formGroup4: FormGroup;
  filtro: string = '';
  procesoValido: boolean = false;
  infoPersonalForm: FormGroup;
  entrevistaForm: FormGroup;
  observacionesForm: FormGroup;
  vacantesForm: FormGroup;

  // Mapeo de campos a sus correspondientes tags
  tagsMap: { [key: string]: number[] } = {
    afp: [3],
    eps: [3],
    policivos: [3],
    procuraduria: [3],
    contraloria: [3],
    medidasCorrectivas: [3],
    ramaJudicial: [3]
  };

  typeMap: { [key: string]: number } = {
    afp: 5,
    eps: 6,
    policivos: 8,
    procuraduria: 9,
    contraloria: 10,
    medidasCorrectivas: 11,
    ramaJudicial: 12
  };

  uploadedFiles: { [key: string]: { file: File, fileName: string } } = {}; // Almacenar tanto el archivo como el nombre


  epsList: string[] = [
    'ALIANSALUD',
    'ASMET SALUD',
    'CAJACOPI',
    'CAPITAL SALUD',
    'CAPRESOCA',
    'COMFAMILIARHUILA',
    'COMFAORIENTE',
    'COMPENSAR',
    'COOSALUD',
    'DUSAKAWI',
    'ECOOPSOS',
    'FAMISANAR',
    'FAMILIAR DE COLOMBIA',
    'MUTUAL SER',
    'NUEVA EPS',
    'PIJAOS SALUD',
    'SALUD TOTAL',
    'SANITAS',
    'SAVIA SALUD',
    'SOS',
    'SURA',
    'No Tiene',
    'Sin Buscar',
  ];

  afpList: string[] = [
    'PORVENIR',
    'COLFONDOS',
    'PROTECCION',
    'COLPENSIONES'
  ];

  antecedentesEstados: string[] = [
    'Cumple',
    'No Cumple',
    'Sin Buscar'
  ];

  public isMenuVisible = true;

  // Método para manejar el evento del menú
  onMenuToggle(isMenuVisible: boolean): void {
    this.isMenuVisible = isMenuVisible;
  }

  constructor(
    private fb: FormBuilder,
    private contratacionService: ContratacionService,
    public dialog: MatDialog,
    private vacantesService: VacantesService,
    private seleccionService: SeleccionService,
    private gestionDocumentalService: GestionDocumentalService
  ) {
    this.formGroup1 = this.fb.group({
      eps: [''],
      afp: [''],
      policivos: [''],
      procuraduria: [''],
      contraloria: [''],
      ramaJudicial: [''],
      medidasCorrectivas: [''],
      area_aplica: ['']
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
      fechaIngreso: [null],      
      salario: [''],
      auxTransporte: [''],
      rodamiento: [''],
      auxMovilidad: [''],
      bonificacion: ['']
    });


    // forms de ayuda 

    // Inicializamos cada FormGroup de manera independiente
    this.infoPersonalForm = this.fb.group({
      oficina: [{ value: '', disabled: true }],
      tipodedocumento: [{ value: '', disabled: true }],
      numerodecedula: [{ value: '', disabled: true }],
      nombreCompleto: [{ value: '', disabled: true }],
      celular: [''],
      whatsapp: [''],
      genero: [''],
      edad: [{ value: '', disabled: true }],
      fechaNacimiento: [{ value: '', disabled: true }],
      barrio: [''],
      tieneExperienciaFlores: [''],
      referenciado: [''],
      comoSeEntero: ['']
    });

    this.entrevistaForm = this.fb.group({
      presentoEntrevista: [''],
      eps: [''],
      revisionAntecedentes: [''],
      laboresRealizadas: [''],
      empresasLaborado: [''],
      tiempoExperiencia: [''],
      escolaridad: [''],
      numHijos: [''],
      quienLosCuida: ['']
    });

    this.observacionesForm = this.fb.group({
      observacionNovedad: [''],
      observacionEvaluador: ['']
    });

    // Formulario para vacantes
    this.vacantesForm = this.fb.group({
      centroCosto: [{ value: '', disabled: true }],
      cargo: [{ value: '', disabled: true }],
      fechaPruebaEntrevista: [{ value: '', disabled: true }],
      horaPruebaEntrevista: [{ value: '', disabled: true }],
      porQuienPregunta: [''],
      retroalimentacionFinal: ['']
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
        this.sedeLogin = sede;
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
      console.log('Vacante seleccionada:', vacante);
      // imprimir hora de prueba tecnica
      this.formGroup2.patchValue({
        centroCosto: vacante.Localizaciondelavacante || '',
        cargo: vacante.Cargovacante_id || '',
        areaEntrevista: vacante.empresaQueSolicita_id || '',
        fechaPruebaEntrevista: this.formatDate(vacante.fechadePruebatecnica) || '',
        horaPruebaEntrevista: vacante.horadePruebatecnica || '',
        direccionEmpresa: vacante.lugarPrueba || ''
      });

      this.vacantesService.obtenerDetalleLaboral(vacante.Localizaciondelavacante, vacante.finca, vacante.Cargovacante_id).subscribe((response: any) => {
        if (response) {
          console.log('Detalle laboral:', vacante.fechaIngreso);
          
          let valorT = 0;
      
          // Verificar si auxilio_transporte NO es "No" ni "NO"
          if (response.auxilio_transporte === "No" || response.auxilio_transporte === "NO") {
            valorT = 0;
          } else {
            // Verificar si valor_transporte es un número válido
            if (!isNaN(parseFloat(response.valor_transporte))) {
              valorT = parseFloat(response.valor_transporte);
            } 
          }
      
          // Convertir fecha de ingreso (DD/MM/YYYY) a un objeto Date válido
          let fechaIngresoConvertida: Date | null = null;
          if (vacante.fechadeIngreso) {
            const partesFecha = vacante.fechadeIngreso.split('/');
            if (partesFecha.length === 3) {
              const dia = parseInt(partesFecha[0], 10);  // Tomamos el primer valor como día
              const mes = parseInt(partesFecha[1], 10) - 1; // Meses en JavaScript son base 0
              const año = parseInt(partesFecha[2], 10);
              fechaIngresoConvertida = new Date(año, mes, dia);  // Crear el objeto Date con el formato adecuado
            }
          }
      
          this.formGroup4.patchValue({
            empresaUsuaria: vacante.Localizaciondelavacante || '',
            fechaIngreso: fechaIngresoConvertida || null,  // Asegurarse de que se asigne un Date válido
            salario: response.salario || '',
            auxTransporte: valorT,
            rodamiento: response.rodamiento || '',
            auxMovilidad: response.auxMovilidad || '',
            bonificacion: response.bonificacion || ''
          });
        }
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
    if (!this.filtro) return this.vacantes;

    const filtroLower = this.filtro.toLowerCase();
    return this.vacantes.filter(vacante =>
      ['Cargovacante_id', 'localizacionDeLaPersona', 'empresaQueSolicita_id']
        .some(key => vacante[key]?.toLowerCase().includes(filtroLower))
    );
  }


  async buscarCedula() {
    forkJoin({
      seleccion: this.contratacionService.traerDatosSeleccion(this.cedula),
      infoGeneral: this.contratacionService.buscarEncontratacion(this.cedula),
    }).subscribe(
      async ({ seleccion, infoGeneral }) => {
        if (seleccion && seleccion.procesoSeleccion && Array.isArray(seleccion.procesoSeleccion)) {
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

        // Mueve verificarSeleccion aquí para que luego de asignar código de contrato se haga la llamada
        await this.verificarSeleccion();

        await this.infoGeneralCandidato();
        this.procesoValido = true;
      },
      (err) => {
        console.error(err);
        Swal.fire({
          title: 'Atención',
          text: 'No se encontró la cédula ingresada, no ha llenado el formulario, se podrá continuar con el proceso, pero se debe indicar que a la persona que llene el formulario',
          icon: 'warning',
          confirmButtonText: 'Ok'
        });

        // Generar el código de contrato si no se encuentra la cédula
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



  // Obtener el nombre completo
  getFullName(): string {
    const { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido } = this.infoGeneralC || {};
    return `${primer_nombre || ''} ${segundo_nombre || ''} ${primer_apellido || ''} ${segundo_apellido || ''}`.trim();
  }

  // Convertir un número de días en una fecha válida (basado en el 1 de enero de 1900)
  convertirAFecha(fecha: string): Date | null {
    // Si la fecha es un número de días (solo contiene dígitos)
    if (/^\d+$/.test(fecha)) {
      const diasDesde1900 = Number(fecha);
      const fechaBase = new Date(1900, 0, 1); // 1 de enero de 1900
      fechaBase.setDate(fechaBase.getDate() + diasDesde1900);

      if (isNaN(fechaBase.getTime())) {
        return null;
      }

      return fechaBase;

      // Si la fecha está en formato "DD/MM/YYYY"
    } else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(fecha)) {
      const [dia, mes, anio] = fecha.split('/').map(Number);
      if (!dia || !mes || !anio) {
        return null;
      }

      const fechaValida = new Date(anio, mes - 1, dia);

      if (isNaN(fechaValida.getTime())) {
        return null;
      }

      return fechaValida;

    } else {
      return null;
    }
  }

  // Calcular edad a partir del número de días desde 1 de enero de 1900
  calcularEdad(fecha: string): number {
    const fechaNacimiento = this.convertirAFecha(fecha);
    if (!fechaNacimiento) {
      return NaN; // Si la fecha no es válida
    }

    const today = new Date();
    let age = today.getFullYear() - fechaNacimiento.getFullYear();

    // Restar un año si aún no ha pasado el cumpleaños este año
    const monthDiff = today.getMonth() - fechaNacimiento.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < fechaNacimiento.getDate())) {
      age--;
    }
    return age;
  }

  async infoGeneralCandidato() {
    if (this.infoGeneralC) {
      // Llenar el formulario de Info Personal con los datos de this.infoGeneralC
      this.infoPersonalForm.patchValue({
        oficina: this.sedeLogin || 'No disponible',
        tipodedocumento: this.infoGeneralC.tipodedocumento || 'No disponible',
        numerodecedula: this.infoGeneralC.numerodeceduladepersona || 'No disponible',
        nombreCompleto: this.getFullName(),
        celular: this.infoGeneralC.celular || '',
        whatsapp: this.infoGeneralC.whatsapp || '',
        genero: this.infoGeneralC.genero || '',
        edad: this.calcularEdad(this.infoGeneralC.fecha_nacimiento) || '',
        fechaNacimiento: this.convertirAFecha(this.infoGeneralC.fecha_nacimiento),
        barrio: this.infoGeneralC.barrio || '',
        tieneExperienciaFlores: this.infoGeneralC.tiene_experiencia_laboral || '',
        referenciado: this.infoGeneralC.referenciado || '',
        comoSeEntero: this.infoGeneralC.como_se_entero || ''
      });

      // Llenar el formulario de Entrevista con los datos de this.infoGeneralC
      this.entrevistaForm.patchValue({
        presentoEntrevista: this.infoGeneralC.presento_entrevista || '',
        eps: this.infoGeneralC.eps || '',
        revisionAntecedentes: this.infoGeneralC.revision_antecedentes || '',
        laboresRealizadas: this.infoGeneralC.labores_realizadas || '',
        empresasLaborado: this.infoGeneralC.empresas_laborado || '',
        tiempoExperiencia: this.infoGeneralC.tiempo_experiencia || '',
        escolaridad: this.infoGeneralC.escolaridad || '',
        numHijos: this.infoGeneralC.num_hijos_dependen_economicamente || '',
        quienLosCuida: this.infoGeneralC.quien_los_cuida || ''
      });

      // Llenar el formulario de Observaciones con los datos de this.infoGeneralC
      this.observacionesForm.patchValue({
        observacionNovedad: this.infoGeneralC.observacion_novedad || '',
        observacionEvaluador: this.infoGeneralC.observacion_evaluador || ''
      });


    }

    if (this.seleccion) {
      // Llenar el formulario de vacantes con los datos de this.seleccion
      this.vacantesForm.patchValue({
        centroCosto: this.seleccion.centro_costo_entrevista || '',
        cargo: this.seleccion.cargo || '',
        fechaPruebaEntrevista: this.seleccion.fecha_prueba_entrevista || '',
        horaPruebaEntrevista: this.seleccion.hora_prueba_entrevista || '',
        porQuienPregunta: '',  // Campo vacío que debe ser llenado por el usuario
        retroalimentacionFinal: ''  // Campo vacío que debe ser llenado por el usuario
      });
    }
  }

  async verificarSeleccion() {
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

          console.log('Código de contrato:', this.codigoContrato);
          // Ahora que ya se ha asignado this.codigoContrato, puedes llamar a obtenerDocumentosPorTipo
          if (this.codigoContrato) {
            this.gestionDocumentalService.obtenerDocumentosPorTipo(this.cedula, this.codigoContrato, 3)
              .subscribe({
                next: (infoGestionDocumentalAntecedentes: any[]) => {
                  if (infoGestionDocumentalAntecedentes) {
                    console.log('Antecedentes:', infoGestionDocumentalAntecedentes);

                    // Iterar sobre los documentos y mapearlos a los campos correctos
                    infoGestionDocumentalAntecedentes.forEach((documento: any) => {
                      const typeKey = Object.keys(this.typeMap).find(key => this.typeMap[key] === documento.type);
                      if (typeKey) {
                        // Aquí almacenamos el archivo con su URL para visualizarlo luego
                        this.uploadedFiles[typeKey] = {
                          fileName: documento.title,
                          file: documento.file_url // Guardar la URL para acceder al archivo más tarde
                        };
                      }
                    });
                  }
                },
                error: (err: any) => {
                  if (err.error.error === "No se encontraron documentos") {
                    Swal.fire({
                      title: '¡Atención!',
                      text: 'No se encontraron documentos de antecedentes',
                      icon: 'warning',
                      confirmButtonText: 'Ok'
                    });
                  } else {
                    console.error('Error al obtener antecedentes:', err);
                    Swal.fire({
                      title: '¡Error!',
                      text: 'No se pudieron obtener los documentos de antecedentes',
                      icon: 'error',
                      confirmButtonText: 'Ok'
                    });
                  }
                }
              });
          }



          // Llenar los campos del formulario de Datos Generales (formGroup1)
          this.formGroup1.patchValue({
            eps: this.seleccion.eps || '',
            afp: this.seleccion.afp || '',
            policivos: this.seleccion.policivos || '',
            procuraduria: this.seleccion.procuraduria || '',
            contraloria: this.seleccion.contraloria || '',
            ramaJudicial: this.seleccion.rama_judicial || '',
            medidasCorrectivas: this.seleccion.medidas_correctivas || '',
            area_aplica: this.seleccion.area_aplica || ''
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

  verArchivo(campo: string) {
    const archivo = this.uploadedFiles[campo];

    if (archivo && archivo.file) {
      if (archivo.file instanceof File) {
        // Crear una URL temporal para el archivo si es un objeto File
        const fileUrl = URL.createObjectURL(archivo.file);

        // Abrir el archivo en una nueva pestaña
        window.open(fileUrl);

        // Revocar la URL después de que el archivo ha sido abierto para liberar memoria
        setTimeout(() => {
          URL.revokeObjectURL(fileUrl);
        }, 100);
      } else if (typeof archivo.file === 'string') {
        // Si archivo.file es una URL, simplemente ábrela
        window.open(archivo.file);
      }
    } else {
      Swal.fire('Error', 'No se pudo encontrar el archivo para este campo', 'error');
    }
  }






  // Método que se ejecuta cuando se selecciona un archivo
  subirArchivo(event: any, campo: string) {
    const file = event.target.files[0]; // Obtén el archivo seleccionado
    if (file) {
      // Verificar si el nombre del archivo tiene más de 100 caracteres
      if (file.name.length > 100) {
        Swal.fire('Error', 'El nombre del archivo no debe exceder los 100 caracteres', 'error');
        return; // Salir de la función si la validación falla
      }

      // Si la validación es exitosa, almacenar el archivo
      this.uploadedFiles[campo] = { file: file, fileName: file.name }; // Guarda el archivo y el nombre
      //Swal.fire('Archivo subido', `Archivo ${file.name} subido para ${campo}`, 'success');
    }
  }

  // Método para imprimir los datos del formulario y subir todos los archivos
  imprimirVerificacionesAplicacion(): void {
    // Mostrar Swal de cargando
    Swal.fire({
      title: 'Cargando...',
      text: 'Estamos guardando los datos y subiendo los archivos.',
      icon: 'info',
      allowOutsideClick: false,
      showConfirmButton: false, // No mostrar botón hasta que termine el proceso
      willOpen: () => {
        Swal.showLoading(); // Mostrar el indicador de carga
      }
    });

    // Llamar al servicio para guardar los datos del formulario (Parte 1)
    this.seleccionService
      .crearSeleccionParteUnoCandidato(this.formGroup1.value, this.cedula, this.codigoContrato)
      .subscribe(
        (response) => {
          // Si la respuesta es exitosa, proceder a subir los archivos
          this.subirTodosLosArchivos().then((allFilesUploaded) => {
            if (allFilesUploaded) {
              // Cerrar el Swal de carga y mostrar el mensaje de éxito
              Swal.fire({
                title: '¡Éxito!',
                text: 'Datos y archivos guardados exitosamente',
                icon: 'success',
                confirmButtonText: 'Ok'
              });
            }
          }).catch((error) => {
            // Cerrar el Swal de carga y mostrar el mensaje de error en caso de fallo al subir archivos
            Swal.fire({
              title: 'Error',
              text: `Hubo un error al subir los archivos: ${error}`,
              icon: 'error',
              confirmButtonText: 'Ok'
            });
          });
        },
        (error) => {
          // Cerrar el Swal de carga y mostrar el mensaje de error en caso de fallo al guardar los datos
          Swal.fire({
            title: 'Error',
            text: 'Hubo un error al guardar los datos del formulario',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        }
      );
  }



  // Método para subir todos los archivos almacenados en uploadedFiles
  subirTodosLosArchivos(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      console.log('Subiendo archivos...', this.uploadedFiles);
      const totalFiles = Object.keys(this.uploadedFiles).length; // Total de archivos a subir
      let filesUploaded = 0; // Contador de archivos subidos

      Object.keys(this.uploadedFiles).forEach((campo) => {
        const { file, fileName } = this.uploadedFiles[campo]; // Obtén el archivo y su nombre
        const title = fileName; // El título será el nombre del archivo PDF

        // Obtener los tags correspondientes del mapa
        const tags = this.tagsMap[campo] || []; // Si no hay tags definidos para el campo, se usa un array vacío

        // Obtener el tipo correspondiente del mapa
        const type = this.typeMap[campo] || 3; // Si no hay tipo definido para el campo, se usa 3 como valor predeterminado

        // Llamar al servicio para subir cada archivo
        this.gestionDocumentalService
          .guardarDocumento(title, this.cedula, this.codigoContrato, type, tags, file)
          .subscribe(
            (response) => {
              filesUploaded += 1;

              // Si todos los archivos se han subido, resolvemos la promesa
              if (filesUploaded === totalFiles) {
                resolve(true); // Todos los archivos se subieron correctamente
              }
            },
            (error) => {
              console.error(error);
              reject(`Error al subir el archivo para ${campo}`);
            }
          );
      });
    });
  }







  // Método para imprimir los datos de los formularios
  imprimirEntrevistaPrueba(): void {
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
