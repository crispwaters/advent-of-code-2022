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
monkeys.root = monkeys.root.replace(/[+\-*/]/, '=')

const evaluate = (name) => {
  if (name === 'humn') return 'x'
  const info = monkeys[name]
  console.log({name, info})
  if (Number(info)) return Number(info)
  const [monkey1, op, monkey2] = info.split(' ')
  const val1 = evaluate(monkey1)
  const val2 = evaluate(monkey2)
  const ops = {
    '+': () => val1 + val2,
    '-': () => val1 - val2,
    '*': () => val1 * val2,
    '/': () => val1 / val2,
    '=': () => {
      // copy/paste this into https://www.mathpapa.com/algebra-calculator.html
      console.log(`${val1} ${op} ${val2}`)
      // Maybe I'll figure out how to solve this programatically over winter break...
      // let known, unknown
      // if (Number(val1)) {
      //   known = val1
      //   unknown = val2
      // } else {
      //   unknown = val1
      //   known = val2
      // }
      
      // while (unknown != 'humn') {
      //   unknown = unknown.substring(1, unknown.length - 1) // remove outer parens
      //   console.log(unknown)
      //   const parsed = unknown.split('').reduce((acc, cur) => {
      //     if (cur === '(') acc.openParens++
      //     if (cur === ')') acc.closedParens++
      //     if (acc.op) acc.part2 += cur
      //     else {
      //       if (acc.openParens === acc.closedParens && cur !== ')') {
      //         acc.op += cur.trim()
      //       } else {
      //         acc.part1 += cur
      //       }
      //     }
      //     return acc
      //   }, {part1: '', op: '', part2: '', openParens: 0, closedParens: 0})
      //   console.log(parsed)
      //   if (Number(parsed.part1)) {
      //     unknown = parsed.part2
      //   } else {
      //     unknown = parsed.part1
      //     const magic = {
      //       '/': (val) => known * val,
      //       '*': (val) => known / val,
      //       '+': (val) => known - val,
      //       '-': (val) => known + val
      //     }
      //     known = magic[parsed.op](Number(parsed.part2))
      //   }
      //   console.log(unknown)
      // }
      // console.log(`${unknown} = ${known}`)
      return val1 == val2
    }
  }
  if (op === '=' || (Number(val1) && Number(val2))) {
    monkeys[name] = ops[op]()
  } else {
    monkeys[name] = `(${val1} ${op} ${val2})`
  }
  return monkeys[name]
}
console.log(evaluate('root'))