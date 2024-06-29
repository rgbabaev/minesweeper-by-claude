import React, { useEffect, useRef, useState } from 'react';

const MinesweeperGame = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState(() => {
    const grid = Array(10)
      .fill()
      .map(() => Array(10).fill(0));
    const revealed = Array(10)
      .fill()
      .map(() => Array(10).fill(false));
    const flagged = Array(10)
      .fill()
      .map(() => Array(10).fill(false));
    return { grid, revealed, flagged, gameOver: false };
  });

  const GRID_SIZE = 10;
  const CELL_SIZE = 30;
  const MINE_COUNT = 15;

  useEffect(() => {
    initGrid();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    drawGrid(ctx);
  }, [gameState]);

  function initGrid() {
    setGameState((prevState) => {
      const newGrid = Array(GRID_SIZE)
        .fill()
        .map(() => Array(GRID_SIZE).fill(0));

      // Place mines
      let minesPlaced = 0;
      while (minesPlaced < MINE_COUNT) {
        const x = Math.floor(Math.random() * GRID_SIZE);
        const y = Math.floor(Math.random() * GRID_SIZE);
        if (newGrid[x][y] !== -1) {
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

      return { ...prevState, grid: newGrid };
    });
  }

  function countAdjacentMines(grid, x, y) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (
          x + i >= 0 &&
          x + i < GRID_SIZE &&
          y + j >= 0 &&
          y + j < GRID_SIZE
        ) {
          if (grid[x + i][y + j] === -1) count++;
        }
      }
    }
    return count;
  }

  function drawGrid(ctx) {
    ctx.clearRect(0, 0, GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (gameState.revealed[i][j]) {
          if (gameState.grid[i][j] === -1) {
            ctx.fillStyle = 'red';
          } else {
            ctx.fillStyle = 'lightgray';
          }
        } else {
          ctx.fillStyle = 'gray';
        }
        ctx.fillRect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        ctx.strokeRect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);

        if (gameState.revealed[i][j] && gameState.grid[i][j] > 0) {
          ctx.fillStyle = 'black';
          ctx.font = '20px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(
            gameState.grid[i][j],
            i * CELL_SIZE + CELL_SIZE / 2,
            j * CELL_SIZE + CELL_SIZE / 2
          );
        }

        if (gameState.flagged[i][j]) {
          ctx.fillStyle = 'orange';
          ctx.beginPath();
          ctx.moveTo(i * CELL_SIZE + 5, j * CELL_SIZE + 5);
          ctx.lineTo(
            i * CELL_SIZE + CELL_SIZE - 5,
            j * CELL_SIZE + CELL_SIZE / 2
          );
          ctx.lineTo(i * CELL_SIZE + 5, j * CELL_SIZE + CELL_SIZE - 5);
          ctx.fill();
        }
      }
    }
  }

  function revealCells(
    x,
    y,
    newRevealed = gameState.revealed.map((row) => [...row])
  ) {
    const stack = [[x, y]];

    while (stack.length > 0) {
      const [currX, currY] = stack.pop();

      if (
        currX < 0 ||
        currX >= GRID_SIZE ||
        currY < 0 ||
        currY >= GRID_SIZE ||
        newRevealed[currX][currY]
      )
        continue;

      newRevealed[currX][currY] = true;

      if (gameState.grid[currX][currY] === 0) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            stack.push([currX + i, currY + j]);
          }
        }
      }
    }

    return newRevealed;
  }

  function chordAction(x, y) {
    const cell = gameState.grid[x][y];
    if (cell <= 0 || !gameState.revealed[x][y]) return gameState.revealed;

    let flagCount = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (
          x + i >= 0 &&
          x + i < GRID_SIZE &&
          y + j >= 0 &&
          y + j < GRID_SIZE
        ) {
          if (gameState.flagged[x + i][y + j]) flagCount++;
        }
      }
    }

    if (flagCount === cell) {
      let newRevealed = gameState.revealed.map((row) => [...row]);
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (
            x + i >= 0 &&
            x + i < GRID_SIZE &&
            y + j >= 0 &&
            y + j < GRID_SIZE
          ) {
            if (!gameState.flagged[x + i][y + j]) {
              newRevealed = revealCells(x + i, y + j, newRevealed);
            }
          }
        }
      }
      return newRevealed;
    }

    return gameState.revealed;
  }

  function handleClick(event) {
    event.preventDefault();
    if (gameState.gameOver) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / CELL_SIZE);
    const y = Math.floor((event.clientY - rect.top) / CELL_SIZE);

    if (event.button === 2) {
      // Right click
      setGameState((prev) => {
        const newFlagged = prev.flagged.map((row) => [...row]);
        newFlagged[x][y] = !newFlagged[x][y];
        return { ...prev, flagged: newFlagged };
      });
    } else if (event.button === 0) {
      // Left click
      if (gameState.flagged[x][y]) return; // Can't reveal flagged cells

      setGameState((prev) => {
        let newRevealed;
        if (prev.revealed[x][y]) {
          newRevealed = chordAction(x, y);
        } else {
          newRevealed = revealCells(x, y);
        }

        if (
          newRevealed.some((row, i) =>
            row.some((cell, j) => cell && prev.grid[i][j] === -1)
          )
        ) {
          return { ...prev, revealed: newRevealed, gameOver: true };
        }

        const hasWon = checkWin(prev.grid, newRevealed);

        return { ...prev, revealed: newRevealed, gameOver: hasWon };
      });
    }
  }

  function checkWin(grid, revealed) {
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (grid[i][j] !== -1 && !revealed[i][j]) return false;
      }
    }
    return true;
  }

  return (
    <div className='flex flex-col items-center'>
      <canvas
        ref={canvasRef}
        width={GRID_SIZE * CELL_SIZE}
        height={GRID_SIZE * CELL_SIZE}
        onClick={handleClick}
        onContextMenu={handleClick}
        className='border border-gray-300'
      />
      {gameState.gameOver &&
        gameState.revealed.some((row, i) =>
          row.some((cell, j) => cell && gameState.grid[i][j] === -1)
        ) && (
          <div className='mt-4 text-xl font-bold text-red-500'>Game Over!</div>
        )}
      {gameState.gameOver &&
        !gameState.revealed.some((row, i) =>
          row.some((cell, j) => cell && gameState.grid[i][j] === -1)
        ) && (
          <div className='mt-4 text-xl font-bold text-green-500'>
            Congratulations! You won!
          </div>
        )}
    </div>
  );
};

export default MinesweeperGame;
