import { expect } from 'chai'
import { readFileSync } from 'fs'
import { sum } from 'lodash'
import { resolve } from 'path'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')

interface Rule {
  before: string
  after: string
}

const parse = (input: string) => {
  const [rulesString, updatesString] = input
    .split('\n\n')

  return {
    rules: rulesString.split('\n').map(r => ({
      before: r.split('|')[0],
      after: r.split('|')[1]
    })),
    updates: updatesString.split('\n').map(u => u.split(','))
  }
}

const isUpdateInRightOrder = (update: string[], rules: Rule[]) => {
  const isNumberInRightOrder = (i: number) => {
    const current = update[i]

    const numbersBefore = update.slice(0, i)
    for (const n of numbersBefore) {
      for (const rule of rules) {
        if (rule.after === n && rule.before === current) return false
      }
    }

    const numbersAfter = update.slice(i + 1)
    for (const n of numbersAfter) {
      for (const rule of rules) {
        if (rule.before === n && rule.after === current) return false
      }
    }

    return true
  }

  for (let i = 0; i < update.length; i++) {
    if (!isNumberInRightOrder(i)) return false
  }

  return true
}

const solve = (input: string) => {
  const { rules, updates } = parse(input)

  return sum(updates
    .filter(u => isUpdateInRightOrder(u, rules))
    .map(u => u[(u.length - 1) / 2])
    .map(n => Number(n)))
}

expect(solve(testData)).to.equal(143)
expect(solve(taskInput)).to.equal(6034)

// Part 2

const solve2 = (input: string) => {
}

expect(solve2(testData)).to.equal(undefined)
expect(solve2(taskInput)).to.equal(undefined)

// npx ts-node 2024/5/index.ts
