import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VetadosService } from '../../services/vetados/vetados.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgFor } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-autorizar-vetado',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    NgFor,
    ReactiveFormsModule,
    MatInputModule
  ],
  templateUrl: './autorizar-vetado.component.html',
  styleUrls: ['./autorizar-vetado.component.css']
})
export class AutorizarVetadoComponent implements OnInit {
  categorias: any[] = [];

  // Definir el formulario reactivo
  categoriaForm: FormGroup;

  constructor(
    private vetadosService: VetadosService,
    public dialogRef: MatDialogRef<AutorizarVetadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Inicializar el formulario reactivo
    this.categoriaForm = new FormGroup({
      selectedCategoriaId: new FormControl('', Validators.required),
      clasificacion: new FormControl({ value: '', disabled: true }),
      descripcion: new FormControl({ value: '', disabled: true })
    });
  }

  ngOnInit() {
    this.getCategorias();
  }

  // Obtener categorías del servicio
  getCategorias() {

    this.vetadosService.listarCategorias().subscribe((data: any) => {
      this.categorias = data.categorias;
    });

  }

  // Manejar cambio en la selección de categoría
  onCategoriaChange(categoriaId: number) {
    const categoria = this.categorias.find((c) => c.id === categoriaId);
    if (categoria) {
      // Actualizar valores en el formulario
      this.categoriaForm.patchValue({
        clasificacion: categoria.clasificacion,
        descripcion: categoria.descripcion
      });
    }
  }

  // Seleccionar categoría
  seleccionarCategoria() {
    if (this.categoriaForm.valid) {
      const selectedData = {
        id: this.categoriaForm.get('selectedCategoriaId')?.value,
        clasificacion: this.categoriaForm.get('clasificacion')?.value,
        descripcion: this.categoriaForm.get('descripcion')?.value
      };
      this.dialogRef.close(selectedData);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}