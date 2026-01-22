import { expect } from 'chai'
import { readFileSync } from 'fs'
import { sum } from 'lodash'
import { resolve } from 'path'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')

const parse = (input: string): string[][] =>
  input
    .split('\n')
    .map(line => line.split(''))

const solve = (input: string) => {
  const grid = parse(input)
  const startX = grid[0].indexOf('S')
  const beamsMap = { [startX]: true }
  let splitCount = 0

  for (let y = 1; y < grid.length; y++) {
    const beamsXes = Object.keys(beamsMap).map(Number)
    for (const beamX of beamsXes) {
      if (grid[y][beamX] === '^' && beamsMap[beamX]) {
        beamsMap[beamX] = false
        beamsMap[beamX - 1] = true
        beamsMap[beamX + 1] = true
        splitCount++
      }
    }
  }
  return splitCount
}

expect(solve(testData)).to.equal(21)
expect(solve(taskInput)).to.equal(1581)

// Part 2

const solve2 = (input: string) => {
  const grid = parse(input) as Array<Array<string | number>>
  const startX = grid[0].indexOf('S')
  const beamsMap = { [startX]: true }

  const values: number[][] = []
  for (let y = 0; y < grid.length; y++) {
    values[y] = []
    for (let x = 0; x < grid[0].length; x++) {
      values[y][x] = 0
    }
  }
  values[0][startX] = 1

  for (let y = 1; y < grid.length; y++) {
    const beamsX = Object.keys(beamsMap).map(Number)
    for (const x of beamsX) {
      if (grid[y][x] === '^') {
        delete beamsMap[x]
        beamsMap[x - 1] = true
        beamsMap[x + 1] = true
        values[y][x - 1] += values[y - 1][x]
        values[y][x + 1] += values[y - 1][x]
      } else {
        values[y][x] += values[y - 1][x]
      }
    }
  }
  const result = sum(
    values
      .at(-1)
      ?.filter(i => Number.isInteger(i))
      .map(Number)
  )

  return result
}

expect(solve2(testData)).to.equal(40)
expect(solve2(taskInput)).to.equal(73007003089792)

// npx ts-node 2025/7/index.ts
