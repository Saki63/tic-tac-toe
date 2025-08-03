const BOARD = [
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

const ROUNDS = [
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

let CURRENTROUND = 0;

let CURRENTPLAYER = "circle";

const WINPATTERNS = [
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
    renderResults('results', '');
    renderResults('results-resp', '-resp');
}

function renderPlayer(){
    const currentPlayerElement = document.getElementById("current-player");
    currentPlayerElement.innerHTML = displayCurrentPlayerTemplate();
}

function checkResp() {
    const resultElement = document.getElementById('results');
    if (resultElement && resultElement.style.display === 'none') {
        return document.getElementById('results-resp');
    } else {
        return resultElement;
    }
}

function renderResults(id, addition) {
    const resultListElement = document.getElementById(id);

    let html = `
        <table class="result-table">
            <thead>
                <tr>
                    <th>Round</th>
                    <th>O</th>
                    <th>X</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (let i = 0; i < 10; i++) {
            html += `
                    <tr id="round${addition}-${i}">
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
                    <td>Total</td>
                    <td id="o-total${addition}"></td>
                    <td id="x-total${addition}"></td>
                </tr>
            </tfoot>
        </table>
    `;

    resultListElement.innerHTML = html;
}

function renderBoard() {
    const boardElement = document.getElementById('board');
    let html = '';

    for (let cellIdx = 0; cellIdx < BOARD.length; cellIdx++) {
        html += getBoardCellTemplate(cellIdx);
    }

    boardElement.innerHTML = html;
}

function setCell(cellIdx) {
    const cellElement = document.getElementById(`cell-${cellIdx}`);

    if (BOARD[cellIdx] === 'circle') {
        cellElement.innerHTML = getCircleSVG();
        cellElement.onclick = null;
    } else if (BOARD[cellIdx] === 'cross') {
        cellElement.innerHTML = getCrossSVG();
        cellElement.onclick = null;
    }
    else{
        cellElement.innerHTML = "";
        cellElement.onclick = () => setSymbole(cellIdx);
    }
}

function resetBoard() {
    for (let cellIdx = 0; cellIdx < BOARD.length; cellIdx++) {
        BOARD[cellIdx] = null;
        setCell(cellIdx);
    }
}

function setSymbole(index) {

    BOARD[index] = CURRENTPLAYER;
    setCell(index);
    if (!checkGameOver()) {
        CURRENTPLAYER = CURRENTPLAYER === 'circle' ? 'cross' : 'circle';
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
    for (const [a, b, c] of WINPATTERNS) {
        if (
            BOARD[a] &&
            BOARD[a] === BOARD[b] &&
            BOARD[a] === BOARD[c]
        ) {
            drawWinLine(a, c);
            blockBoard();
            ROUNDS[CURRENTROUND] = CURRENTPLAYER;
            updateResultRow(CURRENTROUND);
            CURRENTROUND++;
            document.getElementById("next-button").disabled = false;
            return true;
        }
    }
    return false;
}

function checkEqual(){
    if (!BOARD.includes(null)) {
        ROUNDS[CURRENTROUND] = "-";
        updateResultRow(CURRENTROUND);
        CURRENTROUND++;
        document.getElementById("next-button").disabled = false;
        return true;
    }
    return false;
}

function blockBoard() {
    for (let cellIdx = 0; cellIdx < BOARD.length; cellIdx++) {
        const cell = document.getElementById(`cell-${cellIdx}`);
        if (cell) {
            cell.onclick = null;
        }
    }
}

function drawWinLine(a, c) {
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
    
    CURRENTPLAYER = Math.random() < 0.5 ? "circle" : "cross";
    updateCurrentPlayerDisplay();

    deleteWinLine();

    resetBoard();
    document.getElementById("next-button").disabled = true;
}

function updateCurrentPlayerDisplay() {
    const circleEl = document.getElementById('player-circle');
    const crossEl = document.getElementById('player-cross');

    if (CURRENTPLAYER === 'circle') {
        circleEl.classList.add('active');
        crossEl.classList.remove('active');
    } else {
        crossEl.classList.add('active');
        circleEl.classList.remove('active');
    }
}

function updateResultRow(index) {
    ['','-resp'].forEach(suffix => {
        const row = document.getElementById(`round${suffix}-${index}`);
        if (!row) return;

        const xCell = row.children[2];
        const oCell = row.children[1];

        xCell.textContent = '';
        oCell.textContent = '';

        const round = ROUNDS[index];
        if (round === 'cross') {
            xCell.textContent = '✔';
        } else if (round === 'circle') {
            oCell.textContent = '✔';
        } else if (round === '-') {
            xCell.textContent = '-';
            oCell.textContent = '-';
        }
    });
}

function checkFinalGameEnd() {
    if (CURRENTROUND >= 10) {
        let xWins = 0;
        let oWins = 0;

        for (const result of ROUNDS) {
            if (result === 'cross') {
                xWins++;
            } else if (result === 'circle') {
                oWins++;
            }
        }
        updateTotalRow(xWins, oWins);
        document.getElementById("next-button").disabled = true;
        return true;
    }
    return false;
}

function updateTotalRow(xWins, oWins) {
    ['','-resp'].forEach(suffix => {
        document.getElementById(`o-total${suffix}`).innerText = oWins;
        document.getElementById(`x-total${suffix}`).innerText = xWins;
    });
}

function restartGame(){
    resetBoard();
    resetResultList();
    updateTotalRow("", "");
    CURRENTROUND = 0;
    
    CURRENTPLAYER = Math.random() < 0.5 ? "circle" : "cross";
    deleteWinLine();
    document.getElementById("next-button").disabled = true;
}

function deleteWinLine(){
    const line = document.getElementById('win-line');
    if (line) {
        line.style.display = 'none';
    }    
}

function resetResultList(){
    for (let roundIdx = 0; roundIdx < ROUNDS.length; roundIdx++) {
        ROUNDS[roundIdx] = null;
        updateResultRow(roundIdx);
    }
}

function closeMediaWindow() {
    document.getElementById('game-info-overlayer').classList.replace("game-info-overlayer-open", "game-info-overlayer-closed");
    document.getElementById("main-content").classList.toggle("main-content-not-scrollable");
}

function stopBubbling(event){
    event.stopPropagation();
}

function openGameResults() {
    document.getElementById("game-info-overlayer").classList.replace("game-info-overlayer-closed", "game-info-overlayer-open");
    document.getElementById("main-content").classList.toggle("main-content-not-scrollable");
}