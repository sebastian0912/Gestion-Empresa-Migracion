import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { NgIf } from '@angular/common';
import { DocumentacionService } from '../../service/documentacion/documentacion.service';
import { NavbarLateralComponent } from '../../../../shared/components/navbar-lateral/navbar-lateral.component';
import { NavbarSuperiorComponent } from '../../../../shared/components/navbar-superior/navbar-superior.component';


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
  ],
  templateUrl: './buscar-documentacion.component.html',
  styleUrl: './buscar-documentacion.component.css'
})
export class BuscarDocumentacionComponent implements OnInit {

  isSidebarHidden = false;

  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
  }

  constructor(
    private documentacionService: DocumentacionService
  ) { }


  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
