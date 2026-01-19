import { expect } from 'chai'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { type DirectionFunction, type Coordinates, isInBounds, type Bounds, serializeCoords, Direction, directionByType } from 'utils/coordinates'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')

const parse = (input: string): string[][] =>
  input
    .split('\n')
    .map(line => line.split(''))

interface Beam {
  next: (direction: DirectionFunction) => Coordinates | undefined
}

const createBeam = (start: Coordinates, bounds: Bounds): Beam => {
  let current = start
  return {
    next (direction: DirectionFunction) {
      const next = direction(current)
      if (isInBounds(next, bounds)) {
        current = next
        return current
      }
    }
  }
}

const ninetyDegrees = {
  '\\': {
    [Direction.East]: Direction.South,
    [Direction.South]: Direction.East,
    [Direction.North]: Direction.West,
    [Direction.West]: Direction.North
  },
  '/': {
    [Direction.East]: Direction.North,
    [Direction.South]: Direction.West,
    [Direction.North]: Direction.East,
    [Direction.West]: Direction.South
  }
}

const energize = (start: Coordinates, startDirection: Direction, grid: string[][]) => {
  const bounds = { maxY: grid.length, maxX: grid[0].length }
  const visited: Record<string, Direction[]> = {
  }

  const moveBeam = (beam: Beam, directionType: Direction) => {
    const direction = directionByType[directionType]
    const next = beam.next(direction)
    if (!next) return

    const key = serializeCoords(next)
    if (visited[key]?.includes(directionType)) return
    visited[key] = (visited[key] || []).concat(directionType)

    const tile = grid[next.y][next.x]

    if (tile === '|' && (directionType === Direction.East || directionType === Direction.West)) {
      const a = createBeam(next, bounds)
      const b = createBeam(next, bounds)

      moveBeam(a, Direction.North)
      moveBeam(b, Direction.South)
    } else if (tile === '-' && (directionType === Direction.North || directionType === Direction.South)) {
      const a = createBeam(next, bounds)
      const b = createBeam(next, bounds)

      moveBeam(a, Direction.West)
      moveBeam(b, Direction.East)
    } else if (tile === '\\' || tile === '/') {
      const newDirectionType = ninetyDegrees[tile][directionType]
      moveBeam(beam, newDirectionType)
    } else {
      moveBeam(beam, directionType)
    }
  }

  const initialBeam = createBeam(start, bounds)

  moveBeam(initialBeam, startDirection)

  return Object.keys(visited).length
}

const solve = (input: string) => {
  const grid = parse(input)

  return energize({ x: -1, y: 0 }, Direction.East, grid)
}

expect(solve(testData)).to.equal(46)
expect(solve(taskInput)).to.equal(7067)

// Part 2

const solve2 = (input: string) => {
  const grid = parse(input)
  const maxX = grid[0].length
  const maxY = grid.length

  let max = 0

  for (let x = 0; x < maxX; x++) {
    const a = energize({ x, y: -1 }, Direction.South, grid)
    const b = energize({ x, y: maxY }, Direction.North, grid)

    max = Math.max(a, b, max)
  }

  for (let y = 0; y < maxY; y++) {
    const a = energize({ x: -1, y }, Direction.East, grid)
    const b = energize({ x: maxX, y }, Direction.West, grid)

    max = Math.max(a, b, max)
  }

  return max
}

expect(solve2(testData)).to.equal(51)
expect(solve2(taskInput)).to.equal(7324)

// npx ts-node 2023/16/index.ts
