import { Client } from "../../client/model/Client";
import { Game } from "../../game/model/game";
import { Loan } from "./Loan";
import { LoanPage } from "./LoanPage"

export const LOANS_DATA: LoanPage = { 
    content: [
    {
        id: 1,
        game: { id: 10, title: 'Catan' } as Game,
        client: { id: 100, name: 'Ana Pérez' } as Client,
        loanDate: '2026-03-01', 
        returnDate: '2026-03-10',
        // loanDate: '2026-03-01T10:00:00Z', 
        // returnDate: '2026-03-10T12:30:00Z',
    },
    {
        id: 2,
        game: { id: 11, title: 'Azul' } as Game,
        client: { id: 101, name: 'Luis Gómez' } as Client,
        loanDate: new Date('2026-03-02'),
        returnDate: new Date('2026-03-07')
        // loanDate: new Date('2026-03-02T09:15:00Z'),
        // returnDate: new Date('2026-03-07T09:15:00Z')
    },
],
    pageable: {
        pageSize: 5,
        pageNumber: 0,
        sort: [{ property: 'id', direction: 'ASC' }],
    },
    totalElements: 7,
};