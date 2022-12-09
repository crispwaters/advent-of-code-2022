const fs = require('fs')

const isSample = true
const prefix = isSample ? 'sample.' : ''
const inputFile = `${prefix}input.txt`
const outputfile = `${prefix}output.txt`

const buffer = fs.readFileSync(inputFile)
const input = buffer.toString()

const startOfMessage = (str) => found(str, 14)
const startOfPacket = (str) => found(str, 4)
const found = (str, length) => {
  if (str.length !== length) return false
  const map = {}
  for(const char of str.split('')) {
    if (map[char]) return false
    map[char] = char
  }  
  console.log(JSON.stringify(map))
  return true
}

let pos = 1
while (pos < input.length) {
  let start = pos - 4
  if (start < 0) start = 0
  if (startOfPacket(input.substring(start, pos))) {
    console.log(pos)
    break;
  }
  pos++
}

pos = 1
while (pos < input.length) {
  let start = pos - 14
  if (start < 0) start = 0
  if (startOfMessage(input.substring(start, pos))) {
    console.log(pos)
    break;
  }
  pos++
}