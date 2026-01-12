const gameBoard = (function () {
  const gameBoardArray = new Array(3).fill(null).map(() => new Array(3).fill(null));
  let isCellEmpty = false;


  const inputPlayerSelection = (selection, position) => {
    
    gameBoardArray[position[0]][position[1]] = selection;
    console.log(gameBoardArray);
  }

  const getBoard = () => gameBoardArray;


  const checkEmptyCells = (...position) => {
     if (!(gameBoardArray[position[0]][position[1]] === null)) {
        alert("That space is already taken!!!! Take another position!");
        return false;
    }  
    
    return true;
  }
   
  const checkMatchPerline = (board) => board[0] !== null && board.every(item => item === board[0])
 

  const checkFullMatch = () => {

    
    for (let i = 0; i < 3; i++) {
        if (checkMatchPerline(gameBoardArray[i])) {
          console.log("row winner!")
            return true;
        }
    }
    
   
    for (let i = 0; i < 3; i++) {
        let column = [gameBoardArray[0][i], gameBoardArray[1][i], gameBoardArray[2][i]];
        if (checkMatchPerline(column)) {
          console.log("column winner!")
            return true;
        }
    }
   
    let diagonal1 =[gameBoardArray[0][0], gameBoardArray[1][1], gameBoardArray[2][2]];
    let diagonal2 = [gameBoardArray[0][2], gameBoardArray[1][1], gameBoardArray[2][0]];

    if (checkMatchPerline(diagonal1) || checkMatchPerline(diagonal2)) {
      console.log("Diagonal winner")
      return true;
    }
  }
  
  const resetBoard = () => {
    gameBoardArray.forEach((row, i) => {
        gameBoardArray[i] = new Array(3).fill(null);
    });
  }
  return {gameBoardArray, inputPlayerSelection, getBoard, checkFullMatch, checkEmptyCells, isCellEmpty, resetBoard}

})();


function player(name, choice) {
 

  const getName = () => name;
  const getChoice = () => choice;

  const getPosition = (a, b) => {
    let row = a;
    let cellRow = b;
    return [row, cellRow];
  };
 
  return {getName, getChoice, getPosition}
  
}


function gameControl() {
 
  const player1 = player("Player1", "X")
  const player2 = player("Player2", "O")
  let currentPlayer = player1
  let numberOfPlay = 0;
  let gameStatus = false;

  const play = (a, b) => {
    gameBoard.inputPlayerSelection(currentPlayer.getChoice(), currentPlayer.getPosition(a, b));
  }

 const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
 }
 

 const getCurrentPlayer = () => currentPlayer;

 const announceWinner = () => {
  gameStatus = true;
  return `Congratulations!!! ${currentPlayer.getName()} with the letter ${currentPlayer.getChoice()} Wins!!!`
  
 }

 const getGameStatus = () => gameStatus;


 const getWinnerMessage = () => winnerMessage;


    const handleMove =  (row, col) => {
       if (!gameBoard.checkEmptyCells(row, col)) {
        return {valid: false}
      } 
        play(row, col)
        numberOfPlay++;


        if (gameBoard.checkFullMatch()) {  
          const winnerMessage = announceWinner();
          gameBoard.resetBoard(); 
          return {
            valid: true,
            gameOver: true,
            winnerMessage
          }; 
        }

        return {
          valid: true,
          gameOver: false
        }
    }
   


    

  return {player1, player2, currentPlayer, play, announceWinner, switchPlayer, getCurrentPlayer, handleMove, getGameStatus, getWinnerMessage}

}


const screenController = (function () {
  const newGame = gameControl();
  const parent = document.querySelector(".game-board");
  const reset = document.querySelector("#reset");
  const modal = document.querySelector("#winnerModal");
  const modalMessage = document.querySelector("#modalMessage");
  const closeModalBtn = document.querySelector("#closeModal");

  
  
  const displayBoard = () => {

    const board = gameBoard.getBoard();
    for (let i = 0; i < board.length; i++) {
      let row = board[i]
      for (let j = 0; j < row.length; j++) {
        let btn = document.createElement('button')
        btn.classList.add('board-cells')
        btn.dataset.row = i;
        btn.dataset.col = j;
        btn.textContent = row[j] || " ";  
        parent.appendChild(btn)

      }
    }
  }

  const updateBoard = () => {
   while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
   }
  }



  reset.addEventListener("click", () => {
    gameBoard.resetBoard();  
    updateBoard();           
    displayBoard();         
  });


  parent.addEventListener("click", (e) => {

    if (!e.target.classList.contains("board-cells")) return;
      
      const row = e.target.dataset.row;
      const col = e.target.dataset.col;
   
      const result =  newGame.handleMove(row, col);
       

      if (!result.valid) return;
      e.target.textContent = newGame.getCurrentPlayer().getChoice();


       if (result.gameOver) {
          displayResults(result.winnerMessage);
          resetGame();
          return;
        }
       
       newGame.switchPlayer();
    
  })
  
  closeModalBtn.addEventListener("click", () => {
    hideModal();
  });


  const displayResults = (message) => {
     showModal(message)
  }

  const resetGame = () => {
    if (newGame.getGameStatus()) {
      updateBoard();
      displayBoard();
    } else {
      console.log("Heyyyy")
    }
  }

 const showModal = (message) => {
  modalMessage.textContent = message;
  modal.classList.remove("hidden");
};

const hideModal = () => {
  modal.classList.add("hidden");
};
   return {displayBoard, updateBoard, resetGame}
  
})();



screenController.displayBoard();




