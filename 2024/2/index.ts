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

const solve = (input: string) => {
  const reports = parse(input)

  const safeIndexes: number[] = []

  reports.forEach((report, reportIndex) => {
    if (report.length < 2) {
      throw new Error('very short report')
    }

    const sign = Math.sign(report[0] - report[1])
    if (sign === 0) {
      return
    }

    for (let i = 0; i < report.length - 1; i++) {
      const a = report[i]
      const b = report[i + 1]
      const diff = a - b
      const diffSign = Math.sign(diff)

      if (diffSign === 0) {
        console.log({ report, a, b, diffSign })
        return
      }

      if (diffSign !== sign) {
        console.log({ report, a, b, diffSign, sign })
        return
      }

      if (Math.abs(diff) > 3) {
        console.log({ report, a, b, diff })
        return
      }

      if (Math.abs(diff) < 1) {
        console.log({ report, a, b, diff })
        return
      }
    }
    safeIndexes.push(reportIndex)
  })

  return safeIndexes.length
}

expect(solve(testData)).to.equal(2)
expect(solve(taskInput)).to.equal(2)

// Part 2

const solve2 = (input: string) => {
}

expect(solve2(testData)).to.equal(undefined)
expect(solve2(taskInput)).to.equal(undefined)

// npx ts-node 2024/2/index.ts
