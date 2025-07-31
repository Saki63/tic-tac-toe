const ticTacToeBoard = [
    null, 
    "cyrcle", 
    null, 
    null, 
    null, 
    null, 
    null, 
    null, 
    null];


function render() {
    const boardElement = document.getElementById('board');
    let html = '';

    for (let i = 0; i < ticTacToeBoard.length; i++) {
        const cellValue = ticTacToeBoard[i] ? ticTacToeBoard[i] : '';
        html += `<div class="cell" data-index="${i}">${cellValue}</div>`;
    }

    boardElement.innerHTML = html;
}

