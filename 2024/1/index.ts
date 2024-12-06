import { expect } from 'chai'
import { readFileSync } from 'fs'
import { sum } from 'lodash'
import { resolve } from 'path'
import { ascendingSorter } from 'utils/sort'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')

const parse = (input: string) => {
  const pairs = input
    .split('\n')
    .map(line => line.split('   '))
    .map(numberStrings => numberStrings.map(s => parseInt(s, 10)))

  const result: [number[], number[]] = [[], []]
  for (const pair of pairs) {
    result[0].push(pair[0])
    result[1].push(pair[1])
  }
  result.forEach(l => l.sort(ascendingSorter))
  return result
}

const solve = (input: string) => {
  const lists = parse(input)
  const distances = lists[0].map((n, i) => {
    const diff = n - lists[1][i]
    const distance = Math.abs(diff)
    return distance
  })
  return sum(distances)
}

expect(solve(testData)).to.equal(11)
expect(solve(taskInput)).to.equal(3508942)

// Part 2

const solve2 = (input: string) => {
}

expect(solve2(testData)).to.equal(undefined)
expect(solve2(taskInput)).to.equal(undefined)

// npx ts-node 2024/1/index.ts
