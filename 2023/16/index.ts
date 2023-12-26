import { expect } from 'chai'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { type DirectionFunction, type Coordinates, isInBounds, type Bounds, east, serializeCoords, west, north, south, Direction } from 'utils/coordinates'

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

const directionByType = {
  [Direction.East]: east,
  [Direction.North]: north,
  [Direction.West]: west,
  [Direction.South]: south
}

const solve = (input: string) => {
  const grid = parse(input)
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

  const initialBeam = createBeam({ x: -1, y: 0 }, bounds)

  moveBeam(initialBeam, Direction.East)

  return Object.keys(visited).length
}

expect(solve(testData)).to.equal(46)
expect(solve(taskInput)).to.be.above(117)
expect(solve(taskInput)).to.equal(undefined)

// Part 2

const solve2 = (input: string) => {
}

expect(solve2(testData)).to.equal(undefined)
expect(solve2(taskInput)).to.equal(undefined)

// npx ts-node 2023/16/index.ts
