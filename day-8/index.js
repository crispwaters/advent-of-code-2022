const fs = require('fs')

const isSample = false
const prefix = isSample ? 'sample.' : ''
const inputFile = `${prefix}input.txt`
const outputfile = `${prefix}output.txt`

const buffer = fs.readFileSync(inputFile)
const input = buffer.toString()

const forest = []
input.split('\n').map(row => forest.push(row.trim().split('').map(i => Number(i))))

fs.writeFileSync(outputfile, JSON.stringify(forest, null, 2))


const getHeight = (row, column) => forest[row][column]
const isVisible = (row, column) => {
  const height = getHeight(row, column)
  const rLength = forest.length
  const cLength = forest[row].length

  if (row === 0) return true
  if (row === rLength - 1) return true
  if (column === 0) return true
  if (column === cLength - 1) return true

  let visibleLeft = true
  let visibleRight = true
  let visibleTop = true
  let visibleBottom = true  
  for (let i = 0; i < row; i++) {
    if (getHeight(i, column) >= height) visibleTop = false
  }
  for (let i = row + 1; i < rLength; i++) {
    if (getHeight(i, column) >= getHeight(row, column)) visibleBottom = false
  }
  for (let j = 0; j < column; j++) {
    if (j === column) continue
    if (getHeight(row, j) >= getHeight(row, column)) visibleLeft = false
  }
  for (let j = column + 1; j < cLength; j++) {
    if (j === column) continue
    if (getHeight(row, j) >= getHeight(row, column)) visibleRight = false
  }
  return visibleTop || visibleBottom || visibleLeft || visibleRight
}
const scenicScore = (row, column) => {
  const height = getHeight(row, column)
  const rLength = forest.length
  const cLength = forest[row].length

  let visibleLeft = 0
  let visibleRight = 0
  let visibleTop = 0
  let visibleBottom = 0
  for (let i = row - 1; i >= 0; i--) {
    visibleTop++
    if (getHeight(i, column) >= height) break
  }
  for (let i = row + 1; i < rLength; i++) {
    visibleBottom++
    if (getHeight(i, column) >= getHeight(row, column)) break
  }
  for (let j = column - 1; j >= 0; j--) {
    visibleLeft++
    if (getHeight(row, j) >= getHeight(row, column)) break
  }
  for (let j = column + 1; j < cLength; j++) {
    visibleRight++
    if (getHeight(row, j) >= getHeight(row, column)) break
  }
  // console.log({ row, column, height, visibleTop, visibleBottom, visibleLeft, visibleRight })
  return [visibleTop, visibleBottom, visibleLeft, visibleRight].reduce((acc, cur) => acc * cur, 1)
}

let visibleCount = 0
for (let i = 0; i < forest.length; i++) {
  for (let j = 0; j < forest[0].length; j++) {
    if (isVisible(i, j)) {
      visibleCount++
    }
  }
}

let maxScenicScore = 0
for (let i = 1; i < forest.length - 1; i++) {
  for (let j = 1; j < forest[0].length - 1; j++) {
    maxScenicScore = Math.max(maxScenicScore, scenicScore(i, j))
  }
}

// console.log(scenicScore(1, 2))
// console.log(scenicScore(3, 2))

console.log({ visibleCount, maxScenicScore })
