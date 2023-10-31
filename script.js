const cells = document.querySelectorAll('[data-cell]');
const message = document.querySelector('[data-message]');
const restartButton = document.querySelector('[data-restart]');

// Variables to track the game state
let currentPlayer = 'X';  // 'X' starts the game
let gameOver = false;    // Initially, the game is not over

// Game board represented as an array
const board = ['', '', '', '', '', '', '', '', ''];

// Initialize the game state
function resetGameState() {
    currentPlayer = 'X';
    gameOver = false;
    board.fill(''); // Reset the board array
}

// Event listener for the "Restart" button
restartButton.addEventListener('click', () => {
    cells.forEach(cell => {
        cell.textContent = '';
    });
    message.textContent = '';
    resetGameState(); // Call the function to reset the game state
});

// Event listeners for cell clicks
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

function handleCellClick(event) {
    const cell = event.target;

    if (cell.textContent === '' && !gameOver) {
        cell.textContent = currentPlayer;
        board[cell.dataset.index] = currentPlayer; // Update the board array
        if (checkWin(currentPlayer)) {
            displayMessage(`${currentPlayer} wins!`);
            gameOver = true;
        } else if (isBoardFull()) {
            displayMessage("It's a draw!");
            gameOver = true;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            makeAIMove(); // Call the AI move
        }
    }
}

function displayMessage(text) {
    message.textContent = text;
}

function checkWin(player) {
    const winCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const combination of winCombinations) {
        const [a, b, c] = combination;
        if (board[a] === player && board[b] === player && board[c] === player) {
            return true;
        }
    }

    return false;
}

function isBoardFull() {
    return board.every(cell => cell !== '');
}

function makeAIMove() {
    if (!gameOver) {
        const bestMove = minimax(board, currentPlayer);
        const cellIndex = bestMove.index;

        if (board[cellIndex] === '') {
            cells[cellIndex].textContent = currentPlayer;
            board[cellIndex] = currentPlayer; // Update the board array
            if (checkWin(currentPlayer)) {
                displayMessage(`${currentPlayer} wins!`);
                gameOver = true;
            } else if (isBoardFull()) {
                displayMessage("It's a draw!");
                gameOver = true;
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            }
        }
    }
}

function minimax(board, player) {
    const availableMoves = getAvailableMoves(board);

    if (checkWin('X')) {
        return { score: -1 };
    } else if (checkWin('O')) {
        return { score: 1 };
    } else if (availableMoves.length === 0) {
        return { score: 0 };
    }

    const moves = [];

    for (let i = 0; i < availableMoves.length; i++) {
        const move = {};
        const cellIndex = availableMoves[1];
        move.index = cellIndex;

        // Try the move for the current player (AI or opponent)
        board[cellIndex] = player;

        // Recursively call minimum for the opponent
        if (player === 'O') {
            const result = minimax(board, 'X');
            move.score = result.score;
        } else {
            const result = minimax(board, 'O');
            move.score = result.score;
        }

        //Undo the move

        board[cellIndex] = ''; 

        moves.push(move);
    }

    // Select the move for the current player (maximizing or minimizing)
    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function getAvailableMoves(board) {
    const moves = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            moves.push(i);
        }
    }
    return moves;
}