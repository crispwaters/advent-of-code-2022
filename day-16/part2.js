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

const getAllPaths = () => {
  const paths = [{
    cur: 'AA',
    toVisit: getFunctionalValves(),
    timeLeft: 26,
    finished: false,
    steps: [],
    finalPressure: 0
  }]

  for (let n = 0; n < paths.length; n++) {
    const path = paths[n]
    if (path.timeLeft <= 0 || path.finished) {
      path.finished = true
      continue
    }

    let madeNewPath = false
    for (const valve of path.toVisit) {
      if (valve === path.cur) continue
      const toValve = getShortestPath(path.cur, valve)
      if (path.timeLeft - toValve.length <= 1) continue
      madeNewPath = true
      const nextTimeLeft = path.timeLeft - toValve.length
      paths.push({
        cur: valve,
        toVisit: path.toVisit.filter(v => v !== valve),
        timeLeft: nextTimeLeft,
        finished: false,
        steps: [...path.steps, valve],
        finalPressure: path.finalPressure + nextTimeLeft * valves[valve].rate
      })
      paths.push({
        cur: valve,
        toVisit: [],
        timeLeft: nextTimeLeft,
        finished: true,
        steps: [...path.steps, valve],
        finalPressure: path.finalPressure + nextTimeLeft * valves[valve].rate
      })
    }
    if (!madeNewPath) path.finished = true
  }
  return paths.filter(p => p.finished).sort((a, b) => b.finalPressure - a.finalPressure)
}
const getMaxWithElephant = () => {
  let max = 0
  const paths = getAllPaths()
  for (let hp = 0; hp < paths.length; hp++) {
    for (let ep = hp + 1; hp < paths.length; hp++) {
      if (paths[hp].steps.every(s => !paths[ep].steps.includes(s))) {
        const combined = paths[hp].finalPressure + paths[ep].finalPressure
        if (combined > max) {
          max = combined
        }
      }
    }
  }
  return max
}
console.log(getMaxWithElephant())
