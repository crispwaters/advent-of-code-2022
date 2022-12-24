const fs = require('fs')
const Grid = require('./grid')

const isSample = false
const prefix = isSample ? 'sample.' : ''
const inputFile = `${prefix}input.txt`
const outputFile = `${prefix}output.txt`
const printFile = `${prefix}print.txt`
const logFile = `${prefix}logs.txt`
const verbosePrintFile = (turn) => `${prefix}print-turn-${turn}.txt`
const isVerbosePrint = false

const buffer = fs.readFileSync(inputFile)
const input = buffer.toString().split('\n')

const logs = []

const isDebug = false
const debug = (msg) => {
  if (!isDebug) {
    logs.push(msg)
    return
  }
  console.log(msg)
}

const createGrid = (input) => {
  const coordinates = []
  let row = 0
  for (const line of input) {
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '#') coordinates.push({ x: row, y: i })
    }
    row++
  }
  return new Grid(coordinates)
}
const grid = createGrid(input)
debug(grid.getElfCoordinates())
let nTurn = 0
while (true) {
  nTurn++
  grid.calculateMoves()
  const elfMoved = grid.executeMoves()
  if (isVerbosePrint) {
    fs.writeFileSync(verbosePrintFile(turn), grid.printGrid())
    debug(grid.getElfCoordinates())
  }
  if (!elfMoved) break;
}
console.log(nTurn)