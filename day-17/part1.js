const fs = require('fs')
const { 
  Grid,
  RockGenerator 
} = require('./rocks')

const isSample = false
const prefix = isSample ? 'sample.' : ''
const inputFile = `${prefix}input.txt`
const outputFile = `${prefix}output.txt`
const printFile = `${prefix}print.txt`
const logFile = `${prefix}logs.txt`

const buffer = fs.readFileSync(inputFile)
const input = buffer.toString().trim()

const logs = []

const isDebug = false
const verbosePrintCount = 0
const debug = (msg) => {
  if (!isDebug) return
  console.log(msg)
}

const jetPattern = input.split('')

const grid = new Grid()
const rg = RockGenerator(grid)

let iJet = 0
const getJetDirection = () => {
  const pattern = jetPattern[iJet]
  iJet = (iJet + 1) % jetPattern.length
  return pattern
}
const tryMoveRock = (rock) => {
  const jetDirection = getJetDirection()
  if (jetDirection === '<') debug(`moveLeft ${rock.moveLeft()?'':'not '}successful`)
  if (jetDirection === '>') debug(`moveRight ${rock.moveRight()?'':'not '}successful`)
}
while(grid.rockCount < 2022) {
  const rock = rg.next().value
  tryMoveRock(rock)
  while (rock._isFalling) {
    if (rock.canMoveDown()) {
      rock.moveDown()
      debug(`moveDown successful to ${rock._position.y}`)
      tryMoveRock(rock)
    }
    else {
      grid.placeRock(rock)
      if (grid.rockCount <= verbosePrintCount) fs.writeFileSync(printFile.replace('print',`print_${grid.rockCount.toString().padStart(4, '0')}`), grid.printGrid())
    }
  }
}
console.log(grid.height)

fs.writeFileSync(printFile, grid.printGrid())