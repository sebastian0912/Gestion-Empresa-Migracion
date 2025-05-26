import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavbarLateralComponent } from '../../components/navbar-lateral/navbar-lateral.component';
import { NavbarSuperiorComponent } from '../../components/navbar-superior/navbar-superior.component';
import { InfoCardComponent } from '../../components/info-card/info-card.component';
import { RobotsService } from '../../services/robots/robots.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OrdenUnionDialogComponent } from '../../components/orden-union-dialog/orden-union-dialog.component';

@Component({
  selector: 'app-antecedentes-robots',
  standalone: true,
  templateUrl: './antecedentes-robots.component.html',
  styleUrls: ['./antecedentes-robots.component.css'],
  imports: [
    NavbarLateralComponent,
    NavbarSuperiorComponent,
    InfoCardComponent,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    CommonModule,
    MatDialogModule
  ]
})
export class AntecedentesRobotsComponent implements OnInit {
  /** ---------- CONTROLES ---------- */
  cedulaControl = new FormControl('');

  /** ---------- TABLA PRINCIPAL ---------- */
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'encontrado', 'cedula', 'hora_registro', 'oficina', 'tipo_documento',
    'estado_adress', 'apellido_adress', 'entidad_adress', 'pdf_adress', 'fecha_adress',
    'estado_policivo', 'anotacion_policivo', 'pdf_policivo',
    'estado_ofac', 'anotacion_ofac', 'pdf_ofac',
    'estado_contraloria', 'anotacion_contraloria', 'pdf_contraloria',
    'estado_sisben', 'tipo_sisben', 'pdf_sisben', 'fecha_sisben',
    'estado_procuraduria', 'anotacion_procuraduria', 'pdf_procuraduria',
    'estado_fondo_pension', 'entidad_fondo_pension', 'pdf_fondo_pension', 'fecha_fondo_pension',
    'estado_union', 'union_pdf', 'fecha_union_pdf'
  ];

  /** ---------- OTROS ---------- */
  isSidebarHidden = false;
  private readonly claves = ['cedula', 'tipo_documento', 'paquete'];

  constructor(
    private robotsService: RobotsService,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {}

  /* ---------- SIDEBAR ---------- */
  toggleSidebar(): void { this.isSidebarHidden = !this.isSidebarHidden; }

  /* ---------- BÚSQUEDA INDIVIDUAL ---------- */
  buscarPorCedula(): void {
    const cedula = this.cedulaControl.value?.trim();
    if (!cedula) {
      Swal.fire({ icon: 'warning', title: 'Cédula vacía', text: 'Ingrese una cédula.' });
      return;
    }
    this.robotsService.consultarEstadosRobots(cedula).subscribe({
      next: r => this.pintarRespuestaEnTabla(r, cedula),
      error:  () => this.pintarRespuestaEnTabla(null, cedula)
    });
  }

  /* ---------- PEGAR LISTA DIRECTO EN TABLA ---------- */
  onTablePaste(evt: ClipboardEvent): void {
    const txt = evt.clipboardData?.getData('text') ?? '';
    if (!txt) { return; }
    evt.preventDefault();                                     // no pegar texto crudo
    if (txt.includes('\n') || txt.includes('\t') || txt.includes(',')) {
      this.procesarCedulasPegadas(txt);                       // lista de cédulas
    } else {
      this.cedulaControl.setValue(txt.trim());
      this.buscarPorCedula();                                 // cédula única
    }
  }

  procesarCedulasPegadas(texto: string): void {
    this.dataSource.data = [];
    const cedulas = texto.split(/[\n,\t;]+/).map(c => c.trim()).filter(Boolean);
    cedulas.forEach(c =>
      this.robotsService.consultarEstadosRobots(c).subscribe({
        next: r => this.pintarRespuestaEnTabla(r, c),
        error: () => this.pintarRespuestaEnTabla(null, c)
      })
    );
  }

  /* ---------- AGREGAR FILA CON ✔ / ❌ ---------- */
  private pintarRespuestaEnTabla(res: any | null, cedulaFallback: string): void {
    const row = (res && (res.con_registros?.length || res.sin_consultar?.length))
      ? { ... (res.con_registros?.[0] ?? res.sin_consultar?.[0]), encontrado: true }
      : { cedula: cedulaFallback, encontrado: false };
    this.dataSource.data = [...this.dataSource.data, row];
  }

  /* ---------- FILTRO DE TABLA ---------- */
  applyFilters(ev: Event): void {
    this.dataSource.filter = (ev.target as HTMLInputElement).value.trim().toLowerCase();
  }

  /* ---------- INPUT FILE (EXCEL) ---------- */
  triggerFileInput(): void {
    (document.getElementById('fileInput') as HTMLInputElement).click();
  }

  /** ---------- CARGAR EXCEL (sin cambios funcionales) ---------- */
  cargarExcel(evt: any): void {
    const file = evt.target.files[0];
    if (!file) { Swal.fire({icon:'error',title:'Error',text:'Seleccione un archivo'}); return; }

    Swal.fire({title:'Cargando...',allowOutsideClick:false,didOpen:()=>Swal.showLoading()});
    const reader = new FileReader();
    reader.onload = (e:any)=>{ try{
      const wb = XLSX.read(new Uint8Array(e.target.result), {type:'array',cellDates:true});
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{header:1,raw:false});
      if(!rows.length){ Swal.fire({icon:'error',title:'Archivo vacío'}); return; }
      const mod = this.asignarClaves(rows);
      if(Object.keys(mod[0]).length!==this.claves.length){
        Swal.fire({icon:'error',title:'Formato incorrecto'}); return; }
      this.robotsService.enviarEstadosRobots(mod).subscribe({
        next: r=>Swal.fire(r.message==='success'?{icon:'success',title:'Éxito'}:{icon:'error',title:'Error'}),
        error: ()=>Swal.fire({icon:'error',title:'Error'}), complete: ()=>Swal.close()
      });
    }catch(_){ Swal.fire({icon:'error',title:'Error al procesar'}); } };
    reader.readAsArrayBuffer(file);
  }

  /* ---------- UTIL ---------- */
  private asignarClaves(data:any[]):any[]{
    return data
      .filter(r=>r.some((c:any)=>c!==null&&c!==undefined&&c!==''))
      .map(r=>{
        const obj:any={};
        r.forEach((c:any,i:number)=>{ if(i<this.claves.length){ obj[this.claves[i]]=c||'N/A'; } });
        return obj;
      });
  }
}
