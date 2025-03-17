import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { VacantesService } from '../../services/vacantes/vacantes.service';
import { AnyMxRecord } from 'dns';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { AdminService } from '../../services/admin/admin.service';

// Custom date format definition
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',  // Formato que se utilizará para el ingreso de fechas
  },
  display: {
    dateInput: 'DD/MM/YYYY',  // Formato que se mostrará en la UI
    monthYearLabel: 'MMM YYYY',  // Formato de mes/año para la selección de mes
    dateA11yLabel: 'LL',  // Formato accesible para lectores de pantalla
    monthYearA11yLabel: 'MMMM YYYY',  // Formato accesible para la selección de mes/año
  },
};




@Component({
  selector: 'app-crear-editar-vacante',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule
  ],
  templateUrl: './crear-editar-vacante.component.html',
  styleUrls: ['./crear-editar-vacante.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }  // Aplica el formato personalizado
  ],
})


export class CrearEditarVacanteComponent implements OnInit {
  vacanteForm!: FormGroup;
  sedes: any[] = [];
  user: any;
  cargos: string[] = [];
  filteredCargos!: Observable<string[]>;
  centrosCostos: string[] = [];
  filteredCentrosCostos!: Observable<string[]>;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CrearEditarVacanteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private adminService: AdminService,
    private vacantesService: VacantesService
  ) { }

  async ngOnInit(): Promise<void> {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');

    // ✅ Inicializar el formulario
    this.vacanteForm = this.fb.group({
      cargo: ['', Validators.required],
      finca: ['', Validators.required],
      empresaUsuariaSolicita: ['', Validators.required],
      temporal: ['', Validators.required],
      ubicacionPruebaTecnica: [''],
      experiencia: ['', Validators.required],
      presentaPruebaTecnica: ['', Validators.required],
      fechadePruebatecnica: [''],
      horadePruebatecnica: [''],
      observacionVacante: [''],
      tieneFechaIngreso: [''],
      fechadeIngreso: [''],
      descripcion: ['', Validators.required],
      fechaPublicado: [new Date()],
      quienpublicolavacante: [`${this.user.primer_nombre} ${this.user.primer_apellido}`],
      estadovacante: ['Activa'],
      salario: ['1423500', [Validators.required, Validators.min(0)]],
      codigoElite: [''],
      oficinasSeleccionadas: [[]],
      oficinasQueContratan: this.fb.array([])
    });

    // ✅ Cargar lista de cargos
    this.vacantesService.listarCargos().subscribe((cargos: any) => {
      this.cargos = cargos.sublabores || [];
      this.filteredCargos = this.vacanteForm.get('cargo')!.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '', this.cargos))
      );
    });

    // ✅ Cargar lista de centros de costo
    this.vacantesService.listarCentrosCostos().subscribe((response: any) => {
      this.centrosCostos = response.data || [];
      this.filteredCentrosCostos = this.vacanteForm.get('finca')!.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '', this.centrosCostos))
      );
    });

    // ✅ Cargar sucursales
    const sucursalesObservable = await this.adminService.traerSucursales();
    sucursalesObservable.subscribe((sucursales: any) => {
      this.sedes = sucursales.sucursal || [];
    });

    // ✅ Escuchar cambios en oficinas seleccionadas
    this.vacanteForm.get('oficinasSeleccionadas')!.valueChanges.subscribe((seleccionadas: string[]) => {
      this.actualizarOficinasQueContratan(seleccionadas);
    });
  }

  setupFiltering() {
    this.filteredCentrosCostos = this.vacanteForm.get('finca')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '', this.centrosCostos))
    );
  }

  private filterCentros(value: string): string[] {
    const filtro = value.toLowerCase();
    return this.centrosCostos
      ? this.centrosCostos.filter(centro => centro.toLowerCase().includes(filtro))
      : [];
  }


  // ✅ Método genérico para filtrar listas
  private _filter(value: string, list: string[]): string[] {
    const filterValue = value.toLowerCase();
    return list.filter(item => item.toLowerCase().includes(filterValue));
  }

  get oficinasQueContratan(): FormArray {
    return this.vacanteForm.get('oficinasQueContratan') as FormArray;
  }

  onCentroCostoSelected(event: any) {
    const selectedCentro = event.option.value; // Obtener el valor seleccionado
    console.log('Centro de Costo seleccionado:', selectedCentro);

    this.vacantesService.filtrarFinca(selectedCentro).subscribe(response => {
      console.log('Datos filtrados:', response[0]);
      this.vacanteForm.get('empresaUsuariaSolicita')?.setValue(response[0].empresa_usuaria);
      const empresaTemporal = response[0].empresa_temporal; // Debe ser empresa_temporal

      // Lista de opciones válidas
      const opcionesValidas = ["APOYO LABORAL SAS", "TU ALIANZA SAS"];

      // Verificar si el valor recibido está en la lista de opciones permitidas
      if (opcionesValidas.includes(empresaTemporal)) {
        this.vacanteForm.get('temporal')?.setValue(empresaTemporal);
      } else {
        this.vacanteForm.get('temporal')?.setValue(null); // O deja vacío si el valor no es válido
      }
    });
  }

  actualizarOficinasQueContratan(seleccionadas: any[]) {
    const formArray = this.oficinasQueContratan;
    formArray.clear(); // Limpiar antes de agregar nuevas selecciones

    seleccionadas.forEach((sede) => {
      formArray.push(this.fb.group({
        nombre: [sede, Validators.required],
        numeroDeGenteRequerida: [0, Validators.required],
        ruta: [false]
      }));
    });
  }

  formatSalary(event: any) {
    let value = event.target.value.replace(/\D/g, ''); // Elimina caracteres no numéricos
    if (value) {
      event.target.value = new Intl.NumberFormat('es-CO').format(Number(value)); // Formato con separadores
      this.vacanteForm.get('salario')?.setValue(event.target.value, { emitEvent: false });
    }
  }

  onBlur() {
    let value = this.vacanteForm.get('salario')?.value;
    if (value) {
      this.vacanteForm.get('salario')?.setValue(this.formatNumber(value), { emitEvent: false });
    }
  }

  formatNumber(value: string | number): string {
    return new Intl.NumberFormat('es-CO').format(Number(value));
  }



  eliminarOficina(index: number) {
    this.oficinasQueContratan.removeAt(index);
  }

  guardar() {
    if (this.vacanteForm.valid) {
      console.log('Formulario válido:', this.vacanteForm.value);
      this.dialogRef.close(this.vacanteForm.value);
    }
    else {
      console.log('Formulario inválido:', this.vacanteForm);
      // que campos faltan por llenar
      let camposFaltantes = [];
      for (const control in this.vacanteForm.controls) {
        if (this.vacanteForm.get(control)?.invalid) {
          camposFaltantes.push(control);
        }
      }
      console.log('Campos faltantes:', camposFaltantes);
    }
  }

  cancelar() {
    this.dialogRef.close();
  }
}
