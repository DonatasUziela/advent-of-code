import { expect } from 'chai'
import { readFileSync } from 'fs'
import { sum } from 'lodash'
import { resolve } from 'path'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')

const parse = (input: string) =>
  input
    .split(',')
    .map(range => range.split('-'))

const isIdInvalid = (id: string) => id.slice(0, id.length / 2) === id.slice(id.length / 2)

const getInvalidIdsInRange = (start: string, end: string): string[] => {
  const invalidIds: string[] = []

  for (let idNumber = Number(start); idNumber <= Number(end); idNumber++) {
    const id = idNumber.toString()
    if (id.length % 2 !== 0) continue
    if (isIdInvalid(id)) invalidIds.push(id)
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
    for (let idNumber = Number(start); idNumber <= Number(end); idNumber++) {
      const id = idNumber.toString()

      if (id.length % 2 !== 0) continue

      if (isIdInvalid(id)) invalidIds.push(id)
    }
  }

  const result = sum(invalidIds.map(i => parseInt(i, 10)))

  return result
}

expect(solve(testData)).to.equal(1227775554)
expect(solve(taskInput)).to.equal(19128774598)

// Part 2

const isIdInvalid2 = (id: string) => {
  const maxGroupLength = Math.floor(id.length / 2)
  for (let groupLength = 1; groupLength <= maxGroupLength; groupLength++) {
    if (id.length % groupLength !== 0) continue
    const repeater = id.slice(0, groupLength)
    const result = repeater.repeat(id.length / groupLength)
    if (result === id) return true
  }
  return false
}

expect(isIdInvalid2('11')).to.equal(true)
expect(isIdInvalid2('22')).to.equal(true)
expect(isIdInvalid2('999')).to.equal(true)
expect(isIdInvalid2('1010')).to.equal(true)
expect(isIdInvalid2('446446')).to.equal(true)
expect(isIdInvalid2('1111111')).to.equal(true)
expect(isIdInvalid2('38593859')).to.equal(true)

const solve2 = (input: string) => {
  const ranges = parse(input)
  const invalidIds: string[] = []

  for (const [start, end] of ranges) {
    for (let idNumber = Number(start); idNumber <= Number(end); idNumber++) {
      const id = idNumber.toString()
      if (isIdInvalid2(id)) invalidIds.push(id)
    }
  }

  const result = sum(invalidIds.map(i => parseInt(i, 10)))

  return result
}

expect(solve2(testData)).to.equal(4174379265)
expect(solve2(taskInput)).to.equal(21932258645)

// npx ts-node 2025/2/index.ts
