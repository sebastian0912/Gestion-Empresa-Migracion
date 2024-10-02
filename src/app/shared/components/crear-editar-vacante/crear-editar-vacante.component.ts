import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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

  empresas: any = [];

  vacanteForm: FormGroup;
  oficinas = ['FACATATIVA', 'ROSAL', 'CARTAGENITA', 'MADRID', 'FUNZA', 'SOACHA', 'FONTIBÓN', 'SUBA', 'TOCANCIPÁ', 'BOSA', 'BOGOTÁ', 'OTRA'];
  empresasFiltradas!: Observable<string[]>;
  listacargos: any = [];
  cargosFiltrados!: Observable<any[]>;
  fincas: string[] = [];
  fincasFiltradas!: Observable<string[]>;
  id = null;

  constructor(
    private vacantesService: VacantesService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CrearEditarVacanteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dateAdapter: DateAdapter<any>
  ) {
    this.dateAdapter.setLocale('en-GB');

    this.vacanteForm = this.fb.group({
      empresa: ['', Validators.required],
      finca: ['', Validators.required],
      temporal: ['', Validators.required],
      oficina: this.fb.control([], Validators.required),
      cargos: this.fb.array([this.crearCargo()])
    });

  }

ngOnInit(): void {
    this.dateAdapter.setLocale('en-GB'); // Format date as dd/MM/yyyy
    
    // Cargar sublabores
    this.vacantesService.obtenerSublabores().subscribe((response: any) => {
      this.listacargos = response.sublabores;
      this.cargosFiltrados = of(this.listacargos);  // Inicializa los cargos filtrados con todos los datos al principio
    });

    // Detectar cambios en el campo de "empresa" para actualizar las fincas
    this.vacantesService.obtenerCentrosCostos().subscribe((response: any) => {
      // Almacenar la estructura completa de empresas y fincas
      this.empresas = response;

      // Extraer los nombres de las empresas
      const empresasNombres = Object.keys(response);

      // Inicializar el observable para el filtrado de empresas
      this.empresasFiltradas = this.vacanteForm.get('empresa')!.valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterEmpresas(value, empresasNombres) : empresasNombres.slice())
      );

      // Si se está editando y ya hay una empresa seleccionada, actualizar las fincas de esa empresa
      if (this.data) {
        this.id = this.data.id;

        // Patching company-related fields
        this.vacanteForm.patchValue({
          empresa: this.data.Localizaciondelavacante,
          finca: this.data.finca,
          temporal: this.data.empresaQueSolicita_id,
          oficina: this.data.localizacionDeLaPersona.split(', '),
        });

        // Actualizar las fincas según la empresa seleccionada al cargar los datos
        const empresaSeleccionada = this.data.Localizaciondelavacante;
        if (empresaSeleccionada && this.empresas[empresaSeleccionada]) {
          this.fincas = this.empresas[empresaSeleccionada];
          this.fincasFiltradas = of(this.fincas); // Inicializar las fincas filtradas
        }

        const cargosArray = this.vacanteForm.get('cargos') as FormArray;
        cargosArray.clear(); // Clear previous cargos

        const cargoGroup = this.crearCargo();
        cargoGroup.patchValue({
          cargo: this.data.Cargovacante_id,
          pruebaTecnica: this.capitalizeFirstLetter(this.data.fechadePruebatecnica ? 'Si' : 'No'),
          fechaPrueba: this.convertirStringADate(this.data.fechadePruebatecnica),
          horaPrueba: this.data.horadePruebatecnica,
          lugarPrueba: this.data.lugarPrueba,
          requiereExperiencia: this.data.experiencia,
          numeroPersonas: this.data.numeroDeGenteRequerida,
          observaciones: this.data.observacionVacante,
          fechaIngreso: this.data.fechadeIngreso ? 'Si' : 'No',
          fechaIngresoSeleccionada: this.data.fechadeIngreso ? this.convertirStringADate(this.data.fechadeIngreso) : null,
        });

        cargosArray.push(cargoGroup); // Add cargo to the form array
      }
    });

    // Escuchar cambios en el campo de "empresa" para actualizar las fincas
    this.vacanteForm.get('empresa')!.valueChanges.subscribe((empresaSeleccionada: string) => {
      if (empresaSeleccionada && this.empresas[empresaSeleccionada]) {
        // Actualizar la lista de fincas basada en la empresa seleccionada
        this.fincas = this.empresas[empresaSeleccionada];

        // Inicializar el observable para el filtrado de fincas
        this.fincasFiltradas = this.vacanteForm.get('finca')!.valueChanges.pipe(
          startWith(''),
          map(value => value ? this._filterFincas(value) : this.fincas.slice())
        );
      } else {
        this.fincas = [];
        this.fincasFiltradas = of(this.fincas);  // Limpiar las fincas filtradas si no hay empresa seleccionada
      }
    });
  }




  // Convert date from string "dd/MM/yyyy"
  convertirStringADate(fechaString: string): Date | null {
    if (!fechaString) {
      return null;
    }
    const [day, month, year] = fechaString.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  // Helper function to capitalize the first letter
  capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

  // Convert 24-hour time to 12-hour format with AM/PM
  formatHoraTo12(hora24: string): string {
    if (!hora24) return '';
    let [hour, minute] = hora24.split(':').map(Number);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12; // Convert 24-hour format to 12-hour format
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${ampm}`;
  }

  // Convert 12-hour time back to 24-hour format before sending to the server
  convertirHoraAFormato24(hora12: string): string {
    const [time, modifier] = hora12.split(' ');
    let [hour, minute] = time.split(':').map(Number);

    if (modifier === 'PM' && hour < 12) {
      hour += 12;
    }
    if (modifier === 'AM' && hour === 12) {
      hour = 0;
    }
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }









  get cargos() {
    return this.vacanteForm.get('cargos') as FormArray;
  }

  crearCargo(): FormGroup {
    return this.fb.group({
      cargo: ['', Validators.required],
      pruebaTecnica: ['no'],
      fechaPrueba: [''],
      lugarPrueba: [''],
      fechaIngreso: ['no'],
      horaPrueba: [''],
      fechaIngresoSeleccionada: [''],
      requiereExperiencia: ['no'],
      numeroPersonas: ['', Validators.required],
      observaciones: ['']
    });
  }

  agregarOtroCargo() {
    const cargoGroup = this.crearCargo();
    this.cargos.push(cargoGroup);

    const cargoControl = cargoGroup.get('cargo');
    if (cargoControl) {
      cargoControl.valueChanges.pipe(
        startWith(''),
        map(value => value && value.length >= 1 ? this._filterCargos(value) : [])
      ).subscribe(filteredCargos => {
        this.cargosFiltrados = of(filteredCargos);
      });
    }
  }

  eliminarCargo(index: number) {
    this.cargos.removeAt(index);
  }

  mostrarPruebaTecnica(index: number): boolean {
    return this.cargos.at(index).get('pruebaTecnica')?.value === 'Si';
  }

  mostrarFechaIngreso(index: number): boolean {
    return this.cargos.at(index).get('fechaIngreso')?.value === 'Si';
  }

  onPruebaTecnicaChange(event: any, index: number): void {
    const pruebaTecnica = event.value;
    const control = this.cargos.at(index);
    if (pruebaTecnica === 'si') {
      control.get('fechaPrueba')?.setValidators([Validators.required]);
      control.get('horaPrueba')?.setValidators([Validators.required]);  // Add validation for time
      control.get('lugarPrueba')?.setValidators([Validators.required]);
    } else {
      control.get('fechaPrueba')?.clearValidators();
      control.get('horaPrueba')?.clearValidators();  // Clear validation for time
      control.get('lugarPrueba')?.clearValidators();
    }
    control.get('fechaPrueba')?.updateValueAndValidity();
    control.get('horaPrueba')?.updateValueAndValidity();  // Update validity for time
    control.get('lugarPrueba')?.updateValueAndValidity();
  }


  onFechaIngresoChange(event: any, index: number): void {
    const fechaIngreso = event.value;
    if (fechaIngreso === 'si') {
      this.cargos.at(index).get('fechaIngresoSeleccionada')?.setValidators([Validators.required]);
    } else {
      this.cargos.at(index).get('fechaIngresoSeleccionada')?.clearValidators();
    }
    this.cargos.at(index).get('fechaIngresoSeleccionada')?.updateValueAndValidity();
  }

  guardar(): void {
    if (this.vacanteForm.valid) {
      const formValue = this.vacanteForm.value;

      // Formatear fecha de ingreso
      formValue.cargos.forEach((cargo: any) => {
        if (cargo.fechaIngresoSeleccionada) {
          cargo.fechaIngresoSeleccionada = this.formatDate(cargo.fechaIngresoSeleccionada);
        }
        if (cargo.fechaPrueba) {
          cargo.fechaPrueba = this.formatDate(cargo.fechaPrueba);
        }
      });

      this.dialogRef.close(formValue);
    }
  }


  // Método para formatear la fecha en dd/MM/yyyy
  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses empiezan desde 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }


  
  private _filterCargos(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.listacargos.filter((cargo: any) => cargo.toLowerCase().includes(filterValue));
  }

  private _filterEmpresas(value: string, empresas: string[]): string[] {
    const filterValue = value.toLowerCase();
    return empresas.filter(empresa => empresa.toLowerCase().includes(filterValue));
  }

  private _filterFincas(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.fincas.filter(finca => finca.toLowerCase().includes(filterValue));
  }

}

