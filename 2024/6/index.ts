import { expect } from 'chai'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { changeDirectionRight, type Coordinates, Direction, directionByType, isInBounds, serializeCoords } from 'utils/coordinates'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')

const parse = (input: string) => {
  const map = input
    .split('\n')
    .map(line => line.split(''))

  let start = { x: 0, y: 0 }
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === '^') {
        start = { x, y }
      }
    }
  }

  return {
    map,
    start,
    maxX: map.length,
    maxY: map.length
  }
}

const patrol = (start: Coordinates, maxX: number, maxY: number, map: string[][]) => {
  let currentDirection = Direction.North
  let currentPosition = start
  const visitedMap: Record<string, true> = {}

  while (isInBounds(currentPosition, { maxX, maxY })) {
    const nextPosition = directionByType[currentDirection](currentPosition)

    if (map[nextPosition.y]?.[nextPosition.x] === '#') {
      // todo detect loop
      currentDirection = changeDirectionRight(currentDirection)
    } else {
      visitedMap[serializeCoords(currentPosition)] = true
      currentPosition = nextPosition
    }
  }
  return { visitedMap }
}

const solve = (input: string) => {
  const { map, start, maxX, maxY } = parse(input)
  const { visitedMap } = patrol(start, maxX, maxY, map)
  return Object.keys(visitedMap).length
}

expect(solve(testData)).to.equal(41)
expect(solve(taskInput)).to.equal(5145)

// Part 2

const solve2 = (input: string) => {
}

expect(solve2(testData)).to.equal(undefined)
expect(solve2(taskInput)).to.equal(undefined)

// npx ts-node 2024/6/index.ts
