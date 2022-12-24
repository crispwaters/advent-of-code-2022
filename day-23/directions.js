module.exports = {
  NORTH: 'NORTH',
  SOUTH: 'SOUTH',
  WEST: 'WEST',
  EAST: 'EAST',
  getNorth: ({x}) => x - 1,
  getSouth: ({x}) => x + 1,
  getWest: ({y}) => y - 1,
  getEast: ({y}) => y + 1
}