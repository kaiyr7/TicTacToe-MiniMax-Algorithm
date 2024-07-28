var Board;
var human = 'X';
var ai = 'O';
const winCombo= [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
]

const cells = document.querySelectorAll('.cell');

startGame();

function startGame(flag){
    document.querySelector(".endgame").style.display = "none";
    Board = Array.from(Array(9).keys());
    for(var i = 0; i<9;i++){
        cells[i].innerText = '';
        cells[i].addEventListener('click', turnClick, false);
        cells[i].style.removeProperty('background-color');
    }
    if(flag){
        human = 'O';
        ai = 'X';
        turn(bestMove(), ai);
    }
    
}
function turnClick(square){
    if(typeof Board[square.target.id] == 'number'){
        if(!turn(square.target.id, human)) turn(bestMove(), ai);
    }

}
function turn(squareId, player){
    Board[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(Board, player);
    if(gameWon){
        gameOver(gameWon, player) 
        return true;
    }
    return checkTie();
    
}


function gameOver(combo,player){
    let color = (player === human) ? 'blue' : 'red';
    let who = (player === human) ? "You Win!" : "You Lose!";
    for(let j=0;j<combo.length;j++){
        for(let i=0;i<3;i++){
            document.getElementById(combo[j][i]).style.backgroundColor = color;
        }
    }
    for(let i = 0; i<9;i++){
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(who);
}


function declareWinner(who){
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}


function availableSquares(board){
    return board.filter(x => typeof x == 'number');
}

function checkWin(board, player){
    let combos=[]
    for(let i=0;i<8;i++){
        let cnt = 0;
        for(let j=0;j<3;j++){
            if(board[winCombo[i][j]] === player){
                cnt++;
            }
        }
        if(cnt === 3) {
            combos.push(winCombo[i]);
        }
    }
    if(combos.length==0){
        return false;
    }
    return combos;
}

function checkTie(){
    if(availableSquares(Board).length == 0){
        for(let i = 0; i<9;i++){
            cells[i].removeEventListener('click', turnClick, false);
            document.getElementById(i).style.backgroundColor = "green";
        }
        declareWinner("TIE!");
        return true;
    }
    return false;
    
}

function bestMove() {
    var availSpots = availableSquares(Board);
    let bestEval = -Infinity;
    let bestMove;
    for (let i = 0; i < availSpots.length; i++) {
        Board[availSpots[i]] = ai;
        let eval = minimax(Board, 0, false);
        Board[availSpots[i]] = availSpots[i];
        if (eval > bestEval) {
            bestEval = eval;
            bestMove = availSpots[i];
        }
    }
    return bestMove;
}

function minimax(newBoard, depth, isMaximizing) {
    var availSpots = availableSquares(newBoard);
    if (checkWin(newBoard, ai)) {
        return 10 - depth;
    }
    if (checkWin(newBoard, human)) {
        return depth - 10;
    }
    if (availSpots.length === 0) {
        return 0;
    }

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (let i = 0; i < availSpots.length; i++) {
            newBoard[availSpots[i]] = ai;
            let eval = minimax(newBoard, depth + 1, false);
            newBoard[availSpots[i]] = availSpots[i];
            maxEval = Math.max(maxEval, eval);
        }
        return maxEval;
    } 
    else {
        let minEval = Infinity;
        for (let i = 0; i < availSpots.length; i++) {
            newBoard[availSpots[i]] = human;
            let eval = minimax(newBoard, depth + 1, true);
            newBoard[availSpots[i]] = availSpots[i];
            minEval = Math.min(minEval, eval);
        }
        return minEval;
    }
}
