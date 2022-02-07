const grid = document.querySelector('.grid')
const resultsDisplay = document.querySelector('#result')
let currentShooterIndex = 202
let width = 15
let direction = 1 // 1 for forward or R, -1 for backward or L
let invadersId
let goingRight = true
let aliensRemoved = []
let results = 0 // change to score

// automating creation of width x width grid
for (let i = 0; i < 225; i++) {
  const square = document.createElement('div')
  grid.appendChild(square)
}

// to access all 225 squares in the grid
const squares = Array.from(document.querySelectorAll('.grid div'))

// defining the alien invaders by their grid indices
const alienInvaders = [
  0,1,2,3,4,5,6,7,8,9,
  15,16,17,18,19,20,21,22,23,24,
  30,31,32,33,34,35,36,37,38,39
]

// drawing the aliens
function draw() {
  for (let i = 0; i < alienInvaders.length; i++) {
    if(!aliensRemoved.includes(i)) {
      squares[alienInvaders[i]].classList.add('invader')
    }
  }
}
draw()

function remove() {
  for (let i = 0; i < alienInvaders.length; i++) {
    squares[alienInvaders[i]].classList.remove('invader')
  }
}

// drawing the shooter
squares[currentShooterIndex].classList.add('shooter')

// // moving the shooter around when event e occurs
function moveShooter(e) {
  squares[currentShooterIndex].classList.remove('shooter')
  
  // so basically you can move left as long as remainder is not 0, if it's 0 you're at the end of the grid
  switch(e.key) {
    case 'ArrowLeft':
      if (currentShooterIndex % width !== 0) currentShooterIndex -=1
      break
    case 'ArrowRight' :
      if (currentShooterIndex % width < width - 1) currentShooterIndex +=1
      break
  } // end of switch
  squares[currentShooterIndex].classList.add('shooter')
} // end of move shooter func

// adding an eventlistener that listens to the keydown action and triggers the moveshooter function whenever we press left and right arrow keys
document.addEventListener('keydown', moveShooter)

// moving the invaders, from side to side, moving down a row each time
function moveInvaders() {
  const leftEdge = alienInvaders[0] % width === 0
  const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width -1
  
  // remove all aliens
  remove()

  if (rightEdge && goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width +1
      direction = -1
      goingRight = false
    }
  }

  if(leftEdge && !goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width -1
      direction = 1
      goingRight = true
    }
  }

  // change the direction for each alien invader
  for (let i = 0; i < alienInvaders.length; i++) {
    alienInvaders[i] += direction
  }

  draw()

  // alien invader has got to the shooter square? lol game over
  if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
    resultsDisplay.innerHTML = 'GAME OVER. (in Sova accent)'
    alert("GAME OVER. (in Sova accent)");
    clearInterval(invadersId)
    clearInterval(laserId)
  }

  // aliens missed the shooter but are at the bottom
  for (let i = 0; i < alienInvaders.length; i++) {
    if(alienInvaders[i] > (squares.length)) {
      resultsDisplay.innerHTML = 'GAME OVER. (in Sova accent)'
      alert("GAME OVER. (in Sova accent)");
      clearInterval(invadersId)
      clearInterval(laserId)
    }
  }

  // declare a win bih when all aliens are in the taken down array
  if (aliensRemoved.length === alienInvaders.length) {
    // resultsDisplay.innerHTML = 'YOU ARE THE HUNTER. congrats bitch you win.'
    alert("YOU ARE THE HUNTER. congrats bitch you win.");
    clearInterval(invadersId)
    clearInterval(laserId)
  }
} // end of invadersMOVEbitches()

// calling the invadersmove function at intervals of half a sec
invadersId = setInterval(moveInvaders, 600)

let laserId;
function shoot(e) {
  
  let currentLaserIndex = currentShooterIndex; // has to begin shooting from the shooter
  
  // now, moving the laser from the shooter to the alien invader
  function moveLaser() {
    
    // remove laser from current starting position
    squares[currentLaserIndex].classList.remove('laser');

    // we've to minus 15 (or width) so that it's next appearance is in the next row of the grid
    currentLaserIndex -= width
    squares[currentLaserIndex].classList.add('laser')

    // if laser hits an invader do all dis crap
    if (squares[currentLaserIndex].classList.contains('invader')) {
      squares[currentLaserIndex].classList.remove('laser')
      squares[currentLaserIndex].classList.remove('invader')
      squares[currentLaserIndex].classList.add('boom')

      setTimeout(()=> squares[currentLaserIndex].classList.remove('boom'), 300)
      clearInterval(laserId);

      const alienRemoved = alienInvaders.indexOf(currentLaserIndex)
      aliensRemoved.push(alienRemoved)
      results++
      resultsDisplay.innerHTML = results
      console.log(aliensRemoved)

    } // end of if
  } // end of moveLaser()

  // now to trigger the shoot() when we press the spacebar
  switch(e.keyCode) {
    case 32 :
      laserId = setInterval(moveLaser, 100)
  }
} // end of shoot()

document.addEventListener('keydown', shoot);