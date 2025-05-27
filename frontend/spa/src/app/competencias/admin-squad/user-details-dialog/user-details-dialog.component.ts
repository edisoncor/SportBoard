import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../models/competencies/user.model';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-user-details-dialog',
  imports: [MatDialogModule, SharedModule],
  templateUrl: './user-details-dialog.component.html',
  styleUrls: ['./user-details-dialog.component.scss']
  
})
export class UserDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UserDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
