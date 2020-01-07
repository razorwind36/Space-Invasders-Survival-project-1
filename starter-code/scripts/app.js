function init() {

  const grid = document.querySelector('.grid')

  const squares = []
  const fireBoxes = []
  const fireIntervals = []
  const alienIntervals = []

  const width = 22
  let playerIndex = 472

  Array(width * width).join('.').split('.').forEach(()=>{
    const square = document.createElement('div')
    square.classList.add('box')
    squares.push(square)
    grid.appendChild(square)
  })

  function randomizer(){
    return Math.floor(Math.random() * 100)
  }

  function alienBlock() {
    if (!squares[26,28,30,32].classList.contains('alien')){
      squares[26].classList.add('alien')
      squares[28].classList.add('alien')
      squares[30].classList.add('alien')
      squares[32].classList.add('alien')
    }
  }

  function alienGenerator(){
    const alienCount = document.querySelectorAll('.alien')

    if (alienCount.length < 8){
      setInterval(alienBlock,1000)
    }
  }

  squares[playerIndex].classList.add('player')

  function keyDown(e){
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
  function fire(){
    const fireBox = playerIndex - width
    fireBoxes.push([squares[fireBox], fireBox])
    fireBoxes[fireBoxes.length - 1][0].classList.add('fire')
    fireIntervals.push(setInterval(continueProjectile,150,fireBoxes.length - 1))
  }
  function continueProjectile(fireIndex){

    if (squares[fireBoxes[fireIndex][1]] === undefined){
      clearInterval(fireIntervals.shift())
    }
    else {
      fireBoxes[fireIndex][0].classList.remove('fire')
      fireBoxes[fireIndex][1] = fireBoxes[fireIndex][1] - width
      fireBoxes[fireIndex][0] = squares[fireBoxes[fireIndex][1]]
      fireBoxes[fireIndex][0].classList.add('fire')
    }

    if (fireBoxes[fireIndex][0].classList.contains('alien')){
      clearInterval(fireIntervals.shift())
      fireBoxes[fireIndex][0].classList.remove('alien','fire')
    }
  }
  window.addEventListener('keydown', keyDown)
}

window.addEventListener('DOMContentLoaded', init)