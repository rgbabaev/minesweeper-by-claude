export function initGrid(firstClickX, firstClickY, gridSize, mineCount) {
  const newGrid = Array(gridSize)
    .fill()
    .map(() => Array(gridSize).fill(0));

  // Place mines
  let minesPlaced = 0;
  while (minesPlaced < mineCount) {
    const x = Math.floor(Math.random() * gridSize);
    const y = Math.floor(Math.random() * gridSize);
    if (
      newGrid[x][y] !== -1 &&
      (Math.abs(x - firstClickX) > 1 || Math.abs(y - firstClickY) > 1)
    ) {
      newGrid[x][y] = -1;
      minesPlaced++;
    }
  }

  // Calculate numbers
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (newGrid[i][j] !== -1) {
        newGrid[i][j] = countAdjacentMines(newGrid, i, j);
      }
    }
  }

  return newGrid;
}

function countAdjacentMines(grid, x, y) {
  let count = 0;
  const gridSize = grid.length;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (x + i >= 0 && x + i < gridSize && y + j >= 0 && y + j < gridSize) {
        if (grid[x + i][y + j] === -1) count++;
      }
    }
  }
  return count;
}

export function checkWin(grid, revealed) {
  const gridSize = grid.length;
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (grid[i][j] !== -1 && !revealed[i][j]) {
        return false;
      }
    }
  }
  return true;
}

export function autoFlagRemainingCells(grid, revealed, flagged) {
  const gridSize = grid.length;
  const newFlagged = flagged.map((row) => [...row]);
  let newBombsLeft = 0;

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
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
