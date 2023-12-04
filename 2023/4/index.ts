import { expect } from 'chai'
import { readFileSync } from 'fs'
import { sum } from 'lodash'
import { resolve } from 'path'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')

interface Card {
  index: number
  cardNumbers: number[]
  winningNumbers: number[]
}

const parse = (input: string): Card[] => input
  .split('\r\n')
  .map(c => c.split(':').pop()!)
  .map(n => n.split('|'))
  .map(n => n.map(i => i
    .split(' ')
    .filter(s => s)
    .map(s => parseInt(s, 10))
  ))
  .map((p, index) => ({
    index: index + 1,
    winningNumbers: p[0],
    cardNumbers: p[1]
  }))

const solve = (input: string) => {
  const parsed = parse(input)

  const myWinningNumbers = parsed.map(({ cardNumbers, winningNumbers }) =>
    cardNumbers.filter(n =>
      winningNumbers.includes(n)))

  const points = myWinningNumbers.map(n =>
    n.length ? Math.pow(2, n.length - 1) : 0)

  return sum(points)
}

expect(solve(testData)).to.equal(13)
expect(solve(taskInput)).to.equal(22488)

// Part 2

const solve2 = (input: string) => {
  const parsed = parse(input)
  const originalCards = parsed
    .map(({ cardNumbers, winningNumbers, index }) => ({
      index,
      wonCardsCount: cardNumbers.filter(n => winningNumbers.includes(n)).length
    }))

  const cardCounts: Record<number, number | undefined> = {}

  const increment = (index: number) => {
    const newValue = (cardCounts[index] ?? 0) + 1
    cardCounts[index] = newValue
    return newValue
  }

  originalCards.forEach(({ index: originalCardIndex, wonCardsCount }) => {
    const copies = increment(originalCardIndex)

    for (let c = 0; c < copies; c++) {
      for (
        let wonCardIndex = originalCardIndex + 1;
        wonCardIndex <= originalCardIndex + wonCardsCount;
        wonCardIndex++
      ) {
        increment(wonCardIndex)
      }
    }
  })

  const result = originalCards.reduce((acc, { index }) => {
    return acc + (cardCounts[index] ?? 0)
  }, 0)

  return result
}

expect(solve2(testData)).to.equal(30)
expect(solve2(taskInput)).to.equal(7013204)

// npx ts-node 2023/4/index.ts
