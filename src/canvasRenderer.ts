import { GameState } from './types';

// Flag SVG
const flagSvg: string = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <!-- Flag -->
    <rect x="30" y="20" width="5" height="60" fill="#8B4513" />
    <polygon points="35,20 75,35 35,50" fill="#FF0000" />
    
    <!-- Flag Details -->
    <rect x="30" y="15" width="7" height="5" fill="#A0522D" />
    <rect x="28" y="80" width="9" height="3" fill="#A0522D" />
    <polygon points="35,20 72,34 35,48" fill="#FF6347" />
    
    <!-- Wood Grain -->
    <line x1="32" y1="20" x2="32" y2="80" stroke="#A0522D" stroke-width="0.5" />
    <line x1="34" y1="20" x2="34" y2="80" stroke="#8B4513" stroke-width="0.5" />
    
    <!-- Flag Folds -->
    <path d="M35,25 Q55,32 35,40" fill="none" stroke="#FF6347" stroke-width="0.5" />
    <path d="M35,30 Q55,37 35,45" fill="none" stroke="#FF6347" stroke-width="0.5" />
  </svg>
`;

// Bomb SVG
const bombSvg: string = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <!-- Classic Naval Mine -->
    <circle cx="50" cy="50" r="30" fill="#333333" />
    
    <!-- Spikes -->
    <polygon points="50,10 55,20 45,20" fill="#555555" />
    <polygon points="50,90 55,80 45,80" fill="#555555" />
    <polygon points="10,50 20,55 20,45" fill="#555555" />
    <polygon points="90,50 80,55 80,45" fill="#555555" />
    <polygon points="22,22 32,32 28,36 18,26" fill="#555555" />
    <polygon points="78,78 68,68 72,64 82,74" fill="#555555" />
    <polygon points="22,78 32,68 28,64 18,74" fill="#555555" />
    <polygon points="78,22 68,32 72,36 82,26" fill="#555555" />
    
    <!-- Highlights -->
    <circle cx="40" cy="40" r="5" fill="#FFFFFF" fill-opacity="0.3" />
    <circle cx="60" cy="60" r="3" fill="#FFFFFF" fill-opacity="0.2" />
  </svg>
`;

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  gameState: GameState,
  cellSize: number
): void {
  const gridSize: number = gameState.grid.length;
  const scale: number = ctx.getTransform().a;

  ctx.save();
  ctx.scale(1 / scale, 1 / scale);
  ctx.clearRect(0, 0, gridSize * cellSize * scale, gridSize * cellSize * scale);
  ctx.restore();

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const cellX = i * cellSize;
      const cellY = j * cellSize;

      if (gameState.revealed[i][j]) {
        // Revealed cell
        ctx.fillStyle = '#e0e0e0'; // Slightly lighter gray for revealed cells
        ctx.fillRect(cellX, cellY, cellSize, cellSize);

        // Add subtle border
        ctx.strokeStyle = '#c0c0c0'; // Light gray border
        ctx.lineWidth = 1;
        ctx.strokeRect(cellX, cellY, cellSize, cellSize);

        if (gameState.grid[i][j] === -1) {
          drawSvgToCanvas(ctx, bombSvg, cellX, cellY, cellSize, cellSize);
        } else if (gameState.grid[i][j] > 0) {
          ctx.fillStyle = getNumberColor(gameState.grid[i][j]);
          ctx.font = `bold ${cellSize / 2}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(
            gameState.grid[i][j].toString(),
            cellX + cellSize / 2,
            cellY + cellSize / 2
          );
        }
      } else {
        // Not revealed cell - draw in pseudo-3D style
        // Main cell face
        ctx.fillStyle = '#c0c0c0';
        ctx.fillRect(cellX, cellY, cellSize, cellSize);

        // Top edge
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(cellX, cellY);
        ctx.lineTo(cellX + cellSize, cellY);
        ctx.lineTo(cellX + cellSize - 2, cellY + 2);
        ctx.lineTo(cellX + 2, cellY + 2);
        ctx.closePath();
        ctx.fill();

        // Left edge
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(cellX, cellY);
        ctx.lineTo(cellX, cellY + cellSize);
        ctx.lineTo(cellX + 2, cellY + cellSize - 2);
        ctx.lineTo(cellX + 2, cellY + 2);
        ctx.closePath();
        ctx.fill();

        // Bottom edge
        ctx.fillStyle = '#808080';
        ctx.beginPath();
        ctx.moveTo(cellX, cellY + cellSize);
        ctx.lineTo(cellX + cellSize, cellY + cellSize);
        ctx.lineTo(cellX + cellSize - 2, cellY + cellSize - 2);
        ctx.lineTo(cellX + 2, cellY + cellSize - 2);
        ctx.closePath();
        ctx.fill();

        // Right edge
        ctx.fillStyle = '#808080';
        ctx.beginPath();
        ctx.moveTo(cellX + cellSize, cellY);
        ctx.lineTo(cellX + cellSize, cellY + cellSize);
        ctx.lineTo(cellX + cellSize - 2, cellY + cellSize - 2);
        ctx.lineTo(cellX + cellSize - 2, cellY + 2);
        ctx.closePath();
        ctx.fill();
      }

      if (gameState.flagged[i][j]) {
        drawSvgToCanvas(ctx, flagSvg, cellX, cellY, cellSize, cellSize);
      }
    }
  }
}

function getNumberColor(num: number): string {
  const colors = [
    '#0000FF', // 1: Blue
    '#008000', // 2: Green
    '#FF0000', // 3: Red
    '#000080', // 4: Navy
    '#800000', // 5: Maroon
    '#008080', // 6: Teal
    '#000000', // 7: Black
    '#808080', // 8: Gray
  ];
  return colors[num - 1] || '#000000';
}

function drawSvgToCanvas(
  ctx: CanvasRenderingContext2D,
  svgString: string,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, x, y, width, height);
  };
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
}
