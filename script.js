const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("reset");
const modeSelect = document.getElementById("mode");

const popup = document.getElementById("popup");
const popupMsg = document.getElementById("popup-msg");
const playAgainBtn = document.getElementById("play-again");

let board = Array(9).fill("");
let currentPlayer = "X";
let gameActive = true;
let mode = "pvp";

const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function showPopup(message) {
  popupMsg.textContent = message;
  popup.classList.remove("hide");

  // Apply darker glass effect
  popup.classList.add("win-glass-dark");
  document.querySelector(".game-container")?.classList.add("win-glass-dark");
}


function checkWinner() 
{
  for (let i = 0; i < winPatterns.length; i++) 
  {
    const pattern = winPatterns[i];   // example: [0, 1, 2]
    const a = pattern[0];
    const b = pattern[1];
    const c = pattern[2];
  
    if (board[a] !== "" && board[a] === board[b] && board[b] === board[c])
    {
      gameActive = false;

      pattern.forEach(index => {
        cells[index].classList.add("winning");
      });
      
      showPopup(`${board[a]} wins! 🎉`);
      return;
    }
  }
  

  if (!board.includes("")) 
  {
    gameActive = false;
    showPopup("🤝 It's a draw!");
  }
}

function aiMoveEasy() {
  const empty = board.map((v, i) => (v === "" ? i : null)).filter(i => i !== null);
  const choice = empty[Math.floor(Math.random() * empty.length)];
  makeMove(choice);
}

function aiMoveHard() {
  const bestMove = minimax(board, "O").index;
  makeMove(bestMove);
}

function minimax(newBoard, player) 
{
  const empty = newBoard.map((v, i) => (v === "" ? i : null)).filter(i => i !== null);

  if (checkWin(newBoard, "X")) return { score: -10 };
  if (checkWin(newBoard, "O")) return { score: 10 };
  if (empty.length === 0) return { score: 0 };

  const moves = [];

  for (let j = 0; j < empty.length; j++) 
  {
    let i = empty[j];           // Get the index of the empty cell
    let move = {};
    move.index = i;             // Save the index we're testing
  
    newBoard[i] = player;       // Simulate the move

    move.score = (player === "O")
      ? minimax(newBoard, "X").score
      : minimax(newBoard, "O").score;

    newBoard[i] = "";
    moves.push(move);
  }

  let bestMove = 0;
  if (player === "O") 
  {
    let bestScore = -Infinity;
    moves.forEach((move, i) => {
      if (move.score > bestScore) {
        bestScore = move.score;
        bestMove = i;
      }
    });
  } 
  else 
  {
    let bestScore = Infinity;
    moves.forEach((move, i) => {
      if (move.score < bestScore) 
      {
        bestScore = move.score;
        bestMove = i;
      }
    });
  }

  return moves[bestMove];
}

function checkWin(board, player) {
  return winPatterns.some(([a, b, c]) => board[a] === player && board[b] === player && board[c] === player);
}

function makeMove(index) {
  if (board[index] !== "" || !gameActive) return;

  board[index] = currentPlayer;
  cells[index].textContent = currentPlayer;
  cells[index].classList.add(currentPlayer);
  checkWinner();

  if (!gameActive) return;

  currentPlayer = currentPlayer === "X" ? "O" : "X";

  if ((mode === "easy" || mode === "hard") && currentPlayer === "O") {
    setTimeout(() => {
      if (mode === "easy") aiMoveEasy();
      else aiMoveHard();
      checkWinner();
      if (gameActive) currentPlayer = "X";
    }, 300);
  }
}

function resetGame() {
  board.fill("");
  currentPlayer = "X";
  gameActive = true;
  statusText.textContent = "";
  popup.classList.add("hide");

  // Remove dark glass effect on reset
  popup.classList.remove("win-glass-dark");
  document.querySelector(".game-container")?.classList.remove("win-glass-dark");

  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("X", "O", "winning");
  });
}



cells.forEach((cell, index) => {
  cell.addEventListener("click", () => {
    if (mode === "pvp" || (mode !== "pvp" && currentPlayer === "X")) {
      makeMove(index);
    }
  });
});

resetBtn.addEventListener("click", resetGame);
playAgainBtn.addEventListener("click", resetGame);
modeSelect.addEventListener("change", () => {
  mode = modeSelect.value;
  resetGame();
});
