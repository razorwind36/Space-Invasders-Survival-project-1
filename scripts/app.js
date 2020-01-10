function init() {

  const body = document.querySelector('body')
  const grid = document.querySelector('.grid')
  const scoreView = document.querySelector('#score')
  const livesLeft = document.querySelector('#life')

  const squares = []
  let fireBox = undefined
  const alienBoxes = []
  const alienFireBoxes = []
  const listOfIntervals = []

  let score = 0
  let lives = 3
  livesLeft.innerHTML = lives

  const width = 22
  let playerIndex = 472

  Array(width * width).join('.').split('.').forEach(()=>{
    const square = document.createElement('div')
    square.classList.add('box')
    squares.push(square)
    grid.appendChild(square)
  })
  alienGenerator()

  listOfIntervals.push(setInterval(alienGenerator,10000))

  listOfIntervals.push(setInterval(alienFire,500))

  listOfIntervals.push(setInterval(collisonCheck,1))
  // setInterval(alienGenerator,10000) // create enemies every 10 secs

  function collisonCheck() {
    for (let i = 0; i < alienFireBoxes.length; i++){

      if (alienFireBoxes[i] !== undefined && fireBox !== undefined){
        if (alienFireBoxes[i].shotLocation === fireBox.shotIndex) {
          clearInterval(fireBox.intervalID)
          clearInterval(alienFireBoxes[i].intervalID)

          squares[alienFireBoxes[i].shotLocation].classList.remove('alienfire')
          squares[alienFireBoxes[i].shotLocation].classList.remove('fire')
    
          alienFireBoxes[i] = undefined
          fireBox = undefined
        }
      }
    }
  }

  function alienProjectile(alienFireIndex){

    if (alienFireBoxes[alienFireIndex].shotLocation > width * width){

      squares[alienFireBoxes[alienFireIndex].shotLocation - width].classList.remove('alienfire')
      clearInterval(alienFireBoxes[alienFireIndex].intervalID)
      alienFireBoxes[alienFireIndex] = undefined
    } else {
      squares[alienFireBoxes[alienFireIndex].shotLocation].classList.remove('alienfire')
      alienFireBoxes[alienFireIndex].shotLocation = alienFireBoxes[alienFireIndex].shotLocation + width
      squares[alienFireBoxes[alienFireIndex].shotLocation].classList.add('alienfire')
    }
    

    if (alienFireBoxes[alienFireIndex].shotLocation === playerIndex){

      squares[alienFireBoxes[alienFireIndex].shotLocation].classList.remove('alienfire')

      clearInterval(alienFireBoxes[alienFireIndex].intervalID)
      alienFireBoxes[alienFireIndex] = undefined

      if (lives > 1){
        lives -= 1
        livesLeft.innerHTML = lives
      } else if (lives === 1) {

        listOfIntervals.forEach(e => clearInterval(e))

        const gameName = document.querySelector('.gamename')
        const gameOver = document.querySelector('.gameover')
        lives -= 1
        livesLeft.innerHTML = lives
        body.removeChild(grid)
        gameName.style.display = 'none'
        gameOver.style.display = 'block'
      }
    } 
  }
  function alienFire(){
    const aliens = document.querySelectorAll('.alien')

    const chosenAlien = aliens[randomizer(aliens.length - 1)]

    const alienShot = {
      shotLocation: squares.indexOf(chosenAlien) + width
    }
    alienFireBoxes.push(alienShot)
    squares[alienShot.shotLocation].classList.add('alienfire')

    let intReady = false
    while (!intReady){
      const alienFireInterval = setInterval(alienProjectile, 100, alienFireBoxes.indexOf(alienShot))
      if (!listOfIntervals.includes(alienFireInterval)){
        listOfIntervals.push(alienFireInterval)
        alienFireBoxes[alienFireBoxes.indexOf(alienShot)].intervalID = alienFireInterval
        intReady = true
      } else if (listOfIntervals.includes(alienFireInterval)){
        clearInterval(alienFireInterval)
      }
    }
    
    
  }
  function killCheck(){ // check is an enemy should be removed from an alien interval
    for (const alien in alienBoxes){
      const alive = alienBoxes[alien].locations.filter( n => {
        return (!squares[n].classList.contains('fire'))
      })
      alienBoxes[alien].locations = alive
    }
  }

  function randomizer(e = 100){ // Makes a random number and returns it
    return Math.floor(Math.random() * e)
  }

  function alienBlock(alienIndex){ // Aliens movement logic
    // Movement control system
    if (alienBoxes[alienIndex].locations.length === 0){
      console.log('I worked')
      clearInterval(alienBoxes[alienIndex].intervalID)
      alienBoxes[alienIndex] = undefined
    }

    alienBoxes[alienIndex].locations.forEach(n => squares[n].classList.remove('alien'))
    if (alienBoxes[alienIndex].locations[alienBoxes[alienIndex].locations.length - 1] % width < width - 1 && alienBoxes[alienIndex].direction === 'right'){

      alienBoxes[alienIndex].locations = alienBoxes[alienIndex].locations.map(n => n + 1)

    } else if (alienBoxes[alienIndex].locations[0] % width > 0 && alienBoxes[alienIndex].direction === 'left'){

      alienBoxes[alienIndex].locations = alienBoxes[alienIndex].locations.map(n => n - 1)

    } else {

      alienBoxes[alienIndex].locations = alienBoxes[alienIndex].locations.map(n => n + width)

      if (alienBoxes[alienIndex].direction === 'right') alienBoxes[alienIndex].direction = 'left'
      else if (alienBoxes[alienIndex].direction === 'left') alienBoxes[alienIndex].direction = 'right'
    }
    alienBoxes[alienIndex].totalMoves += 1
    alienBoxes[alienIndex].locations.forEach(n => squares[n].classList.add('alien'))

  }

  function alienGenerator(){ // Checks the board, decides and generates alien blocks 
    const alienCount = document.querySelectorAll('.alien')

    let alienSet

    if (alienCount.length === 0) {
      alienSet = {
        locations: [26,28,30,32,34,71,73,75,77,79],
        direction: 'right',
        totalMoves: 0
      }
    } else if (alienCount.length < 10 && randomizer() > 25){
      alienSet = {
        locations: [26,28,30,32,34],
        direction: 'right',
        totalMoves: 0
      }
    }
    if (alienSet !== undefined){
      alienSet.locations.forEach(n => squares[n].classList.add('alien'))

      alienBoxes.push(alienSet)// last index is the amount of times aliens have moved, last -1 is the direction it should move


      let intReady = false
      while (!intReady){
        const alienInterval = setInterval(alienBlock,1000, alienBoxes.indexOf(alienSet))
        if (!listOfIntervals.includes(alienInterval)){
          listOfIntervals.push(alienInterval)
          alienBoxes[alienBoxes.indexOf(alienSet)].intervalID = alienInterval
          intReady = true
        } else if (listOfIntervals.includes(alienInterval)){
          clearInterval(alienInterval)
        }
      }
    }
  }

  squares[playerIndex].classList.add('player')

  function keyDown(e){ // player action registry system
    let openFire = true
    const projectileNum = document.querySelectorAll('.fire')
    if (projectileNum.length > 0) openFire = false

    switch (e.keyCode) {
      case 39:
        if (playerIndex % width < width - 1){
          playerIndex++
        }
        break
      case 37:
        if (playerIndex % width > 0){
          playerIndex--
        }
        break
      case 32:
        if (openFire) fire()
        break
        
      default:
        console.log('Player shouldn\'t move')
    }
    squares.forEach(square => square.classList.remove('player'))
    squares[playerIndex].classList.add('player')
  }
  function fire(){ // creating a player fire object
    const shot = {
      shotIndex: playerIndex - width
    }
    fireBox = shot
    squares[shot.shotIndex].classList.add('fire')

    let intReady = false
    while (!intReady){
      const interID = setInterval(continueProjectile,100)
      if (!listOfIntervals.includes(interID)){
        listOfIntervals.push(interID)
        fireBox.intervalID = interID
        intReady = true
      } else if (listOfIntervals.includes(interID)){
        clearInterval(interID)
      }
    }
  }
  function continueProjectile(){ // keeps the player fire going
    if (fireBox.shotIndex < 0){
      clearInterval(fireBox.intervalID)
      fireBox = undefined
    } else {
      squares[fireBox.shotIndex].classList.remove('fire')
      fireBox.shotIndex = fireBox.shotIndex - width
      squares[fireBox.shotIndex].classList.add('fire')
    }

    if (squares[fireBox.shotIndex].classList.contains('alien')){

      squares[fireBox.shotIndex].classList.remove('alien')
      killCheck()
      squares[fireBox.shotIndex].classList.remove('fire')

      clearInterval(fireBox.intervalID)
      fireBox = undefined

      score += 100
      scoreView.innerHTML = score
    } 

  }
  window.addEventListener('keydown', keyDown)
}

window.addEventListener('DOMContentLoaded', init)