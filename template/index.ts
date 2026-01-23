import { expect } from 'chai'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')

const parse = (input: string) =>
  input
    .split('\n')
    .map(line => line.split(''))

const solve = (input: string) => {
  const parsed = parse(input)
  console.log(parsed)
}

expect(solve(testData)).to.equal(undefined)
expect(solve(taskInput)).to.equal(undefined)

// Part 2

const solve2 = (input: string) => {
}

expect(solve2(testData)).to.equal(undefined)
expect(solve2(taskInput)).to.equal(undefined)

// npx ts-node 2025/5/index.ts
