const fs = require('fs')

const isSample = true
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

const valves = {}
const createValve = (valve, rate, edges) => {
  if (valves[valve]) return

  valves[valve] = {}
  valves[valve].rate = Number(rate)
  valves[valve].edges = edges.split(', ')
}
const readLine = (line) => {
  const [,valve, rate, edges] = line.match(/Valve (\w+) has flow rate=(\d+); tunnel(?:s?) lead(?:s?) to valve(?:s?) (\w+(, \w+)*)/)
  createValve(valve, rate, edges)
}

for (const line of input) {
  readLine(line)
}

const sp_cache = {}
const getShortestPath = (start, end) => {
  const cacheKey = [start, end].join(':')
  if (!valves[start]) throw new Error(`${start} not defined`)
  if (!valves[end]) throw new Error(`${end} not defined`)
  if (sp_cache[cacheKey]) return sp_cache[cacheKey]
  let q = valves[start].edges.map(edge => ({ path: '', next: edge }))
  while (true) {
    const {path, next} = q.shift()
    if (next === end) {
      const shortestPath = [...path.split(','), next]
      sp_cache[cacheKey] = shortestPath
      return shortestPath
    }
    for (const edge of valves[next].edges) {
      if (path.split(',').includes(next)) continue
      q.push({ path: [...path.split(','), next].join(','), next: edge })
    }
  }
}
const getFunctionalValves = () => Object.keys(valves).filter(key => valves[key].rate > 0)

const limit = 26
const dfs = (cur, eCur, openValvesOrder, turn, eTurn) => {
  if (turn > limit && eTurn > limit) return [0]
  const results = [0]
  const openValves = openValvesOrder.split(',')
  const toOpen = getFunctionalValves().filter(valve => !openValves.includes(valve))
  for (const next of toOpen) {
    const pathLength = getShortestPath(cur, next).length
    const eToOpen = getFunctionalValves().filter(valve => valve !== next && !openValves.includes(valve))
    for (const eNext of eToOpen) {
      const ePathLength = getShortestPath(eCur, eNext).length
      const tPressure = Math.max((limit - turn - pathLength + 1) * valves[next].rate, 0) +
        Math.max((limit - eTurn - ePathLength + 1) * valves[eNext].rate, 0) +
        Math.max(...dfs(next, eNext, `${[...openValvesOrder.split(','), next, eNext].join(',')}`, turn + pathLength, eTurn + ePathLength))
      results.push(tPressure)
    }    
  }
  return results
}
console.log(Math.max(...dfs('AA', 'AA', '', 1, 1)))