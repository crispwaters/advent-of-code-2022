const test = require('ava')
const Logger = require('./logger')
const Node = require('./node')

test('Nodes store edges by reference', t => {
  const nodeA = new Node({x: -1, y: 0}, 0)
  const nodeB = new Node({x: 0, y: 0}, 1)
  const nodeC = new Node({x: 2, y: 0}, 2)

  nodeA.addEdge(nodeB)
  nodeB.addEdge(nodeC)

  t.deepEqual(nodeA.edges, [nodeB])
  t.deepEqual(nodeB.edges, [nodeC])
  t.deepEqual(nodeA.edges[0].edges, [nodeC])
})