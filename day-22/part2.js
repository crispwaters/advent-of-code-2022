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

const FACE = Object.freeze({
  FRONT: 'front',
  BACK: 'back',
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right'
})
const FACES = Object.freeze(Object.keys(FACE))

const isBetween = (num, [low, high]) => low <= num && num <= high

const chunk1 = Object.freeze([1, 50])
const chunk2 = Object.freeze([51, 100])
const chunk3 = Object.freeze([101, 150])
const chunk4 = Object.freeze([151, 200])

/**
 * Hard coding this in for real input
 * Will not work with sample, general solution probably not worth it
 */
const getFaceChunks = (face) => {
  if (face === FACE.UP) return { row: chunk1, column: chunk2 }
  if (face === FACE.RIGHT) return { row: chunk1, column: chunk3 }
  if (face === FACE.FRONT) return { row: chunk2, column: chunk2 }
  if (face === FACE.LEFT) return { row: chunk3, column: chunk1 }
  if (face === FACE.DOWN) return { row: chunk3, column: chunk2 }
  if (face === FACE.BACK) return { row: chunk4, column: chunk1 }
}
const getFace = ({row, column}) => {
  for (const key of FACES) {
    const face = FACE[key]
    const chunks = getFaceChunks(face)
    // console.log({ chunks, row, column, face, key })
    if (isBetween(row, chunks.row) && isBetween(column, chunks.column)) return face
  }
  throw new Error(`Unknown face for row: ${row}, column: ${column}`)
}

const getChunkOffset = (val) => (val - 1) % 50
const applyChunkOffset = (offset, [low]) => offset + low

const cur = { row: 1, column: grid[1].min, dir: '>' }
const getNext = {
  '>': () => {
    if (grid[cur.row].max <= cur.column) {
      const curFace = getFace(cur)
      let nextRow, nextColumn, nextDir
      if (curFace === FACE.RIGHT) {
        const nextChunks = getFaceChunks(FACE.DOWN)
        nextDir = '<'
        nextRow = applyChunkOffset(
          49 - getChunkOffset(cur.row),
          nextChunks.row
        )
        nextColumn = nextChunks.column[1]
      }
      if (curFace === FACE.FRONT) {
        const nextChunks = getFaceChunks(FACE.RIGHT)
        nextDir = '^'
        nextRow = nextChunks.row[1]
        nextColumn = applyChunkOffset(
          getChunkOffset(cur.row),
          nextChunks.column
        )
      }
      if (curFace === FACE.DOWN) {
        const nextChunks = getFaceChunks(FACE.RIGHT)
        nextDir = '<'
        nextRow = applyChunkOffset(
          49 - getChunkOffset(cur.row),
          nextChunks.row
        ),
        nextColumn = nextChunks.column[1]
      }
      if (curFace === FACE.BACK) {
        const nextChunks = getFaceChunks(FACE.DOWN)
        nextDir = '^'
        nextRow = nextChunks.row[1]
        nextColumn = applyChunkOffset(
          getChunkOffset(cur.row),
          nextChunks.column
        )
      }
      if (!nextRow || !nextColumn || !nextDir) throw new Error(curFace)
      return {
        row: nextRow,
        column: nextColumn,
        dir: nextDir
      }
    }
    return { row: cur.row, column: cur.column + 1, dir: cur.dir }
  },
  'V': () => {
    const maxRow = getMaxRow(cur.column)
    if (maxRow <= cur.row) {
      const curFace = getFace(cur)
      let nextRow, nextColumn, nextDir
      if (curFace === FACE.BACK){
        const nextChunks = getFaceChunks(FACE.RIGHT)
        nextDir = 'V'
        nextRow = nextChunks.row[0]
        nextColumn = applyChunkOffset(
          getChunkOffset(cur.column),
          nextChunks.column
        )
      }
      if (curFace === FACE.DOWN) {
        const nextChunks = getFaceChunks(FACE.BACK)
        nextDir = '<'
        nextRow = applyChunkOffset(
          getChunkOffset(cur.column),
          nextChunks.row
        )
        nextColumn = nextChunks.column[1]
      }
      if (curFace === FACE.RIGHT) {
        const nextChunks = getFaceChunks(FACE.FRONT)
        nextDir = '<'
        nextRow = applyChunkOffset(
          getChunkOffset(cur.column),
          nextChunks.row
        )
        nextColumn = nextChunks.column[1]
      }
      if (!nextRow || !nextColumn || !nextDir) throw new Error(curFace)
      return {
        row: nextRow,
        column: nextColumn,
        dir: nextDir
      }
    }
    return { row: cur.row + 1, column: cur.column, dir: cur.dir }
  },
  '<': () => {
    if (grid[cur.row].min >= cur.column) {
      const curFace = getFace(cur)
      let nextRow, nextColumn, nextDir
      if (curFace === FACE.UP) {
        const nextChunks = getFaceChunks(FACE.LEFT)
        nextDir = '>'
        nextRow = applyChunkOffset(
          49 - getChunkOffset(cur.row),
          nextChunks.row
        )
        nextColumn = nextChunks.column[0]
      }
      if (curFace === FACE.FRONT) {
        const nextChunks = getFaceChunks(FACE.LEFT)
        nextDir = 'V'
        nextRow = nextChunks.row[0]
        nextColumn = applyChunkOffset(
          getChunkOffset(cur.row),
          nextChunks.column
        )
      }
      if (curFace === FACE.LEFT) {
        const nextChunks = getFaceChunks(FACE.UP)
        nextDir = '>'
        nextRow = applyChunkOffset(
          49 - getChunkOffset(cur.row),
          nextChunks.row
        )
        nextColumn = nextChunks.column[0]
      }
      if (curFace === FACE.BACK) {
        const nextChunks = getFaceChunks(FACE.UP)
        nextDir = 'V'
        nextRow = nextChunks.row[0]
        nextColumn = applyChunkOffset(
          getChunkOffset(cur.row),
          nextChunks.column
        )
      }
      if (!nextRow || !nextColumn || !nextDir) throw new Error(curFace)
      return {
        row: nextRow,
        column: nextColumn,
        dir: nextDir
      }
    }
    return { row: cur.row, column: cur.column - 1, dir: cur.dir }
  },
  '^': () => {
    const minRow = getMinRow(cur.column)
    if (minRow >= cur.row) {
      const curFace = getFace(cur)
      let nextRow, nextColumn, nextDir
      if (curFace === FACE.LEFT) {
        const nextChunks = getFaceChunks(FACE.FRONT)
        nextDir = '>'
        nextRow = applyChunkOffset(
          getChunkOffset(cur.column),
          nextChunks.row
        )
        nextColumn = nextChunks.column[0]
      }
      if (curFace === FACE.UP) {
        const nextChunks = getFaceChunks(FACE.BACK)
        nextDir = '>'
        nextRow = applyChunkOffset(
          getChunkOffset(cur.column),
          nextChunks.row
        )
        nextColumn = nextChunks.column[0]
      }
      if (curFace === FACE.RIGHT) {
        const nextChunks = getFaceChunks(FACE.BACK)
        nextDir = '^',
        nextRow = nextChunks.row[1]
        nextColumn = applyChunkOffset(
          getChunkOffset(cur.column),
          nextChunks.column
        )
      }
      if (!nextRow || !nextColumn || !nextDir) {
        console.log({cur, minRow})
        console.log(getFace(cur))
        throw new Error(curFace)
      }
      return {
        row: nextRow,
        column: nextColumn,
        dir: nextDir
      }
    }
    return { row: cur.row - 1, column: cur.column, dir: cur.dir }
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
        const {row, column, dir} = getNext[cur.dir]()
        cur.row = row
        cur.column = column
        cur.dir = dir
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

const test = () => {
  const oldCur = {...cur}

  const cases = [
  {
    row: 1,
    column: 51,
    dir: '^',
    next: {
      row: 151,
      column: 1,
      dir: '>'
    }
  },{
    row: 1,
    column: 100,
    dir: '^',
    next: {
      row: 200,
      column: 1,
      dir: '>'
    }
  },{
    row: 1,
    column: 101,
    dir: '^',
    next: {
      row: 200,
      column: 1,
      dir: '^'
    }
  },{
    row: 1,
    column: 150,
    dir: '^',
    next: {
      row: 200,
      column: 50,
      dir: '^'
    }
  },{
    row: 101,
    column: 1,
    dir: '^',
    next: {
      row: 51,
      column: 51,
      dir: '>'
    }
  },{
    row: 101,
    column: 50,
    dir: '^',
    next: {
      row: 100,
      column: 51,
      dir: '>'
    }
  },{
    row: 1,
    column: 150,
    dir: '>',
    next: {
      row: 150,
      column: 100,
      dir: '<'
    }
  },{
    row: 50,
    column: 150,
    dir: '>',
    next: {
      row: 101,
      column: 100,
      dir: '<'
    }
  },{
    row: 51,
    column: 100,
    dir: '>',
    next: {
      row: 50,
      column: 101,
      dir: '^'
    }
  },{
    row: 100,
    column: 100,
    dir: '>',
    next: {
      row: 50,
      column: 150,
      dir: '^'
    }
  },{
    row: 101,
    column: 100,
    dir: '>',
    next: {
      row: 50,
      column: 150,
      dir: '<'
    }
  },{
    row: 150,
    column: 100,
    dir: '>',
    next: {
      row: 1,
      column: 150,
      dir: '<'
    }
  },{
    row: 151,
    column: 50,
    dir: '>',
    next: {
      row: 150,
      column: 51,
      dir: '^'
    }
  },{
    row: 200,
    column: 50,
    dir: '>',
    next: {
      row: 150,
      column: 100,
      dir: '^'
    }
  },{
    row: 50,
    column: 101,
    dir: 'V',
    next: {
      row: 51,
      column: 100,
      dir: '<'
    }
  },{
    row: 50,
    column: 150,
    dir: 'V',
    next: {
      row: 100,
      column: 100,
      dir: '<'
    }
  },{
    row: 150,
    column: 51,
    dir: 'V',
    next: {
      row: 151,
      column: 50,
      dir: '<'
    }
  },{
    row: 150,
    column: 100,
    dir: 'V',
    next: {
      row: 200,
      column: 50,
      dir: '<'
    }
  },{
    row: 200,
    column: 1,
    dir: 'V',
    next: {
      row: 1,
      column: 101,
      dir: 'V'
    }
  },{
    row: 200,
    column: 50,
    dir: 'V',
    next: {
      row: 1,
      column: 150,
      dir: 'V'
    }
  },{
    row: 1,
    column: 51,
    dir: '<',
    next: {
      row: 150,
      column: 1,
      dir: '>'
    }
  },{
    row: 50,
    column: 51,
    dir: '<',
    next: {
      row: 101,
      column: 1,
      dir: '>'
    }
  },{
    row: 51,
    column: 51,
    dir: '<',
    next: {
      row: 101,
      column: 1,
      dir: 'V'
    }
  },{
    row: 100,
    column: 51,
    dir: '<',
    next: {
      row: 101,
      column: 50,
      dir: 'V'
    }
  },{
    row: 101,
    column: 1,
    dir: '<',
    next: {
      row: 50,
      column: 51,
      dir: '>'
    }
  },{
    row: 150,
    column: 1,
    dir: '<',
    next: {
      row: 1,
      column: 51,
      dir: '>'
    }
  },{
    row: 151,
    column: 1,
    dir: '<',
    next: {
      row: 1,
      column: 51,
      dir: 'V'
    }
  },{
    row: 200,
    column: 1,
    dir: '<',
    next: {
      row: 1,
      column: 100,
      dir: 'V'
    }
  }]

  let passedCases = 0
  for(const { row, column, dir, next } of cases) {
    cur.row = row
    cur.column = column
    cur.dir = dir
    const actual = getNext[cur.dir]()
    const pass = actual.row === next.row && actual.column === next.column && actual.dir === next.dir
    // console.log(`Test case: row=${row}, column=${column}, dir=${dir} ${pass ? 'PASSED' : 'FAILED'}`)
    if (!pass) {
      console.log(`Test case: row=${row}, column=${column}, dir=${dir} ${pass ? 'PASSED' : 'FAILED'}`)
      console.log(`--EXPECTED: ${JSON.stringify(next)}`)
      console.log(`--ACTUAL: ${JSON.stringify(actual)}`)
    } else {
      passedCases++
    }
  }
  console.log(`${passedCases} of ${cases.length} test cases passed`)

  cur.row = oldCur.row
  cur.column = oldCur.column
  cur.dir = oldCur.dir
}
// test()