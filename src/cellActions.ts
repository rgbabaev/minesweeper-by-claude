import { GameState } from './types';

export function revealCells(x: number, y: number, revealed: boolean[][], grid: number[][], flagged: boolean[][]): boolean[][] {
  const gridSize: number = grid.length;
  const newRevealed: boolean[][] = revealed.map((row) => [...row]);
  const stack: [number, number][] = [[x, y]];

  while (stack.length > 0) {
    const [currX, currY] = stack.pop()!;

    if (
      currX < 0 ||
      currX >= gridSize ||
      currY < 0 ||
      currY >= gridSize ||
      newRevealed[currX][currY] ||
      (flagged && flagged[currX][currY])
    )
      continue;

    newRevealed[currX][currY] = true;

    if (grid[currX][currY] === 0) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          stack.push([currX + i, currY + j]);
        }
      }
    }
  }

  return newRevealed;
}

export function chordAction(x: number, y: number, gameState: GameState): boolean[][] {
  const cell: number = gameState.grid[x][y];
  const gridSize: number = gameState.grid.length;
  if (cell <= 0 || !gameState.revealed[x][y]) return gameState.revealed;

  let flagCount: number = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (x + i >= 0 && x + i < gridSize && y + j >= 0 && y + j < gridSize) {
        if (gameState.flagged[x + i][y + j]) flagCount++;
      }
    }
  }

  if (flagCount === cell) {
    let newRevealed: boolean[][] = gameState.revealed.map((row) => [...row]);
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (x + i >= 0 && x + i < gridSize && y + j >= 0 && y + j < gridSize) {
          if (!gameState.flagged[x + i][y + j]) {
            newRevealed = revealCells(
              x + i,
              y + j,
              newRevealed,
              gameState.grid,
              gameState.flagged
            );
          }
        }
      }
    }
    return newRevealed;
  }

  return gameState.revealed;
}