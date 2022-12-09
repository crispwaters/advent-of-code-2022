const fs = require('fs')

const isSample = false
const inputFile = `${isSample?'sample.':''}input.txt`
const outputFile = `${isSample?'sample.':''}output.txt`

const buffer = fs.readFileSync(inputFile)
const input = buffer.toString()

const isFullyContained = (section1, section2) => section1.start <= section2.start && section1.end >= section2.end
const isOverlapped = (section1, section2) => section1.start <= section2.end && section2.start <= section1.end

const pairs = input.split('\n').map((str) => {
  return str.split(',').map((str) => {
    const [start, end] = str.split('-').map((str) => Number(str))
    return { start, end }
  })
})

const filtered = pairs.filter(([elfA, elfB]) => isFullyContained(elfA, elfB) || isFullyContained(elfB, elfA))
console.log(filtered.length)

const overlapped = pairs.filter(([elfA, elfB]) => isOverlapped(elfA, elfB))
console.log(overlapped.length)

fs.writeFileSync(outputFile, JSON.stringify({filtered, overlapped, pairs}, null, 2))