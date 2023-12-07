import { expect } from 'chai'
import { readFileSync } from 'fs'
import { isEqual, groupBy, sum } from 'lodash'
import { resolve } from 'path'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')

enum HandType {
  HighCard = 'HighCard',
  Pair = 'Pair',
  TwoPair = 'Two pair',
  ThreeOfAKind = 'ThreeOfAKind',
  FullHouse = 'FullHouse',
  FourOfAKind = 'FourOfAKind',
  FiveOfAKind = 'FiveOfAKind',
}

const handTypesOrderedByStrength = Object.values(HandType)

const parse = (input: string) => input
  .split('\r\n')
  .map(l => l.split(' '))
  .map(([handString, bidString]) => ({
    hand: handString.split(''),
    bid: parseInt(bidString)
  }))

const getHandType = (counts: number[]) => {
  if (isEqual(counts, [5])) return HandType.FiveOfAKind
  if (isEqual(counts, [4, 1])) return HandType.FourOfAKind
  if (isEqual(counts, [3, 2])) return HandType.FullHouse
  if (isEqual(counts, [3, 1, 1])) return HandType.ThreeOfAKind
  if (isEqual(counts, [2, 2, 1])) return HandType.TwoPair
  if (isEqual(counts, [2, 1, 1, 1])) return HandType.Pair
  if (isEqual(counts, [1, 1, 1, 1, 1])) return HandType.HighCard

  throw new Error(`unknown hand type counts: ${JSON.stringify(counts)}`)
}

const valueByCard: Record<string, number> = {
  T: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14
}

const getCardCountsMap = (hand: string[]) => {
  const cardCountsMap: Record<string, number> = {}

  for (const card of hand) {
    cardCountsMap[card] = (cardCountsMap[card] || 0) + 1
  }

  return cardCountsMap
}

const getCardCounts = (hand: string[]) => {
  const cardCountsMap = getCardCountsMap(hand)
  return Object.values(cardCountsMap).sort((a, b) => b - a)
}

const orderGamesByHandStrength = <T extends { handType: HandType, values: number[] }>(games: T[]): T[] => {
  const byHandType = groupBy(games, 'handType')

  const gamesOrderedByStrength: T[] = []

  for (const handType of handTypesOrderedByStrength) {
    const hands = byHandType[handType]

    if (!hands) continue

    const orderedByValues = hands.slice().sort((a, b) => {
      for (let i = 0; i < a.values.length; i++) {
        if (a.values[i] > b.values[i]) return 1
        if (a.values[i] < b.values[i]) return -1
      }
      throw new Error('Even hands!')
    })

    gamesOrderedByStrength.push(...orderedByValues)
  }

  return gamesOrderedByStrength
}

const solve = (input: string) => {
  const games = parse(input).map((game) => {
    const cardCounts = getCardCounts(game.hand)
    return {
      ...game,
      handType: getHandType(cardCounts),
      values: game.hand.map(card => parseInt(card, 10) || valueByCard[card])
    }
  })

  const orderedGames = orderGamesByHandStrength(games)

  const winnings = orderedGames.map(({ bid }, index) => {
    const rank = index + 1
    return bid * rank
  })

  return sum(winnings)
}

expect(solve(testData)).to.equal(6440)
expect(solve(taskInput)).to.equal(250058342)

// Part 2

const valueByCard2: Record<string, number> = {
  T: 10,
  J: 1,
  Q: 12,
  K: 13,
  A: 14
}

const improveHandWithJoker = (hand: string[]) => {
  const nonJokerCards = hand.filter(c => c !== 'J')

  if (nonJokerCards.length === 5 || nonJokerCards.length === 0) return hand

  const cardCountsMap = getCardCountsMap(nonJokerCards)

  let cardWithTheHighestCount = nonJokerCards[0]
  for (const card of nonJokerCards) {
    if (cardCountsMap[card] > cardCountsMap[cardWithTheHighestCount]) {
      cardWithTheHighestCount = card
    }
  }

  const handWithJokerReplacedAsHighestCard = hand
    .join('')
    .replaceAll('J', cardWithTheHighestCount)
    .split('')

  return handWithJokerReplacedAsHighestCard
}

const solve2 = (input: string) => {
  const games = parse(input).map((game) => {
    const improvedHand = improveHandWithJoker(game.hand)

    const cardCounts = getCardCounts(improvedHand)

    return {
      ...game,
      handType: getHandType(cardCounts),
      values: game.hand.map(card => parseInt(card, 10) || valueByCard2[card])
    }
  })

  const orderedGames = orderGamesByHandStrength(games)

  const winnings = orderedGames.map(({ bid }, index) => {
    const rank = index + 1
    return bid * rank
  })

  return sum(winnings)
}

expect(solve2(testData)).to.equal(5905)
expect(solve2(taskInput)).to.equal(250506580)

// npx ts-node 2023/7/index.ts
