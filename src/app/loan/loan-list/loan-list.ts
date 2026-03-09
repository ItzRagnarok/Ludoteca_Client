import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LoanService } from '../loan.service';
import { Game } from '../../game/model/game';
import { Author } from '../../author/model/Author';
import { Loan } from '../model/Loan';
import { MatDialog } from '@angular/material/dialog';
import { LoanEdit } from '../loan-edit/loan-edit';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Pageable } from '../../core/model/page/Pageable';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { GameService } from '../../game/game.service';
import { ClientService } from '../../client/client.service';
import { Client } from '../../client/model/Client';
import { LoanFilters } from '../model/LoanFilters';
import { DialogConfirmation } from '../../core/dialog-confirmation/dialog-confirmation';

@Component({
  selector: 'app-loan-list',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    CommonModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule
  ],
  templateUrl: './loan-list.html',
  styleUrl: './loan-list.scss',
})
export class LoanList implements OnInit {
  pageNumber: number = 0;
  pageSize: number = 5;
  totalElements: number = 0;

  dataSource = new MatTableDataSource<Loan>([]);
  displayedColumns: string[] = ['id', 'gameTitle', 'clientName', 'loanDate', 'returnDate', 'action'];

  // Combos
  games: Game[] = [];
  clients: Client[] = [];
  loans: Loan[];

  // Filtros (template-driven)
  filterGame: Game | null = null;
  filterClient: Client | null = null;
  filterDate: Date | null = null;
  filterTitle: string;

  // Últimos filtros aplicados (para mantenerlos al cambiar de página)
  private lastFilters: LoanFilters = { gameId: null, clientId: null, date: null };

  constructor(
    private loanService: LoanService,
    public dialog: MatDialog,
    private gameService: GameService,
    private clientService: ClientService
  ) { }

  ngOnInit(): void {
    // Carga inicial de combos y primera página
    this.gameService.getGames().subscribe(games => (this.games = games));
    this.clientService.getClients().subscribe(clients => (this.clients = clients));

    this.loadPage();
  }


  /** Convierte Date a 'YYYY-MM-DD' (sin zona horaria) */
  private toISODateOnly(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  loadPage(event?: PageEvent) {
    const pageable: Pageable = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sort: [
        {
          property: 'id',
          direction: 'ASC',
        },
      ],
    };

    if (event != null) {
      pageable.pageSize = event.pageSize;
      pageable.pageNumber = event.pageIndex;
    }

    // Construimos el DTO juntando la paginación y los últimos filtros aplicados
    const searchDto = {
      pageable: pageable,
      gameId: this.lastFilters.gameId,
      clientId: this.lastFilters.clientId,
      date: this.lastFilters.date
    };

    // Enviamos el DTO completo en lugar de solo el 'pageable'
    this.loanService.getLoans(searchDto).subscribe((data) => {
      this.dataSource.data = data.content;
      this.pageNumber = data.pageable.pageNumber;
      this.pageSize = data.pageable.pageSize;
      this.totalElements = data.totalElements;
    });
  }


  /** Botón Filtrar */
  onSearch(): void {
    this.pageNumber = 0; // resetea a primera página
    this.lastFilters = {
      gameId: this.filterGame?.id ?? null,
      clientId: this.filterClient?.id ?? null,
      date: this.filterDate ? this.toISODateOnly(this.filterDate) : null,
    };
    this.loadPage();
  }

  /** Botón Limpiar */
  onCleanFilter(): void {
    this.filterGame = null;
    this.filterClient = null;
    this.filterDate = null;
    this.onSearch();
  }


  createLoan() {
    const dialogRef = this.dialog.open(LoanEdit, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  editLoan(loan: Loan) {
    const dialogRef = this.dialog.open(LoanEdit, {
      data: { loan }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  deleteLoan(loan: Loan) {
    const dialogRef = this.dialog.open(DialogConfirmation, {
      data: { title: "Eliminar préstamo", description: "Atención si borra el préstamo se perderán sus datos.<br> ¿Desea eliminar el préstamo?" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loanService.deleteLoan(loan.id).subscribe(result => {
          this.ngOnInit();
        }); 
      }
    });
  }
}
