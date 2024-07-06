export interface GameState {
  grid: number[][];
  revealed: boolean[][];
  flagged: boolean[][];
  gameOver: boolean;
  isFirstClick: boolean;
  timer: number;
  bombsLeft: number;
  hasWon: boolean;
}
