const fs = require('fs')

const isSample = false
const inputFile = `${isSample?'sample.':''}input.txt`
const outputFile = `${isSample?'sample.':''}output.txt`

const buffer = fs.readFileSync(inputFile)
const input = buffer.toString()

const stacks = {}
let buildingStacks = true
const instructionRegex = /move (\d+) from (\d+) to (\d+)/
for (const line of input.split('\n')) {
  if (buildingStacks) {
    if (Number(line[1]) === 1) {
      buildingStacks = false
      continue
    }
    let stack = 1
    let i = 1
    while (line.length > i) {
      if (!stacks[stack]) stacks[stack] = []
      if (line[i] !== ' ') stacks[stack].unshift(line[i])
      stack++
      i += 4
    }
  } else if (instructionRegex.test(line)) {
    const [, count, from, to] = line.match(instructionRegex)
    const intermediate = []
    for (let i = 0; i < count; i++) {
      intermediate.push(stacks[from].pop())
    }
    while(intermediate.length) {
      stacks[to].push(intermediate.pop())
    }
  }
}

fs.writeFileSync(outputFile, JSON.stringify(stacks, null, 2))
const last = (arr) => arr[arr.length - 1]
console.log(Object.keys(stacks).reduce((acc, cur) => `${acc}${last(stacks[cur])}`, ''))