
const test = require('ava')
const {gcd} = require('./util')

test('Day 24 - gcd', t => {
  for (const {input, expected} of [
    {input: [3,4], expected: 1},
    {input: [3,12], expected: 3},
    {input: [4,12], expected: 4},
    {input: [8, 12], expected: 4}
  ]) {
    t.is(gcd(...input), expected)
  }
})