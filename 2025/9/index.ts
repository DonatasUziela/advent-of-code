import { expect } from 'chai'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { type Coordinates } from 'utils/coordinates'

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

interface TwoPoints {
  a: Coordinates
  b: Coordinates
}
const solve2 = (input: string) => {
  const redTiles = parse(input)

  const edges: TwoPoints[] = []
  for (let i = 0; i < redTiles.length - 1; i++) {
    edges.push({
      a: redTiles[i],
      b: redTiles[i + 1]
    })
  }
  edges.push({
    a: redTiles.at(-1)!,
    b: redTiles[0]
  })

  const rectAndEdgeIntersects = (rect: TwoPoints, edge: TwoPoints) => {
    const rectMinX = Math.min(rect.a.x, rect.b.x)
    const rectMaxX = Math.max(rect.a.x, rect.b.x)
    const edgeMinX = Math.min(edge.a.x, edge.b.x)
    const edgeMaxX = Math.max(edge.a.x, edge.b.x)
    const rectMinY = Math.min(rect.a.y, rect.b.y)
    const rectMaxY = Math.max(rect.a.y, rect.b.y)
    const edgeMinY = Math.min(edge.a.y, edge.b.y)
    const edgeMaxY = Math.max(edge.a.y, edge.b.y)

    return rectMinX < edgeMaxX &&
      rectMaxX > edgeMinX &&
      rectMaxY > edgeMinY &&
      rectMinY < edgeMaxY
  }

  const rectIsOutsidePolygon = (rect: TwoPoints) =>
    edges.some(edge => rectAndEdgeIntersects(rect, edge))

  let maxArea = 0
  for (let i = 0; i < redTiles.length - 1; i++) {
    for (let j = i + 1; j < redTiles.length; j++) {
      const rect = { a: redTiles[i], b: redTiles[j] }

      if (rectIsOutsidePolygon(rect)) continue

      const lenghtX = Math.abs(rect.b.x - rect.a.x) + 1
      const lenghtY = Math.abs(rect.b.y - rect.a.y) + 1
      const area = lenghtX * lenghtY
      if (area > maxArea) maxArea = area
    }
  }
  return maxArea
}

expect(solve2(testData)).to.equal(24)
expect(solve2(taskInput)).to.equal(1654141440)

// npx ts-node 2025/9/index.ts
