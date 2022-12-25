const fs = require('fs')
const Graph = require('./src/graph')
const Logger = require('./src/logger')
Logger.LOG_LEVEL = Logger.LOG_LEVELS.debug
const timerLabel = 'Execution time'
Logger.time(timerLabel)

const isSample = false
const prefix = isSample ? 'sample.' : ''
const inputFile = `${prefix}input.txt`
const outputFile = `${prefix}output.txt`
const printFile = `${prefix}print.txt`
const logFile = `${prefix}logs.txt`

const buffer = fs.readFileSync(inputFile)
const input = buffer.toString().split('\n')

const parseInput = (input) => {
  input.shift()
  input.pop()
  const blizzards = []
  const height = input.length
  const width = input[0].trim().length - 2
  for (let x=0; x<height; x++) {
    const line = input[x].trim().split('')
    line.shift()
    line.pop()
    for (let y=0; y<width; y++) {
      if (['^','v','<','>'].includes(line[y])) blizzards.push({x, y, direction: line[y]})
    }
  }
  const parsed = {
    blizzards,
    width,
    height,
    start: {x: -1, y: 0},
    finish: {x: height, y: width-1}
  }
  Logger.log(parsed)
  return parsed
}
const graph = new Graph(parseInput(input))
// graph.prune()
const path = graph.findShortestPath()
console.log(path)
console.log(path.history.split(';').length - 1)
Logger.timeEnd(timerLabel)
