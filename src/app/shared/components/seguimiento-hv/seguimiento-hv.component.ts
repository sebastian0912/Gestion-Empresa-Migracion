import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectChange } from '@angular/material/select';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-seguimiento-hv',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatDatepickerModule,
    MatIconModule,
    MatDialogActions,
    MatDialogContent,
    MatCheckboxModule,
    MatOptionModule,
    MatSelectModule
  ],
  templateUrl: './seguimiento-hv.component.html',
  styleUrls: ['./seguimiento-hv.component.css']
})
export class SeguimientoHvComponent {
  auditForm!: FormGroup;
  data: any;
  otroSalarioMap: { [key: string]: boolean } = {};

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SeguimientoHvComponent>,
    @Inject(MAT_DIALOG_DATA) public datos: any
  ) { 
    this.data = datos;
  }

  ngOnInit(): void {
    if (!this.data) {
      this.data = {};
    }

    this.createForm();
    this.applyConditionalLogic();

    this.auditForm.get('certificado_afp')?.valueChanges.subscribe(value => {
      this.onCertificadoAfpChange(value);
    });

  }

  createForm() {
    this.auditForm = this.fb.group({
      contratos_si: [this.data?.contratos_si || '', Validators.required],
      contratos_no: [this.data?.contratos_no || '', Validators.required],
      numero_de_contrato: [this.data?.numero_de_contrato || '', Validators.required],
      foto: [this.data?.foto || '', Validators.required],      
      fecha_de_ingreso_FT: [this.convertToDate(this.data?.fecha_de_ingreso_FT), Validators.required],
      infolaboral_FT: [this.data?.infolaboral_FT || '', Validators.required],
      firma_trabajador: [this.data?.firma_trabajador || '', Validators.required],
      huella: [this.data?.huella || '', Validators.required],
      referencia: [this.data?.referencia || '', Validators.required],
      empleador_FT: [this.data?.empleador_FT || '', Validators.required],
      ampliada_al_150: [this.data?.ampliada_al_150 || '', Validators.required],
      huellaCedula: [this.data?.huellaCedula || '', Validators.required],
      sello: [this.data?.sello || '', Validators.required],
      legible: [this.data?.legible || '', Validators.required],
      procuraduria_vigente: [this.data?.procuraduria_vigente || '', Validators.required],
      
      fecha_procuraduria: [this.convertToDate(this.data?.fecha_procuraduria), Validators.required],
      contraloria_vigente: [this.data?.contraloria_vigente || '', Validators.required],
      fecha_contraloria: [this.convertToDate(this.data?.fecha_contraloria), Validators.required],
      ofac_lista_clinton: [this.data?.ofac_lista_clinton || '', Validators.required],
      fecha_ofac: [this.convertToDate(this.data?.fecha_ofac), Validators.required],
      policivos_vigente: [this.data?.policivos_vigente || '', Validators.required],
      fecha_policivos: [this.convertToDate(this.data?.fecha_policivos), Validators.required],
      medidas_correstivas: [this.data?.medidas_correstivas || '', Validators.required],
      fecha_medidas_correstivas: [this.data?.fecha_medidas_correstivas || '', Validators.required],
      adres: [this.data?.adres || '', Validators.required],
      fecha_adres: [this.convertToDate(this.data?.fecha_adres), Validators.required],
      sisben: [this.data?.sisben || '', Validators.required],
      fecha_sisben: [this.convertToDate(this.data?.fecha_sisben), Validators.required],
      formatoElite: [this.data?.formatoElite || '', Validators.required],
      cargoElite: [this.data?.cargoElite || '', Validators.required],
      nombres_trabajador_contrato: [this.data?.nombres_trabajador_contrato || '', Validators.required],
      no_cedula_contrato: [this.data?.no_cedula_contrato || '', Validators.required],
      direccion: [this.data?.direccion || '', Validators.required],
      correo_electronico: [this.data?.correo_electronico || '', Validators.required],
      fecha_de_ingreso_contrato: [this.convertToDate(this.data?.fecha_de_ingreso_contrato), Validators.required],
      salario_contrato: [this.data?.salario_contrato || '', Validators.required],
      salario_contrato_otro: [''], // Campo para el valor de "Otro"

      empresa_usuaria: [this.data?.empresa_usuaria || '', Validators.required],
      cargo_contrato: [this.data?.cargo_contrato || '', Validators.required],
      descripcion_temporada: [this.data?.descripcion_temporada || '', Validators.required],
      firma_trabajador_contrato: [this.data?.firma_trabajador_contrato || '', Validators.required],
      firma_testigos: [this.data?.firma_testigos || '', Validators.required],
      sello_temporal: [this.data?.sello_temporal || '', Validators.required],
      autorizacion_dscto_casino: [this.data?.autorizacion_dscto_casino || '', Validators.required],
      forma_de_pago: [this.data?.forma_de_pago || '', Validators.required],
      autorizacion_funerario: [this.data?.autorizacion_funerario || '', Validators.required],
      huellas_docs: [this.data?.huellas_docs || '', Validators.required],
      fecha_de_recibido_docs: [this.convertToDate(this.data?.fecha_de_recibido_docs), Validators.required],
      centro_de_costo_arl: [this.data?.centro_de_costo_arl || '', Validators.required],
      clase_de_riesgo: [this.data?.clase_de_riesgo || '', Validators.required],
      cedula_arl: [this.data?.cedula_arl || '', Validators.required],
      nombre_trabajador_arl: [this.data?.nombre_trabajador_arl || '', Validators.required],
      fecha_de_ingreso_arl:  [this.convertToDate(this.data?.fecha_de_ingreso_arl), Validators.required],
      entrevista_ingreso: [this.data?.entrevista_ingreso || '', Validators.required],
      temporal: [this.data?.temporal || '', Validators.required],
      fecha_no_mayor_a_15_dias: [this.convertToDate(this.data?.fecha_no_mayor_a_15_dias), Validators.required],
      nombres_trabajador_examenes: [this.data?.nombres_trabajador_examenes || '', Validators.required],
      cedula_examenes: [this.data?.cedula_examenes || '', Validators.required],
      cargo: [this.data?.cargo || '', Validators.required],
      apto: [this.data?.apto || '', Validators.required],
      salud_ocupacional: [this.data?.salud_ocupacional || '', Validators.required],
      colinesterasa: [this.data?.colinesterasa || '', Validators.required],
      planilla_colinesterasa: [this.data?.planilla_colinesterasa || '', Validators.required],
      otros: [this.data?.otros || '', Validators.required],
      
      certificado_afp: [this.data?.certificado_afp || '', Validators.required],
      fecha_certificado_afp: [{ value: this.convertToDate(this.data?.fecha_certificado_afp), disabled: true }],
      ruaf: [{ value: this.data?.ruaf || '', disabled: true }],
      nombre_trabajador_ruaf: [{ value: this.data?.nombre_trabajador_ruaf || '', disabled: true }],
      cedula_ruaf: [{ value: this.data?.cedula_ruaf || '', disabled: true }],
      fecha_cerRuaf15menor: [{ value: this.convertToDate(this.data?.fecha_cerRuaf15menor), disabled: true }],
      historia: [this.data?.historia || '', Validators.required],

      fecha_radicado_eps: [this.convertToDate(this.data?.fecha_radicado_eps), Validators.required],
      fecha_ingreso_eps: [this.convertToDate(this.data?.fecha_ingreso_eps), Validators.required],
      nombre_y_cedula_eps: [this.data?.nombre_y_cedula_eps || '', Validators.required],
      salario_eps: [this.data?.salario_eps || '', Validators.required],
      salario_eps_otro: [''], // Campo para el valor de "Otro"

      fecha_radicado_caja: [this.convertToDate(this.data?.fecha_radicado_caja), Validators.required],
      fecha_ingreso_caja : [this.convertToDate(this.data?.fecha_ingreso_caja), Validators.required],
      nombre_y_cedula_caja: [this.data?.nombre_y_cedula_caja || '', Validators.required],
      salario_caja: [this.data?.salario_caja || '', Validators.required],
      salario_caja_otro: [''], // Campo para el valor de "Otro"

      nombre_y_cedula_seguridad: [this.data?.nombre_y_cedula_seguridad || '', Validators.required],
      fecha_radicado_seguridad: [this.convertToDate(this.data?.fecha_radicado_seguridad), Validators.required],

      // Fields for FLORES DE LOS ANDES
      codigo_hoja_de_vida: [this.data?.codigo_hoja_de_vida || '', Validators.required],
      foto_hoja_de_vida: [this.data?.foto_hoja_de_vida || '', Validators.required],
      nombre_y_cedula_hoja_de_vida: [this.data?.nombre_y_cedula_hoja_de_vida || '', Validators.required],
      correo_electronico_hoja_de_vida: [this.data?.correo_electronico_hoja_de_vida || '', Validators.required],
      direccion_hoja_de_vida: [this.data?.direccion_hoja_de_vida || '', Validators.required],
      referencia_hoja_de_vida: [this.data?.referencia_hoja_de_vida || '', Validators.required],
      firma_carnet_hoja_de_vida: [this.data?.firma_carnet_hoja_de_vida || '', Validators.required],
      firma_clausulas_add: [this.data?.firma_clausulas_add || '', Validators.required],
      sello_temporal_clausulas_add: [this.data?.sello_temporal_clausulas_add || '', Validators.required],
      firma_add_contrato: [this.data?.firma_add_contrato || '', Validators.required],
      sello_temporal_add_contrato: [this.data?.sello_temporal_add_contrato || '', Validators.required],
      autorizaciontratamientosDatosJDA: [this.data?.autorizaciontratamientosDatosJDA || '', Validators.required],
      cartadescuentoflor: [this.data?.cartadescuentoflor || '', Validators.required],
      formato_timbre: [this.data?.formato_timbre || '', Validators.required],
      cartaaurotiracioncorreo: [this.data?.cartaaurotiracioncorreo || '', Validators.required]
    });
  }

  onCertificadoAfpChange(value: string) {
    const ruafFields = ['ruaf', 'nombre_trabajador_ruaf', 'cedula_ruaf', 'fecha_cerRuaf15menor'];
    const fechaCertificadoAfpField = this.auditForm.get('fecha_certificado_afp');

    if (value === '1') {
      fechaCertificadoAfpField?.enable(); // Mostrar el campo "Fecha Certificado Afp"
      ruafFields.forEach(field => this.auditForm.get(field)?.disable()); // Ocultar campos relacionados con RUAF
    } else if (value === '0') {
      fechaCertificadoAfpField?.disable(); // Ocultar el campo "Fecha Certificado Afp"
      ruafFields.forEach(field => this.auditForm.get(field)?.enable()); // Mostrar campos relacionados con RUAF
    }
  }

  toggleNoAplica(controlName: string, event: any) {
    const control = this.auditForm.get(controlName);
    
    if (event.checked) {
      if (controlName.includes('fecha')) {
        control?.setValue(null); // Vacía el campo de fecha
      } else {
        control?.setValue('No Aplica'); // Coloca "No Aplica" en el campo de texto
      }
      control?.disable(); // Deshabilita el campo para evitar cambios
    } else {
      control?.enable(); // Habilita el campo si se desmarca "No Aplica"
      control?.setValue(''); // Limpia el campo
    }
  }

  onSalarioSelectChange(controlName: string, event: any) {
    const selectedValue = event.value;
    if (selectedValue !== 'otro') {
      this.auditForm.get(`${controlName}_otro`)?.setValue('');
    }
  }

  isOtroSelected(controlName: string): boolean {
    return this.auditForm.get(controlName)?.value === 'otro';
  }
  
  

  convertToDate(dateString: string): Date | null {
    if (!dateString) return null;
  
    const [day, month, year] = dateString.split('/');
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  applyConditionalLogic() {
    const tipo = this.data.tipo;
    const centroDeCosto = this.data.centro_de_costo;
  
    if (tipo === 'TA') {
      this.hideFields([
        'fecha_de_ingreso_FT', 'infolaboral_FT', 
        'sisben', 'fecha_sisben', 'fecha_de_recibido_docs',
        'firma_carnet_FT', 'firma_loker_FT',
        'formatoElite', 'cargoElite'
      ]);
    }
  
    if (tipo === 'AL') {
      this.hideFields([
        'entrevista_ingreso', 'firma_clausulas_add',
        'sello_temporal_clausulas_add', 'firma_add_contrato',
        'sello_temporal_add_contrato', 'autorizaciontratamientosDatosJDA',
        'cartadescuentoflor', 'formato_timbre', 'cartaaurotiracioncorreo'
      ]);
    }
  
    if (centroDeCosto === 'JARDINES DE LOS ANDES') {
      this.showFields([
        'firma_clausulas_add', 'sello_temporal_clausulas_add',
        'firma_add_contrato', 'sello_temporal_add_contrato',
        'autorizaciontratamientosDatosJDA', 'cartadescuentoflor',
        'formato_timbre', 'cartaaurotiracioncorreo',
        'codigo_hoja_de_vida', 'foto_hoja_de_vida',
        'nombre_y_cedula_hoja_de_vida', 'correo_electronico_hoja_de_vida',
        'direccion_hoja_de_vida', 'referencia_hoja_de_vida',
        'firma_carnet_hoja_de_vida', 'medidas_correstivas', 'fecha_medidas_correstivas'
      ]);
    }
  }
  
  
  hideFields(fields: string[]) {
    fields.forEach(field => {
      const control = this.auditForm.get(field);
      if (control) {
        control.clearValidators(); // Elimina todos los validadores
        control.updateValueAndValidity(); // Actualiza el estado de validez
        control.disable(); // Deshabilita el campo
      }
    });
  }

  showFields(fields: string[]) {
    fields.forEach(field => {
      const control = this.auditForm.get(field);
      if (control) {
        control.setValidators(Validators.required); // Vuelve a agregar el validador
        control.updateValueAndValidity(); // Actualiza el estado de validez
        control.enable(); // Habilita el campo
      }
    });
  }

  formatDateToDdMmYyyy(date: Date): string {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()); // Año completo de 4 dígitos
    return `${day}/${month}/${year}`;
  }

  onSubmit() {
    // Formatea las fechas antes de enviar el formulario
    const formattedData = {
      ...this.auditForm.value,
      fecha_de_ingreso_FT: this.formatDateToDdMmYyyy(this.auditForm.value.fecha_de_ingreso_FT),
      fecha_procuraduria: this.formatDateToDdMmYyyy(this.auditForm.value.fecha_procuraduria),
      fecha_contraloria: this.formatDateToDdMmYyyy(this.auditForm.value.fecha_contraloria),
      fecha_ofac: this.formatDateToDdMmYyyy(this.auditForm.value.fecha_ofac),
      fecha_policivos: this.formatDateToDdMmYyyy(this.auditForm.value.fecha_policivos),
      fecha_medidas_correstivas: this.formatDateToDdMmYyyy(this.auditForm.value.fecha_medidas_correstivas),
      fecha_adres: this.formatDateToDdMmYyyy(this.auditForm.value.fecha_adres),
      fecha_sisben: this.formatDateToDdMmYyyy(this.auditForm.value.fecha_sisben),
      fecha_de_ingreso_contrato: this.formatDateToDdMmYyyy(this.auditForm.value.fecha_de_ingreso_contrato),
      fecha_de_recibido_docs: this.formatDateToDdMmYyyy(this.auditForm.value.fecha_de_recibido_docs),
      fecha_de_ingreso_arl: this.formatDateToDdMmYyyy(this.auditForm.value.fecha_de_ingreso_arl),
      fecha_certificado_afp: this.formatDateToDdMmYyyy(this.auditForm.value.fecha_certificado_afp),
      fecha_no_mayor_a_15_dias: this.formatDateToDdMmYyyy(this.auditForm.value.fecha_no_mayor_a_15_dias),
      fecha_cerRuaf15menor: this.formatDateToDdMmYyyy(this.auditForm.value.fecha_cerRuaf15menor),
      fecha_radicado_eps: this.formatDateToDdMmYyyy(this.auditForm.value.fecha_radicado_eps),
      fecha_radicado_caja: this.formatDateToDdMmYyyy(this.auditForm.value.fecha_radicado_caja),
      fecha_radicado_seguridad: this.formatDateToDdMmYyyy(this.auditForm.value.fecha_radicado_seguridad),
      fecha_ingreso_eps: this.formatDateToDdMmYyyy(this.auditForm.value.fecha_ingreso_eps),
      fecha_ingreso_caja: this.formatDateToDdMmYyyy(this.auditForm.value.fecha_ingreso_caja),
    };
  
    // Sobrescribe el valor del campo de salario con el campo "otro" si fue seleccionado
    if (this.auditForm.get('salario_contrato')?.value === 'otro') {
      formattedData.salario_contrato = this.auditForm.get('salario_contrato_otro')?.value;
    }
    if (this.auditForm.get('salario_eps')?.value === 'otro') {
      formattedData.salario_eps = this.auditForm.get('salario_eps_otro')?.value;
    }
    if (this.auditForm.get('salario_caja')?.value === 'otro') {
      formattedData.salario_caja = this.auditForm.get('salario_caja_otro')?.value;
    }
  
    this.dialogRef.close(formattedData);
  }
  
  

  onCancel() {
    this.dialogRef.close(null);
  }
}
