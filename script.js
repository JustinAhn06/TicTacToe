
const gameGrid = document.getElementById("game-grid");

const gameBoard = new Array(9).fill(null);

gameGrid.addEventListener('click',(e) => {
    const cellID = document.getElementById(e.target.id);
    if (cellID.textContent !== "") return;
    cellID.textContent = "X";
    gameBoard[Number(e.target.id[e.target.id.length -1])] = "X";
    if(gameOver()) return;
    aiTurn();     
});

const aiTurn = () => {
    while (true) {
        const cellNum = Math.floor(Math.random() * 9);
        const cell = document.getElementById(`grid-item-${cellNum}`);
        if(cell.textContent === "") {
            cell.textContent = "O";
            gameBoard[cellNum] = "O";
            break;
        }
    }
};



const gameOver = () => {
    return !(gameBoard.includes(null));
};