import { expect } from 'chai'
import { readFileSync } from 'fs'
import { sum, multiply } from 'lodash'
import { resolve } from 'path'
import { transpose } from 'utils/transpose'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')

interface Problem {
  numbers: number[]
  operator?: string
}

const parse = (input: string) => {
  const parsed = input
    .split('\n')
    .map(line => line.trim().split(/\s+/))

  return transpose(parsed).map(l => ({
    operator: l.pop(),
    numbers: l.map(Number)
  }))
}

const calculateProblems = (problems: Problem[]) => {
  const result = problems.reduce((acc, curr) => {
    if (curr.operator === '+') return acc + sum(curr.numbers)
    return acc + curr.numbers.reduce(multiply)
  }, 0)
  return result
}

const solve = (input: string) => {
  const problems = parse(input)
  return calculateProblems(problems)
}

expect(solve(testData)).to.equal(4277556)
expect(solve(taskInput)).to.equal(5316572080628)

// Part 2

const parse2 = (input: string) => {
  const lines = input.split('\n')
  return {
    operatorLine: lines.pop()?.split(''),
    numbersGrid: lines.map(l => l.split(''))
  }
}

const solve2 = (input: string, columnLength: number) => {
  const { operatorLine, numbersGrid } = parse2(input)

  if (!operatorLine) throw new Error('bad parsing')

  const problems: Problem[] = []
  for (let i = 0; i < operatorLine.length; i++) {
    const char = operatorLine[i]

    const numberColumn = []
    for (let j = 0; j < columnLength; j++) {
      numberColumn.push(numbersGrid[j][i])
    }
    const parsedNumber = parseInt(numberColumn.join(''), 10)

    if (char === '+' || char === '*') {
      problems.push({ operator: char, numbers: [parsedNumber] })
    }

    if (char === ' ') {
      if (isNaN(parsedNumber)) continue
      problems.at(-1)?.numbers.push(parsedNumber)
    }
  }

  return calculateProblems(problems)
}

expect(solve2(testData, 3)).to.equal(3263827)
expect(solve2(taskInput, 4)).to.equal(11299263623062)

// npx ts-node 2025/6/index.ts
