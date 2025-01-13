import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { DocumentacionService } from '../../service/documentacion/documentacion.service';
import { NavbarLateralComponent } from '../../../../shared/components/navbar-lateral/navbar-lateral.component';
import { NavbarSuperiorComponent } from '../../../../shared/components/navbar-superior/navbar-superior.component';
import { MatSelectModule } from '@angular/material/select';
import { ContratacionService } from '../../../../shared/services/contratacion/contratacion.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatMenuModule } from '@angular/material/menu';

interface Documento {
  id: number;
  title: string;
  file_url: string;
  type: number;  // <- para cruzarlo con tiposDocumentales

}

interface Categoria {
  categoria: string;
  documentos: Documento[];
}

export interface TipoDocumental {
  id: number;
  name: string;
  estado: boolean;
  tags: string[];
  subtypes: TipoDocumental[]; // subtipos anidados
}



@Component({
  selector: 'app-buscar-documentacion',
  standalone: true,
  imports: [
    NavbarLateralComponent,
    NavbarSuperiorComponent,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatCardModule,
    MatSelectModule,
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    NgClass,
    MatMenuModule
  ],
  templateUrl: './buscar-documentacion.component.html',
  styleUrl: './buscar-documentacion.component.css'
})
export class BuscarDocumentacionComponent implements OnInit {
  isSidebarHidden = false;
  tiposDocumentales: any[] = [];
  codigosContrato: string[] = [];
  pdfSeleccionado: SafeResourceUrl | null = null;
  form: FormGroup;
  documentosPorCategoria: Array<{ categoria: string; documentos: any[] }> = [];
  @ViewChild('pdfPreview') pdfPreview!: ElementRef<HTMLIFrameElement>;

  constructor(
    private fb: FormBuilder,
    private documentacionService: DocumentacionService,
    private contratacionService: ContratacionService,
    private sanitizer: DomSanitizer
  ) {
    this.form = this.fb.group({
      cedula: ['', Validators.required],
      codigoContrato: [''],
      tipoDocumental: [''],
      textoBuscar: ['']
    });
  }

  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
  }

  ngOnInit(): void {
    this.documentacionService.mostrar_jerarquia_gestion_documental().subscribe(
      (data) => {
        this.tiposDocumentales = data;
      },
      (error) => {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo obtener la jerarquía de tipos documentales.' });
      }
    );

    // Escuchar cambios en el campo de cédula
    this.form.get('cedula')?.valueChanges
      .pipe(
        debounceTime(3000), // Espera 3 segundos después del último cambio
        distinctUntilChanged(), // Evita consultas repetidas con el mismo valor
        switchMap((cedula) => {
          if (cedula) {
            // Mostrar modal de carga
            Swal.fire({
              title: 'Cargando',
              icon: 'info',
              text: 'Obteniendo códigos de contrato...',
              allowOutsideClick: false,
              didOpen: () => {
                Swal.showLoading(); // Inicia el indicador de carga
              }
            });
            return this.contratacionService.obtenerCodigosContrato(cedula); // Llama al servicio
          }
          return []; // Si la cédula está vacía, retorna un arreglo vacío
        })
      )
      .subscribe(
        (codigos: any) => {
          Swal.close(); // Cierra el modal de carga
          this.codigosContrato = codigos.data;
        },
        (error) => {
          Swal.close(); // Cierra el modal de carga
          // Mostrar error con SweetAlert
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron obtener los códigos de contrato.'
          });
        }
      );
  }


  onSubmit(): void {
    if (this.form.valid) {
      this.documentacionService.buscar_documentos(this.form.value).subscribe(
        (data) => {
          // Convertir el objeto en un array de objetos para el uso en @for
          this.documentosPorCategoria = Object.entries(data).map(([categoria, documentos]) => ({
            categoria,
            documentos: documentos as any[], // Asegurar que "documentos" es un array
          }));
        },
        (error) => {
          Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron obtener los documentos.' });
        }
      );
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Formulario inválido.' });
    }
  }

  trackByCategoria(index: number, item: Categoria): string {
    return item.categoria;
  }

  trackByDocumento(index: number, doc: Documento): number {
    return doc.id;
  }


  verPDF(docUrl: string): void {
    // Ahora usas el ElementRef inyectado por Angular, no document.getElementById
    if (docUrl && this.pdfPreview) {
      this.pdfPreview.nativeElement.src = docUrl;
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se encontró el iframe o la URL del documento.' });
    }
  }

  /**
   * Devuelve el nombre del tipo documental, dada su ID.
   * @param typeId ID del tipo documental.
   */
  public obtenerNombreDelTipo(typeId: number): string {
    const tipo = this.buscarTipoPorId(this.tiposDocumentales, typeId);
    return tipo ? tipo.name : 'Tipo documental desconocido';
  }

  /**
   * Busca recursivamente un tipo documental por su `id`.
   * @param listaTipos Lista de tipos (nivel actual).
   * @param idBuscado  ID del tipo documental que se quiere ubicar.
   * @returns          El tipo documental (si existe), o undefined.
   */
  private buscarTipoPorId(listaTipos: TipoDocumental[], idBuscado: number): TipoDocumental | undefined {
    for (const tipo of listaTipos) {
      if (tipo.id === idBuscado) {
        return tipo;
      }
      if (tipo.subtypes && tipo.subtypes.length > 0) {
        const resultado = this.buscarTipoPorId(tipo.subtypes, idBuscado);
        if (resultado) {
          return resultado;
        }
      }
    }
    return undefined;
  }

  obtenerTipoDocumental(doc: Documento): string { 
    // Usa la función recursiva para buscar en TODA la estructura anidada
    const tipoEncontrado = this.buscarTipoPorId(this.tiposDocumentales, doc.type);
  
    // Ajusta a "tipoEncontrado?.name" porque la propiedad es "name"
    return tipoEncontrado ? tipoEncontrado.name : 'Tipo documental desconocido';
  }
  
  
  
  





}
