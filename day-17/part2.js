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
const aTrillionRocks = 1e12

const isDebug = false
const verbosePrintCount = 0
const debug = (msg) => {
  if (!isDebug) return
  console.log(msg)
}

const jetPattern = input.split('')

const getRockType = (rock) => rock.constructor.name

const run = (tRocks) => {
  const grid = new Grid()
  const rg = RockGenerator(grid)

  const previousStates = {}
  
  let iJet = 0
  let nRocks = 0
  let addedHeight = 0
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
  while(nRocks < tRocks) {
    const rock = rg.next().value
    const height = grid.height
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

    let state = `${iJet}:${getRockType(rock)}`
    for (let y = height; y >= height - 10; y--) {
      const bits = [',']
      for (let x = 0; x < grid.width; x++) {
        bits.push(grid.hasRock(x, y) ? '1' : '0')
      }
      state += bits.join('')
    }
    if (previousStates[state] != null) {
      const nRockDelta = nRocks - previousStates[state].rockCount;
      const heightChange = height - previousStates[state].height
      const nCycles = Math.floor((tRocks - previousStates[state].rockCount) / nRockDelta) - 1
      console.log({ nCycles, heightChange, nRockDelta })
      addedHeight += nCycles * heightChange
      nRocks += nCycles * nRockDelta
    } else {
      previousStates[state] = {
        height: grid.height,
        rockCount: nRocks
      }
    }
    nRocks++
  }
  return grid.height + addedHeight
}
const height = run(aTrillionRocks)
console.log(height)
