const fs = require('fs')

const isSample = false
const prefix = isSample ? 'sample.' : ''
const inputFile = `${prefix}input.txt`
const outputfile = `${prefix}output.txt`
const printfile = `${prefix}print.txt`
const logFile = `${prefix}logs.txt`

const buffer = fs.readFileSync(inputFile)
const input = buffer.toString()

const logs = []

const isDebug = false
const isVerbose = false
const debug = (msg) => {
  if (!isDebug) return
  console.log(msg)
}

const  linePoints = []
const bounds = { 
  x: {
    min: Number.POSITIVE_INFINITY,
    max: Number.NEGATIVE_INFINITY
  },
  y: {    
    min: Number.POSITIVE_INFINITY,
    max: Number.NEGATIVE_INFINITY
  }
}

for (const line of input.split('\n')) {
  const points = line.trim().split(' -> ').map(pair => {
    const [x, y] = pair.split(',').map(val => Number(val))
    bounds.x.min = Math.min(bounds.x.min, x)
    bounds.x.max = Math.max(bounds.x.max, x)
    bounds.y.min = Math.min(bounds.y.min, y)
    bounds.y.max = Math.max(bounds.y.max, y)
    return {x, y}
  })
  linePoints.push(points)
}
debug(linePoints)
debug(bounds)

bounds.y.max += 2

linePoints.push([{x: bounds.x.min, y: bounds.y.max}, {x: bounds.x.max, y: bounds.y.max}])



const map = {}
const checkColumn = (x) => {
  const fill = (x) => {
    map[x] = {}
    for (let y = 0; y <= bounds.y.max; y++) {
      map[x][y] = y === bounds.y.max ? '#' : '.'
    }
  }
  for (let i = x; i < bounds.x.min; i++) {
    fill(i)
  }
  for (let i = x; i > bounds.x.max; i--) {
    fill(i)
  }
  bounds.x.min = Math.min(bounds.x.min, x)
  bounds.x.max = Math.max(bounds.x.max, x)
}

const setValue = (x, y, val) => {
  checkColumn(x)
  map[x][y] = val
 }
const getValue = (x, y) => {
  checkColumn(x)
  return map[x][y]
}

for (let i = bounds.x.min; i <= bounds.x.max; i++) {
  for (let j = 0; j <= bounds.y.max; j++) {
    if (!map[i]) map[i] = {}
    map[i][j] = '.'
  }
}

const drawLines = () => {
  for (const points of linePoints) {
    let last
    for (const point of points) {
      if (last) {
        for (let x = last.x; x < point.x; x++) map[x][last.y] = '#'
        for (let x = last.x; x > point.x; x--) map[x][last.y] = '#'
        for (let y = last.y; y < point.y; y++) map[last.x][y] = '#'
        for (let y = last.y; y > point.y; y--) map[last.x][y] = '#'
      }
      setValue(point.x, point.y, '#')
      last = point
    }
  }
}
drawLines()

const printMap = () => {
  const xMin = `${bounds.x.min}`.padStart(3, ' ').split('')
  const xMax = `${bounds.x.max}`.padStart(3, ' ').split('')
  const xSrc = ['5','0','0']

  const yMax = `${bounds.y.max}`.split('')

  const lines = []
  // HEADER
  const space = (n) => {
    return Array(n).fill(' ').join('')
  }
  for (const i of [0,1,2]) {
    lines.push(`${space(yMax.length)}${xMin[i]}${space(500 - bounds.x.min - 1)}${xSrc[i]}${space(bounds.x.max - 500 - 1)}${xMax[i]}`)
  }
  // GRAPH
  for (let y = 0; y <= bounds.y.max; y++) {
    const cells = [`${y}`.padStart(yMax.length, ' ')]
    for (let x = bounds.x.min; x <= bounds.x.max; x++) {
      cells.push(getValue(x, y))
    }
    lines.push(cells.join(''))
  }
  fs.writeFileSync(printfile, lines.join('\n'))
}
printMap()

const drop = () => {
  const isBlocked = (x, y) => ['#','o'].includes(getValue(x,y)) 
  const tryFall = ({x, y}) => {
    for (const [xDest, yDest] of [[x, y+1], [x-1, y+1], [x+1, y+1]]) {
      if (isBlocked(xDest, yDest)) continue
      setValue(x, y, '.')
      setValue(xDest, yDest, 'o')
      return { x: xDest, y: yDest}
    }
    return false
  }
  const fall = () => {
    let next = { x: 500, y: 0}
    do {
      setValue(next.x, next.y, 'o')
      next = tryFall(next)
    }
    while (next)
  }

  let count = 0
  while (true) {
    fall()
    count++
    if (isVerbose) printMap()
    if (map[500][0] === 'o') break
  }
  return count
}
const count = drop()
console.log(count)
printMap()


