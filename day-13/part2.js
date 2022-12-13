const fs = require('fs')

const isSample = false
const prefix = isSample ? 'sample.' : ''
const inputFile = `${prefix}input.txt`
const outputfile = `${prefix}output.txt`
const logFile = `${prefix}logs.txt`

const buffer = fs.readFileSync(inputFile)
const input = buffer.toString()

const logs = []

const isDebug = false
const debug = (msg) => {
  if (!isDebug) return
  console.log(msg)
}
const test = (a, b) => {
  if (!isDebug) return
  console.log(`Comparing ${JSON.stringify(a)} with ${JSON.stringify(b)} = ${comparePackets(a, b)}`)
}

const isNumber = (val) => typeof val === 'number'
const isArray = (val) => Array.isArray(val)
const readPacket = (line) => JSON.parse(line)
const comparePackets = (a, b) => {
  if (isNumber(a) && isNumber(b)) {
    return a - b
  } else if (isArray(a) && isArray(b)) {
    for (let i=0, j=0; i<a.length && j<b.length; i++, j++) {
      const comp = comparePackets(a[i], b[j])
      if (comp !== 0) return comp
    }
    return a.length - b.length
  } else {
    if (isArray(a)) return comparePackets(a, [b])
    if (isArray(b)) return comparePackets([a], b)
  }
}

// test([1,1,3,1,1], [1,1,5,1,1])
// test([[1],[2,3,4]], [[1],4])
// test([9], [[8,7,6]])
// test([[4,4],4,4], [[4,4],4,4,4])
// test([7,7,7,7], [7,7,7])
// test([], [3])
// test([[[]]], [[]])
// test([1,[2,[3,[4,[5,6,7]]]],8,9], [1,[2,[3,[4,[5,6,0]]]],8,9])

const packets = input.split('\n').filter(line => line.trim() !== '').map(readPacket)
const dividerPackets = [[[2]],[[6]]]

packets.push(...dividerPackets)

packets.sort(comparePackets)
for (const packet of packets) {
  debug(JSON.stringify(packet))
}

const dpi1 = packets.indexOf(dividerPackets[0]) + 1
const dpi2 = packets.indexOf(dividerPackets[1]) + 1
console.log(dpi1 * dpi2)