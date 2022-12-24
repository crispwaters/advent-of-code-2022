const test = require('ava')
const Path = require('./path')
const Node = require('./node')

test('Path deep links node edges', t => {
  const nodeA = new Node({x: -1, y: 0}, 0)
  const nodeB = new Node({x: 0, y: 0}, 1)
  const nodeC = new Node({x: 2, y: 0}, 2)

  nodeA.addEdge(nodeB)
  nodeB.addEdge(nodeC)

  const path = new Path({ location: nodeA })

  t.deepEqual(path.location.edges, [nodeB])
  t.deepEqual(path.location.edges[0].edges, [nodeC])
})