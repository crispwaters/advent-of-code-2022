const { Directions } = require('./enums')

class Blizzard {
  /**
   * @type {{x: number, y: number}}
   */
  #position

  /**
   * @type {'^'|'V'|'<'|'>'}
   */
  #direction

  /**
   * @param {{ 
   *  position: {x: number, y: number},
   *  direction: '^'|'V'|'<'|'>'
   * }} params 
   */
  constructor({position, direction}) {
    this.#position = position
    this.#direction = direction
  }

  getPosition() {
    return { ...this.#position }
  }

  getDirection() {
    return this.#direction
  }

  /**
   * 
   * @param {{width: number, height: number}} param0 
   * @returns 
   */
  move({width, height}) {
    if (this.#direction === Directions.UP) this.#position.x--
    if (this.#direction === Directions.DOWN) this.#position.x++
    if (this.#direction === Directions.LEFT) this.#position.y--
    if (this.#direction === Directions.RIGHT) this.#position.y++
    this.#position.x = (this.#position.x + height) % height
    this.#position.y = (this.#position.y + width) % width
  }
}

module.exports = Blizzard