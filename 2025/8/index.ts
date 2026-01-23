import { expect } from 'chai'
import { readFileSync } from 'fs'
import { multiply, uniq } from 'lodash'
import { resolve } from 'path'
import { distance, serializeCoords } from 'utils/coordinates3d'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')

const parse = (input: string) =>
  input
    .split('\n')
    .map(line => line.split(',').map(Number))

const countAllDistances = (jukeboxes: number[][]) => {
  const distances = []
  for (let i = 0; i < jukeboxes.length - 1; i++) {
    for (let j = i + 1; j < jukeboxes.length; j++) {
      distances.push({
        d: distance(jukeboxes[i], jukeboxes[j]),
        a: jukeboxes[i],
        b: jukeboxes[j]
      })
    }
  }
  return distances
}

const solve = (input: string, count: number) => {
  const jukeboxes = parse(input)

  // count all distances
  const distances = countAllDistances(jukeboxes)

  const circuitByJukebox: Record<string, number> = {}
  for (let i = 0; i < jukeboxes.length; i++) {
    circuitByJukebox[serializeCoords(jukeboxes[i])] = i
  }

  // connect `count` shortest distances
  distances.sort((a, b) => a.d - b.d)
  for (let i = 0; i < count; i++) {
    const { a, b } = distances[i]
    const circuitA = circuitByJukebox[serializeCoords(a)]
    const circuitB = circuitByJukebox[serializeCoords(b)]
    const allJukeboxesInA = Object.keys(circuitByJukebox).filter(c => circuitByJukebox[c] === circuitA)
    for (const j of allJukeboxesInA) {
      circuitByJukebox[j] = circuitB
    }
  }

  // count circuit sizes
  const circuitSizes: Record<number, number> = {}
  Object.keys(circuitByJukebox).forEach((j) => {
    const circuit = circuitByJukebox[j]
    circuitSizes[circuit] = (circuitSizes[circuit] || 0) + 1
  })

  // multiply top 3
  const result = Object.values(circuitSizes)
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce(multiply)

  return result
}

expect(solve(testData, 10)).to.equal(40)
expect(solve(taskInput, 1000)).to.equal(54600)

// Part 2

const solve2 = (input: string) => {
  const jukeboxes = parse(input)

  const distances = countAllDistances(jukeboxes)

  const circuitByJukebox: Record<string, number> = {}
  for (let i = 0; i < jukeboxes.length; i++) {
    circuitByJukebox[serializeCoords(jukeboxes[i])] = i
  }

  // connect shortest distances while all connected to single circuit
  distances.sort((a, b) => a.d - b.d)
  let i = 0
  while (uniq(Object.values(circuitByJukebox)).length !== 1) {
    const { a, b } = distances[i]
    const circuitA = circuitByJukebox[serializeCoords(a)]
    const circuitB = circuitByJukebox[serializeCoords(b)]
    const allJukeboxesInA = Object.keys(circuitByJukebox).filter(c => circuitByJukebox[c] === circuitA)
    for (const j of allJukeboxesInA) {
      circuitByJukebox[j] = circuitB
    }
    i++
  }
  const lastConnected = distances[i - 1]
  return lastConnected.a[0] * lastConnected.b[0]
}

expect(solve2(testData)).to.equal(25272)
expect(solve2(taskInput)).to.equal(107256172)

// npx ts-node 2025/5/index.ts
