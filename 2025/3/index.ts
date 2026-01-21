import { expect } from 'chai'
import { readFileSync } from 'fs'
import { sum } from 'lodash'
import { resolve } from 'path'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')

const parse = (input: string) =>
  input
    .split('\n')
    // .map(line => line.split(''))

const solve = (input: string) => {
  const banks = parse(input)
  const joltages = banks.map(bank => {
    const numbers = bank.slice(0, -1).split('').map(b => parseInt(b, 10))
    const max = Math.max(...numbers)
    const firstIndex = numbers.indexOf(max)
    const remainingBankNumbers = bank.slice(firstIndex + 1).split('').map(b => parseInt(b, 10))
    const secondMax = Math.max(...remainingBankNumbers)
    return Number(`${max}${secondMax}`)
  })
  return sum(joltages)
}

expect(solve(testData)).to.equal(357)
expect(solve(taskInput)).to.equal(undefined)

// Part 2

const solve2 = (input: string) => {
}

expect(solve2(testData)).to.equal(undefined)
expect(solve2(taskInput)).to.equal(undefined)

// npx ts-node 2025/3/index.ts
