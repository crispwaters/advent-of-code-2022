const fs = require('fs')
const isSample = false
const inputFile = `${isSample?'sample.':''}input.txt`
const outputFile = `${isSample?'sample.':''}output.txt`
const buffer = fs.readFileSync(inputFile)
const input = buffer.toString()

const getValue = (str) => getLetterValue(str.charCodeAt(0))
const getLetterValue = (charCode) => charCode >= 97 ? charCode - 96 : charCode - 64 + 26

const addRucksack = (inputString) => {
  return inputString.trim().split('').reduce((acc, cur, index, arr) => {
    const { items, compartment1, compartment2, shared } = acc
    items.push(cur)
    if (index < (arr.length/2)) {
      compartment1.push(cur)
    } else {
      compartment2.push(cur)
      if (compartment1.includes(cur)) {
        shared.push(cur)
        acc.sharedTotal += getValue(cur)
      }
    }
    return acc
  }, { items: [], compartment1: [], compartment2: [], shared: [], sharedTotal: 0 })
}

const rucksacks = input.split('\n').map((str) => addRucksack(str.trim()))

console.log(rucksacks.reduce((acc, cur) => acc + getValue(cur.shared[0]), 0))

const getSharedItems = (rucksackA, rucksackB) => rucksackA.filter(item => rucksackB.includes(item))

const groups = rucksacks.reduce((acc, cur) => {
  const group = acc[acc.length - 1]
  group.members.push(cur)
  if (group.members.length === 3) {
    group.sharedItems = group.members.reduce((acc, {items}) => {
      if (!acc) return items
      return getSharedItems(acc, items)
    }, null)

    acc.push({ members: [], sharedItems: []})
  }
  return acc
}, [{ members: [], sharedItems: []}])
groups.pop()

console.log(groups.reduce((acc, cur) => acc + getValue(cur.sharedItems[0]), 0))

fs.writeFileSync(outputFile, JSON.stringify({rucksacks, groups}, null, 2))