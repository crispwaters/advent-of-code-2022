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

const readAtRow = isSample ? 10 : 2000000
const isDebug = true
const debug = (msg) => {
  if (!isDebug) return
  console.log(msg)
}

const sensors = []
const sensorRegex = /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/
const map = {}
const place = ({x, y}, val) => {
  if (!map[x]) map[x] = {}
  if (['S','B'].includes(val) || !map[x][y]) map[x][y] = val
}
const placeSensor = (xy) => place(xy, 'S')
const placeBeacon = (xy) => place(xy, 'B')

const calculateDistance = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y)

let xMin = Number.POSITIVE_INFINITY, xMax = Number.NEGATIVE_INFINITY
const readLine = (line) => {
  const [,sensorX, sensorY, beaconX, beaconY] = line.match(sensorRegex)
  const sensor = {
    x: Number(sensorX),
    y: Number(sensorY)
  }
  const beacon = {
    x: Number(beaconX),
    y: Number(beaconY)
  }
  const distance = calculateDistance(sensor, beacon)
  sensors.push({sensor,beacon,distance})
  placeSensor(sensor)
  placeBeacon(beacon)
  xMin = Math.min(xMin, sensor.x - distance, beacon.x - distance)
  xMax = Math.max(xMax, sensor.x + distance, beacon.x + distance)
}

for (const line of input) {
  readLine(line)
}

debug({xMin, xMax})

let sum = 0
for (let x = xMin; x <= xMax; x++) {
  const point = { x, y: readAtRow }
  const getPoint = () => {
    if (!map[point.x]) return
    return map[point.x][point.y]
  }
  if (['S','B'].includes(getPoint())) continue
  if (sensors.some(({ sensor, distance }) => calculateDistance(sensor, point) <= distance)) {
    sum++
  }
}
console.log(sum)
