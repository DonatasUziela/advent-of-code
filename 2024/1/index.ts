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
  const lists = parse(input)

  const countsMap: Record<number, number> = {}
  lists[0].forEach((n) => {
    if (countsMap[n]) return

    let count = 0
    lists[1].forEach((m) => {
      if (m === n) count += 1
    })
    countsMap[n] = count
  })

  const similarityScores = lists[0].map((n) => n * countsMap[n])

  return sum(similarityScores)
}

expect(solve2(testData)).to.equal(31)
expect(solve2(taskInput)).to.equal(26593248)

// npx ts-node 2024/1/index.ts
