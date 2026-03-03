import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Client } from '../model/Client';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-client-edit',
  imports: [
    FormsModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule
  ],
  templateUrl: './client-edit.html',
  styleUrl: './client-edit.scss',
})
export class ClientEdit implements OnInit {
  client: Client;
  errorMessage: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<ClientEdit>,
    @Inject(MAT_DIALOG_DATA) public data: {client: Client}, 
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.client = this.data.client ? Object.assign({}, this.data.client) : new Client();
  }
  
// onSave() {
//   this.clientService.saveClient(this.client).subscribe(() => {
//     this.dialogRef.close();
//   });
// }


onSave() {
  this.clientService.saveClient(this.client).subscribe({
    next: () => this.dialogRef.close(),
    error: (err) => {
      if (err.status === 409) {
        alert('El nombre ya existe');
      }
    }
  });
}

// onSave() {
//   this.errorMessage = null; // Limpiar mensaje previo

//   this.clientService.saveClient(this.client).subscribe({
//     next: () => {
//       this.dialogRef.close();
//     },
//     error: (err) => {
//       if (err.status === 409) {
//         this.errorMessage = err?.error?.message || 'El nombre ya existe';
//       } else {
//         this.errorMessage = 'Error inesperado al guardar.';
//       }
//     }
//   });
// }

  onClose() {
    this.dialogRef.close();
  }

  
}
