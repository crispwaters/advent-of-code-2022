const fs = require('fs')

const buffer = fs.readFileSync('./input.txt')
const input = buffer.toString()

const mapper = {
  A: 'Rock',
  B: 'Paper',
  C: 'Scissors',
  X: 'Rock',
  Y: 'Paper',
  Z: 'Scissors'
}

const winLoseDraw = {
  X: {
    'Rock': 'Scissors',
    'Paper': 'Rock',
    'Scissors': 'Paper'
  },
  Y: {
    'Rock': 'Rock',
    'Paper': 'Paper',
    'Scissors': 'Scissors'
  },
  Z: {
    'Rock': 'Paper',
    'Paper': 'Scissors',
    'Scissors': 'Rock'
  }
}

// X => 1
// Y => 2
// Z => 3
const values = {
  'Rock': 1,
  'Paper': 2,
  'Scissors': 3
}

const match = {
  'Rock': {
    'Rock': 3,
    'Paper': 6,
    'Scissors': 0
  },
  'Paper': {
    'Rock': 0,
    'Paper': 3,
    'Scissors': 6
  },
  'Scissors': {
    'Rock': 6,
    'Paper': 0,
    'Scissors': 3
  }
}

const calculateScore = (opp, you) => values[you] + match[opp][you]

const rounds = input.split('\n').map((round) => {
  const [opp, you] = round.trim().split(' ')
  return calculateScore(mapper[opp], winLoseDraw[you][mapper[opp]])
})
console.log(rounds)
console.log(rounds.reduce((acc, cur) => acc + cur, 0))