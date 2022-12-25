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

test('Node getEdges skips visited nodes', t => {
  const nodeA = new Node({x: 5, y: 5}, 1)
  const nodeB = new Node({x: 5, y: 4}, 2)
  const nodeC = new Node({x: 5, y: 6}, 2)
  const nodeD = new Node({x: 4, y: 5}, 2)

  nodeA.addEdge(nodeB)
  nodeA.addEdge(nodeC)
  nodeA.addEdge(nodeD)

  nodeC.visit()

  t.deepEqual(nodeA.getEdges({skipVisited: true}), [nodeB, nodeD])
})