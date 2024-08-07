import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import moment from 'moment';

@Component({
  selector: 'app-date-rang-dialog',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,   
    
  ],
  templateUrl: './date-rang-dialog.component.html',
  styleUrl: './date-rang-dialog.component.css'
})

export class DateRangeDialogComponent {
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  constructor(
    public dialogRef: MatDialogRef<DateRangeDialogComponent>,
  ) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    const formattedRange = {
      start: moment(this.range.value.start).format('YYYY-MM-DD'),
      end: moment(this.range.value.end).format('YYYY-MM-DD')
    };
    this.dialogRef.close(formattedRange);
  }
}
