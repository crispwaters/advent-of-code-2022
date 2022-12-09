const fs = require('fs')

const isSample = false
const prefix = isSample ? 'sample.' : ''
const inputFile = `${prefix}input.txt`
const outputfile = `${prefix}output.txt`

const buffer = fs.readFileSync(inputFile)
const input = buffer.toString()

const isCommand = (str) => str[0] === '$'
const isCd = (str) => str.startsWith('$ cd')
const isLs = (str) => str.startsWith('$ ls')

const fileSystem = {}

let curDir
let hist = []

for (const line of input.split('\n')) {
  if (isCommand(line)) {
    if (isCd(line)) {
      if (line.trim() === '$ cd /') {
        curDir = fileSystem
        hist.length = 0
      } else {
        const toMove = line.trim().replace('$ cd ', '')
        if (toMove === '..') {
          curDir = hist.pop()
        } else {
          hist.push(curDir)
          curDir[toMove] = {}
          curDir = curDir[toMove]
        }
      }
    }
    else if (isLs(line)) continue
  } else {
    const [a, b] = line.trim().split(' ')
    if (a === 'dir') {
      curDir[b] = {}
    } else {
      curDir[b] = Number(a)
    }
  }
}

const directorySizes = {}
let total = 0

const getSize = (dir, dirName) => {
  const size = Object.keys(dir).reduce((acc, cur) => {
    const value = dir[cur]
    const toAdd = typeof(value) === 'number' ? value : getSize(value, cur)
    return acc + toAdd
  }, 0)
  directorySizes[dirName] = size
  if (size < 100000) {
    console.log(`${dirName}: ${size}`)
    total += size
  }
  return size
}

getSize(fileSystem, '/')
console.log(total)

const totalSpace = 70000000
const updateSize = 30000000

const usedSpace = directorySizes['/']
console.log(usedSpace)

const toFree = updateSize - (totalSpace - usedSpace)
console.log({toFree})

let toDeleteSize = Number.MAX_SAFE_INTEGER

for (const dir of Object.keys(directorySizes)) {
  const size = directorySizes[dir]
  console.log(size)
  if (size > toFree && size < toDeleteSize) toDeleteSize = size
}

console.log(toDeleteSize)
fs.writeFileSync(outputfile, JSON.stringify({ directorySizes, fileSystem}, null, 2))