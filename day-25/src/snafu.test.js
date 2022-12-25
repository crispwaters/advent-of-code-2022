const test = require('ava')
const {dec2Snafu, snafu2Dec} = require('./snafu')

const known = [
  { dec: 1, snafu: '1'},
  { dec: 2, snafu: '2'},
  { dec: 3, snafu: '1='},
  { dec: 4, snafu: '1-'},
  { dec: 5, snafu: '10'},
  { dec: 6, snafu: '11'},
  { dec: 7, snafu: '12'},
  { dec: 8, snafu: '2='},
  { dec: 9, snafu: '2-'},
  { dec: 10, snafu: '20'},
  { dec: 15, snafu: '1=0'},
  { dec: 20, snafu: '1-0'},
  { dec: 2022, snafu: '1=11-2'},
  { dec: 12345, snafu: '1-0---0'},
  { dec: 314159265, snafu: '1121-1110-1=0'},
  { snafu: '1=-0-2', dec: 1747 },
  { snafu: '12111', dec: 906 },
  { snafu: '2=0=', dec: 198 },
  { snafu: '21', dec: 11 },
  { snafu: '2=01', dec: 201 },
  { snafu: '111', dec: 31 },
  { snafu: '20012', dec: 1257 },
  { snafu: '112', dec: 32 },
  { snafu: '1=-1=', dec: 353 },
  { snafu: '1-12', dec: 107 },
  { snafu: '12', dec: 7 },
  { snafu: '1=', dec: 3 },
  { snafu: '122', dec: 37 },
]

test('dec2Snafu', t => {
  for (const {dec, snafu} of known) {
    t.is(dec2Snafu(dec), snafu)
  }
})

test('snafu2Dec', t => {
  for (const {dec, snafu} of known) {
    t.is(snafu2Dec(snafu), dec)
  }
})