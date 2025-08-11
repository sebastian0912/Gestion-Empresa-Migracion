import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ContentChild,
  TemplateRef,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl, FormGroup } from '@angular/forms';
import { SharedModule } from '../../shared.module';
import * as XLSX from 'xlsx';

export interface ColumnDefinition {
  name: string;
  header: string;
  type: 'text' | 'number' | 'date' | 'select' | 'status' | 'custom';
  options?: string[]; // For select type
  statusConfig?: {
    // For status type
    [key: string]: {
      color: string;
      background: string;
    };
  };
  customClassConfig?: {
    // For custom type
    [key: string]: {
      color: string;
      background: string;
    };
  };
  width?: string;
  filterable?: boolean;
}

/**
 * Tipo para los filtros activos
 */
export interface ActiveFilter {
  name: string;
  header: string;
  type: string;
  value: any;
}

@Component({
  selector: 'app-standard-filter-table',
  standalone: true,
  templateUrl: './standard-filter-table.html',
  styleUrls: ['./standard-filter-table.css'],
  imports: [SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StandardFilterTable implements OnInit, OnChanges {
  @ContentChild('actionsTemplate', { static: false })
  actionsTemplate!: TemplateRef<any>;
  @ContentChild('attachmentTemplate', { static: false })
  attachmentTemplate!: TemplateRef<any>;
  @Input() data: any[] = [];
  @Input() columnDefinitions: ColumnDefinition[] = [];
  @Input() pageSizeOptions: number[] = [10, 20, 50];
  @Input() defaultPageSize: number = 10;
  @Input() tableTitle: string = 'Tabla de datos';

  displayedColumns: string[] = [];
  displayedFilterColumns: string[] = [];
  dataSource = new MatTableDataSource<any>();
  filterControls: { [key: string]: FormControl } = {};
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // Date range controls for date filter (global para todas las columnas tipo date)
  dateRange: FormGroup = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  originalData: any[] = []; // copia base para filtrar
  private dateRangeSubscribed = false;
  activeFilters: ActiveFilter[] = []; // cache filtros activos

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.initializeTable();
    this.applyFilters();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      // Actualizar copia original manteniendo referencia nueva
      this.originalData = Array.isArray(this.data) ? [...this.data] : [];
      this.applyFilters(false); // rehacer filtros sin reiniciar paginador siempre
    }
  }

  ngAfterViewInit(): void {
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  /**
   * Inicializa columnas, controles de filtro y listeners
   */
  initializeTable(): void {
    this.displayedColumns = this.columnDefinitions.map((col) => col.name);
    this.displayedFilterColumns = this.columnDefinitions.map(
      (col) => col.name + '_filter'
    );
    this.originalData = Array.isArray(this.data) ? [...this.data] : [];
    this.dataSource.data = [...this.originalData];

    this.columnDefinitions.forEach((col) => {
      if (col.filterable === false) return;
      if (col.type === 'date') {
        if (!this.dateRangeSubscribed) {
          this.dateRange.valueChanges.subscribe(() => this.applyFilters());
          this.dateRangeSubscribed = true;
        }
      } else {
        this.filterControls[col.name] = new FormControl(
          col.type === 'select' ? [] : ''
        );
        this.filterControls[col.name].valueChanges.subscribe(() =>
          this.applyFilters()
        );
      }
    });

    setTimeout(() => {
      if (this.sort) this.dataSource.sort = this.sort;
      if (this.paginator) this.dataSource.paginator = this.paginator;
    });
  }

  /**
   * Aplica los filtros de cada columna a los datos
   */
  applyFilters(resetPaginator: boolean = true): void {
    const filtered = this.originalData.filter((item) => {
      return this.columnDefinitions.every((col) => {
        if (col.filterable === false) return true;
        if (col.type === 'date') {
          const start: Date | null = this.dateRange.get('start')?.value;
          const end: Date | null = this.dateRange.get('end')?.value;
          if (!start && !end) return true;
          const raw = item[col.name];
          const itemDate: Date | null =
            raw instanceof Date ? raw : raw ? new Date(raw) : null;
          if (!itemDate) return false;
          if (start && itemDate < start) return false;
          if (end) {
            const toEnd = new Date(end);
            toEnd.setHours(23, 59, 59, 999);
            if (itemDate > toEnd) return false;
          }
          return true;
        }
        const control = this.filterControls[col.name];
        if (!control) return true;
        const filterValue = control.value;
        if (Array.isArray(filterValue)) {
          return (
            filterValue.length === 0 || filterValue.includes(item[col.name])
          );
        }
        if (typeof filterValue === 'string') {
          if (!filterValue) return true;
          const itemValue = item[col.name];
          return (
            itemValue &&
            itemValue
              .toString()
              .toLowerCase()
              .includes(filterValue.toLowerCase())
          );
        }
        if (typeof filterValue === 'number') {
          if (filterValue === null || filterValue === undefined) return true;
          return item[col.name] === filterValue;
        }
        return true;
      });
    });
    // Ordenamiento manual
    if (this.sort && this.sort.active && this.sort.direction !== '') {
      const { active, direction } = this.sort;
      filtered.sort((a: any, b: any) => {
        let valueA = a[active];
        let valueB = b[active];
        if (valueA instanceof Date && valueB instanceof Date) {
          valueA = valueA.getTime();
          valueB = valueB.getTime();
        } else if (typeof valueA === 'string' && typeof valueB === 'string') {
          valueA = valueA.toLowerCase();
          valueB = valueB.toLowerCase();
        }
        if (valueA < valueB) return direction === 'asc' ? -1 : 1;
        if (valueA > valueB) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    this.dataSource.data = filtered;
    if (this.paginator && resetPaginator) this.paginator.firstPage();
    this.updateActiveFilters();
    this.cd.markForCheck();
  }

  /**
   * Limpia todos los filtros
   */
  clearFilters(): void {
    Object.keys(this.filterControls).forEach((key) => {
      const control = this.filterControls[key];
      if (Array.isArray(control.value)) control.setValue([]);
      else control.setValue('');
    });
    this.dateRange.patchValue({ start: null, end: null }, { emitEvent: true });
    this.applyFilters();
  }

  /**
   * Actualiza los filtros activos en base a los controles de filtro
   */
  private updateActiveFilters(): void {
    const filters: ActiveFilter[] = [];
    this.columnDefinitions.forEach((col) => {
      if (col.filterable === false) return;
      if (col.type === 'date') {
        const start = this.dateRange.get('start')?.value;
        const end = this.dateRange.get('end')?.value;
        if (start || end) {
          filters.push({
            name: col.name,
            header: col.header,
            type: 'date',
            value: { from: start, to: end },
          });
        }
      } else {
        const ctrl = this.filterControls[col.name];
        if (!ctrl) return;
        const val = ctrl.value;
        if (
          (Array.isArray(val) && val.length) ||
          (typeof val === 'string' && val) ||
          (typeof val === 'number' && val !== null && val !== undefined)
        ) {
          filters.push({
            name: col.name,
            header: col.header,
            type: col.type,
            value: val,
          });
        }
      }
    });
    this.activeFilters = filters;
  }

  /**
   * Limpia un filtro individual (tag)
   */
  clearSingleFilter(filter: any): void {
    if (filter.type === 'date') {
      this.dateRange.patchValue(
        { start: null, end: null },
        { emitEvent: true }
      );
    } else if (this.filterControls[filter.name]) {
      const ctrl = this.filterControls[filter.name];
      if (Array.isArray(ctrl.value)) ctrl.setValue([]);
      else ctrl.setValue('');
    }
    // applyFilters será disparado por valueChanges, pero aseguramos actualización:
    this.applyFilters();
  }

  getColumnType(columnName: string): string {
    const colDef = this.columnDefinitions.find(
      (col) => col.name === columnName
    );
    return colDef ? colDef.type : 'text';
  }

  getStatusConfig(columnName: string): any {
    const colDef = this.columnDefinitions.find(
      (col) => col.name === columnName
    );
    return colDef ? colDef.statusConfig || {} : {};
  }

  getCustomClassConfig(columnName: string): any {
    const colDef = this.columnDefinitions.find(
      (col) => col.name === columnName
    );
    return colDef ? colDef.customClassConfig || {} : {};
  }

  exportTable(format: 'pdf' | 'xml' | 'excel') {
    // Aquí iría la lógica real de exportación
    switch (format) {
      case 'pdf':
        // TODO: Implementar exportación a PDF
        alert('Exportar a PDF no implementado aún.');
        break;
      case 'xml':
        // TODO: Implementar exportación a XML
        alert('Exportar a XML no implementado aún.');
        break;
      case 'excel':
        this.exportToExcel();
        break;
    }
  }

  exportToExcel() {
    // Exportar solo los datos filtrados actualmente visibles en la tabla
    const exportData = (this.dataSource.data as any[]).map((row) => {
      const obj: any = {};
      this.columnDefinitions.forEach((col) => {
        let value = row[col.name];
        // Formatear fechas a string legible
        if (col.type === 'date' && value instanceof Date) {
          value = value.toLocaleDateString();
        }
        obj[col.header] = value;
      });
      return obj;
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = {
      Sheets: { Datos: worksheet },
      SheetNames: ['Datos'],
    };
    XLSX.writeFile(workbook, `${this.tableTitle || 'tabla'}.xlsx`);
  }

  trackByCol = (_: number, col: ColumnDefinition) => col.name;
  trackByFilter = (_: number, f: ActiveFilter) =>
    `${f.name}-${JSON.stringify(f.value)}`;
  isArray = (v: any): v is any[] => Array.isArray(v);
}
