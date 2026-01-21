import { expect } from 'chai'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { get8Directions, isInBounds } from 'utils/coordinates'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')

const parse = (input: string): string[][] =>
  input
    .split('\n')
    .map(line => line.split(''))

const solve = (input: string) => {
  const grid = parse(input)
  const bounds = { minX: 0, minY: 0, maxX: grid[0].length, maxY: grid.length }

  let movableCount = 0
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      const cell = grid[y][x]
      if (cell !== '@') continue

      const directions = get8Directions({ x, y })
      let count = 0
      for (const d of directions) {
        if (isInBounds({ x: d.x, y: d.y }, bounds) && grid[d.y][d.x] === '@') {
          count++
        }
      }
      if (count < 4) movableCount++
    }
  }

  return movableCount
}

expect(solve(testData)).to.equal(13)
expect(solve(taskInput)).to.equal(1474)

// Part 2

const solve2 = (input: string) => {
}

expect(solve2(testData)).to.equal(undefined)
expect(solve2(taskInput)).to.equal(undefined)

// npx ts-node 2025/4/index.ts
