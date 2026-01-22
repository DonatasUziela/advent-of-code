import { expect } from 'chai'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')

const parse = (input: string): string[][] =>
  input
    .split('\n')
    .map(line => line.split(''))

const solve = (input: string) => {
  const grid = parse(input)
  const start = { x: grid[0].indexOf('S'), y: 0 }
  const beamsMap = { [start.x]: true }
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
expect(solve(taskInput)).to.equal(undefined)

// Part 2

const solve2 = (input: string) => {
}

expect(solve2(testData)).to.equal(undefined)
expect(solve2(taskInput)).to.equal(undefined)

// npx ts-node 2025/7/index.ts
