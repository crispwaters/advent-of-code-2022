const GridFactory = require('./grid-factory')
const Logger = require('./logger')
const Path = require('./path')
const Node = require('./node')
const {c2k} = require('./util')

const nmid = (cycle, xy) => `${cycle}::${c2k(xy)}`

/**
 * Graph containing information about how our elves can move through the valley through time
 */
class Graph {
  /**
   * @type {GridFactory}
   */
  #gridFactory
  /**
   * @type {Number}
   */
  #nCycles
  /**
   * Encapsulation of traversable nodes at each cycle index
   * @type {Record<number, Record<string, Node>>}
   */
  #nodeMap = {}
  /**
  * @param {{
  *  blizzards: {x: number, y: number: direction: '^'|'V'|'<'|'>'}[],
  *  width: number,
  *  height: number,
  *  start: {x: number, y: number},
  *  finish: {x: number, y: number}
  * }} params 
  */
  constructor(params) {
    const timerLabel = 'Construct Graph'
    Logger.time(timerLabel)
    Logger.log('Constructing graph...')
    this.#gridFactory = new GridFactory(params)
    this.#nCycles = this.#gridFactory.getCycleLength()
    for(let i=0; i<this.#nCycles; i++) {
      this.#nodeMap[i] = {}
      const grid = this.#gridFactory.getGrid(i)
      const nextGrid = this.#gridFactory.getGrid(i + 1)
      for (const xy of grid.getPositions()) {
        const node = this.#getNode(i, xy)
        const adjacentSapces = nextGrid.getAdjacentSpaces(xy)
        Logger.verbose('Adjacent spaces for', node, '=', adjacentSapces)
        for (const next of adjacentSapces) {
          const nextNode = this.#getNode(this.#minuteToIndex(i + 1), next)
          node.addEdge(nextNode)
        }
        Logger.verbose(node.getEdges({skipVisited: false}))
      }
    }
    Logger.verbose(this.#nodeMap)
    Logger.timeEnd(timerLabel)
    Logger.info('Total graph nodes=', Object.keys(this.#nodeMap).length)
  }

  findShortestPath() {
    const start = this.#gridFactory.getStart()
    const finish = this.#gridFactory.getFinish()
    const fKey = c2k(finish)
    const startNode = this.#getNode(0, start)
    const q = [new Path({ location: startNode })]
    while (q.length) {
      const path = q.shift()
      path.location.visit()
      let nNewPaths = 0
      const edges = path.location.getEdges({skipVisited: true})
      Logger.verbose(edges)
      for (const next of edges) {
        Logger.verbose(next)
        const nextPath = Path.clone(path).move(next)
        if (c2k(nextPath.location.xy) === fKey) {
          nextPath.terminate(true)
          return nextPath
        }
        q.push(nextPath)
        nNewPaths++
      }
      Logger.verbose(`Added ${nNewPaths} path(s) to queue`)
    }
  }

  #minuteToIndex(nMinute) {
    return nMinute % this.#nCycles
  }

  #createNode(i, xy, node) {
    if (this.#nodeMap[nmid(i, xy)]) throw new Error(`A node already exists at this.#nodeMap[${i}][${c2k(xy)}]!`)
    Logger.verbose('Creating node', node)
    this.#nodeMap[nmid(i, xy)] = node
  }

  #getNode(i, xy) {
    if (!this.#nodeMap[nmid(i, xy)]) {
      Logger.verbose('Creating new node for cycle=', i, 'xy=', xy)
      this.#createNode(i, xy, new Node(xy, i))
    }
    return this.#nodeMap[nmid(i, xy)]
  }
}

module.exports = Graph