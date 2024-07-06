import React, { useEffect, useRef, useState } from 'react';
import { initGrid, checkWin, autoFlagRemainingCells } from './gameLogic';
import { drawGrid } from './canvasRenderer';
import { GRID_SIZE, CELL_SIZE, MINE_COUNT } from './constants';
import { revealCells, chordAction } from './cellActions';
import { GameState } from './types';

const MinesweeperGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    grid: Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(0)),
    revealed: Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(false)),
    flagged: Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(false)),
    gameOver: false,
    isFirstClick: true,
    timer: 0,
    bombsLeft: MINE_COUNT,
    hasWon: false,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const devicePixelRatio = window.devicePixelRatio || 1;

    canvas.width = GRID_SIZE * CELL_SIZE * devicePixelRatio;
    canvas.height = GRID_SIZE * CELL_SIZE * devicePixelRatio;
    canvas.style.width = `${GRID_SIZE * CELL_SIZE}px`;
    canvas.style.height = `${GRID_SIZE * CELL_SIZE}px`;

    ctx.scale(devicePixelRatio, devicePixelRatio);

    drawGrid(ctx, gameState, CELL_SIZE);
  }, [gameState]);

  useEffect(() => {
    let interval: number | undefined;
    if (!gameState.isFirstClick && !gameState.gameOver) {
      interval = window.setInterval(() => {
        setGameState((prev) => ({ ...prev, timer: prev.timer + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState.isFirstClick, gameState.gameOver]);

  function handleClick(event: React.MouseEvent<HTMLCanvasElement>): void {
    event.preventDefault();
    if (gameState.gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / CELL_SIZE);
    const y = Math.floor((event.clientY - rect.top) / CELL_SIZE);

    if (event.button === 2) {
      // Right click
      setGameState((prev) => {
        if (prev.revealed[x][y]) return prev; // Can't flag revealed cells
        const newFlagged = prev.flagged.map((row) => [...row]);
        newFlagged[x][y] = !newFlagged[x][y];
        const newBombsLeft = prev.bombsLeft + (newFlagged[x][y] ? -1 : 1);
        return { ...prev, flagged: newFlagged, bombsLeft: newBombsLeft };
      });
    } else if (event.button === 0) {
      // Left click
      if (gameState.flagged[x][y]) return; // Can't reveal flagged cells

      setGameState((prev) => {
        if (prev.isFirstClick) {
          const newGrid = initGrid(x, y, GRID_SIZE, MINE_COUNT);
          const newRevealed = revealCells(
            x,
            y,
            prev.revealed.map((row) => [...row]),
            newGrid,
            prev.flagged
          );
          return {
            ...prev,
            grid: newGrid,
            revealed: newRevealed,
            isFirstClick: false,
          };
        } else {
          let newRevealed: boolean[][];
          if (prev.revealed[x][y]) {
            newRevealed = chordAction(x, y, prev);
          } else {
            newRevealed = revealCells(
              x,
              y,
              prev.revealed.map((row) => [...row]),
              prev.grid,
              prev.flagged
            );
          }

          if (
            newRevealed.some((row, i) =>
              row.some((cell, j) => cell && prev.grid[i][j] === -1)
            )
          ) {
            return {
              ...prev,
              revealed: newRevealed,
              gameOver: true,
              hasWon: false,
            };
          }

          const hasWon = checkWin(prev.grid, newRevealed);

          if (hasWon) {
            const { newFlagged, newBombsLeft } = autoFlagRemainingCells(
              prev.grid,
              newRevealed,
              prev.flagged
            );
            return {
              ...prev,
              revealed: newRevealed,
              flagged: newFlagged,
              bombsLeft: newBombsLeft,
              gameOver: true,
              hasWon: true,
            };
          }

          return { ...prev, revealed: newRevealed };
        }
      });
    }
  }

  return (
    <div className='flex flex-col items-center'>
      <div className='mb-4 flex justify-between w-full'>
        <div className='text-xl font-bold'>
          Bombs left: {gameState.bombsLeft}
        </div>
        <div className='text-xl font-bold'>Time: {gameState.timer}s</div>
      </div>
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        onContextMenu={handleClick}
        className='border border-gray-300'
      />
      {gameState.gameOver && !gameState.hasWon && (
        <div className='mt-4 text-xl font-bold text-red-500'>Game Over!</div>
      )}
      {gameState.gameOver && gameState.hasWon && (
        <div className='mt-4 text-xl font-bold text-green-500'>
          Congratulations! You won!
        </div>
      )}
    </div>
  );
};

export default MinesweeperGame;
