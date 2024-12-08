import { expect } from 'chai'
import { readFileSync } from 'fs'
import { sum } from 'lodash'
import { resolve } from 'path'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')
const testData2 = readFileSync(resolve(__dirname, 'testData2.txt'), 'utf-8')

const parse = (input: string) =>
  input
    .split('\n').join(' ')

const isValidOperand = (str: string) => str.length >= 1 && str.length <= 3

interface Multiplication {
  a: number
  b: number
  index: number
}

const findMultiplicationInstructions = (str: string): Multiplication[] => {
  let index = str.indexOf('mul(')
  const result: Multiplication[] = []
  while (index !== -1) {
    const operands = ['', '']
    let operandsIndex = 0
    index = index + 4

    while (true) {
      const char = str[index]
      if (!isNaN(Number(char))) {
        operands[operandsIndex] += char
        index++
      } else if (char === ',' && operandsIndex === 0 && isValidOperand(operands[operandsIndex])) {
        operandsIndex++
        index++
      } else if (char === ')' && operandsIndex === 1 && isValidOperand(operands[operandsIndex])) {
        result.push({
          a: Number(operands[0]),
          b: Number(operands[1]),
          index
        })
        index++
        break
      } else {
        index++
        break
      }
    }
    index = str.indexOf('mul(', index)
  }
  return result
}

const solve = (input: string) => {
  const parsed = parse(input)
  const multiplicationPairs = findMultiplicationInstructions(parsed)
  const result = sum(multiplicationPairs.map(({ a, b }) => a * b))
  return result
}

expect(solve(testData)).to.equal(161)
expect(solve(taskInput)).to.equal(187194524)

// Part 2

const getAllIndexes = (str: string, search: string) => {
  const indexes = []
  let index = str.indexOf(search)
  while (index !== -1) {
    indexes.push(index)
    index = str.indexOf(search, index + 1)
  }
  return indexes
}

const solve2 = (input: string) => {
  const parsed = parse(input)
  const multiplicationPairs = findMultiplicationInstructions(parsed)
  const dos = getAllIndexes(parsed, 'do()').map(index => ({ index, enabled: true }))
  const donts = getAllIndexes(parsed, 'don\'t()').map(index => ({ index, enabled: false }))
  const dosAndDonts = [...dos, ...donts].sort((a, b) => a.index - b.index)
  const enabledMultiplications = multiplicationPairs.filter(({ index }) => {
    const instructions = dosAndDonts.filter(({ index: i }) => i < index)
    if (instructions.length === 0) {
      return true
    }

    const lastInstruction = instructions[instructions.length - 1]
    return lastInstruction.enabled
  })

  const result = sum(enabledMultiplications.map(({ a, b }) => a * b))

  return result
}

expect(solve2(testData2)).to.equal(48)
expect(solve2(taskInput)).to.equal(127092535)

// npx ts-node 2024/3/index.ts
