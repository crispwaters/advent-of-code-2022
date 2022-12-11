const fs = require('fs')

const isSample = false
const prefix = isSample ? 'sample.' : ''
const inputFile = `${prefix}input.txt`
const outputfile = `${prefix}output.txt`
const logFile = `${prefix}logs.txt`

const buffer = fs.readFileSync(inputFile)
const input = buffer.toString()

const logs = []


const config = {
  part1: {
    stressFree: true,
    modulus: 1,
    rounds: 20
  },
  part2: {
    stressFree: false,
    modulus: 1,
    rounds: 10_000
  }
}['part2'];

const readFile = () => {
  let curMonkey
  const monkeys = {}
  for (const line of input.split('\n')) {
    if (/Monkey \d:/.test(line)) {
      const name = line.trim().replace(':', '').toLowerCase()
      curMonkey = {
        name,
        itemInspectionCount: 0
      }
      monkeys[name] = curMonkey
    }
    if (/Starting items:/.test(line)) {
      curMonkey.items = line.trim().split(':')[1].split(',').map(val => Number(val))
    }
    if (/Operation:/.test(line)) {
      const op = line.split('=')[1].trim()
      const isAdd = /\+/.test(op)
      const isMult = /\*/.test(op)
      console.log({ isAdd, isMult, op})
      const getParams = (old) => {
        if (isAdd) return op.split('+').map(val => val.trim() === 'old' ? old : Number(val.trim()))
        if (isMult) return op.split('*').map(val => val.trim() === 'old' ? old : Number(val.trim()))
      }
      const getOp = () => {
        if (isAdd) return (a, b) => a + b
        if (isMult) return (a, b) => a * b
      }
      curMonkey.operation = (old) => {
        const op = getOp()
        const params = getParams(old)
        return op(...params)
      }
      console.log(`Sample input 7 = ${curMonkey.operation(7).toString()}`)
    }
    if (/Test:/.test(line)) {
      const div = Number(line.match(/\d+/)[0])
      config.modulus *= div
      const thisMonkey = monkeys[curMonkey.name]
      curMonkey.test = (value) =>  {
        thisMonkey.itemInspectionCount++

        return value % div === 0
      }
    }
    if (/If true:/.test(line)) {
      const monkey = line.match(/monkey \d/)[0]
      curMonkey.ifTrue = () => monkeys[monkey]
    }
    if (/If false:/.test(line)) {
      const monkey = line.match(/monkey \d/)[0]
      curMonkey.ifFalse = () => monkeys[monkey]
    }
  }  
  return monkeys
}
const monkeys = readFile()
const getMonkeys = () => Object.keys(monkeys).map(monkey => monkeys[monkey])

const doRound = () => {
  for (const monkey of getMonkeys()) {
    for (const i in monkey.items) {      
      const getVal = () => {
        const item = monkey.items[i]
        let val = monkey.operation(item)
        if (config.stressFree) val = Math.floor(val / 3)
        else val = val % config.modulus
        // console.log(val.toString())
        return val
      }
      const val = getVal()
      // console.log(val.toString())
      monkey.items[i] = null
      const toThrow = monkey.test(val) ? monkey.ifTrue() : monkey.ifFalse()
      // console.log(val.toString())
      toThrow.items.push(val)
    }
    monkey.items = monkey.items.filter(val => val)
  }
}
// doRound()
// console.log(monkeys)
for (const monkey of getMonkeys()) {
  console.log(`${monkey.name}: [${monkey.items.map(item => item.toString()).join(', ')}]`)
}


for (let i = 1; i <= config.rounds; i++) {
  // if (i % 100 === 0) console.log(i)
  doRound()
}
const [first, second] = getMonkeys().sort(({ itemInspectionCount: a }, { itemInspectionCount: b }) => b - a)
// console.log(monkeys)
console.log(`${first.name} inspected items ${first.itemInspectionCount} times.`)
console.log(`${second.name} inspected items ${second.itemInspectionCount} times.`)
console.log(first.itemInspectionCount * second.itemInspectionCount)
for (const monkey of getMonkeys()) {
  console.log(`${monkey.name}: inspectionCount=${monkey.itemInspectionCount}, items=[${monkey.items.join(', ')}]`)
}
