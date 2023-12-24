import { expect } from 'chai'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { serializeCoords, north, type Coordinates, south, left, right, type Bounds, isInBounds } from 'utils/coordinates'
import { ascendingSorter, descendingSorter } from 'utils/sort'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')

interface RockInfo {
  rocks: Record<string, Coordinates>
  cubes: Record<string, true>
  bounds: Bounds
}

const parse = (input: string): string[][] =>
  input
    .split('\n')
    .map(line => line.split(''))

const printPlatform = (info: RockInfo) => {
  const platform: string[][] = []
  for (let y = 0; y < info.bounds.maxY; y++) {
    platform.push([])
    for (let x = 0; x < info.bounds.maxX; x++) {
      const c = serializeCoords({ x, y })
      platform[y][x] = info.cubes[c] ? '#' : info.rocks[c] ? 'O' : '.'
    }
  }
  console.log('------')
  console.log(platform.map(l => l.join('')).join('\n'))
}

const roll = ({ rocks, cubes, bounds }: RockInfo, coords: Coordinates, direction: (c: Coordinates) => Coordinates) => {
  let curr = coords

  while (true) {
    const next = direction(curr)
    const nextC = serializeCoords(next)
    if (!rocks[nextC] && !cubes[nextC] && isInBounds(next, bounds)) {
      curr = next
    } else {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete rocks[serializeCoords(coords)]
      rocks[serializeCoords(curr)] = curr
      return rocks
    }
  }
}

const findRocks = (platform: string[][]): RockInfo => {
  const rocks: Record<string, Coordinates> = {}
  const cubes: Record<string, true> = {}
  for (let y = 0; y < platform.length; y++) {
    const line = platform[y]
    for (let x = 0; x < line.length; x++) {
      const symbol = line[x]
      if (symbol === 'O') rocks[serializeCoords({ x, y })] = { x, y }
      if (symbol === '#') cubes[serializeCoords({ x, y })] = true
    }
  }
  return { rocks, cubes, bounds: { minX: 0, minY: 0, maxX: platform[0].length, maxY: platform.length } }
}

const tiltNorth = (info: RockInfo) => {
  Object.values(info.rocks)
    .sort((a, b) => ascendingSorter(a.x, b.x))
    .sort((a, b) => ascendingSorter(a.y, b.y))
    .forEach(c => {
      roll(info, c, north)
    })
}

const tiltSouth = (info: RockInfo) => {
  Object.values(info.rocks)
    .sort((a, b) => ascendingSorter(a.x, b.x))
    .sort((a, b) => descendingSorter(a.y, b.y))
    .forEach(c => {
      roll(info, c, south)
    })
}

const tiltWest = (info: RockInfo) => {
  Object.values(info.rocks)
    .sort((a, b) => ascendingSorter(a.y, b.y))
    .sort((a, b) => ascendingSorter(a.x, b.x))
    .forEach(c => {
      roll(info, c, left)
    })
}

const tiltEast = (info: RockInfo) => {
  Object.values(info.rocks)
    .sort((a, b) => ascendingSorter(a.y, b.y))
    .sort((a, b) => descendingSorter(a.x, b.x))
    .forEach(c => {
      roll(info, c, right)
    })
}

const calculateLoad = (info: RockInfo) => {
  let load = 0
  Object.values(info.rocks).forEach(c => {
    load += info.bounds.maxY - c.y
  })
  return load
}

const solve = (input: string) => {
  const platform = parse(input)
  const info = findRocks(platform)
  tiltNorth(info)
  //   printPlatform(info)
  const load = calculateLoad(info)
  return load
}

expect(solve(testData)).to.equal(136)
expect(solve(taskInput)).to.equal(108918)

// Part 2

const CYCLE_COUNT = 1_000_000_000

const serializeInfo = (info: RockInfo) => Object.keys(info.rocks).join('-')

const solve2 = (input: string) => {
  const platform = parse(input)
  const rockInfo = findRocks(platform)

  printPlatform(rockInfo)

  const cache: Record<string, boolean> = {}
  let repeatingPatternKey = ''
  let repeatingPatternStart = 0
  let repeatingPatternEnd = 0
  for (let i = 0; i < CYCLE_COUNT; i++) {
    tiltNorth(rockInfo)
    tiltWest(rockInfo)
    tiltSouth(rockInfo)
    tiltEast(rockInfo)

    const key = serializeInfo(rockInfo)
    if (repeatingPatternKey === key) {
      repeatingPatternEnd = i
      //   printPlatform(rockInfo)
      break
    }

    // find when the pattern starts repeating
    if (cache[key] && !repeatingPatternKey) {
      repeatingPatternStart = i
      repeatingPatternKey = key
    //   printPlatform(rockInfo)
    }

    cache[key] = true
  }

  const patternLength = repeatingPatternEnd - repeatingPatternStart
  const toRun = (CYCLE_COUNT - repeatingPatternStart - 1) % patternLength

  for (let i = 0; i < toRun; i++) {
    tiltNorth(rockInfo)
    tiltWest(rockInfo)
    tiltSouth(rockInfo)
    tiltEast(rockInfo)
  }

  //   printPlatform(rockInfo)

  return calculateLoad(rockInfo)
}

expect(solve2(testData)).to.equal(64)
expect(solve2(taskInput)).to.equal(100310)

// npx ts-node 2023/14/index.ts
