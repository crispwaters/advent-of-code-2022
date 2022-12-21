class Node {
  prev
  next
  val

  constructor(val) {
    this.val = val
  }
}

class CircularList {
  nodes = []

  constructor(arr) {
    let start
    let cursor
    for (const val of arr) {
      const node = new Node(val)
      this.nodes.push(node)
      if (cursor) {
        node.prev = cursor
        cursor.next = node
      } else {
        start = node
      }      
      cursor = node
    }
    cursor.next = start
    start.prev = cursor
  }

  move (i) {
    const node = this.nodes[i]
    const total = this.nodes.length
    const val = node.val
    const steps = (Math.abs(val) % (total - 1))
    if (val === 0 || steps === 0) return
    let cursor = node
    node.prev.next = node.next
    node.next.prev = node.prev
    const direction = val > 0 ? 'next' : 'prev'
    for (let i = 0; i < steps; i++) {
      cursor = cursor[direction]
    }

    if (val > 0) {
      node.prev = cursor
      node.next = cursor.next
      cursor.next.prev = node
      cursor.next = node
    } else {
      node.next = cursor
      node.prev = cursor.prev
      cursor.prev.next = node
      cursor.prev = node
    }
  }

  toArray () {
    const start = this.nodes[0]
    let cursor = start
    const arr = []
    do {
      arr.push(cursor.val)
      cursor = cursor.next
    } while (cursor !== start)
    return arr
  }

  getCoordinates () {
    const coordinates = {}
    const toFind = [1000, 2000, 3000]
    let found = 0
    let i = 0
    let cursor = this.nodes.find(n => n.val === 0)
    while (found < toFind.length) {
      i++
      cursor = cursor.next
      if (toFind.includes(i)) {
        coordinates[i] = cursor.val
        found++
      }
    }
    return coordinates
  }
}

module.exports = CircularList