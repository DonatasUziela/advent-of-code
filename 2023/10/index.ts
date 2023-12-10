import { expect } from 'chai'
import {
  readFileSync
  // writeFileSync
} from 'fs'
import { sum } from 'lodash'
import { resolve } from 'path'
import { right, type Coordinates, left, up, down, serializeCoords, parseCoords, sameCoords } from 'utils/coordinates'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')
const testData2 = readFileSync(resolve(__dirname, 'testData2.txt'), 'utf-8')
const testData3 = readFileSync(resolve(__dirname, 'testData3.txt'), 'utf-8')
const testData4 = readFileSync(resolve(__dirname, 'testData4.txt'), 'utf-8')
const testData5 = readFileSync(resolve(__dirname, 'testData5.txt'), 'utf-8')
const testData6 = readFileSync(resolve(__dirname, 'testData6.txt'), 'utf-8')

type Direction = 'N' | 'E' | 'S' | 'W'

export const get4Directions = (c: Coordinates): Array<{ coord: Coordinates, direction: Direction }> => [
  { coord: right(c), direction: 'E' },
  { coord: left(c), direction: 'W' },
  { coord: up(c), direction: 'S' },
  { coord: down(c), direction: 'N' }
]

const parse = (input: string) => {
  const rows = input.split('\n')
  const start = { x: 0, y: 0 }
  for (let row = 0; row < rows.length; row++) {
    const column = rows[row].indexOf('S')
    if (column !== -1) {
      start.x = column
      start.y = row
      break
    }
  }
  return {
    grid: rows.map(row => row.split('')),
    start
  }
}

const connections: Record<string, string[]> = {
  S: ['N', 'E', 'S', 'W'],
  '|': ['N', 'S'],
  '-': ['E', 'W'],
  J: ['N', 'W'],
  L: ['N', 'E'],
  7: ['S', 'W'],
  F: ['S', 'E']
}
const opposites = {
  S: 'N',
  N: 'S',
  W: 'E',
  E: 'W'
}

const arePipesConnected = (current: string, next: string, direction: Direction) => {
  const conA = connections[current]
  const conB = connections[next]
  const result = conA.includes(direction) && conB?.includes(opposites[direction])
  return result
}

const findLoop = (grid: string[][], start: Coordinates) => {
  const getSymbol = ({ x, y }: Coordinates) => grid[y][x]

  const visited: Record<string, boolean> = {}
  const toVisit = [start]

  const maxX = grid[0].length
  const maxY = grid.length

  while (toVisit.length) {
    const node = toVisit.pop()
    if (!node) throw new Error('Invalid loop')

    visited[serializeCoords(node)] = true

    const newNodes = get4Directions(node)
      .filter(({ coord: { x, y } }) => x >= 0 && x < maxX && y >= 0 && y < maxY)
      .filter(d => !visited[serializeCoords(d.coord)])
      .filter(d => arePipesConnected(
        getSymbol(node),
        getSymbol(d.coord),
        d.direction
      ))

    toVisit.push(...newNodes.map(n => n.coord))
  }
  return visited
}

const solve = (input: string) => {
  const { grid, start } = parse(input)

  const getSymbol = (c: string) => {
    const { y, x } = parseCoords(c)
    return grid[y][x]
  }

  const loop = Object.keys(findLoop(grid, start)).map(getSymbol)
  const result = (loop.length / 2) + (loop.length % 2)
  return result
}

expect(solve(testData)).to.equal(4)
expect(solve(testData2)).to.equal(8)
expect(solve(taskInput)).to.equal(6701)

// Part 2

const floodFill = (grid: string[][], blocked: Record<string, boolean>, start = { x: 0, y: 0 }) => {
  const visited: Record<string, boolean> = {}
  const toVisit = [start]

  const maxX = grid[0].length
  const maxY = grid.length

  while (toVisit.length) {
    const node = toVisit.pop()
    if (!node) throw new Error('Invalid loop')

    visited[serializeCoords(node)] = true

    const newNodes = get4Directions(node)
      .filter(({ coord: { x, y } }) => x >= 0 && x < maxX && y >= 0 && y < maxY)
      .filter(d => !visited[serializeCoords(d.coord)] && !blocked[serializeCoords(d.coord)])

    toVisit.push(...newNodes.map(n => n.coord))
  }

  return visited
}

const solve2 = (input: string) => {
  const { grid, start } = parse(input)

  const visited = findLoop(grid, start)
  const floodFillted = floodFill(grid, visited)

  const innerItems: Coordinates[] = []
  grid.forEach((row, y) => row.forEach((symbol, x) => {
    if (
      !floodFillted[serializeCoords({ y, x })] &&
        !visited[serializeCoords({ y, x })]
    ) {
      innerItems.push({ x, y })
    }
  }))

  //   const visualized = grid.map((row, y) => row.map((symbol, x) => {
  //     if (innerItems.find(i => sameCoords(i, { y, x }))) return '1'
  //     return ' '
  //   })).map(row => row.join('')).join('\n')
  //   writeFileSync(resolve(__dirname, 'temp.txt'), visualized, 'utf-8')

  let toVisit = innerItems
  const sections: Array<{ start: Coordinates, size: number }> = []

  while (toVisit.length) {
    const node = toVisit.pop()
    if (!node) throw new Error('Invalid loop')
    const section = Object.keys(floodFill(grid, visited, node))
    const sectionCoords = section.map(parseCoords)
    sections.push({ start: sectionCoords[0], size: section.length })
    toVisit = toVisit.filter(c => !sectionCoords.find(sc => sameCoords(sc, c)))
  }

  const isEnclosed = (start: Coordinates) => {
    const line = grid[start.y]
      .slice(0, start.x)
      .filter((symbol, x) => visited[serializeCoords({ x, y: start.y })])
      .join('')

    const oneDirectionPipeCount = line
      .replaceAll('-', '')
      .replaceAll('.', '')
      .replaceAll('FJ', '|')
      .replaceAll('L7', '|')
      .split('')
      .filter(i => i === '|')
      .length

    return oneDirectionPipeCount % 2 === 1
  }

  const enclosed = sections
    .filter(section => isEnclosed(section.start))
    .map(section => section.size)

  return sum(enclosed)
}

expect(solve2(testData3)).to.equal(4)
expect(solve2(testData4)).to.equal(4)
expect(solve2(testData5)).to.equal(8)
expect(solve2(testData6)).to.equal(10)
expect(solve2(taskInput)).to.equal(303)

// npx ts-node 2023/10/index.ts
