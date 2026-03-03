import { Game } from "../../game/model/game";
import { Client } from "../../client/model/Client";

export class Loan {
    id: number;
    game: Game;
    client: Client;
    
    loanDate: string | Date; 
    returnDate?: string | Date; 

}