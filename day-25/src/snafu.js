const SNAFU_DIGITS = {
  '=': -2,
  '-': -1,
  '0': 0,
  '1': 1,
  '2': 2
}

const REM_TO_SNAFU = {
  '0': '0',
  '1': '1',
  '2': '2',
  '3': '=',
  '4': '-',
  '5': '0'
}

/**
 * Convert decimal number to SNAFU number
 * @param {number} number 
 */
const dec2Snafu = (number) => {
  const digits = []
  let carry = 0
  while (number) {
    const rem = (number % 5) + carry
    digits.unshift(REM_TO_SNAFU[rem])
    carry = rem >= 3 ? 1 : 0
    number = Math.floor(number / 5)
  }
  if (carry) digits.unshift([REM_TO_SNAFU[carry]])
  return digits.join('')
}

/**
 * Convert SNAFU number to decimal number
 * @param {string} number 
 * @return {number}
 */
const snafu2Dec = (number) => {
  let place = 0
  let sum = 0
  const digits = number.split('')
  while(digits.length) {
    const digit = digits.pop()
    const placeValue = Math.pow(5, place)
    sum += placeValue * SNAFU_DIGITS[digit]
    place++
  }
  return sum
}

module.exports = {
  dec2Snafu,
  snafu2Dec
}