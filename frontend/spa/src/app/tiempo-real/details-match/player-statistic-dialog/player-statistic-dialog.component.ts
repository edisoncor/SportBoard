import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { PlayerStatistic } from '../../../models/real-time/player-statistic.model';

@Component({
  selector: 'app-player-statistic-dialog',
  templateUrl: './player-statistic-dialog.component.html',
  styleUrls: ['./player-statistic-dialog.component.scss'],
  imports: [CommonModule, MatButtonModule, MatDialogModule]
})
export class PlayerStatisticDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<PlayerStatisticDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PlayerStatistic
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
