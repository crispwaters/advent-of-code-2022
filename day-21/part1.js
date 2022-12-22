const fs = require('fs')

const isSample = false
const prefix = isSample ? 'sample.' : ''
const inputFile = `${prefix}input.txt`
const outputFile = `${prefix}output.txt`
const printFile = `${prefix}print.txt`
const logFile = `${prefix}logs.txt`

const buffer = fs.readFileSync(inputFile)
const input = buffer.toString().split('\n')

const logs = []

const isDebug = false
const debug = (msg) => {
  if (!isDebug) {
    logs.push(msg)
    return
  }
  console.log(msg)
}

const monkeys = {}

const parseMonkey = (line) => {
  const [name, info] = line.trim().split(': ')
  monkeys[name] = info
}
for (const line of input) {
  parseMonkey(line)
}

console.log(monkeys)

const evaluate = (name) => {
  const info = monkeys[name]
  if (/\d+/.test(info)) return Number(info)
  const [monkey1, op, monkey2] = info.split(' ')
  const val1 = evaluate(monkey1)
  const val2 = evaluate(monkey2)
  const ops = {
    '+': () => val1 + val2,
    '-': () => val1 - val2,
    '*': () => val1 * val2,
    '/': () => val1 / val2
  }
  monkeys[name] = ops[op]()
  return monkeys[name]
}
console.log(evaluate('root'))