const {c2k, k2c} = require('./util')
const Logger = require('./logger')

 /**
  * Grid encapsulation that keeps track of x-y coordinate pairs for movable spaces in 2D space
  */
class Grid {
  #grid = {}

  /**
   * Creates a grid of movable spaces from x-y coordinate pairs
   * @param {{x: number, y: number}[]} movableSpaces 
   */
  constructor(movableSpaces) {
    const timerLabel = 'Constructing Grid'
    Logger.time(timerLabel)
    Logger.log('Constructing Grid...')
    for (const {x, y} of movableSpaces) {
      this.#grid[c2k({x, y})] = true
    }
    Logger.timeEnd(timerLabel)
  }

  /**
   * Get all x-y coordinate positions that are a valid space
   * @returns {{x: number, y: number}[]}
   */
  getPositions() {
    return Object.keys(this.#grid).map(key => {
      const [x, y] = k2c(key)
      return {x, y}
    })
  }

  /**
   * Returns all adjacent spaces in the grid that are not obstructed (i.e., can be moved into).
   * If the provided space is not obstructed, it will be included in the return array. This
   * represents staying in the current spot
   * @param {{x: number, y: number}} xy x-y coordinate pair
   * @returns {{x: number, y: number}[]} x-y coordinate pairs
   */
  getAdjacentSpaces({x, y}) {
    return [{x: x+1, y},{x: x-1, y},{x, y: y+1},{x, y: y-1},{x, y}].filter(xy => this.#grid[c2k(xy)]) 
  }
}

module.exports = Grid