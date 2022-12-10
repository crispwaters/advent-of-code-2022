const fs = require('fs')

const isSample = false
const prefix = isSample ? 'sample.' : ''
const inputFile = `${prefix}input.txt`
const outputfile = `${prefix}output.txt`
const logFile = `${prefix}logs.txt`

const buffer = fs.readFileSync(inputFile)
const input = buffer.toString()

let value = 1
let tickCount = 1
const tickValueMap = {}
let sum = 0
let curCrtRow = ''
const pixels = []
const getLitValues = () => {
  // logs.push(value)
  return [value - 1, value, value + 1]
}
const getPixelPosition = (tickCount) => {
  let pos = tickCount
  while (pos > 40) pos -= 40
  // logs.push({pos, tickCount})
  return pos - 1
}
// [0,40,41,80,81].forEach((n) => getPixelPosition(n))
const logs = []
const getSpritePosition = () => {
  let pos = ''
  for(let i = 0; i < 40; i++) {
    pos += isLit(i) ? '#' : '.'
  }
  return pos
}
const isLit = (pos) => {
  const vals = getLitValues()
  // logs.push(JSON.stringify({vals, pos}))
  return vals.includes(pos)
}
const tick = (n) => {
  let i = 0
  while (i < n) {
    if (tickCount%20 === 0) {
      tickValueMap[tickCount] = value
      if ([20, 60, 100, 140, 180, 220].includes(tickCount)) {
        sum += (value * tickCount)
      }
    }
    logs.push(`During cycle ${tickCount}: CRT draws pixel in position ${tickCount - 1}`)
    const pixel = isLit(getPixelPosition(tickCount)) ? '#' : '.'
    pixels.push(pixel)
    curCrtRow = (tickCount % 40 === 1 ? '' : curCrtRow) + pixel
    logs.push(`Current CRT row: ${curCrtRow}`)
    tickCount++
    i++
  }
}
const opMap = {
  addx: (v) => {
    logs.push(`Start cycle ${tickCount}: begin executing addx ${v}`)
    tick(2)
    value += Number(v)
    logs.push(`End of cycle ${tickCount}: finish executing addx ${v} (Register X is now ${value})`)
    logs.push(`Sprite position: ${getSpritePosition()}`)
  },
  noop: () => {
    tick(1)
  }
}
logs.push(`Sprite position: ${getSpritePosition()}`)

for (const line of input.split('\n')) {
  // logs.push(line)
  const [op, param] = line.trim().split(' ')
  // logs.push({ op, param})
  opMap[op](param)
}

// logs.push(tickValueMap)
logs.push(JSON.stringify({ sum }))
console.log(sum)
for (let i = 0; i < 6; i++) {
  console.log(pixels.slice(i * 40, (i + 1) * 40).join(''))
  logs.push(pixels.slice(i * 40, (i + 1) * 40).join(''))  
}
fs.writeFileSync(logFile, logs.join('\n'))