import { expect } from 'chai'
import { readFileSync } from 'fs'
import { sum } from 'lodash'
import { resolve } from 'path'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')

const parse = (input: string) =>
  input
    .split('\n')

const isValidOperand = (str: string) => str.length >= 1 && str.length <= 3

const findMultiplicationInstructions = (str: string): Array<[number, number]> => {
  let index = str.indexOf('mul(')
  const result: Array<[number, number]> = []
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
        result.push(operands.map(Number) as [number, number])
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
  const multiplicationPairs = parsed.flatMap(findMultiplicationInstructions)
  const result = sum(multiplicationPairs.map(pair => pair[0] * pair[1]))
  return result
}

expect(solve(testData)).to.equal(161)
expect(solve(taskInput)).to.equal(undefined)

// Part 2

const solve2 = (input: string) => {
}

expect(solve2(testData)).to.equal(undefined)
expect(solve2(taskInput)).to.equal(undefined)

// npx ts-node 2024/3/index.ts
