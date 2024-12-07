import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgFor, NgIf } from '@angular/common';
import { DocumentacionService } from '../service/documentacion/documentacion.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

export interface ModalData {
  id: number;
  name: string;
  expandable: boolean;
  estado: boolean;
  tags?: string[];
  isEdit: boolean;
}

@Component({
  selector: 'app-document-modal',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDialogModule,
    NgIf,
    NgFor,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './document-modal.component.html',
  styleUrls: ['./document-modal.component.css']
})
export class DocumentModalComponent implements OnInit {
  form: FormGroup;
  nuevosDocumentos: FormArray<FormGroup>; // Manejo dinámico de documentos
  availableTags: { id: number; name: string }[] = [];
  isAddingNewTag: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DocumentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalData,
    private fb: FormBuilder,
    private documentacionService: DocumentacionService
  ) {
    // Inicializar formulario principal
    this.form = this.fb.group({
      id: [data.id || null], // Incluye el id en el formulario
      name: [data.name || '', Validators.required],
      expandable: [data.expandable || false],
      estado: [data.estado || true],
      tags: [data.tags || []],
      newTagName: ['', Validators.required],
    });

    // Inicializar el FormArray para documentos dinámicos
    this.nuevosDocumentos = this.fb.array<FormGroup>([]);
  }

  ngOnInit(): void {
    // Cargar tags desde el servicio
    this.documentacionService.mostrar_tags().subscribe((tags: any) => {
      this.availableTags = tags.map((tag: any) => ({
        id: tag.id,
        name: tag.name,
      }));

      // Agregar opción para agregar un nuevo tag
      this.availableTags.push({ id: -1, name: 'NUEVO' });

      // Convertir nombres de tags seleccionados a IDs
      if (this.data.tags) {
        const selectedTagIds = this.data.tags
          .map(tagName => this.availableTags.find(tag => tag.name === tagName)?.id)
          .filter((id): id is number => id !== undefined);

        this.form.patchValue({ tags: selectedTagIds });
      }
    });
  }

  agregarNuevoDocumento(): void {
    const nuevoDocumento = this.fb.group({
      name: [null, Validators.required],
      estado: [true],
      tags: [[]],
    });
    this.nuevosDocumentos.push(nuevoDocumento);
  }

  eliminarDocumento(index: number): void {
    this.nuevosDocumentos.removeAt(index);
  }

  onTagSelection(event: any): void {
    const tagsControl = this.form.get('tags');
    const newTagNameControl = this.form.get('newTagName');
  
    if (event.value.includes(-1)) { // Si selecciona "NUEVO" (ID -1)
      this.isAddingNewTag = true;
      newTagNameControl?.setValidators([Validators.required]);
    } else {
      this.isAddingNewTag = false;
      newTagNameControl?.clearValidators();
      newTagNameControl?.reset();
    }
  
    // Actualizar estado de validación de los controles
    newTagNameControl?.updateValueAndValidity();
    tagsControl?.updateValueAndValidity();
  }
  

  transformToUpperCaseAndNoSpaces(fieldName: 'name' | 'newTagName'): void {
    const control = this.form.get(fieldName);
    if (control?.value) {
      control.setValue(control.value.toUpperCase().replace(/\s+/g, ''), { emitEvent: false });
    }
  }

  save(): void {
    if (this.data.isEdit) {
      // Modo edición
      if (this.form.valid) {
        const formData = { ...this.form.value };
  
        // Procesar tags seleccionados
        const processedTags = formData.tags.map((tagId: number | string) => {
          if (tagId === -1 && this.isAddingNewTag && formData.newTagName) {
            return formData.newTagName; // Reemplazar -1 con el nombre del nuevo tag
          }
          return this.availableTags.find(tag => tag.id === tagId)?.name || tagId;
        });
  
        formData.tags = processedTags; // Actualizar tags procesados como nombres
        delete formData.newTagName; // Eliminar el campo auxiliar
        this.dialogRef.close({ type: 'edit', data: formData }); // Retornar datos actualizados
      }
    } else {
      // Modo creación de documentos
      const nuevosDocumentosData = this.nuevosDocumentos.controls.map((control: AbstractControl) => {
        const controlValue = { ...control.value };
        // Procesar tags para nuevos documentos
        controlValue.tags = controlValue.tags.map((tagId: number | string) => {
          if (tagId === -1 && this.isAddingNewTag && controlValue.newTagName) {
            return controlValue.newTagName; // Reemplazar -1 con el nombre del nuevo tag
          }
          return this.availableTags.find(tag => tag.id === tagId)?.name || tagId;
        });
        delete controlValue.newTagName;
        return controlValue;
      });
  
      this.dialogRef.close({ type: 'create', data: nuevosDocumentosData });
    }
  }
  
  

  cancel(): void {
    this.dialogRef.close();
  }
}
