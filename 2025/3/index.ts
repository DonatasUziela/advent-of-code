import { expect } from 'chai'
import { readFileSync } from 'fs'
import { sum } from 'lodash'
import { resolve } from 'path'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')

const parse = (input: string) => input.split('\n')

const findMax = (bank: string) => {
  const numbers = bank.split('').map(b => parseInt(b, 10))
  const max = Math.max(...numbers)
  const index = numbers.indexOf(max)
  return {
    max,
    index
  }
}

const getJoltage = (banks: string[], batteryCount: number) => {
  const joltages = banks.map(bank => {
    const turnedOnBatteries: number[] = []
    let scannedBank = bank
    for (let i = 1; i <= batteryCount; i++) {
      const { max, index } = findMax(scannedBank.slice(0, (-batteryCount + i) || undefined))
      scannedBank = scannedBank.slice(index + 1)
      turnedOnBatteries.push(max)
    }
    return Number(turnedOnBatteries.join(''))
  })
  return sum(joltages)
}

const solve = (input: string) => {
  const banks = parse(input)
  return getJoltage(banks, 2)
}

expect(solve(testData)).to.equal(357)
expect(solve(taskInput)).to.equal(17403)

// Part 2

const solve2 = (input: string) => {
  const banks = parse(input)
  return getJoltage(banks, 12)
}

expect(solve2(testData)).to.equal(3121910778619)
expect(solve2(taskInput)).to.equal(173416889848394)

// npx ts-node 2025/3/index.ts
