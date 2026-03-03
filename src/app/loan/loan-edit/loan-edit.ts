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
import { MatNativeDateModule } from '@angular/material/core';

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
    // Si pasamos un loan desde la tabla (para editar), lo clonamos. Si no, creamos uno nuevo vacío.
    this.loan = this.data.loan ? Object.assign({}, this.data.loan) : new Loan();

    // Cargamos los datos para llenar los <mat-select>
    this.clientService.getClients().subscribe(clients => this.clients = clients);
    this.gameService.getGames().subscribe(games => this.games = games);
  }

  onSave() {
    this.errorMessage = null; // Reseteamos el error

    // Validamos que todos los campos estén llenos
    if (!this.loan.client || !this.loan.game || !this.loan.loanDate || !this.loan.returnDate) {
      this.errorMessage = "Todos los campos son obligatorios.";
      return;
    }

    const start = new Date(this.loan.loanDate);
    const end = new Date(this.loan.returnDate);

    // Validación 1: Fecha fin no puede ser anterior a fecha inicio
    if (end < start) {
      this.errorMessage = "La fecha de fin no puede ser anterior a la fecha de inicio.";
      return;
    }

    // Validación 2: Máximo 14 días
    // Calculamos la diferencia en milisegundos y la pasamos a días
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 14) {
      this.errorMessage = "El periodo de préstamo máximo es de 14 días.";
      return;
    }

    // Si pasa las validaciones del front, guardamos.
    // Aquí preparamos la captura de errores del BACKEND (Validaciones 3 y 4)
    this.loanService.saveLoan(this.loan).subscribe({
      next: () => {
        this.dialogRef.close();
      },
      error: (err) => {
        // Si el backend devuelve un bad request (400) 
        // o conflicto (409), pinto el mensaje de error aquí.
        this.errorMessage = "Error al guardar: " + (err.error?.message || "Comprueba la disponibilidad del juego y del cliente.");
      }
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}
