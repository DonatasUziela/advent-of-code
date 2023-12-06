import { expect } from 'chai'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')

const parse = (input: string) => {
  const [times = [], distances = []] = input
    .split('\r\n')
    .map(l => l.split(':').pop())
    .map(l => l?.split(' '))
    .map(l => l?.filter(n => n))
    .map(l => l?.map(n => parseInt(n, 10)))

  return times.map((time, i) => ({ time, record: distances[i] }))
}

const getAllPossibleDistances = (time: number) => {
  const distances: number[] = []
  for (let timePressingButton = 1; timePressingButton <= time; timePressingButton++) {
    const remainingTime = time - timePressingButton
    const speed = timePressingButton
    const distance = speed * remainingTime
    distances.push(distance)
  }
  return distances
}

const solve = (input: string) => {
  const races = parse(input)
  const distancesPerRace = races.map(({ time }) => getAllPossibleDistances(time))

  const winningDistancesCounts = distancesPerRace
    .map((distances, raceIndex) =>
      distances.filter(d => d > races[raceIndex].record).length)

  return winningDistancesCounts.reduce((acc, c) => acc * c, 1)
}

expect(solve(testData)).to.equal(288)
expect(solve(taskInput)).to.equal(227850)

// Part 2

const parse2 = (input: string) => {
  const [time, record] = input
    .split('\r\n')
    .map(l => l.split(':').pop())
    .map(l => l?.replaceAll(' ', ''))
    .map(n => parseInt(n!, 10))

  return { time, record }
}

const solve2 = (input: string) => {
  const race = parse2(input)
  const distances = getAllPossibleDistances(race.time)
  const amountOfWinningRaces = distances.filter(d => d > race.record).length
  return amountOfWinningRaces
}

expect(solve2(testData)).to.equal(71503)
expect(solve2(taskInput)).to.equal(42948149)

// npx ts-node 2023/6/index.ts
