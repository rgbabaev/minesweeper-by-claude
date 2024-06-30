import { GRID_SIZE, MINE_COUNT } from './constants';

export function initGrid(firstClickX, firstClickY) {
  const newGrid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));

  // Place mines
  let minesPlaced = 0;
  while (minesPlaced < MINE_COUNT) {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    if (newGrid[x][y] !== -1 && (Math.abs(x - firstClickX) > 1 || Math.abs(y - firstClickY) > 1)) {
      newGrid[x][y] = -1;
      minesPlaced++;
    }
  }

  // Calculate numbers
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (newGrid[i][j] !== -1) {
        newGrid[i][j] = countAdjacentMines(newGrid, i, j);
      }
    }
  }

  return newGrid;
}

function countAdjacentMines(grid, x, y) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (x + i >= 0 && x + i < GRID_SIZE && y + j >= 0 && y + j < GRID_SIZE) {
        if (grid[x + i][y + j] === -1) count++;
      }
    }
  }
  return count;
}

export function checkWin(grid, revealed) {
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j] !== -1 && !revealed[i][j]) {
        return false;
      }
    }
  }
  return true;
}

export function autoFlagRemainingCells(grid, revealed, flagged) {
  const newFlagged = flagged.map((row) => [...row]);
  let newBombsLeft = 0;

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j] === -1 && !revealed[i][j]) {
        newFlagged[i][j] = true;
      }
      if (grid[i][j] === -1 && !newFlagged[i][j]) {
        newBombsLeft++;
      }
    }
  }

  return { newFlagged, newBombsLeft };
}
