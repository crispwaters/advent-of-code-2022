const {
  NORTH,
  SOUTH,
  EAST,
  WEST,
  getNorth,
  getSouth,
  getEast,
  getWest
} = require('./directions')

class StrategyFactory {
  #strategies
  constructor() {
    this.#strategies = [NORTH, SOUTH, WEST, EAST]
  }

  getStrategy() {
    return [...this.#strategies]
  }

  rotateStrategy() {
    this.#strategies.push(this.#strategies.shift())
  }

  getSurroundingCoordinates(xy) {
    const { x, y } = xy
    return[
      { x: getNorth(xy), y },
      { x: getNorth(xy), y: getEast(xy) },
      { x: getNorth(xy), y: getWest(xy) },
      { x: getSouth(xy), y },
      { x: getSouth(xy), y: getEast(xy) },
      { x: getSouth(xy), y: getWest(xy) },
      { x, y: getEast(xy) },
      { x, y: getWest(xy) }
    ]
  }

  getStrategyCoordinates(strategy, xy) {
    const { x, y } = xy
    if (strategy === NORTH) return [{ x: getNorth(xy), y }, { x: getNorth(xy), y: getEast(xy) }, { x: getNorth(xy), y: getWest(xy) }]
    if (strategy === SOUTH) return [{ x: getSouth(xy), y }, { x: getSouth(xy), y: getEast(xy) }, { x: getSouth(xy), y: getWest(xy) }]
    if (strategy === EAST) return [{ x, y: getEast(xy) }, { x: getNorth(xy), y: getEast(xy) }, { x: getSouth(xy), y: getEast(xy) }]
    if (strategy === WEST) return [{ x, y: getWest(xy) }, { x: getNorth(xy), y: getWest(xy) }, { x: getSouth(xy), y: getWest(xy) }]
  }

  executeStrategy(strategy, xy) {
    const { x, y } = xy
    if (strategy === NORTH) return { x: getNorth(xy), y }
    if (strategy === SOUTH) return { x: getSouth(xy), y }
    if (strategy === EAST) return { x, y: getEast(xy) }
    if (strategy === WEST) return { x, y: getWest(xy) }
  }
}

module.exports = StrategyFactory