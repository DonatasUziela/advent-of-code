import { expect } from 'chai'
import { readFileSync } from 'fs'
import { sum, multiply } from 'lodash'
import { resolve } from 'path'
import { transpose } from 'utils/transpose'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')

const parse = (input: string) => {
  const parsed = input
    .split('\n')
    .map(line => line.trim().split(/\s+/))

  return transpose(parsed).map(l => ({
    operator: l.pop(),
    numbers: l.map(Number)
  }))
}

const solve = (input: string) => {
  const problems = parse(input)
  const result = problems.reduce((acc, curr) => {
    if (curr.operator === '+') return acc + sum(curr.numbers)
    return acc + curr.numbers.reduce(multiply)
  }, 0)
  return result
}

expect(solve(testData)).to.equal(4277556)
expect(solve(taskInput)).to.equal(5316572080628)

// Part 2

const solve2 = (input: string) => {
}

expect(solve2(testData)).to.equal(undefined)
expect(solve2(taskInput)).to.equal(undefined)

// npx ts-node 2025/6/index.ts
