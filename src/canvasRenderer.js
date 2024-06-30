// Flag SVG
const flagSvg = `
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
const bombSvg = `
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

export function drawGrid(ctx, gameState, cellSize) {
  const gridSize = gameState.grid.length;
  ctx.clearRect(0, 0, gridSize * cellSize, gridSize * cellSize);
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (gameState.revealed[i][j]) {
        ctx.fillStyle = 'lightgray';
        ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);

        if (gameState.grid[i][j] === -1) {
          drawSvgToCanvas(
            ctx,
            bombSvg,
            i * cellSize,
            j * cellSize,
            cellSize,
            cellSize
          );
        } else if (gameState.grid[i][j] > 0) {
          ctx.fillStyle = 'black';
          ctx.font = '20px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(
            gameState.grid[i][j],
            i * cellSize + cellSize / 2,
            j * cellSize + cellSize / 2
          );
        }
      } else {
        ctx.fillStyle = 'gray';
        ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
      }

      ctx.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);

      if (gameState.flagged[i][j]) {
        drawSvgToCanvas(
          ctx,
          flagSvg,
          i * cellSize,
          j * cellSize,
          cellSize,
          cellSize
        );
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
