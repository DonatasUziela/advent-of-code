const fs = require('fs')
const { intersection } = require('lodash')
const path = require('path')

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf-8')

// rangeString: '4-8', range: [4, 5, 6, 7, 8]
const generateRange = (rangeString) => {
  const [start, end] = rangeString.split('-').map(r => parseInt(r, 10))

  const range = []
  for (let i = start; i <= end; i++) {
    range.push(i)
  }
  return range
}

const pairCamps = input
  .split('\n')
  .map(e => e.split(','))
  .map(p => p.map(generateRange))

const result = pairCamps
  .filter(([elf1, elf2]) => {
    const sameCampsCount = intersection(elf1, elf2).length
    return sameCampsCount === elf1.length || sameCampsCount === elf2.length
  })
  .length

console.log(result) // 540

// Part 2

const result2 = pairCamps
  .filter(([elf1, elf2]) => intersection(elf1, elf2).length)
  .length

console.log(result2) // 872

// node 2022/4/CampCleanup.js
