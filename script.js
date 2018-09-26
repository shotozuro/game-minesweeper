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

const boardEl = document.getElementById("board")
const inputBoard = document.getElementById("boardLength")
const inputBombs = document.getElementById("bombsLength")
const gameStatus = document.getElementById("status")

document.getElementById("setBoard").addEventListener("click", setBoardLength)
document.getElementById("setBomb").addEventListener("click", setBombs)

function setBoardLength () {
  const boardVal = parseInt(inputBoard.value)
  // const bombVal = parseInt(inputBombs.value)
  if (boardVal < 1) {
    alert('Kotak minimal 1')
  } else {
    board = Array(boardVal).fill(0).map(x => { return {value: 0, clicked: false} })
    boardLength = boardVal
  }
}

function setBombs () {
  const bombVal = parseInt(inputBombs.value)
  let bombs = bombVal
  const maxBombs = Math.ceil(boardLength * 1 / 3)
  if (bombVal <= maxBombs) {
    // random bomb and set to board
    while(bombs > 0) {
      const randomNumber = getRandom(boardLength)
      console.log(randomNumber)
      if (board[randomNumber].value == 0) {
        board[randomNumber].value = "*"
        bombLocation.push(randomNumber)
        if (board[randomNumber - 1] && board[randomNumber - 1].hasOwnProperty('value')) {
          if (board[randomNumber - 1].value != "*") {
            board[randomNumber - 1].value += 1
          }
        }
        if (board[randomNumber + 1] && board[randomNumber + 1].hasOwnProperty('value')) {
          if (board[randomNumber + 1].value != "*") {
            board[randomNumber + 1].value += 1
          }
        }
        bombs--
      }
    }
    render()
  } else {
    alert('Jumlah bomb maksimal ' + maxBombs)
  }
}

function getRandom (count) {
  return Math.floor(Math.random() * count) 
}

function render () {
  boardEl.innerHTML = ""
  for(let i = 0; i < boardLength; i++) {
    const div = document.createElement("button")
    const text = document.createTextNode(board[i].value)
    div.addEventListener("click", clickBox)
    // div.appendChild(text)
    div.disabled = board[i].clicked
    div.classList.add("box")
    div.setAttribute("id", "box-" + i)
    // html += `<div class="box" id="box-${i}"></div>`
    boardEl.appendChild(div)
  }
  
}

function clickBox (e) {
  const boxVal = e.target.id
  const ids = boxVal.split("-")
  const selectedBox = board[ids[1]]
  e.target.innerText = selectedBox.value
  selectedBox.clicked = true
  if (selectedBox.value == "*") {
    alert('game over')
    gameOver()
  } else if (selectedBox.value != 0 && selectedBox.value != "*") {
    // open the box
    // document.getElementById("box-" + ids[1]).innerText = selectedBox.value 
    document.getElementById("box-" + ids[1]).innerText = selectedBox.value 
  } else {
    // check before
    let hasOpenedBefore = false
    let hasOpenedAfter = false
    let searchIdBefore = parseInt(ids[1]) - 1
    let searchIdAfter = parseInt(ids[1]) + 1
    while(!hasOpenedBefore) {
      if (searchIdBefore > 0) {
        if (board[searchIdBefore] && !isBomb(searchIdBefore)) {
          board[searchIdBefore].clicked = true
          if (board[searchIdBefore].value > 0) {
            hasOpenedBefore = true
          }
        }
        searchIdBefore --
      } else {
        hasOpenedBefore = true
      }
    }

    while(!hasOpenedAfter) {
      if (searchIdAfter < boardLength - 1) {
        if (board[searchIdAfter] && !isBomb(searchIdAfter)) {
          board[searchIdAfter].clicked = true
          if (board[searchIdAfter].value > 0) {
            hasOpenedAfter = true
          }
        }
        searchIdAfter ++
      } else {
        hasOpenedAfter = true
      }
    }
    // document.getElementById("box-" + ids[1]).innerText = selectedBox.value
  }

  render()

}

function isBomb (index) {
  return board[index].value == "*"
}

function gameOver () {
  //game over
}