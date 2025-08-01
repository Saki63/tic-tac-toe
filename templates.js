
function displayCurrentPlayerTemplate(){
    return `<div id="player-circle" class="player-symbol">${getCircleSVG()}</div>
            <div id="player-cross" class="player-symbol">${getCrossSVG()}</div>`;
}

function getBoardCellTemplate(cellIdx){
    return `<div id="cell-${cellIdx}" class="cell" data-index="${cellIdx}" onclick="setSymbole(${cellIdx})"></div>`;
}


function getCircleSVG(){
    return `<svg width="70" height="70" viewBox="0 0 100 100">
                <circle class="circle-animate" cx="50" cy="50" r="40" stroke="#04b504" stroke-width="10" fill="none" />
            </svg>`;
}

function getCrossSVG() {
    return `<svg width="70" height="70" viewBox="0 0 100 100">
                <line class="cross-line cross-line1" x1="20" y1="20" x2="80" y2="80" />
                <line class="cross-line cross-line2" x1="80" y1="20" x2="20" y2="80" />
            </svg>`;
}