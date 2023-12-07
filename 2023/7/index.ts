import { expect } from 'chai'
import { readFileSync } from 'fs'
import { isEqual, groupBy, sum } from 'lodash'
import { resolve } from 'path'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')

const parse = (input: string) => input
  .split('\r\n')
  .map(l => l.split(' '))
  .map(([handString, bidString]) => ({
    hand: handString.split(''),
    bid: parseInt(bidString)
  }))

enum HandType {
  FiveOfAKind = 'FiveOfAKind',
  FourOfAKind = 'FourOfAKind',
  FullHouse = 'FullHouse',
  ThreeOfAKind = 'ThreeOfAKind',
  TwoPair = 'Two pair',
  Pair = 'Pair',
  HighCard = 'HighCard'
}

const allHandTypes = [
  {
    handType: HandType.FiveOfAKind,
    checkCounts: (counts: number[]) => isEqual(counts, [5])
  },
  {
    handType: HandType.FourOfAKind,
    checkCounts: (counts: number[]) => isEqual(counts, [4, 1])
  },
  {
    handType: HandType.FullHouse,
    checkCounts: (counts: number[]) => isEqual(counts, [3, 2])

  },
  {
    handType: HandType.ThreeOfAKind,
    checkCounts: (counts: number[]) => isEqual(counts, [3, 1, 1])
  },
  {
    handType: HandType.TwoPair,
    checkCounts: (counts: number[]) => isEqual(counts, [2, 2, 1])
  },
  {
    handType: HandType.Pair,
    checkCounts: (counts: number[]) => isEqual(counts, [2, 1, 1, 1])

  },
  {
    handType: HandType.HighCard,
    checkCounts: (counts: number[]) => isEqual(counts, [1, 1, 1, 1, 1])
  }
]

const handValues: Record<string, number> = {
  T: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14
}

const solve = (input: string) => {
  const parsed = parse(input)
  const cardCounts = parsed
    .map(({ hand, bid }) => {
      const cardCountsMap: Record<string, number> = {}

      for (const card of hand) {
        cardCountsMap[card] = (cardCountsMap[card] || 0) + 1
      }

      return {
        hand,
        bid,
        // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
        cardCounts: Object.values(cardCountsMap).sort().reverse()
      }
    })

  const handTypes = cardCounts
    .map(({ hand, cardCounts, bid }) => {
      for (const { checkCounts, handType } of allHandTypes) {
        if (checkCounts(cardCounts)) {
          return {
            hand,
            bid,
            handType
          }
        }
      }
      throw new Error(`unknown hand type ${JSON.stringify(hand)} counts: ${JSON.stringify(cardCounts)}`)
    })

  const handsMappedToValues = handTypes
    .map(({ hand, ...rest }) => ({
      values: hand.map(c => parseInt(c, 10) || handValues[c]),
      hand,
      ...rest
    }))

  const byHandType = groupBy(handsMappedToValues, 'handType')

  const handTypeOrder = [
    HandType.HighCard,
    HandType.Pair,
    HandType.TwoPair,
    HandType.ThreeOfAKind,
    HandType.FullHouse,
    HandType.FourOfAKind,
    HandType.FiveOfAKind
  ]

  const orderedByHandTypeAndValues = []

  for (const handType of handTypeOrder) {
    const hands = byHandType[handType]
    if (!hands) continue
    const sorted = hands.slice()
      .sort((a, b) => {
        for (let i = 0; i < a.values.length; i++) {
          if (a.values[i] > b.values[i]) return 1
          if (a.values[i] < b.values[i]) return -1
        }
        throw new Error('Even hands!')
      })
    orderedByHandTypeAndValues.push(...sorted)
  }

  const winnings = orderedByHandTypeAndValues.map(({ bid }, index) => {
    const rank = index + 1
    return bid * rank
  })

  return sum(winnings)
}

expect(solve(testData)).to.equal(6440)
expect(solve(taskInput)).to.equal(250058342)

// Part 2

const solve2 = (input: string) => {
}

expect(solve2(testData)).to.equal(undefined)
expect(solve2(taskInput)).to.equal(undefined)

// npx ts-node 2023/7/index.ts
