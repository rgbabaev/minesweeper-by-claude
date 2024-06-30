import { GRID_SIZE, CELL_SIZE } from './constants';

// Flag SVG
const flagSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2">
    <line x1="4" y1="2" x2="4" y2="22" />
    <polygon points="4,2 20,7 4,12" fill="red" />
  </svg>
`;

// Bomb SVG
const bombSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="2" x2="12" y2="4" stroke="white" stroke-width="2" />
    <line x1="12" y1="20" x2="12" y2="22" stroke="white" stroke-width="2" />
    <line x1="2" y1="12" x2="4" y2="12" stroke="white" stroke-width="2" />
    <line x1="20" y1="12" x2="22" y2="12" stroke="white" stroke-width="2" />
    <circle cx="12" cy="12" r="3" fill="white" />
  </svg>
`;

export function drawGrid(ctx, gameState) {
  ctx.clearRect(0, 0, GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (gameState.revealed[i][j]) {
        ctx.fillStyle = 'lightgray';
        ctx.fillRect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);

        if (gameState.grid[i][j] === -1) {
          drawSvgToCanvas(ctx, bombSvg, i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        } else if (gameState.grid[i][j] > 0) {
          ctx.fillStyle = 'black';
          ctx.font = '20px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(gameState.grid[i][j], i * CELL_SIZE + CELL_SIZE / 2, j * CELL_SIZE + CELL_SIZE / 2);
        }
      } else {
        ctx.fillStyle = 'gray';
        ctx.fillRect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }

      ctx.strokeRect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);

      if (gameState.flagged[i][j]) {
        drawSvgToCanvas(ctx, flagSvg, i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  }
}

function drawSvgToCanvas(ctx, svgString, x, y, width, height) {
  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, x, y, width, height);
  };
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
}
