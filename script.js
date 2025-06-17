document.getElementById("footer-text").textContent = `Justin Ahn &copy; ${new Date().getFullYear()}`;
const gameGrid = document.getElementById("game-grid");
const statusText =  document.getElementById('status');
const restartBtn = document.getElementById("restart");

const gameBoard = new Array(9).fill(null);
let gameOver = false;
const wins = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
];

gameGrid.addEventListener('click',(e) => {
    if(gameOver) return;
    playerTurn(e.target.id);
    checkGameOver();
    if(gameOver) return;
    aiTurn();     
    checkGameOver();
});

restartBtn.addEventListener('click', () => {
    gameOver = false;
    gameBoard.fill(null);
    statusText.textContent = "Game in progress...";
    const cells = document.getElementsByClassName("grid-item");
    for(const cell of cells) {
        cell.textContent = "";
        cell.classList.remove("player-win","computer-win","draw");
        restartBtn.classList.remove('restart-animation');
    }
})

const playerTurn = (cellID) => {
    const cell = document.getElementById(cellID);
    if (cell.textContent !== "") return;
    cell.textContent = "X";
    gameBoard[Number(cellID[cellID.length -1])] = "X";
}
/*
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
*/

const aiTurn = () => {
    const scores = gameBoard.map((item) => {
        if(item ==="X" || item === "O") return item;
        else return Number(0);
    });
    console.log("Before");
    for(const score of scores) {
        console.log(score + ",");
    }
    for (const win of wins) {
        // guaranteed = 10_000 --> done(no check)
        // get two in a row with blank third 100 --> done(no check)
        // has empty row | has empty column | has empty diagnal 10
        if(
            scores[win[0]] != "X" &&
            scores[win[1]] != "X" &&
            scores[win[2]] != "X"
        ) {
            if(scores[win[0]] === "O"){
                if(scores[win[0]] === scores[win[1]]) scores[win[2]] += Number(10000);
                else if(scores[win[0]] === scores[win[2]]) scores[win[1]] += Number(10000);
                else {
                    scores[win[1]] += Number(100);
                    scores[win[2]] += Number(100);
                }
            }
            else if(scores[win[1]] === "O"){
                if(scores[win[1]] === scores[win[2]]) scores[win[0]] += Number(10000);
                else {
                    scores[win[0]] += Number(100);
                    scores[win[2]] += Number(100);
                }

            }
            

            if(
                !(isNaN(scores[win[0]])) &&
                !(isNaN(scores[win[1]])) &&
                !(isNaN(scores[win[2]])) 
            ) {
                scores[win[0]] = Number(scores[win[0]]) + 10;
                scores[win[1]] = Number(scores[win[1]]) + 10;
                scores[win[2]] = Number(scores[win[2]]) + 10;
            }
            
            
            
        }
        // if X can get two in a row with black end, add 200
            
        if(
            scores[win[0]] == "X" &&
            typeof scores[win[1]] === "number" &&
            typeof scores[win[2]] === "number"
        ) {
            scores[win[1]] += Number(200);
        }
        else if (
            
            typeof scores[win[0]] === "number" &&
            scores[win[1]] == "X" &&
            typeof scores[win[2]] === "number"
        ) {
            scores[win[0]] += Number(200);
            scores[win[2]] += Number(200);
        }
        else if (
            
            typeof scores[win[0]] === "number" &&
            typeof scores[win[1]] === "number" &&
            scores[win[2]] == "X" 
        ) {
            scores[win[1]] += Number(200);
        }
            
        // block win 1_000 --> done(no check) 
        if(scores[win[0]] === "X") {
            if(scores[win[0]] === scores[win[1]] && typeof scores[win[2]] === "number") scores[win[2]] += Number(1000);
            else if(scores[win[0]] === scores[win[2]] && typeof scores[win[1]] === "number") scores[win[1]] += Number(1000);
        }
        if(scores[win[1]] === "X") {
            if(scores[win[1]] === scores[win[2]] && typeof scores[win[0]] === "number") scores[win[0]] += Number(1000);
        }        
    }
    // is not corner 1
    for (let i = 1; i<9; i+=2) {
        if(typeof scores[i] === "number") scores[i] += Number(1);
    } 

    console.log("After");
    for(const score of scores) {
        console.log(score + ",");
    }

    MaxScore = -999;
    MaxIndex = -999;
    for (let i = 0; i < 9; i++) {
        if(
            typeof scores[i] === "number" &&
            scores[i] > MaxScore
        ) {
            MaxScore = scores[i];
            MaxIndex = i;
        }
    }
    
    const cell = document.getElementById(`grid-item-${MaxIndex}`);
    if(cell.textContent === "") {
        cell.textContent = "O";
        gameBoard[Number(MaxIndex)] = "O";
    }
};

const checkGameOver = () => {
    for (const win of wins) {
        if(
            gameBoard[win[0]] !==null && 
            gameBoard[win [0]] === gameBoard[win[1] ]&& 
            gameBoard[win[0] ]=== gameBoard[win[2]]
        ){
            gameOver = true;
            if (gameBoard[win[0]] === "X") {
                statusText.textContent = "Player wins!";
                for (const id of win) {
                    const item = document.getElementById(`grid-item-${id}`);
                    item.classList.add("player-win");
                    restartBtn.classList.add('restart-animation');
                }
            }
            else {
                statusText.textContent = "Computer wins!";
                for (const id of win) {
                    const item = document.getElementById(`grid-item-${id}`);
                    item.classList.add("computer-win");
                    restartBtn.classList.add('restart-animation');
                }
            }
            return;
        }
    }
    if (!gameBoard.includes(null)) {
        statusText.textContent = "Draw!"
        gameOver = true;
        for (let i = 0 ; i < 9 ; i++) {
            const item = document.getElementById(`grid-item-${i}`);
            item.classList.add("draw");
            restartBtn.classList.add('restart-animation');
        }
    }
};