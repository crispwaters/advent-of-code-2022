const fs = require('fs')
const {snafu2Dec, dec2Snafu} = require('./src/snafu')

const isSample = false
const prefix = isSample ? 'sample.' : ''
const inputFile = `${prefix}input.txt`
const outputFile = `${prefix}output.txt`
const printFile = `${prefix}print.txt`
const logFile = `${prefix}logs.txt`

const buffer = fs.readFileSync(inputFile)
const input = buffer.toString().split('\n')

const total = input.reduce((acc, cur) => {
  console.log({acc, cur})
  return acc + snafu2Dec(cur.trim())
}, 0)
console.log({ total, snafu: dec2Snafu(total) })