const Grid = require('./grid')
const Blizzard = require('./blizzard')
const Logger = require('./logger')
const {c2k, k2c, gcd} = require('./util')

/**
 * Class responsible for creating grids of movable spaces
 */
class GridFactory {
  /**
   * @type {Grid[]}
   */
  #grids = []
  /**
   * @type {Blizzard[]}
   */
  #blizzards = []

  /**
   * Start coordinates. This is outside of the valley
   * @type {{x: number, y: number}}
   */
  #start
  /**
   * End coordinates. This is outside of the valley
   * @type {{x: number, y: number}}
   */
  #finish

  /**
   * Width of valley, zero-based, cooresponds to y coordinate values
   * @type {number}
   */
  #width
  /**
   * Height of valley, zero-based, cooresponds to x coordinate values
   * @type {number}
   */
  #height

  /**
   * @param {{
   *  blizzards: {x: number, y: number: direction: '^'|'V'|'<'|'>'}[],
   *  width: number,
   *  height: number,
   *  start: {x: number, y: number},
   *  finish: {x: number, y: number}
   * }} params 
   */
  constructor({blizzards, width, height, start, finish}) {
    const timerLabel = 'Construct GridFactory'
    Logger.time(timerLabel)
    Logger.log('Constructing GridFactory...')
    for (const {x, y, direction} of blizzards) {
      this.#blizzards.push(new Blizzard({position: {x, y}, direction}))
    }
    this.#width = width
    this.#height = height
    this.#start = start,
    this.#finish = finish
    const nGrids = (width * height) / gcd(width, height)
    Logger.log(`Grids to build=${nGrids}`)
    for (let n = 0; n < nGrids; n++) {
      this.#grids[n] = this.#buildGrid()
      this.#updateBlizzards()
    }
    Logger.log('Built', nGrids, 'grids')
    Logger.timeEnd(timerLabel)
  }

  /**
   * Get starting coordinates
   * @returns {{x: number, y: number}}
   */
  getStart() {
    return { ...this.#start }
  }

  /**
   * Get ending coordinates
   * @returns {{x: number, y: number}}
   */
  getFinish() {
    return { ...this.#finish }
  }

  /**
   * Number of minutes until the grid position cycles
   * @returns {number}
   */
  getCycleLength() {
    return this.#grids.length
  }

  /**
   * Get grid for provided minute
   * @param {number} nMinute 
   */
  getGrid(nMinute) {
    if (typeof nMinute !== 'number') throw new Error(`nMinute must be number, received ${typeof nMinute} value=${nMinute}`)
    if (nMinute < 0) throw new Error(`NO TIME TRAVELING!`)
    return this.#grids[nMinute % this.#grids.length]
  }

  /**
   * Build a new grid of moveable spaces from the current position of blizzards
   * @returns {Grid}
   */
  #buildGrid() {
    const blizzardSpaces = this.#getBlizzardSpaces()
    const movableSpaces = [this.#start, this.#finish]
    for (let x = 0; x < this.#height; x++) {
      for (let y = 0; y < this.#width; y++) {
        if (!blizzardSpaces[c2k({x, y})]) movableSpaces.push({x, y})
      }
    }
    return new Grid(movableSpaces)
  }

  /**
   * @returns {Record<string, boolean>} Record of coordinate-encoded strings representing grid locations containing at least one blizzard
   */
  #getBlizzardSpaces() {
    return this.#blizzards.reduce(
      /**
       * @param {Record<string, boolean>} acc coordinate-encoded strings representing grid locations containing at least one blizzard
       * @param {Blizzard} cur
       */
      (acc, cur) => {
        acc[c2k(cur.getPosition())] = true
        return acc
      }, {}
    )
  }

  /**
   * Move all blizzards one space
   */
  #updateBlizzards() {
    const timerLabel = 'Update Blizzards'
    Logger.time(timerLabel)
    Logger.log(`Updating Blizzards...`)
    const bounds = {
      width: this.#width,
      height: this.#height
    }
    for (const blizzard of this.#blizzards) {
      blizzard.move(bounds)
    }
    Logger.timeEnd(timerLabel)
  }
}

module.exports = GridFactory