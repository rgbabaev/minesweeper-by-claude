import { GRID_SIZE } from './constants';

export function revealCells(x, y, revealed, grid) {
  const newRevealed = revealed.map((row) => [...row]);
  const stack = [[x, y]];

  while (stack.length > 0) {
    const [currX, currY] = stack.pop();

    if (currX < 0 || currX >= GRID_SIZE || currY < 0 || currY >= GRID_SIZE || newRevealed[currX][currY]) continue;

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

export function chordAction(x, y, gameState) {
  const cell = gameState.grid[x][y];
  if (cell <= 0 || !gameState.revealed[x][y]) return gameState.revealed;

  let flagCount = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (x + i >= 0 && x + i < GRID_SIZE && y + j >= 0 && y + j < GRID_SIZE) {
        if (gameState.flagged[x + i][y + j]) flagCount++;
      }
    }
  }

  if (flagCount === cell) {
    let newRevealed = gameState.revealed.map((row) => [...row]);
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (x + i >= 0 && x + i < GRID_SIZE && y + j >= 0 && y + j < GRID_SIZE) {
          if (!gameState.flagged[x + i][y + j]) {
            newRevealed = revealCells(x + i, y + j, newRevealed, gameState.grid);
          }
        }
      }
    }
    return newRevealed;
  }

  return gameState.revealed;
}
