class Grid {
  width
  height
  rockCount
  _gridObj = {}
  constructor() {
    this.width = 7
    this.height = 0
    this.rockCount = 0
  }

  hasRock(x, y) {
    if (y < 0) return true
    if (!this._gridObj[y]) return false
    return this._gridObj[y][x] === '#'
  }

  placeRock(rock) {
    const safePlaceRock = (x, y) => {
      if (!this._gridObj[y]) {
        this._gridObj[y] = {}
        this.height = Math.max(this.height, y)
      }
      this._gridObj[y][x] = '#'
    }
    for (let r = rock._nRows - 1; r >= 0; r--) {
      for (let c = 0; c < rock._nColumns; c++) {
        if (rock._shape[r][c] === '#') {
          const x = rock._position.x + c
          const y = rock._position.y + (rock._nRows - r -1)
          safePlaceRock(x, y)
        }
      }
    }
    rock._isFalling = false
    this.rockCount++
  }

  printGrid() {
    const rows = []
    for (let r = this.height; r > 0; r--) {
      const row = ['|']
      for (let c = 0; c < this.width; c++) {
        row.push(this.hasRock(c, r) ? '#': '.')
      }
      row.push(['|'])
      rows.push(row.join(''))
    }
    rows.push(['+','-'.repeat(this.width),'+'].join(''))
    return rows.join('\n')
  }
}

class Rock {
  _shape
  _grid
  _isFalling = true
  _position
  _nColumns
  _nRows
  
  constructor(shape, grid) {
    this._shape = shape
    this._grid = grid
    this._position = {
      x: 2,
      y: this._grid.height + 4
    }
    this._nRows = this._shape.length
    this._nColumns = this._shape[0].length
  }


  moveLeft() {
    if (this._position.x <= 0) return false
    for (let r = 0; r < this._nRows; r++) {
      for (let c = 0; c < this._nColumns; c++) {
        if (this._shape[r][c] !== '#') continue
        const {x, y} = this.positionToGridCoordinates(r, c)
        const hasRock = this._grid.hasRock(x - 1, y)
        if (hasRock) return false
        break
      }
    }
    this._position.x--
    return true
  }

  moveRight() {
    if (this._position.x + this._nColumns >= this._grid.width) return false
    for (let r = 0; r < this._nRows; r++) {
      for (let c = this._nColumns -1; c >= 0; c--) {
        if (this._shape[r][c] !== '#') continue
        const {x, y} = this.positionToGridCoordinates(r, c)
        const hasRock = this._grid.hasRock(x + 1, y)
        if (hasRock) return false
        break
      }
    }
    this._position.x++
    return true
  }

  canMoveDown() {
    if (this._position.y === 1) return false
    for (let c = 0; c < this._nColumns; c++) {
      for (let r = this._nRows - 1; r >= 0; r--) {
        if (this._shape[r][c] !== '#') continue
        const {x, y} = this.positionToGridCoordinates(r, c)
        const hasRock = this._grid.hasRock(x, y - 1)
        if (hasRock) return false
        break
      }
    }
    return true
  }

  moveDown() {
    this._position.y--
  }

  positionToGridCoordinates(row, column) {
    const x = this._position.x + column;
    const y = this._position.y + (this._nRows - row - 1)
    return {x, y}
  }
}

/**
 * ####
 */
 class HorzLineRock extends Rock {
  constructor(grid) {
    super([
      ['#','#','#','#']
    ], grid)
  }
}

/**
 * .#.
 * ###
 * .#.
 */
class PlusRock extends Rock {
  constructor(grid) {
    super([
      ['.','#','.'],
      ['#','#','#'],
      ['.','#','.']
    ], grid)
  }
}

/**
 * ..#
 * ..#
 * ###
 */
class AngleRock extends Rock {
  constructor(grid) {
    super([
      ['.','.','#'],
      ['.','.','#'],
      ['#','#','#'],
    ], grid)
  }
}

/**
 * #
 * #
 * #
 * #
 */
class VertLineRock extends Rock {
  constructor(grid) {
    super([
      ['#'],
      ['#'],
      ['#'],
      ['#']
    ], grid)
  }
}

/**
 * ##
 * ##
 */
class SquareRock extends Rock {
  constructor(grid) {
    super([
      ['#','#'],
      ['#','#']
    ], grid)
  }
}



const rockOrder = {
  0: HorzLineRock,
  1: PlusRock,
  2: AngleRock,
  3: VertLineRock,
  4: SquareRock
}

function* RockGenerator(grid) {
  let index = 0
  let mod = Object.keys(rockOrder).length
  while (true) {
    yield new rockOrder[index](grid)
    index = (index + 1) % mod
  }
}

module.exports = {
  Grid,
  Rock,
  RockGenerator
}