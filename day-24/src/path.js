const Logger = require('./logger')
const Node = require('./node')

const {c2k} = require('./util')

class Path {
  /**
   * Clones an existing Path record
   * @param {Path} from 
   * @returns 
   */
  static clone(from) {
    const cloned = new Path(from)
    Logger.verbose('Cloned', cloned, 'from', from)
    return cloned
  }
  /**
   * @type {Node}
   */
  location

  /**
   * @type {string}
   */
  history

  /**
   * @type {boolean}
   */
  terminated

  /**
   * @type {boolean}
   */
  success = false

  /**
   * Creates a new Path record
   * @param {{location: Node, history?: string, terminated?: boolean}} path 
   */
  constructor({location, history='', terminated=false}) {
    this.location = location
    this.history = history
    this.terminated = terminated
  }

  /**
   * @param {Node} location 
   * @returns 
   */
  move(location) {
    this.history = [this.history, c2k(this.location.xy)].filter(str => str).join(';')
    this.location = location
    location.visit()
    Logger.verbose('Moved', this, 'to', location)
    return this
  }

  terminate(success = false) {
    this.history = [this.history, c2k(this.location.xy)].filter(str => str).join(';')
    this.terminated = true
    this.success = success
  }
}

module.exports = Path