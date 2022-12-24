const StrategyFactory = require('./strategyFactory')
const Elf = require('./elf')

/**
 * Turn coordinates into string key
 * @param {{x: number, y: number}} xy 
 * @returns {string}
 */
const c2k = ({x, y}) => `${x},${y}`
/**
 * Turn string key in xy coordinates
 * @param {string} key 
 * @returns {[x, y]} 
 */
const k2c = (key) => key.split(',').map(n => Number(n))

class Grid {
  #elfCoordinates
  #pendingMoves
  #strategyFactory
  #nElves
  
  /**
   * 
   * @param {{x: number, y: number}[]} elves - Array of xy coordinate locations of elves 
   */
  constructor(elves) {
    this.#strategyFactory = new StrategyFactory()
    this.#elfCoordinates = {}
    this.#nElves = elves.length
    for (const xy of elves) {
      this.#elfCoordinates[c2k(xy)] = new Elf()
    }
  }

  calculateMoves () {
    this.#pendingMoves = {}
    const strategies = Object.freeze(this.#strategyFactory.getStrategy())
    for (const key of Object.keys(this.#elfCoordinates)) {
      const [x, y] = k2c(key)
      const surrounding = this.#strategyFactory.getSurroundingCoordinates({x, y})
      if (surrounding.every(xy => !this.#elfCoordinates[c2k(xy)])) continue
      const potentialMoves = strategies.map(strategy => ({
        move: this.#strategyFactory.executeStrategy(strategy, {x, y}),
        possible: this.#strategyFactory.getStrategyCoordinates(strategy, {x, y}).every(({x, y}) => !this.#elfCoordinates[c2k({x, y})])
      })).filter(({possible}) => possible)
      if (potentialMoves.length) {
        const moveTo = c2k(potentialMoves[0].move)
        this.#addPendingMove(moveTo, key)
      }
    }
  }

  executeMoves () {
    let elfMoved = false
    for (const moveKey of Object.keys(this.#pendingMoves)) {
      if (this.#pendingMoves[moveKey].length === 1) {
        const elfKey = this.#pendingMoves[moveKey][0]
        this.#elfCoordinates[moveKey] = this.#elfCoordinates[elfKey]
        delete this.#elfCoordinates[elfKey]
        elfMoved = true
      }
      delete this.#pendingMoves[moveKey]
    }
    this.#strategyFactory.rotateStrategy()
    return elfMoved
  }

  getEmptyTiles () {
    const { minX, minY, maxX, maxY } = this.#getGridSize()
    const height = maxX - minX + 1, width = maxY - minY + 1
    return (width * height) - this.#nElves
  }

  printGrid (minWidth = 0, minHeight = 0) {
    const { minX, minY, maxX, maxY } = this.#getGridSize()    
    const width = Math.max(maxX - minX, minWidth), height = Math.max(maxY - minY, minHeight)
    
    const rows = []
    
    for (let x = minX; x <= width + minX; x++) {
      const row = []
      for (let y = minY; y <= height + minY; y++) {
        const key = c2k({x, y})
        const hasElf = this.#elfCoordinates[key] ? true : false
        row.push(hasElf ? '#' : '.')
      }
      rows.push(row.join(''))
    }
    return rows.join('\n')
  }

  getElfCoordinates () {
    return Object.keys(this.#elfCoordinates).map(k2c)
  }

  #addPendingMove (moveTo, elfKey) {
    if (!this.#pendingMoves[moveTo]) this.#pendingMoves[moveTo] = []
    this.#pendingMoves[moveTo].push(elfKey)
  }

  #getGridSize () {
    return Object.keys(this.#elfCoordinates).reduce((acc, cur) => {
      const [x, y] = k2c(cur)
      return {
        minX: Math.min(acc.minX, x),
        minY: Math.min(acc.minY, y),
        maxX: Math.max(acc.maxX, x),
        maxY: Math.max(acc.maxY, y)
      }
    }, { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity })
  }
}

module.exports = Grid