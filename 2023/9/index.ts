import { expect } from 'chai'
import { readFileSync } from 'fs'
import { sum } from 'lodash'
import { resolve } from 'path'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')

const parse = (input: string) =>
  input.split('\n').map(l => l.split(' ').map(n => parseInt(n)))

const findDiffLine = (line: number[]): number[] => {
  const diffLine = []

  for (let i = 0; i < line.length - 1; i++) {
    const diff = line[i + 1] - line[i]
    diffLine.push(diff)
  }

  return diffLine
}

const generateDiffLines = (line: number[]): number[][] => {
  const result = [line]
  let current = line

  while (!current.every(n => n === 0)) {
    const diffLine = findDiffLine(current)
    result.push(diffLine)
    current = diffLine
  }

  current.push(0)

  return result
}

const extrapolate = (diffLines: number[][]) => {
  return sum(diffLines.map(l => l[l.length - 1]))
}

const solve = (input: string) => {
  const lines = parse(input)

  const listOfDiffLines = lines.map(generateDiffLines)

  return sum(listOfDiffLines.map(extrapolate))
}

expect(solve(testData)).to.equal(114)
expect(solve(taskInput)).to.equal(1757008019)

// Part 2

const extrapolate2 = (diffLines: number[][]) => {
  for (let lineIndex = diffLines.length - 2; lineIndex >= 0; lineIndex--) {
    const line = diffLines[lineIndex]
    const lineBelow = diffLines[lineIndex + 1]
    // Formula: line[0] - x  = lineBelow[0]
    const x = line[0] - lineBelow[0]
    line.unshift(x)
  }
  const firstNumber = diffLines[0][0]

  return firstNumber
}

const solve2 = (input: string) => {
  const lines = parse(input)

  const listOfDiffLines = lines.map(generateDiffLines)

  return sum(listOfDiffLines.map(extrapolate2))
}

expect(solve2(testData)).to.equal(2)
expect(solve2(taskInput)).to.equal(995)

// npx ts-node 2023/9/index.ts
