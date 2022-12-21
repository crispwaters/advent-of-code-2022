const fs = require('fs')
const CircularList = require('./circular-list')

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

const decryptionKey = 811589153

const encrypted = input.map(val => Number(val.trim()) * decryptionKey)

const decrypted = new CircularList(encrypted)
debug(decrypted.toArray().join(', '))

for (let round = 0; round < 10; round++) {
  // console.log({ round })
  for (const i in encrypted) {
    decrypted.move(i)
    // debug(decrypted.toArray().join(', '))
  }
}
const coordinates = decrypted.getCoordinates()
debug(coordinates)
console.log(logs.pop())
console.log(coordinates[1000] + coordinates[2000] + coordinates[3000])