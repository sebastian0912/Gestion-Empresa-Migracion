import { Component, OnInit } from '@angular/core';
import { NavbarLateralComponent } from '../../components/navbar-lateral/navbar-lateral.component';
import { InfoCardComponent } from '../../components/info-card/info-card.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { NavbarSuperiorComponent } from '../../components/navbar-superior/navbar-superior.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavbarLateralComponent,
    NavbarSuperiorComponent,
    InfoCardComponent,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,    
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
