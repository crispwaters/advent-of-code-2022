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

const readInput = (input) => {
  const droplet = {}
  const coordinates = []
  const readLine = (line) => {
    const [x, y, z] = line.trim().split(',').map(n => Number(n))
    if (!droplet[x]) droplet[x] = {}
    if (!droplet[x][y]) droplet[x][y] = {}
    droplet[x][y][z] = true
    coordinates.push({ x, y, z})
  }
  for (const line of input) {
    readLine(line)
  }
  return { droplet, coordinates}
}
const { droplet, coordinates } = readInput(input)

const hasDroplet = (droplet, x, y, z) => droplet[x] && droplet[x][y] && droplet[x][y][z]
const countNeighbors = (droplet, x, y, z) => {
  if (!droplet[x]) return 0
  if (!droplet[x][y]) return 0
  if (!droplet[x][y][z]) return 0
  const neighbors = [
    [x + 1, y, z],
    [x - 1, y, z],
    [x, y + 1, z],
    [x, y - 1, z],
    [x, y, z + 1],
    [x, y, z - 1]
  ]
  return neighbors.filter(([x, y, z]) => hasDroplet(droplet, x, y, z)).length
}
const getExposedSides = (droplet, x, y, z) => {
  if (!hasDroplet(droplet, x, y, z)) return 0
  return 6 - countNeighbors(droplet, x, y, z)
}

const exposedSides = coordinates.reduce((acc, {x, y, z}) => acc + getExposedSides(droplet, x, y, z), 0)
console.log(exposedSides)