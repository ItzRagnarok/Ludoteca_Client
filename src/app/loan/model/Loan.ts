import { Game } from "../../game/model/game";
import { Client } from "../../client/model/Client";

export class Loan {
    id: number;
    game: Game;
    client: Client;
    
    loanDate: string | Date;      // fecha de inicio
    returnDate?: string | Date;   // fecha de fin (opcional si aún no devolvió)

}