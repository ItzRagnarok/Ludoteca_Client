import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Client } from '../model/Client';
import { ClientService } from '../client.service';
import { MatDialog } from '@angular/material/dialog';
import { ClientEdit } from '../client-edit/client-edit';
import { DialogConfirmation } from '../../core/dialog-confirmation/dialog-confirmation';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-client-list',
  imports: [
    MatButtonModule, 
    MatIconModule,
    MatTableModule, 
    CommonModule
  ],
  templateUrl: './client-list.html',
  styleUrl: './client-list.scss',
})
export class ClientList implements OnInit {
  dataSource = new MatTableDataSource<Client>();
  displayedColumns: string[] = ['id', 'name', 'action'];

  constructor(
    private clientService: ClientService,
    public dialog: MatDialog, 
  ) {}

  ngOnInit(): void {
    this.clientService.getClients().subscribe(
      clients => this.dataSource.data = clients
    );
  }

  createClient() {
    const dialogRef = this.dialog.open(ClientEdit, {
      data: {}
    })

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    })
  }

  editClient(client: Client) {
    const dialogRef = this.dialog.open(ClientEdit, {
      data: {client}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  deleteClient(client: Client) {
    const dialogRef = this.dialog.open(DialogConfirmation, {
      data: { title: "Eliminar cliente", description: "Atención si borra el cliente se perderán sus datos.<br> ¿Desea eliminar el cliente?"}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.clientService.deleteClient(client.id).subscribe(result => {
          this.ngOnInit();
        });
      }
    })
  }
  
}
