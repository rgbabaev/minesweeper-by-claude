import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { initGrid, checkWin, autoFlagRemainingCells } from './gameLogic.js';

describe('gameLogic', async () => {
  const MINE_COUNT = 28;
  const GRID_SIZE = 15;

  await describe('initGrid', async () => {
    await it('should create a grid with correct dimensions', () => {
      const grid = initGrid(0, 0, GRID_SIZE, MINE_COUNT);
      assert.equal(grid.length, GRID_SIZE);
      assert.equal(grid[0].length, GRID_SIZE);
    });

    await it('should place the correct number of mines', () => {
      const grid = initGrid(0, 0, GRID_SIZE, MINE_COUNT);
      const mineCount = grid.flat().filter((cell) => cell === -1).length;
      assert.equal(mineCount, MINE_COUNT);
    });

    await it('should not place mines in the 3x3 area around the first click', () => {
      const firstClickX = 5;
      const firstClickY = 5;
      const grid = initGrid(firstClickX, firstClickY, GRID_SIZE, MINE_COUNT);

      for (let i = firstClickX - 1; i <= firstClickX + 1; i++) {
        for (let j = firstClickY - 1; j <= firstClickY + 1; j++) {
          assert.notEqual(grid[i][j], -1);
        }
      }
    });

    await it('should calculate correct numbers for cells', () => {
      const grid = initGrid(0, 0, GRID_SIZE, MINE_COUNT);
      grid.forEach((row, i) => {
        row.forEach((cell, j) => {
          if (cell !== -1) {
            const adjacentMines = countAdjacentMines(grid, i, j);
            assert.equal(cell, adjacentMines);
          }
        });
      });
    });
  });

  await describe('checkWin', async () => {
    await it('should return false when not all non-mine cells are revealed', () => {
      const grid = [
        [-1, 1, 0],
        [1, 1, 0],
        [0, 0, 0],
      ];
      const revealed = [
        [false, true, true],
        [true, true, false],
        [false, false, false],
      ];
      assert.equal(checkWin(grid, revealed), false);
    });

    await it('should return true when all non-mine cells are revealed', () => {
      const grid = [
        [-1, 1, 0],
        [1, 1, 0],
        [0, 0, 0],
      ];
      const revealed = [
        [false, true, true],
        [true, true, true],
        [true, true, true],
      ];
      assert.equal(checkWin(grid, revealed), true);
    });
  });

  await describe('autoFlagRemainingCells', async () => {
    await it('should flag all unrevealed mine cells', () => {
      const grid = [
        [-1, 1, 0],
        [1, 1, -1],
        [0, 1, 1],
      ];
      const revealed = [
        [false, true, true],
        [true, true, false],
        [true, true, true],
      ];
      const flagged = [
        [false, false, false],
        [false, false, false],
        [false, false, false],
      ];

      const { newFlagged, newBombsLeft } = autoFlagRemainingCells(
        grid,
        revealed,
        flagged
      );

      assert.equal(newFlagged[0][0], true);
      assert.equal(newFlagged[1][2], true);
      assert.equal(newBombsLeft, 0);
    });

    await it('should not change already flagged cells', () => {
      const grid = [
        [-1, 1, 0],
        [1, 1, -1],
        [0, 1, 1],
      ];
      const revealed = [
        [false, true, true],
        [true, true, false],
        [true, true, true],
      ];
      const flagged = [
        [true, false, false],
        [false, false, false],
        [false, false, false],
      ];

      const { newFlagged, newBombsLeft } = autoFlagRemainingCells(
        grid,
        revealed,
        flagged
      );

      assert.equal(newFlagged[0][0], true);
      assert.equal(newFlagged[1][2], true);
      assert.equal(newBombsLeft, 0);
    });
  });
});

// Helper function for testing initGrid
function countAdjacentMines(grid, x, y) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (
        x + i >= 0 &&
        x + i < grid.length &&
        y + j >= 0 &&
        y + j < grid[0].length
      ) {
        if (grid[x + i][y + j] === -1) count++;
      }
    }
  }
  return count;
}
