import { expect } from 'chai'
import { readFileSync } from 'fs'
import { sum } from 'lodash'
import { resolve } from 'path'
import { type Coordinates, serializeCoords, get8Directions, west, parseCoords, sameCoords } from 'utils/coordinates'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')

const generateNumberCoords = (numberText: string, end: Coordinates) => {
  const result = [end]

  for (let i = 1; i < numberText.length; i++) {
    result.push(west(result[result.length - 1]))
  }

  return result
}

const parse = (input: string) => {
  const numbers: Array<{ text: string, coords: Coordinates[] }> = []
  const symbols: Record<string, string> = {}
  const lines = input.split('\r\n')

  lines.forEach((line, y) => {
    let numberText = ''

    const closeNumber = (coords: Coordinates) => {
      if (!numberText) return

      numbers.push({
        text: numberText,
        coords: generateNumberCoords(numberText, coords)
      })

      numberText = ''
    }

    line.split('').forEach((symbol, x) => {
      if (isNaN(parseInt(symbol, 10))) {
        if (symbol !== '.') {
          symbols[serializeCoords({ x, y })] = symbol
        }

        closeNumber({ x: x - 1, y })
      } else {
        numberText += symbol
      }
    })

    closeNumber({ x: line.length - 1, y })
  })

  return {
    numbers,
    symbols
  }
}

const solve = (input: string) => {
  const { numbers, symbols } = parse(input)
  const numbersWithSymbolNearby = numbers.filter(({ coords }) =>
    coords.some(coord =>
      get8Directions(coord).some(d =>
        symbols[serializeCoords(d)])))

  const result = numbersWithSymbolNearby.map(({ text }) => parseInt(text, 10))
  return sum(result)
}

expect(solve(testData)).to.equal(4361)
expect(solve(taskInput)).to.equal(539590)

// Part 2

interface Gear {
  coords: string
  adjacentNumbers: number[]
}

const solve2 = (input: string) => {
  const { numbers, symbols } = parse(input)
  const gears = Object.entries(symbols).reduce<Gear[]>((acc, [coords, symbol]) => {
    if (symbol !== '*') return acc

    const allDirections = get8Directions(parseCoords(coords))

    const adjacentNumbers = numbers.filter(({ coords }) =>
      coords.some(c =>
        allDirections.some(d =>
          sameCoords(c, d))))

    if (adjacentNumbers.length !== 2) return acc

    acc.push({
      coords,
      adjacentNumbers: adjacentNumbers.map(n => Number(n.text))
    })
    return acc
  }, [])

  const gearRatios = gears.map(({ adjacentNumbers: [first, second] }) => first * second)
  return sum(gearRatios)
}

expect(solve2(testData)).to.equal(467835)
expect(solve2(taskInput)).to.equal(80703636)

// npx ts-node 2023/3/index.ts
