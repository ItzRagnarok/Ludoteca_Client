import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Client } from '../../client/model/Client';
import { Game } from '../../game/model/game';
import { MatDialogRef } from '@angular/material/dialog';
import { LOANS_DATA } from '../model/mock-loan';
import { ClientService } from '../../client/client.service';
import { GameService } from '../../game/game.service';
import { LoanService } from '../loan.service';
import { Loan } from '../model/Loan';

@Component({
  selector: 'app-loan-edit',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './loan-edit.html',
  styleUrl: './loan-edit.scss',
})
export class LoanEdit implements OnInit {
  client: Client;
  loan: Loan;
  game: Game;
  errorMessage: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<LoanEdit>,
    @Inject(LOANS_DATA) public data: {loan: Loan},
    private clientService: ClientService,
    private gameService: GameService,
    private loanService: LoanService
  ) { }

  ngOnInit(): void {
    this.loan = this.data.loan ? Object.assign({}, this.data.loan) : new Loan();
  }

  onSave() {
    this.loanService.saveLoan(this.loan).subscribe(() => {
      this.dialogRef.close();
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}
