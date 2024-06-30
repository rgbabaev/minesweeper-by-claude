import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { revealCells, chordAction } from './cellActions.js';

describe('cellActions', () => {
  describe('revealCells', () => {
    const grid = [
      [1, 1, 1, 0, 0],
      [1, -1, 1, 0, 0],
      [1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ];

    it('should reveal a single cell when clicked on a number', () => {
      const revealed = Array(5)
        .fill()
        .map(() => Array(5).fill(false));
      const newRevealed = revealCells(0, 0, revealed, grid);
      const expectedRevealed = [
        [true, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
      ];
      assert.deepEqual(newRevealed, expectedRevealed);
    });

    it('should reveal multiple cells when clicked on an empty cell', () => {
      const revealed = Array(5)
        .fill()
        .map(() => Array(5).fill(false));
      const newRevealed = revealCells(3, 3, revealed, grid);

      const expectedRevealed = [
        [false, false, true, true, true],
        [false, false, true, true, true],
        [true, true, true, true, true],
        [true, true, true, true, true],
        [true, true, true, true, true],
      ];

      assert.deepEqual(newRevealed, expectedRevealed);
    });
    it('should not reveal flagged cells', () => {
      const revealed = Array(5)
        .fill()
        .map(() => Array(5).fill(false));
      const flagged = [
        [false, true, false, false, false],
        [true, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
      ];
      const newRevealed = revealCells(0, 0, revealed, grid, flagged);
      const expectedRevealed = [
        [true, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
      ];
      assert.deepEqual(newRevealed, expectedRevealed);
    });

    it('should handle boundary conditions and multiple zero cells correctly', () => {
      const revealed = Array(5)
        .fill()
        .map(() => Array(5).fill(false));

      // Test revealing from a zero cell
      const newRevealed = revealCells(3, 3, revealed, grid);

      const expectedRevealed = [
        [false, false, true, true, true],
        [false, false, true, true, true],
        [true, true, true, true, true],
        [true, true, true, true, true],
        [true, true, true, true, true],
      ];

      assert.deepEqual(newRevealed, expectedRevealed);
    });
  });

  describe('chordAction', () => {
    it('should not reveal any cells if the number of adjacent flags does not match the cell value', () => {
      const gameState = {
        grid: [
          [1, 1, 1],
          [1, 2, 1],
          [1, 1, 1],
        ],
        revealed: [
          [true, true, true],
          [true, true, true],
          [false, false, false],
        ],
        flagged: [
          [false, false, false],
          [false, false, false],
          [false, false, false],
        ],
      };
      const newRevealed = chordAction(1, 1, gameState);
      assert.deepEqual(newRevealed, gameState.revealed);
    });

    it('should reveal adjacent non-flagged cells if the number of adjacent flags matches the cell value', () => {
      const gameState = {
        grid: [
          [1, 1, -1],
          [1, 2, 1],
          [-1, 1, 0],
        ],
        revealed: [
          [true, true, false],
          [true, true, false],
          [false, false, false],
        ],
        flagged: [
          [false, false, true],
          [false, false, false],
          [true, false, false],
        ],
      };
      const newRevealed = chordAction(1, 1, gameState);
      const expectedRevealed = [
        [true, true, false],
        [true, true, true],
        [false, true, true],
      ];
      assert.deepEqual(newRevealed, expectedRevealed);
    });

    it('should not reveal flagged cells during chord action', () => {
      const gameState = {
        grid: [
          [1, 1, 1],
          [1, 2, 1],
          [1, 1, 1],
        ],
        revealed: [
          [true, true, true],
          [true, true, true],
          [false, false, false],
        ],
        flagged: [
          [false, false, false],
          [false, false, false],
          [true, true, false],
        ],
      };
      const newRevealed = chordAction(1, 1, gameState);
      assert.deepEqual(newRevealed, [
        [true, true, true],
        [true, true, true],
        [false, false, true],
      ]);
    });

    it('should not perform chord action on unrevealed cells', () => {
      const gameState = {
        grid: [
          [1, 1, 1],
          [1, 2, 1],
          [1, 1, 1],
        ],
        revealed: [
          [false, false, false],
          [false, false, false],
          [false, false, false],
        ],
        flagged: [
          [false, false, false],
          [false, false, false],
          [false, false, false],
        ],
      };
      const newRevealed = chordAction(1, 1, gameState);
      assert.deepEqual(newRevealed, gameState.revealed);
    });
  });
});
