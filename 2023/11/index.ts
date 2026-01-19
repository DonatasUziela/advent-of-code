import { expect } from 'chai'
import { readFileSync } from 'fs'
import { sum } from 'lodash'
import { resolve } from 'path'
import { type Coordinates } from 'utils/coordinates'
import { getPairs } from 'utils/getPairs'
import { transpose } from 'utils/transpose'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')

const parse = (input: string) => input.split('\n').map(row => row.split(''))

type Universe = string[][]

interface Expansions { vertical: number[], horizontal: number[] }

const getExpansions = (universe: Universe): Expansions => {
  const vertical: number[] = []
  universe.forEach((row, rowIndex) => {
    if (row.every(column => column === '.')) {
      vertical.push(rowIndex)
    }
  })

  const transposedUniverse = transpose(universe)
  const horizontal: number[] = []
  transposedUniverse.forEach((row, rowIndex) => {
    if (row.every(column => column === '.')) {
      horizontal.push(rowIndex)
    }
  })

  return { vertical, horizontal }
}

const findGalaxies = (universe: Universe) => {
  const result: Coordinates[] = []
  universe.forEach((row, y) => {
    row.forEach((column, x) => {
      if (universe[y][x] === '#') result.push({ x, y })
    })
  })
  return result
}

const expandGalaxyCoordinates = (galaxies: Coordinates[], expansions: Expansions, expansionSize: number) => {
  // if universe gets "twice as big" - we just need to add one line of space (aka double the current line)
  const k = expansionSize - 1

  return galaxies.map(galaxy => {
    let x = galaxy.x
    let y = galaxy.y
    for (const yExp of expansions.vertical) {
      if (galaxy.y > yExp) y += k
    }

    for (const xExp of expansions.horizontal) {
      if (galaxy.x > xExp) x += k
    }
    return { x, y }
  })
}

const positiveNumber = (n: number) => n * Math.sign(n)

const solve = (input: string, expansionSize: number) => {
  const universe = parse(input)
  const galaxies = findGalaxies(universe)
  const expansions = getExpansions(universe)
  const expandedGalaxies = expandGalaxyCoordinates(galaxies, expansions, expansionSize)
  const pairs = getPairs(expandedGalaxies)
  const distances = pairs.map(([a, b]) => positiveNumber(b.x - a.x) + positiveNumber(b.y - a.y))
  return sum(distances)
}

expect(solve(testData, 2)).to.equal(374)
expect(solve(taskInput, 2)).to.equal(9563821)

// Part 2

expect(solve(testData, 10)).to.equal(1030)
expect(solve(testData, 100)).to.equal(8410)
expect(solve(taskInput, 1_000_000)).to.equal(827009909817)

// npx ts-node 2023/11/index.ts
