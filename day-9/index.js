const fs = require('fs')

const isSample = false
const prefix = isSample ? 'sample.' : ''
const inputFile = `${prefix}input.txt`
const outputfile = `${prefix}output.txt`

const buffer = fs.readFileSync(inputFile)
const input = buffer.toString()




let lastX, lastY
const start = () => ({ x: 0, y: 0 })
const knots = {
  0: start(),
  1: start(),
  2: start(),
  3: start(),
  4: start(),
  5: start(),
  6: start(),
  7: start(),
  8: start(),
  9: start()
}
const mRight = () => { knots[0].x++ }
const mLeft = () => { knots[0].x-- }
const mUp = () => { knots[0].y++ }
const mDown = () => { knots[0].y-- }
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
// const moveTail = () => Math.abs(x - tailX) > 1 || Math.abs(y - tailY) > 1
const checkMoveKnot = (n) => {
  const prev = knots[n - 1]
  const cur = knots[n]
  return Math.abs(prev.x - cur.x) > 1 || Math.abs(prev.y - cur.y) > 1
}
const moveKnot = (n) => {
  const prev = knots[n - 1]
  const cur = knots[n]
  if (cur.x !== prev.x) {
    cur.x += (cur.x < prev.x ? 1 : -1)
  }
  if (cur.y !== prev.y) {    
    cur.y += (cur.y < prev.y ? 1 : -1)
  }
}
for (const line of input.split('\n').map(str => str.trim())) {
  // console.log(line)
  const [direction, moves] = line.split(' ')
  const nMoves = Number(moves)
  for (let i = 0; i < nMoves; i++) {
    move[direction]()
    let checkMove = true
    let n = 1
    while (checkMove && n <= 9) {
      if (checkMoveKnot(n)) {
        moveKnot(n)
        if (n === 9) {
          // console.log(`Tail visiting position ${JSON.stringify({ x: knots[n].x, y: knots[n].y })}`)
          if (grid[knots[n].x] === undefined) {
            grid[knots[n].x] = { [knots[n].y]: true }
            visitedCount++
          } else if (!grid[knots[n].x][knots[n].y]) {
            grid[knots[n].x][knots[n].y] = true
            visitedCount++
          }
        }
        n++
      } else {
        checkMove = false
      }
    }
    // if (moveTail()) {
    //   tailX = lastX, tailY = lastY
    //   if (grid[tailX] === undefined) {
    //     grid[tailX] = { [tailY]: true }
    //     visitedCount++ 
    //   } else if (!grid[tailX][tailY]) {
    //     grid[tailX][tailY] = true
    //     visitedCount++
    //   }
    // }
  }  
  // console.log(knots)
}
console.log(visitedCount)
// console.log(knots)

fs.writeFileSync(outputfile, JSON.stringify(grid, null, 2))
