/* Minesweeper
Set board length
	> minimum: 9
	> use number 1 … n
Set bomb length
	> max 1/3 of board length
Determine the bombs location (random)
Also update number around the bombs

Play the game
> user click the box. > checking > is already clicked
	> if bomb then show all bombs & game over
	> if number then show only number
	> if empty / 0 then show boxes around it until got number

More features:
> reset the game
*/

let board = []
let bombLocation = []

let boardLength = 0
let bombsLength = 0
let isGameOver = false

const boardEl = document.getElementById("board")
const inputBoard = document.getElementById("boardLength")
const inputBombs = document.getElementById("bombsLength")
const gameStatus = document.getElementById("status")
const statusEl = document.getElementById("status")

const inputBoardBtn = document.getElementById("setBoard")

inputBoardBtn.addEventListener("click", setBoardLength)
document.getElementById("resetGame").addEventListener("click", init)

function setBoardLength () {
  statusEl.innerText = ""
  const boardVal = parseInt(inputBoard.value)
  const bombVal = parseInt(inputBombs.value)
  if (!boardVal || boardVal < 1) {
    statusEl.innerText = "Minimum board length is 1"
  } else {
    board = Array(boardVal).fill(0).map(x => { return {value: 0, clicked: false} })
    boardLength = boardVal

    const maxBombs = Math.ceil(boardLength * 1 / 3)
    if (0 < bombVal && bombVal <= maxBombs) {
      inputBoardBtn.disabled = true
      bombsLength = bombVal
      setBombs(bombVal)
    } else {
      statusEl.innerText = maxBombs != 1 ? "The bomb quantity should 1 up to " + maxBombs : "Only one bomb allowed"
      // alert('Jumlah bomb minimal 1 dan maksimal ' + maxBombs)
    }
  }
}

function setBombs (quantity) {
  let bombs = quantity
  while(bombs > 0) {
    const randomNumber = getRandom(boardLength)
    if (board[randomNumber].value == 0) {
      board[randomNumber].value = "*"
      bombLocation.push(randomNumber)
      const indexBefore = randomNumber - 1
      const indexAfter = randomNumber + 1
      
      // left
      if (isInBoard(indexBefore) && !isBomb(indexBefore)) {
        board[indexBefore].value += 1
      }

      // right
      if (isInBoard(indexAfter) && !isBomb(indexAfter)) {
        board[indexAfter].value += 1
      }
      bombs--
    }
  }
  console.log({bombs: bombLocation.join(", ")})
  render()
}

function isInBoard (index) {
  return 0 <= index && index < boardLength
}

function getRandom (maxNumber) {
  return Math.floor(Math.random() * maxNumber) 
}

function render () {
  boardEl.innerHTML = ""
  for(let i = 0; i < boardLength; i++) {
    const div = document.createElement("button")
    const { clicked: isClicked, value: boxValue } = board[i]
    
    div.addEventListener("click", clickBox)
    if (isClicked) {
      const text = document.createTextNode(boxValue)
      div.appendChild(text)
      div.disabled = isClicked
    }
    
    div.classList.add("box")
    div.setAttribute("id", "box-" + i)
    boardEl.appendChild(div)
  }
  
}

function clickBox (e) {
  // prevent player to play if the game is over
  if (isGameOver) {
    // alert("The game is over. Click Reset Game button to play again :)")
    statusEl.innerText = "The game is over. Click Reset Game button to play again :)"
    return
  }

  const ids = e.target.id.split("-")
  const boxId = ids[1]
  const selectedBox = board[boxId]
  const { clicked: isClicked, value: boxValue } = selectedBox
  e.target.innerText = selectedBox.value
  selectedBox.clicked = true
  // selectedElement = document.getElementById("box-" + boxId)
  if (boxValue == "*") {
    gameOver()
  } else if (boxValue != 0) {
    document.getElementById("box-" + boxId).innerText = boxValue
    checkIsPlayerWin()
  } else {
    openEmptyBox(boxId)
    checkIsPlayerWin()
  }

  render()
}

function openEmptyBox (boxId) {
  let hasOpenedBefore = false
  let hasOpenedAfter = false
  let searchIdBefore = parseInt(boxId) - 1
  let searchIdAfter = parseInt(boxId) + 1
  while(!hasOpenedBefore) {
    if (isInBoard(searchIdBefore) && !isBomb(searchIdBefore)) {
      board[searchIdBefore].clicked = true
      if (board[searchIdBefore].value > 0) {
        hasOpenedBefore = true
      }
      searchIdBefore --
    } else {
      hasOpenedBefore = true
    }
  }

  while(!hasOpenedAfter) {
    if (isInBoard(searchIdAfter) && !isBomb(searchIdAfter)) {
      board[searchIdAfter].clicked = true
      if (board[searchIdAfter].value > 0) {
        hasOpenedAfter = true
      }
      searchIdAfter ++
    } else {
      hasOpenedAfter = true
    }
  }
}

function checkIsPlayerWin () {
  const isWin = board.filter(val => !val.clicked).length <= bombsLength
  if (isWin) {
    statusEl.innerText = "You Win!"
    isGameOver = true
  }
}

function isBomb (index) {
  return board[index].value == "*"
}

function gameOver () {
  bombLocation.forEach(element => {
    board[element].clicked = true
  })
  
  isGameOver = true
  statusEl.innerText = "GAME OVER! :("
}

function init () {
  board = []
  bombLocation = []
  isGameOver = false
  inputBoardBtn.disabled = false
  inputBoard.value = ""
  inputBombs.value = ""
  boardEl.innerHTML = ""
  statusEl.innerHTML = ""
}