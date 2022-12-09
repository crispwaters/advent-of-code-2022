const fs = require('fs')

const isSample = false
const prefix = isSample ? 'sample.' : ''
const inputFile = `${prefix}input.txt`
const outputfile = `${prefix}output.txt`

const buffer = fs.readFileSync(inputFile)
const input = buffer.toString()
