import { expect } from 'chai'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { type DirectionFunction, east, north, south, west, type Coordinates, calcPolygonArea, calculatePerimeter } from 'utils/coordinates'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')

const parse = (input: string) =>
  input
    .split('\n')
    .map(line => line.split(' '))
    .map(([direction, size, color]) => ({
      direction,
      size: Number(size),
      color: color.replace('(', '').replace(')', '')
    }))

const directionToFunction: Record<string, DirectionFunction> = {
  D: south,
  U: north,
  R: east,
  L: west
}

// Part 1

const solve1B = (input: string) => {
  const digPlan = parse(input)

  let position = { x: 0, y: 0 }
  const coordinates: Coordinates[] = digPlan.map(({ size, direction }) => {
    const directionFunction = directionToFunction[direction]
    position = directionFunction(position, size)
    return position
  })

  const area = calcPolygonArea(coordinates)
  const perimeter = calculatePerimeter(coordinates)

  return area + (perimeter / 2) + 1
}

expect(solve1B(testData)).to.equal(62)
expect(solve1B(taskInput)).to.equal(53300)

// Part 2

const direction2ToFunction: Record<number, DirectionFunction> = {
  0: east,
  1: south,
  2: west,
  3: north
}

const parse2 = (input: string) =>
  input
    .split('\n')
    .map(line => line.split(' '))
    .map(([_, __, color]) => {
      const cleaned = color.replace('(', '').replace(')', '').replace('#', '')
      return ({
        direction: Number(cleaned.slice(-1)),
        size: parseInt(cleaned.slice(0, 5), 16)
      })
    })

const solve2 = (input: string) => {
  const digPlan = parse2(input)
  let position = { x: 0, y: 0 }
  const coordinates: Coordinates[] = digPlan.map(({ size, direction }) => {
    const directionFunction = direction2ToFunction[direction]
    position = directionFunction(position, size)
    return position
  })

  const area = calcPolygonArea(coordinates)
  const perimeter = calculatePerimeter(coordinates)

  return area + (perimeter / 2) + 1
}

expect(solve2(testData)).to.equal(952408144115)
expect(solve2(taskInput)).to.equal(64294334780659)

// npx ts-node 2023/18/index.ts
