export function initGrid(
  firstClickX: number,
  firstClickY: number,
  gridSize: number,
  mineCount: number
): number[][] {
  const newGrid: number[][] = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(0));

  // Place mines
  let minesPlaced: number = 0;
  while (minesPlaced < mineCount) {
    const x: number = Math.floor(Math.random() * gridSize);
    const y: number = Math.floor(Math.random() * gridSize);
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

function countAdjacentMines(grid: number[][], x: number, y: number): number {
  let count: number = 0;
  const gridSize: number = grid.length;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (x + i >= 0 && x + i < gridSize && y + j >= 0 && y + j < gridSize) {
        if (grid[x + i][y + j] === -1) count++;
      }
    }
  }
  return count;
}

export function checkWin(grid: number[][], revealed: boolean[][]): boolean {
  const gridSize: number = grid.length;
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (grid[i][j] !== -1 && !revealed[i][j]) {
        return false;
      }
    }
  }
  return true;
}

export function autoFlagRemainingCells(
  grid: number[][],
  revealed: boolean[][],
  flagged: boolean[][]
): { newFlagged: boolean[][]; newBombsLeft: number } {
  const gridSize: number = grid.length;
  const newFlagged: boolean[][] = flagged.map((row) => [...row]);
  let newBombsLeft: number = 0;

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
