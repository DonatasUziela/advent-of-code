import { expect } from 'chai'
import { readFileSync } from 'fs'
import { sum } from 'lodash'
import { resolve } from 'path'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')

const hash = (str: string): number => {
  let curr = 0
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i)
    curr += charCode
    curr *= 17
    curr = curr % 256
  }
  return curr
}

expect(hash('HASH')).to.equal(52)

const parse = (input: string): string[] =>
  input.split(',')

const solve = (input: string) => {
  const parsed = parse(input)
  const hashes = parsed.map(hash)
  return sum(hashes)
}

expect(solve(testData)).to.equal(1320)
expect(solve(taskInput)).to.equal(514025)

// Part 2

interface Lense {
  label: string
  focalLength: number
}

const solve2 = (input: string) => {
  const parsed = parse(input)
  const steps = parsed.map(item => {
    if (item[item.length - 1] === '-') {
      const [label] = item.split('-')
      return {
        box: hash(label),
        label
      }
    }

    const [label, focalLengthString] = item.split('=')
    return {
      box: hash(label),
      label,
      focalLength: Number(focalLengthString)
    }
  })
  const boxes: Record<number, Lense[]> = {}
  for (const { box, focalLength, label } of steps) {
    if (!focalLength) {
      if (boxes[box]) {
        boxes[box] = boxes[box].filter(l => l.label !== label)
      }
      continue
    }

    const content = (boxes[box] || [])
    const found = content.find(l => l.label === label)
    if (found) {
      found.focalLength = focalLength
      continue
    }

    boxes[box] = content.concat({ label, focalLength })
  }

  let sum = 0
  for (const [boxString, lenses] of Object.entries(boxes)) {
    const box = Number(boxString)
    lenses.forEach(({ focalLength }, index) => {
      const lenseNumber = index + 1
      const focusingPower = (box + 1) * lenseNumber * focalLength
      sum += focusingPower
    })
  }

  return sum
}

expect(solve2(testData)).to.equal(145)
expect(solve2(taskInput)).to.equal(244461)

// npx ts-node 2023/15/index.ts
