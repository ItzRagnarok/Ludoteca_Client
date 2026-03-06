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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-loan-edit',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    provideNativeDateAdapter() 
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
    @Inject(MAT_DIALOG_DATA) public data: { loan: Loan },
    private clientService: ClientService,
    private gameService: GameService,
    private loanService: LoanService
  ) { }

  ngOnInit(): void {
    // this.loan = this.data.loan ? Object.assign({}, this.data.loan) : new Loan();
    this.loan = this.data.loan ? Object.assign({}, this.data.loan) : new Loan();

    this.clientService.getClients().subscribe(clients => this.clients = clients);
    this.gameService.getGames().subscribe(games => this.games = games);
  }

  onSave() {
    this.errorMessage = null; 

    if (!this.loan.client || !this.loan.game || !this.loan.loanDate || !this.loan.returnDate) {
      this.errorMessage = "Todos los campos son obligatorios.";
      return;
    }

    const start = new Date(this.loan.loanDate);
    const end = new Date(this.loan.returnDate);

    if (end < start) {
      this.errorMessage = "La fecha de fin no puede ser anterior a la fecha de inicio.";
      return;
    }

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 14) {
      this.errorMessage = "El periodo de préstamo máximo es de 14 días.";
      return;
    }

    // if () {
    //   this.errorMessage = "El juego ya esta reservado en esas fechas.";
    //   return;
    // }
    // --- SOLUCIÓN ZONA HORARIA ---
    // Clonamos el objeto para no romper la vista si falla el guardado
    const loanToSave = Object.assign({}, this.loan);

    // Convertimos las fechas a string 'YYYY-MM-DD' puro
    loanToSave.loanDate = this.formatDateOnly(start);
    loanToSave.returnDate = this.formatDateOnly(end);

    this.loanService.saveLoan(loanToSave).subscribe({
      next: () => {
        this.dialogRef.close();
      },
      error: (err) => {
        this.errorMessage = "Error al guardar: " + (err.error?.message || "Comprueba la disponibilidad del juego y del cliente.");
      }
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  /** Método auxiliar para extraer solo Año-Mes-Día en hora local */
  private formatDateOnly(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
