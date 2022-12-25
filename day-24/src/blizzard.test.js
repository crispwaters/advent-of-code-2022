const test = require('ava')
const Blizzard = require('./blizzard')

test('Blizzard left movement works correctly', t => {
  const b = new Blizzard({ position: {x: 2, y: 4 }, direction: '<'})
  const bounds = {width: 5, height: 4}
  b.move(bounds)
  t.deepEqual(b.getPosition(), {x: 2, y: 3})
  b.move(bounds)
  t.deepEqual(b.getPosition(), {x: 2, y: 2})
  b.move(bounds)
  t.deepEqual(b.getPosition(), {x: 2, y: 1})
  b.move(bounds)
  t.deepEqual(b.getPosition(), {x: 2, y: 0})
  b.move(bounds)
  t.deepEqual(b.getPosition(), {x: 2, y: 4})
})

test('Blizzard right movement works correctly', t => {
  const b = new Blizzard({ position: {x: 2, y: 4 }, direction: '>'})
  const bounds = {width: 5, height: 4}
  b.move(bounds)
  t.deepEqual(b.getPosition(), {x: 2, y: 0})
  b.move(bounds)
  t.deepEqual(b.getPosition(), {x: 2, y: 1})
  b.move(bounds)
  t.deepEqual(b.getPosition(), {x: 2, y: 2})
  b.move(bounds)
  t.deepEqual(b.getPosition(), {x: 2, y: 3})
  b.move(bounds)
  t.deepEqual(b.getPosition(), {x: 2, y: 4})
})

test('Blizzard up movement works correctly', t => {
  const b = new Blizzard({ position: {x: 2, y: 4 }, direction: '^'})
  const bounds = {width: 5, height: 4}
  b.move(bounds)
  t.deepEqual(b.getPosition(), {x: 1, y: 4})
  b.move(bounds)
  t.deepEqual(b.getPosition(), {x: 0, y: 4})
  b.move(bounds)
  t.deepEqual(b.getPosition(), {x: 3, y: 4})
  b.move(bounds)
  t.deepEqual(b.getPosition(), {x: 2, y: 4})
})

test('Blizzard down movement works correctly', t => {
  const b = new Blizzard({ position: {x: 2, y: 4 }, direction: 'v'})
  const bounds = {width: 5, height: 4}
  b.move(bounds)
  t.deepEqual(b.getPosition(), {x: 3, y: 4})
  b.move(bounds)
  t.deepEqual(b.getPosition(), {x: 0, y: 4})
  b.move(bounds)
  t.deepEqual(b.getPosition(), {x: 1, y: 4})
  b.move(bounds)
  t.deepEqual(b.getPosition(), {x: 2, y: 4})
})