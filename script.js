let board = [];
let emptyTile = { row: 3, col: 3 };
let moves = 0;
let time = 0;
let timerInterval;

// Tile dimensions (in pixels) for calculating background position
const tileSize = 80; 

// Function to initialize a new randomized game
function newGame() {
  moves = 0;
  time = 0;
  document.getElementById("moveCount").innerText = moves;
  document.getElementById("timer").innerText = time;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    time++;
    document.getElementById("timer").innerText = time;
  }, 1000);
  generateBoard();
}

// Function to generate a random board (for full random play)
function generateBoard() {
  let numbers = [...Array(15).keys()].map(x => x + 1);
  numbers.sort(() => Math.random() - 0.5);
  numbers.push(null); 

  board = [];
  let index = 0;
  for (let r = 0; r < 4; r++) {
    board[r] = [];
    for (let c = 0; c < 4; c++) {
      board[r][c] = numbers[index++];
      if (board[r][c] === null) {
        emptyTile = { row: r, col: c };
      }
    }
  }
  drawBoard();
}

// Function to render the board
function drawBoard() {
  let tableHTML = "";
  for (let r = 0; r < 4; r++) {
    tableHTML += "<tr>";
    for (let c = 0; c < 4; c++) {
      let tile = board[r][c];
      let id = `cell${r}${c}`;
      if (tile === null) {
        tableHTML += `<td id="${id}" class="blank" onclick="clickTile(${r}, ${c})"></td>`;
      } else {
        let pos = getBackgroundPosition(tile);
        tableHTML += `<td id="${id}" class="tile" onclick="clickTile(${r}, ${c})" style="background-image: url('puzzle.png'); background-position: ${pos};"></td>`;
      }
    }
    tableHTML += "</tr>";
  }
  document.getElementById("puzzleBoard").innerHTML = tableHTML;
}

function getBackgroundPosition(tile) {
  let index = tile - 1;
  let row = Math.floor(index / 4);
  let col = index % 4;
  return `-${col * tileSize}px -${row * tileSize}px`;
}

function clickTile(r, c) {
  if (
    r >= 0 && r < 4 && c >= 0 && c < 4 &&
    ((Math.abs(emptyTile.row - r) === 1 && emptyTile.col === c) ||
     (Math.abs(emptyTile.col - c) === 1 && emptyTile.row === r))
  ) {
    board[emptyTile.row][emptyTile.col] = board[r][c];
    board[r][c] = null;
    emptyTile = { row: r, col: c };
    moves++;
    document.getElementById("moveCount").innerText = moves;
    drawBoard();
    checkWin();
  }
}

// Function to check for win condition
function checkWin() {
  let count = 1;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (r === 3 && c === 3) break;
      if (board[r][c] !== count) return;
      count++;
    }
  }
  clearInterval(timerInterval);
  setTimeout(() => {
    if (confirm(`Congratulations! You won in ${moves} moves and ${time} seconds. Do you want to play again?`)) {
      newGame();
    }
  }, 500);
}

// Function to create a "Simple Game" where the board is one move away from solved
function simpleGame() {
  clearInterval(timerInterval);
  moves = 0;
  time = 0;
  document.getElementById("moveCount").innerText = moves;
  document.getElementById("timer").innerText = time;
  
  board = [];
  let count = 1;
  for (let r = 0; r < 4; r++) {
    board[r] = [];
    for (let c = 0; c < 4; c++) {
      board[r][c] = count;
      count++;
    }
  }
  board[3][3] = null; 
  
  const possibleMoves = [{ row: 3, col: 2 }, { row: 2, col: 3 }];
  const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  
  board[3][3] = board[randomMove.row][randomMove.col];
  board[randomMove.row][randomMove.col] = null;
  emptyTile = { row: randomMove.row, col: randomMove.col };
  
  drawBoard();
  timerInterval = setInterval(() => {
    time++;
    document.getElementById("timer").innerText = time;
  }, 1000);
}

// Function to create a "Medium Game" that is 5–6 moves away from being solved
function mediumGame() {
  clearInterval(timerInterval);
  moves = 0;
  time = 0;
  document.getElementById("moveCount").innerText = moves;
  document.getElementById("timer").innerText = time;
  
  board = [];
  let count = 1;
  for (let r = 0; r < 4; r++) {
    board[r] = [];
    for (let c = 0; c < 4; c++) {
      board[r][c] = count;
      count++;
    }
  }
  board[3][3] = null;
  emptyTile = { row: 3, col: 3 };

  let numMoves = Math.floor(Math.random() * 2) + 5; 
  let previousEmpty = { ...emptyTile };

  for (let i = 0; i < numMoves; i++) {
    let movesList = [];
    let directions = [
      { row: emptyTile.row - 1, col: emptyTile.col }, 
      { row: emptyTile.row + 1, col: emptyTile.col }, 
      { row: emptyTile.row, col: emptyTile.col - 1 }, 
      { row: emptyTile.row, col: emptyTile.col + 1 }  
    ];
    for (let dir of directions) {
      if (dir.row >= 0 && dir.row < 4 && dir.col >= 0 && dir.col < 4) {
        if (!(dir.row === previousEmpty.row && dir.col === previousEmpty.col)) {
          movesList.push({ row: dir.row, col: dir.col });
        }
      }
    }

    if (movesList.length === 0) {
      movesList = directions.filter(dir => (dir.row >= 0 && dir.row < 4 && dir.col >= 0 && dir.col < 4));
    }
    let chosen = movesList[Math.floor(Math.random() * movesList.length)];
    let tempEmpty = { ...emptyTile };
    board[emptyTile.row][emptyTile.col] = board[chosen.row][chosen.col];
    board[chosen.row][chosen.col] = null;
    previousEmpty = tempEmpty;
    emptyTile = { row: chosen.row, col: chosen.col };
  }
  
  drawBoard();
  timerInterval = setInterval(() => {
    time++;
    document.getElementById("timer").innerText = time;
  }, 1000);
}

window.newGame = newGame;
window.clickTile = clickTile;
window.simpleGame = simpleGame;
window.mediumGame = mediumGame;

// Start a new game when the page loads
newGame();
