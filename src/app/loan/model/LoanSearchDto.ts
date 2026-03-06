import { Pageable } from "../../core/model/page/Pageable";

export class LoanSearchDto {
    pageable: Pageable;
    gameId?: number | null;
    clientId?: number | null;
    date?: string | null;
}