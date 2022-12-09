const fs = require('fs')

const isSample = false
const prefix = isSample ? 'sample.' : ''
const inputFile = `${prefix}input.txt`
const outputfile = `${prefix}output.txt`

const buffer = fs.readFileSync(inputFile)
const input = buffer.toString()



let x = 0, y = 0
let lastX, lastY
let tailX = 0, tailY = 0
const mRight = () => { x++ }
const mLeft = () => { x-- }
const mUp = () => { y++ }
const mDown = () => { y-- }
const move = {
  "U": mUp,
  "D": mDown,
  "R": mRight,
  "L": mLeft
}
let visitedCount = 1
const grid = {
  0: { 0: true }
}
const moveTail = () => Math.abs(x - tailX) > 1 || Math.abs(y - tailY) > 1
for (const line of input.split('\n').map(str => str.trim())) {
  const [direction, moves] = line.split(' ')
  const nMoves = Number(moves)
  for (let i = 0; i < nMoves; i++) {
    lastX = x
    lastY = y
    move[direction]()
    if (moveTail()) {
      tailX = lastX, tailY = lastY
      if (grid[tailX] === undefined) {
        grid[tailX] = { [tailY]: true }
        visitedCount++ 
      } else if (!grid[tailX][tailY]) {
        grid[tailX][tailY] = true
        visitedCount++
      }
    }
  }
}
console.log(visitedCount)

fs.writeFileSync(outputfile, JSON.stringify(grid, null, 2))
