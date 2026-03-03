import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Client } from '../../client/model/Client';
import { Game } from '../../game/model/game';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
  loan: Loan;
  clients: Client[] = []; // Array para el desplegable de clientes
  games: Game[] = [];     // Array para el desplegable de juegos
  errorMessage: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<LoanEdit>,
    @Inject(MAT_DIALOG_DATA) public data: {loan: Loan},
    private clientService: ClientService,
    private gameService: GameService,
    private loanService: LoanService
  ) { }

  ngOnInit(): void {
    // this.loan = this.data.loan ? Object.assign({}, this.data.loan) : new Loan();
    // Si pasamos un loan desde la tabla (para editar), lo clonamos. Si no, creamos uno nuevo vacío.
    this.loan = this.data.loan ? Object.assign({}, this.data.loan) : new Loan();

    // Cargamos los datos para llenar los <mat-select>
    this.clientService.getClients().subscribe(clients => this.clients = clients);
    this.gameService.getGames().subscribe(games => this.games = games);
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
