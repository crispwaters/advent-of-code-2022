const { count } = require('console')
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
  if (!isDebug) return
  console.log(msg)
}

const ROCK = 'ROCK'
const OUTSIDE = 'OUTSIDE'

const updateBounds = (bounds, x, y, z) => {
  const updateCoordinate = (bound, cur) => {
    bound.min = Math.min(bound.min, cur)
    bound.max = Math.max(bound.max, cur)
  }
  updateCoordinate(bounds.x, x)
  updateCoordinate(bounds.y, y)
  updateCoordinate(bounds.z, z)
}

const set = (droplet, type, x, y, z) => {
  if (!droplet[x]) droplet[x] = {}
  if (!droplet[x][y]) droplet[x][y] = {}
  droplet[x][y][z] = type
}

const readInput = (input) => {
  const droplet = {}
  const coordinates = []
  const bounds = {
    x: {
      min: Infinity,
      max: -Infinity
    },
    y: {
      min: Infinity,
      max: -Infinity
    },
    z: {
      min: Infinity,
      max: -Infinity
    }
  }
  const readLine = (line) => {
    const [x, y, z] = line.trim().split(',').map(n => Number(n))
    set(droplet, ROCK, x, y, z)
    coordinates.push({ x, y, z})
    updateBounds(bounds, x, y, z)
  }
  for (const line of input) {
    readLine(line)
  }
  bounds.x.min--
  bounds.x.max++
  bounds.y.min--
  bounds.y.max++
  bounds.z.min--
  bounds.z.max++
  return { droplet, coordinates, bounds}
}
const { droplet, coordinates, bounds } = readInput(input)

const getValue = (droplet, x, y, z) => {
  if (!droplet[x]) return
  if (!droplet[x][y]) return
  return droplet[x][y][z]
}
const hasDroplet = (droplet, x, y, z) => getValue(droplet, x, y, z) === ROCK
const getNeighbors = (x, y, z) => [
  [x + 1, y, z],
  [x - 1, y, z],
  [x, y + 1, z],
  [x, y - 1, z],
  [x, y, z + 1],
  [x, y, z - 1]
]
const getExposedSides = (droplet, x, y, z) => {
  if (!hasDroplet(droplet, x, y, z)) return 0
  return getNeighbors(x, y, z).filter(([x, y, z]) => getValue(droplet, x, y, z) === OUTSIDE).length
}

const isInBounds = (bounds, x, y, z) => {
  const outOfBounds = (bound, val) => bound.min > val || val > bound.max
  if (outOfBounds(bounds.x, x)) {
    debug(`x=${x} is out of bounds (min: ${bounds.x.min}, max: ${bounds.x.max})`)
    return false
  }
  if (outOfBounds(bounds.y, y)) {
    debug(`x=${y} is out of bounds (min: ${bounds.y.min}, max: ${bounds.y.max})`)
    return false
  }
  if (outOfBounds(bounds.z, z)) {
    debug(`x=${z} is out of bounds (min: ${bounds.z.min}, max: ${bounds.z.max})`)
    return false
  }
  return true
}
const q = [[bounds.x.min, bounds.y.min, bounds.z.min]]
set(droplet, OUTSIDE, bounds.x.min, bounds.y.min, bounds.z.min)
while (q.length) {
  const [x, y, z] = q.shift()
  const neighbors = getNeighbors(x, y, z)
  for (const [x, y, z] of neighbors) {
    if (!isInBounds(bounds, x, y, z)) {
      debug(`(${x},${y},${z}) is out of bounds`)
      continue
    }
    if (getValue(droplet, x, y, z)) {
      debug(`(${x},${y},${z}) has value ${getValue(droplet, x, y, z)}`)
      continue
    }
    set(droplet, OUTSIDE, x, y, z)
    q.push([x,y,z])
  }
}

const exposedSides = coordinates.reduce((acc, {x, y, z}) => acc + getExposedSides(droplet, x, y, z), 0)
console.log(exposedSides)