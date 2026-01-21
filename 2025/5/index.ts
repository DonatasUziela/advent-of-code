import { expect } from 'chai'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')

const parse = (input: string) => {
  const [ranges, availableIds] = input
    .split('\n\n')
    .map(i => i.split('\n'))
  return {
    availableIds: availableIds.map(Number),
    ranges: ranges.map(r => r.split('-').map(Number))
  }
}

const isInRange = (n: number, range: number[]) => n >= range[0] && n <= range[1]

const solve = (input: string) => {
  const { ranges, availableIds } = parse(input)

  let count = 0
  for (const id of availableIds) {
    for (const range of ranges) {
      if (isInRange(id, range)) {
        count++
        break
      }
    }
  }
  return count
}

expect(solve(testData)).to.equal(3)
expect(solve(taskInput)).to.equal(712)

// Part 2

const solve2 = (input: string) => {
}

expect(solve2(testData)).to.equal(undefined)
expect(solve2(taskInput)).to.equal(undefined)

// npx ts-node 2025/5/index.ts
