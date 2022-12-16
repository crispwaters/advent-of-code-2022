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

const isDebug = true
const debug = (msg) => {
  if (!isDebug) return
  console.log(msg)
}

const getRange = () => {
  if (isSample) {
    return { min: 0, max: 20}
  }
  return { min: 0, max: 4000000}
}
const {min, max} = getRange()
const getFrequency = ({x,y}) => (4000000 * x) + y

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

const mergeRanges = (ranges) => {
  const [first, ...rest] = ranges.sort((a, b) => a[0] - b[0])
  const merged = [first]
  for (const [nextFrom, nextTo] of rest) {
    const [prevFrom, prevTo] = merged.at(-1)
    if (nextFrom <= prevTo + 1) {
      merged[merged.length - 1] = [prevFrom, Math.max(prevTo, nextTo)]
    } else {
      merged.push([nextFrom, nextTo])
    }
  }
  return merged
}

const getRanges = (
  y, 
  sensors, 
  xMin = Number.NEGATIVE_INFINITY, 
  xMax = Number.POSITIVE_INFINITY
) => {
  const ranges = []

  for (const { sensor, distance } of sensors) {
    const yDistance = Math.abs(y - sensor.y)
    const xOffset = distance - yDistance
    const width = (xOffset * 2) + 1

    if (width > 0) {
      const from = sensor.x - xOffset
      const to = sensor.x + xOffset
      if (to >= xMin && from <= xMax) {
        ranges.push([Math.max(xMin, from), Math.min(xMax, to)])
      }
    }
  }

  return mergeRanges(ranges)
}

for (let y = min; y <= max; y++) {
  const ranges = getRanges(y, sensors, 0, max)
  if (ranges.length === 2) {
    const x = ranges[0][1] + 1
    console.log(getFrequency({x, y}))
    break;
  }
}