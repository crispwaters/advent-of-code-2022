const fs = require('fs')

const isSample = false
const prefix = isSample ? 'sample.' : ''
const inputFile = `${prefix}input.txt`
const outputfile = `${prefix}output.txt`
const logFile = `${prefix}logs.txt`

const buffer = fs.readFileSync(inputFile)
const input = buffer.toString()

const logs = []

const isDebug = false
const debug = (msg) => {
  if (!isDebug) return
  console.log(msg)
}

const map = []
const path = []
const shortestPathTemplate = []
let shortestPath

for (const line of input.split('\n')) {
  map.push(line.trim().split(''))
  path.push(line.trim().split('').map(_ => '.'))
  shortestPathTemplate.push(line.trim().split('').map(_ => null))
}
debug(path)

const getHeightDiff = (start, end) => {
  const sPos = map[start.x][start.y]
  const ePos = map[end.x][end.y]
  if (sPos === 'S') return 0
  if (ePos === 'E') return sPos === 'z' ? 0 : 10
  debug({sPos, ePos, start, end})
  return ePos.charCodeAt(0) - sPos.charCodeAt(0)
}
debug(getHeightDiff({x: 2, y: 6}, {x: 2, y: 5}))

const checkMove = (start, end, length) => {
  if (end.x < 0) { 
    debug('GC end.x < 0 hit')
    return false
  }
  if (map.length === end.x) { 
    debug('GC map.length === end.x hit')
    return false
  }
  if (end.y < 0) { 
    debug('GC end.y < 0 hit')
    return false
  }
  if (map[end.x].length === end.y) { 
    debug('GC map[end.x].lengh === end.y hit')
    return false
  }
  if (getHeightDiff(start, end) > 1) {
    return false
  }
  if (shortestPath[end.x][end.y] !== null) {
    return false
  }
  return true
}

const clone = (obj) => JSON.parse(JSON.stringify(obj))

const moves = {
  UP: (x, y) => ({x: x-1, y}),
  DOWN: (x, y) => ({x: x+1, y}),
  LEFT: (x, y) => ({x, y: y-1}),
  RIGHT: (x, y) => ({x, y: y+1})
}
const marks = {
  UP: '^',
  DOWN: 'v',
  LEFT: '<',
  RIGHT: '>'
}

function getMoves ({x, y}, path, length) {
  const toReturn = []
  const q = [{x, y, path, length}]
  while (q.length) {
    const {x, y, path, length} = q.shift()
    for (const m of Object.keys(moves)) {
      debug(m)
      const end = moves[m](x, y)
      if (checkMove({x, y}, end, length)) {
        if (map[end.x][end.y] === 'E') {
          toReturn.push({
            success: true,
            length: length + 1,
            path
          })
        } else {
          const newPath = `${path},${end.x}:${end.y}`
          const newLength = length + 1
          shortestPath[end.x][end.y] = {
            path: newPath,
            length: newLength
          }
          q.push({ ...end, path: newPath, length: newLength })
        }
      }
    }
  }
  return toReturn
}


const getPotStartPos = () =>{
  const toReturn = []
  for (let x = 0; x < map.length; x++) {
    for (let y = 0; y < map[x].length; y++) {
      if (map[x][y] === 'a') toReturn.push({ x, y })
    }
  }
  return toReturn
}
let shortestSoFar = Infinity
for (const startPos of getPotStartPos()) {
  shortestPath = clone(shortestPathTemplate)
  const path = `${startPos.x}:${startPos.y}`
  shortestPath[startPos.x][startPos.y] = {
    path,
    length: 0
  }
  const length = getMoves(startPos, path, 0).filter(p => p.success).sort(({ length: a }, { length: b }) => a - b)[0]?.length ?? Infinity
  shortestSoFar = Math.min(shortestSoFar, length)
}
console.log(shortestSoFar)



