/**
 * Turn coordinates into string key
 * @param {{x: number, y: number}} xy 
 * @returns {string}
 */
 const c2k = ({x, y}) => `${x},${y}`
 /**
  * Turn string key in xy coordinates
  * @param {string} key 
  * @returns {[x, y]} 
  */
 const k2c = (key) => key.split(',').map(n => Number(n))

 /**
  * Returns greatest common divisor between two numbers
  * @param {number} a
  * @param {number} b
  * @return {number}
  */
 const gcd = (a, b) => {
  if (typeof a !== 'number' || typeof b !== 'number') throw new Error(`Parameters must be numbers: ${JSON.stringify({a, b})}`)
  let x = Math.abs(a)
  let y = Math.abs(b)
  while (y) [x, y] = [y, x % y]
  return x
 }

 module.exports = {
  c2k,
  k2c,
  gcd
 }