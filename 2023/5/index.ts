import { expect } from 'chai'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')

interface ResourcesMap {
  destination: number
  source: number
  length: number
}
type ResourcesMapsByType = ResourcesMap[][]

const parse = (input: string) => {
  const sections = input
    .split('---')
    .map(i => i
      .split('\r\n')
      .filter(i => i)
    )

  const seeds = sections[0][0]
    .split(':')[1]
    .split(' ')
    .filter(s => s)
    .map(s => parseInt(s, 10))

  const maps: ResourcesMapsByType = sections
    .slice(1)
    .map(section => section
      .slice(1)
      .map(map =>
        map
          .split(' ')
          .map(n => parseInt(n, 10))
      )
      .map(s => ({
        destination: s[0],
        source: s[1],
        length: s[2]
      }))
    )

  return { maps, seeds }
}

const mapSeedToLocation = (seed: number, mapsByType: ResourcesMapsByType) => {
  let current = seed

  for (let typeIndex = 0; typeIndex < mapsByType.length; typeIndex++) {
    const maps = mapsByType[typeIndex]

    for (let mapIndex = 0; mapIndex < maps.length; mapIndex++) {
      const { source, destination, length } = maps[mapIndex]

      if (source <= current && current <= source + length - 1) {
        current = destination + (current - source)
        break
      }
    }
  }

  return current
}

const solve = (input: string) => {
  const { seeds, maps } = parse(input)

  const locations = seeds.map(seed => mapSeedToLocation(seed, maps))

  return Math.min(...locations)
}

expect(solve(testData)).to.equal(35)
expect(solve(taskInput)).to.equal(57075758)

// Part 2

const solve2 = (input: string) => {
  const { seeds, maps } = parse(input)

  let lowestLocation = Number.MAX_SAFE_INTEGER
  for (let pairIndex = 0; pairIndex < seeds.length; pairIndex += 2) {
    const start = seeds[pairIndex]
    const length = seeds[pairIndex + 1]
    console.log({ start, length })
    for (let seed = start; seed < start + length; seed++) {
      const location = mapSeedToLocation(seed, maps)
      lowestLocation = Math.min(location, lowestLocation)
    }
  }
  return lowestLocation
}

expect(solve2(testData)).to.equal(46)
expect(solve2(taskInput)).to.equal(31161857)

// npx ts-node 2023/5/index.ts
