const Logger = require('./logger')
let id = 1
/**
 * Encapsulation of individual points along the graph
 */
class Node {
  id
  /**
   * @type {{x: number, y: number}}
   */
  xy

  /**
   * @type {number}
   */
  cycle

  /**
   * @type {Node[]}
   */
  edges
  visited = false
  constructor (xy, cycle, edges = []) {
    this.id = id++
    this.xy = xy
    this.cycle = cycle
    this.edges = edges
  }

  /**
   * Adds an edge to this node
   * @param {Node} edge 
   */
  addEdge(edge) {
    Logger.verbose('Adding Edge', edge, 'to', this)
    this.edges.push(edge)
  }

  /**
   * Removes an edge from this node
   * @param {Node} edge 
   */
  remove(edge) {
    this.edges = this.edges.filter(e => e !== edge)
  }

  /**
   * Returns edge nodes
   * @param {{skipVisited: boolean}} opts 
   */
  getEdges({skipVisited=true}) {
    Logger.verbose(this.edges)
    return this.edges.filter(edge => !(skipVisited && edge.isVisited()))
  }

  /**
   * Marks node as visited
   */
  visit() {
    this.visited = true
  }

  /**
   * Returns whether or not this node has been visited
   * @returns {boolean}
   */
  isVisited() {
    return this.visited
  }
}

module.exports = Node