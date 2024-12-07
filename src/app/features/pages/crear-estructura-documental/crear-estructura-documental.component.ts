import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { DocumentacionService } from '../../service/documentacion/documentacion.service';
import { NavbarLateralComponent } from '../../../shared/components/navbar-lateral/navbar-lateral.component';
import { NavbarSuperiorComponent } from '../../../shared/components/navbar-superior/navbar-superior.component';
import { MatTreeModule, MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { NgIf } from '@angular/common';
import { FlatTreeControl } from '@angular/cdk/tree';
import { BehaviorSubject } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { DocumentModalComponent, ModalData } from '../../components/document-modal.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

/** Nodo para el árbol plano */
interface FlatNode {
  id: number;
  name: string;
  estado: boolean;
  level: number;
  expandable: boolean;
  tags: string[];
}

/** Nodo de entrada basado en tu JSON */
interface DocumentType {
  id: number;
  name: string;
  estado: boolean;
  tags: string[];
  subtypes: DocumentType[];
}

@Component({
  selector: 'app-crear-estructura-documental',
  standalone: true,
  imports: [
    MatIconModule,
    MatCardModule,
    NavbarLateralComponent,
    NavbarSuperiorComponent,
    MatTreeModule,
    NgIf,
    MatProgressBarModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './crear-estructura-documental.component.html',
  styleUrls: ['./crear-estructura-documental.component.css']
})
export class CrearEstructuraDocumentalComponent implements OnInit {
  documentTypes: DocumentType[] = [];
  isSidebarHidden = false;
  treeControl: FlatTreeControl<FlatNode>;
  dataSource: MatTreeFlatDataSource<DocumentType, FlatNode>;
  treeFlattener: MatTreeFlattener<DocumentType, FlatNode>;

  /** Almacena nodos agregados o editados */
  changes: { id: number; changes: Partial<DocumentType> }[] = [];

  constructor(
    private documentacionService: DocumentacionService,
    private dialog: MatDialog
  ) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      (node) => node.level,
      (node) => node.expandable,
      (node) => node.subtypes
    );

    this.treeControl = new FlatTreeControl<FlatNode>(
      (node) => node.level,
      (node) => node.expandable
    );

    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }

  /** Transformar un nodo jerárquico en un nodo plano */
  transformer = (node: DocumentType, level: number): FlatNode => {
    return {
      id: node.id,
      name: node.name,
      estado: node.estado,
      level,
      expandable: !!node.subtypes && node.subtypes.length > 0,
      tags: node.tags,
    };
  };

  ngOnInit() {
    this.documentacionService.mostrar_jerarquia_gestion_documental().subscribe((data) => {
      this.dataSource.data = data;
      console.log('Jerarquía de gestión documental:', data);
      this.documentTypes = data;
    });
  }

  /** Agregar un nuevo nodo raíz */
  addRootNode() {
    const newNode: DocumentType = {
      id: Date.now(), // Generar un ID único
      name: 'Nuevo Tipo Documental',
      estado: true,
      tags: [],
      subtypes: [],
    };
    this.documentTypes.push(newNode);
    this.dataSource.data = [...this.documentTypes];
    this.trackChange(newNode.id, newNode);
  }

  openModal(node: FlatNode | null, isEdit: boolean) { 
    const data: ModalData = node
      ? {
          id: node.id,
          name: node.name,
          estado: node.estado,
          expandable: node.expandable,
          tags: node.tags || [], // Asegurar que los tags sean un array de IDs
          isEdit,
        }
      : {
          id: Date.now(), // Generar un ID único
          name: '',
          expandable: false,
          tags: [], // Array vacío para nuevos nodos
          estado: true,
          isEdit,
        };

    console.log('Datos del modal:', data);
  
    const dialogRef = this.dialog.open(DocumentModalComponent, {
      minWidth: '50vw',
      minHeight: '30vh',
      data, // Pasar los datos al modal
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      console.log('Resultado del modal:', result);
      if (result) {
        if (isEdit && node) {
          // Actualizar el nodo existente
          node.name = result.name;
          node.expandable = result.expandable;
          node.estado = result.estado; // Actualizar "estado"
          node.tags = result.tags; // Actualizar tags como array de IDs
        } else if (!isEdit) {
          // Crear un nuevo nodo
          const newNode: DocumentType = {
            id: result.id,
            name: result.name,
            estado: result.estado, // Asignar "estado"
            tags: result.tags, // Guardar tags como array de IDs
            subtypes: [],
          };
          this.documentTypes.push(newNode);
        }
  
        // Actualizar la fuente de datos
        this.dataSource.data = [...this.documentTypes];
      }
    });
  }
  
  



  /** Agregar un subtipo a un nodo */
  addSubtype(event: MouseEvent, parentNode: DocumentType) {
    // Detener propagación del evento para evitar que afecte la expansión
    event.stopPropagation();

    console.log('Agregando subtipo a:', parentNode);
    // Aquí puedes añadir lógica adicional para agregar el subtipo
  }



  /** Determina si el nodo tiene hijos */
  hasChild = (_: number, node: FlatNode) => node.expandable;

  /** Rastrear cambios realizados en nodos */
  private trackChange(id: number, changes: Partial<DocumentType>) {
    const existingChange = this.changes.find((change) => change.id === id);
    if (existingChange) {
      Object.assign(existingChange.changes, changes);
    } else {
      this.changes.push({ id, changes });
    }
  }

  /** Obtener los cambios realizados */
  getChanges() {
    console.log('Cambios realizados:', this.changes);
    return this.changes;
  }

  /** Alternar visibilidad de la barra lateral */
  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
  }
}
