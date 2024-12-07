import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NavbarLateralComponent } from '../../components/navbar-lateral/navbar-lateral.component';
import { NavbarSuperiorComponent } from '../../components/navbar-superior/navbar-superior.component';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-generar-documentos',
  standalone: true,
  imports: [
    MatCardModule,
    NavbarSuperiorComponent,
    NavbarLateralComponent,
    MatIconModule,
    MatExpansionModule,
    MatButtonModule
  ],
  templateUrl: './generar-documentos.component.html',
  styleUrl: './generar-documentos.component.css'
})
export class GenerarDocumentosComponent {
  isSidebarHidden = false;

  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
  }

  devolvercontratacion() {
    console.log('devolvercontratacion');
    window.location.href = '/contratacion';
  }

}
