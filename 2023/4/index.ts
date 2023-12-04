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

const parse = (input: string): Card[] => {
  const cards = input
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

  return cards
}

const solve = (input: string) => {
  const parsed = parse(input)
  const myWinningNumbers = parsed
    .map(({ cardNumbers, winningNumbers }) => cardNumbers
      .filter(n => winningNumbers.includes(n)))
  const points = myWinningNumbers.map(n => n.length ? Math.pow(2, n.length - 1) : 0)

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
      winners: cardNumbers.filter(n => winningNumbers.includes(n)).length
    }))

  const cardCounts: Record<number, number | undefined> = {}

  const increment = (index: number) => {
    cardCounts[index] = (cardCounts[index] ?? 0) + 1
  }

  originalCards.forEach(({ index, winners }) => {
    increment(index)
    const copies = cardCounts[index] ?? 0

    console.log({ index, copies, winners })
    for (let c = 0; c < copies; c++) {
      for (let i = 1; i <= winners; i++) {
        const wonCardIndex = index + i
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
