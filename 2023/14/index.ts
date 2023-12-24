import { expect } from 'chai'
import { readFileSync } from 'fs'
import { cloneDeep } from 'lodash'
import { resolve } from 'path'
import { serializeCoords, north, type Coordinates } from 'utils/coordinates'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')

const parse = (input: string): string[][] =>
  input
    .split('\n')
    .map(line => line.split(''))

const printPlatform = (platform: string[][]) => {
  console.log(platform.map(l => l.join('')).join('\n'))
}

const roll = (platform: string[][], coords: Coordinates, direction: (c: Coordinates) => Coordinates): string[][] => {
  let curr = coords

  while (true) {
    const next = direction(curr)
    if (platform[next.y]?.[next.x] !== '.') {
      return platform
    } else {
      platform[curr.y][curr.x] = '.'
      platform[next.y][next.x] = 'O'
      curr = next
    }
  }
}

const tilt = (platform: string[][]) => {
  let tilted = cloneDeep(platform)
  for (let y = 0; y < platform.length; y++) {
    const line = platform[y]
    for (let x = 0; x < line.length; x++) {
      if (line[x] === 'O') {
        tilted = roll(tilted, { x, y }, north)
      }
    }
  }
  return tilted
}

const calculateLoad = (platform: string[][]) => {
  let load = 0
  for (let y = 0; y < platform.length; y++) {
    const line = platform[y]
    for (let x = 0; x < line.length; x++) {
      const symbol = line[x]
      if (symbol === 'O') load += platform.length - y
    }
  }
  return load
}

const solve = (input: string) => {
  const platform = parse(input)
  const tilted = tilt(platform)
  //   printPlatform(tilted)
  const load = calculateLoad(tilted)
  return load
}

expect(solve(testData)).to.equal(136)
expect(solve(taskInput)).to.equal(108918)

// Part 2

const cycleCount = 1_000_000_000

const findRocks = (platform: string[][]) => {
  const rocks: Record<string, true> = {}
  const cubes: Record<string, true> = {}
  for (let y = 0; y < platform.length; y++) {
    const line = platform[y]
    for (let x = 0; x < line.length; x++) {
      const symbol = line[x]
      if (symbol === 'O') rocks[serializeCoords({ x, y })] = true
      if (symbol === '#') cubes[serializeCoords({ x, y })] = true
    }
  }
  return { rocks, cubes }
}

const solve2 = (input: string) => {
}

expect(solve2(testData)).to.equal(64)
expect(solve2(taskInput)).to.equal(undefined)
// npx ts-node 2023/14/index.ts
