import { Point, Polygon, intersections } from '@mathigon/euclid'
import { expect } from 'chai'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')

const parse = (input: string) =>
  input
    .split('\n')
    .map(line => line.split(',').map(Number))
    .map(([x, y]) => ({ x, y }))

const solve = (input: string) => {
  const redTiles = parse(input)

  let maxArea = 0
  for (let i = 0; i < redTiles.length - 1; i++) {
    for (let j = i + 1; j < redTiles.length; j++) {
      const a = redTiles[i]
      const b = redTiles[j]
      const lenghtX = Math.abs(b.x - a.x) + 1
      const lenghtY = Math.abs(b.y - a.y) + 1
      const area = lenghtX * lenghtY
      if (area > maxArea) maxArea = area
    }
  }
  return maxArea
}

expect(solve(testData)).to.equal(50)
expect(solve(taskInput)).to.equal(4739623064)

// Part 2

const solve2 = (input: string) => {
  const redTiles = parse(input)
  const p = new Polygon(
    new Point(0, 0),
    new Point(4, 0),
    new Point(4, 4),
    new Point(0, 4)
  )

  const p2 = new Point(1, 1)

  console.log(intersections(p, p2))
}

expect(solve2(testData)).to.equal(undefined)
expect(solve2(taskInput)).to.equal(undefined)

// npx ts-node 2025/9/index.ts
