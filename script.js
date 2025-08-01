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

const rounds = [
  null,
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

let roundIdx = 0;

let currentPlayer = "circle";

const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]
];

function render() {
    renderPlayer();
    renderBoard();
    updateCurrentPlayerDisplay();
    renderResults();
}

function renderPlayer(){
    const currentPlayerElement = document.getElementById("current-player");
    currentPlayerElement.innerHTML = `  <div id="player-circle" class="player-symbol">${getCircle()}</div>
                                        <div id="player-cross" class="player-symbol">${getCross()}</div>`;
}

function renderResults() {
    const resultListElement = document.getElementById('results');

    let html = `
        <table class="result-table">
            <thead>
                <tr>
                    <th>Runde</th>
                    <th>O</th>
                    <th>X</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (let i = 0; i < 10; i++) {
            html += `
                    <tr id="round-${i}">
                            <td>${i + 1}</td>
                            <td></td>
                            <td></td>
                    </tr>
            `;
    }

    html += `
            </tbody>
            <tfoot>
                <tr>
                    <td>Gesamt</td>
                    <td id="o-total"></td>
                    <td id="x-total"></td>
                </tr>
            </tfoot>
        </table>
    `;

    resultListElement.innerHTML = html;
}

function renderBoard() {
    const boardElement = document.getElementById('board');
    let html = '';

    for (let i = 0; i < ticTacToeBoard.length; i++) {
        html += `<div id="cell-${i}" class="cell" data-index="${i}" onclick="setSymbole(${i})"></div>`;
    }

    boardElement.innerHTML = html;
}

function setCell(index) {
    const cellElement = document.getElementById(`cell-${index}`);

    if (ticTacToeBoard[index] === 'circle') {
        cellElement.innerHTML = getCircle();
        cellElement.onclick = null;
    } else if (ticTacToeBoard[index] === 'cross') {
        cellElement.innerHTML = getCross();
        cellElement.onclick = null;
    }
    else{
        cellElement.innerHTML = "";
        cellElement.onclick = () => setSymbole(index);
    }
}

function resetBoard() {
    for (let i = 0; i < ticTacToeBoard.length; i++) {
        setCell(i);
    }
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
    setCell(index);
    if (!checkGameOver()) {
        currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
        updateCurrentPlayerDisplay();
    }
}

function checkGameOver() {
    let end = checkWinner();

    if (!end){
        end = checkEqual();
    }
    end = checkFinalGameEnd();

    return end;
}

function checkWinner(){
    for (const [a, b, c] of winPatterns) {
        if (
            ticTacToeBoard[a] &&
            ticTacToeBoard[a] === ticTacToeBoard[b] &&
            ticTacToeBoard[a] === ticTacToeBoard[c]
        ) {
            drawWinLine(a, b, c);
            blockBoard();
            rounds[roundIdx] = currentPlayer;
            updateResultRow(roundIdx);
            roundIdx++;
            document.getElementById("next-button").disabled = false;
            return true;
        }
    }
    return false;
}

function checkEqual(){
    if (!ticTacToeBoard.includes(null)) {
        rounds[roundIdx] = "-";
        updateResultRow(roundIdx);
        roundIdx++;
        document.getElementById("next-button").disabled = false;
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

function nextRound() {
    for (let i = 0; i < ticTacToeBoard.length; i++) {
        ticTacToeBoard[i] = null;
    }
    
    currentPlayer = Math.random() < 0.5 ? "circle" : "cross";
    updateCurrentPlayerDisplay();

    const line = document.getElementById('win-line');
    if (line) {
        line.style.display = 'none';
    }

    resetBoard();
    document.getElementById("next-button").disabled = true;
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

function updateResultRow(index) {
    const round = rounds[index];

    const row = document.getElementById(`round-${index}`);

    const xCell = row.children[2];
    const oCell = row.children[1];

    xCell.textContent = '';
    oCell.textContent = '';

    if (round === 'cross') {
        xCell.textContent = '✔';
    } else if (round === 'circle') {
        oCell.textContent = '✔';
    } else if (round === '-') {
        xCell.textContent = '-';
        oCell.textContent = '-';
    }
}

function checkFinalGameEnd() {
    if (roundIdx >= 10) {
        let xWins = 0;
        let oWins = 0;

        for (const result of rounds) {
            if (result === 'cross') {
                xWins++;
            } else if (result === 'circle') {
                oWins++;
            }
        }

        // Zeige die Nachricht an (z. B. in einem div oder alert)
        updateTotalRow(xWins, oWins); // Oder z. B.: document.getElementById("end-message").innerText = message;

        // Optional: Spiel blockieren oder "Neustart"-Button anzeigen
        document.getElementById("next-button").disabled = true;
        return true;
    }
    return false;
}

function updateTotalRow(xWins, oWins) {
    document.getElementById('o-total').innerText = oWins;
    document.getElementById('x-total').innerText = xWins;
}