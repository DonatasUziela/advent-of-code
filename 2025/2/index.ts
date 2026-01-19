import { expect } from 'chai'
import { readFileSync } from 'fs'
import { sum } from 'lodash'
import { resolve } from 'path'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')

const parse = (input: string) =>
  input
    .split(',')
    .map(range => range
      .split('-')
    )

const getInvalidIdsInRange = (start: string, end: string): string[] => {
  const invalidIds: string[] = []

  for (let idNumber = Number(start); idNumber <= Number(end); idNumber++) {
    const id = idNumber.toString()
    if (id.length % 2 !== 0) continue

    const a = id.slice(0, id.length / 2)
    const b = id.slice(id.length / 2)

    if (a === b) invalidIds.push(id)
  }

  return invalidIds
}

expect(getInvalidIdsInRange('11', '22')).to.deep.equal(['11', '22'])
expect(getInvalidIdsInRange('95', '115')).to.deep.equal(['99'])
expect(getInvalidIdsInRange('1188511880', '1188511890')).to.deep.equal(['1188511885'])

const solve = (input: string) => {
  const ranges = parse(input)
  const invalidIds: string[] = []
  for (const [start, end] of ranges) {
    const ids = getInvalidIdsInRange(start, end)
    invalidIds.push(...ids)
  }

  const result = sum(invalidIds.map(i => parseInt(i, 10)))

  return result
}

expect(solve(testData)).to.equal(1227775554)
expect(solve(taskInput)).to.equal(19128774598)

// Part 2

const solve2 = (input: string) => {
}

expect(solve2(testData)).to.equal(undefined)
expect(solve2(taskInput)).to.equal(undefined)

// npx ts-node 2025/2/index.ts
