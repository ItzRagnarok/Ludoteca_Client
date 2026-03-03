import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Loan } from './model/Loan';
import { LOANS_DATA } from './model/mock-loan';
import { Pageable } from '../core/model/page/Pageable';
import { LoanPage } from './model/LoanPage';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  constructor(
    private http: HttpClient
  ) {}

  private baseUrl = 'http://localhost:8080/loan';

  getLoans(pageable: Pageable): Observable<LoanPage> {
    return of(LOANS_DATA);
  }

  saveLoan(loan: Loan): Observable<Loan> {
    const { id } = loan;
    const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;
    return this.http.put<Loan>(url, loan);
  }

  deleteLoan(idLoan: number): Observable<any> {
    return of(null);
  }
}
