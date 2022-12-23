const fs = require('fs')

const isSample = false
const prefix = isSample ? 'sample.' : ''
const inputFile = `${prefix}input.txt`
const outputFile = `${prefix}output.txt`
const printFile = `${prefix}print.txt`
const logFile = `${prefix}logs.txt`

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

const grid = { min: Infinity, max: 0 }
const instructions = []
let row = 1
for(const line of input) {
  if (/[\.#]+/.test(line)) {
    const chars = line.split('')
    grid[row] = { min: Infinity, max: 0}
    for (let column = 1; column <= chars.length; column++) {
      const char = chars[column - 1].trim()
      if (char) {
        grid[row][column] = char
        grid[row].min = Math.min(grid[row].min, column)
        grid[row].max = Math.max(grid[row].max, column)
      }
    }
    grid.min = Math.min(grid.min, row)
    grid.max = Math.max(grid.max, row)
    row++
  } else if (/^[\dRL]+$/.test(line)) {
    line.split('').reduce((acc, cur, i) => {
      if (/\d/.test(cur)) {
        acc = `${acc}${cur}`
      } else {
        instructions.push(acc, cur)
        acc = ''
      }
      if (acc && i === line.length -1) {
        instructions.push(acc)
      }
      return acc
    })
  }
}

const getMinRow = (column) => {
  let row = grid.min
  while (true) {
    if (grid[row][column]) return row
    row++
  }
}

const getMaxRow = (column) => {
  let row = grid.max
  while (true) {
    if (grid[row][column]) return row
    row--
  }
}

const cur = { row: 1, column: grid[1].min, dir: '>' }
const getNext = {
  '>': () => {
    if (grid[cur.row].max <= cur.column) {
      return { row: cur.row, column: grid[cur.row].min }
    }
    return { row: cur.row, column: cur.column + 1 }
  },
  'V': () => {
    const maxRow = getMaxRow(cur.column)
    if (maxRow <= cur.row) {
      return { row: getMinRow(cur.column), column: cur.column }
    }
    return { row: cur.row + 1, column: cur.column }
  },
  '<': () => {
    if (grid[cur.row].min >= cur.column) {
      return { row: cur.row, column: grid[cur.row].max }
    }
    return { row: cur.row, column: cur.column - 1 }
  },
  '^': () => {
    const minRow = getMinRow(cur.column)
    if (minRow >= cur.row) {
      return { row: getMaxRow(cur.column), column: cur.column }
    }
    return { row: cur.row - 1, column: cur.column }
  }
}
const canMove = () => {
  const {row, column} = getNext[cur.dir]()
  return grid[row][column] !== '#'
}
const turn = {
  R: {
    '>': 'V',
    'V': '<',
    '<': '^',
    '^': '>'
  },
  L: {
    '>': '^',
    'V': '>',
    '<': 'V',
    '^': '<'
  }
}

const walk = () => {
  while (instructions.length) {
    grid[cur.row][cur.column] = cur.dir
    const instruction = instructions.shift()
    if (/[RL]/.test(instruction)) {
      cur.dir = turn[instruction][cur.dir]
    } else {
      let steps = Number(instruction)
      while (steps > 0) {
        if (!canMove()) break
        const {row, column} = getNext[cur.dir]()
        cur.row = row
        cur.column = column
        grid[cur.row][cur.column] = cur.dir
        steps--
      }
    }
  }
}
walk()
// console.log(grid)
console.log(cur)

const facingScore = {
  '>': 0,
  'V': 1,
  '<': 2,
  '^': 3
}
const finalScore = (1000 * cur.row) + (4 * cur.column) + facingScore[cur.dir]
console.log({finalScore})

const printRows = []
for (let row = grid.min; row <= grid.max; row++) {
  let line = ''
  for (let column = 0; column <= grid[row].max; column++) {
    if (column < grid[row].min) line += ' '
    else line += grid[row][column]
  }
  printRows.push(line)
}
fs.writeFileSync(printFile, printRows.join('\n'))