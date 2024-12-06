import { expect } from 'chai'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')

const parse = (input: string) =>
  input
    .split('\n')
    .map(line => line.split(' '))
    .map(l => l.map(s => parseInt(s, 10)))

const isSafe = (report: number[]): boolean => {
  if (report.length < 2) {
    throw new Error('very short report')
  }

  const sign = Math.sign(report[0] - report[1])

  for (let i = 0; i < report.length - 1; i++) {
    const a = report[i]
    const b = report[i + 1]
    const diff = a - b
    const diffSign = Math.sign(diff)

    if (diffSign === 0 || diffSign !== sign || Math.abs(diff) > 3 || Math.abs(diff) < 1) {
      return false
    }
  }
  return true
}

const solve = (input: string) => {
  const reports = parse(input)

  const safeIndexes: number[] = []

  reports.forEach((report, reportIndex) => {
    if (isSafe(report)) {
      safeIndexes.push(reportIndex)
    }
  })

  return safeIndexes.length
}

expect(solve(testData)).to.equal(2)
expect(solve(taskInput)).to.equal(334)

// Part 2

const generateAlternativeReports = (report: number[]) => {
  const result: number[][] = []
  for (let i = 0; i < report.length; i++) {
    result.push([
      ...report.slice(0, i),
      ...report.slice(i + 1)
    ])
  }
  return result
}

const solve2 = (input: string) => {
  const reports = parse(input)

  const safeIndexes: number[] = []

  reports.forEach((report, reportIndex) => {
    if (isSafe(report)) {
      safeIndexes.push(reportIndex)
    } else {
      const alternativeReports = generateAlternativeReports(report)
      if (alternativeReports.some(isSafe)) {
        safeIndexes.push(reportIndex)
      }
    }
  })

  return safeIndexes.length
}

expect(solve2(testData)).to.equal(4)
expect(solve2(taskInput)).to.equal(undefined)

// npx ts-node 2024/2/index.ts
