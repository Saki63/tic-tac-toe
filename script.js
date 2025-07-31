const ticTacToeBoard = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
];

let currentPlayer = "circle";

const winPatterns = [
    [0, 1, 2], // horizontal
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6], // vertikal
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8], // diagonal
    [2, 4, 6]
];

function render() {
    renderPlayer();
    const boardElement = document.getElementById('board');
    let html = '';

    for (let i = 0; i < ticTacToeBoard.length; i++) {
            html += `<div id="cell-${i}" class="cell" data-index="${i}" onclick="setSymbole(${i})"></div>`;
    }

    boardElement.innerHTML = html;
    updateCurrentPlayerDisplay();
}

function renderPlayer(){
    const currentPlayerElement = document.getElementById("current-player");
    currentPlayerElement.innerHTML = `  <div id="player-circle" class="player-symbol">${getCircle()}</div>
                                        <div id="player-cross" class="player-symbol">${getCross()}</div>`;
}

function getCircle(){
    return `
            <svg width="70" height="70" viewBox="0 0 100 100">
            <circle class="circle-animate" cx="50" cy="50" r="40" stroke="#04b504" stroke-width="10" fill="none" />
            </svg>
            `;
}

function getCross() {
    return `
        <svg width="70" height="70" viewBox="0 0 100 100">
            <line class="cross-line cross-line1" x1="20" y1="20" x2="80" y2="80" />
            <line class="cross-line cross-line2" x1="80" y1="20" x2="20" y2="80" />
        </svg>
    `;
}

function setSymbole(index) {

    ticTacToeBoard[index] = currentPlayer;
    renderCell(index);
    if (!checkGameOver()) {
        currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
        updateCurrentPlayerDisplay();
    }
}

function renderCell(index) {
    const cellElement = document.getElementById(`cell-${index}`);

    if (ticTacToeBoard[index] === 'circle') {
        cellElement.innerHTML = getCircle();
    } else if (ticTacToeBoard[index] === 'cross') {
        cellElement.innerHTML = getCross();
    }
    
    cellElement.onclick = null;
}

function checkGameOver() {
    for (const [a, b, c] of winPatterns) {
        if (
            ticTacToeBoard[a] &&
            ticTacToeBoard[a] === ticTacToeBoard[b] &&
            ticTacToeBoard[a] === ticTacToeBoard[c]
        ) {
            drawWinLine(a, b, c);  // Strich zeichnen
            blockBoard();          // Keine weiteren Züge möglich
            return true;
        }
    }

    // Unentschieden: alle Felder belegt
    if (!ticTacToeBoard.includes(null)) {
        // alert("Unentschieden!");
        return true;
    }

    return false;
}

function blockBoard() {
    for (let i = 0; i < ticTacToeBoard.length; i++) {
        const cell = document.getElementById(`cell-${i}`);
        if (cell) {
            cell.onclick = null;
        }
    }
}

function drawWinLine(a, b, c) {
    const line = document.getElementById('win-line');

    // Position der Zellen im Grid
    const positions = {
        0: [0, 0], 1: [1, 0], 2: [2, 0],
        3: [0, 1], 4: [1, 1], 5: [2, 1],
        6: [0, 2], 7: [1, 2], 8: [2, 2]
    };

    const [x1, y1] = positions[a];
    const [x2, y2] = positions[c];

    const cellSize = 100;

    const xStart = x1 * cellSize + cellSize / 2;
    const yStart = y1 * cellSize + cellSize / 2;

    const xEnd = x2 * cellSize + cellSize / 2;
    const yEnd = y2 * cellSize + cellSize / 2;

    const dx = xEnd - xStart;
    const dy = yEnd - yStart;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    line.style.display = 'block';
    line.style.width = `${length}px`;
    line.style.transform = `translate(${xStart}px, ${yStart}px) rotate(${angle}deg)`;
}

function restartGame() {
    // Reset der Spielvariablen
    for (let i = 0; i < ticTacToeBoard.length; i++) {
        ticTacToeBoard[i] = null;
    }

    currentPlayer = Math.random() < 0.5 ? "circle" : "cross";
    updateCurrentPlayerDisplay();

    // Gewinnlinie ausblenden
    const line = document.getElementById('win-line');
    if (line) {
        line.style.display = 'none';
    }

    // Spielfeld neu aufbauen
    render();
}

function updateCurrentPlayerDisplay() {
    const circleEl = document.getElementById('player-circle');
    const crossEl = document.getElementById('player-cross');

    if (currentPlayer === 'circle') {
        circleEl.classList.add('active');
        crossEl.classList.remove('active');
    } else {
        crossEl.classList.add('active');
        circleEl.classList.remove('active');
    }
}