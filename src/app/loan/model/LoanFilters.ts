export interface LoanFilters {
  /** id del juego seleccionado (o null si "Todos") */
  gameId?: number | null;

  /** id del cliente seleccionado (o null si "Todos") */
  clientId?: number | null;

  /** Fecha en formato 'YYYY-MM-DD' para buscar préstamos activos ese día */
  date?: string | null;
}
