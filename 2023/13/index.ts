import { expect } from 'chai'
import { readFileSync } from 'fs'
import { sum, cloneDeep } from 'lodash'
import { resolve } from 'path'
import { isDefined } from 'utils/isDefined'
import { transpose } from 'utils/transpose'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')

const parse = (input: string): string[][][] =>
  input
    .split('\n\n')
    .map(block => block
      .split('\n')
      .map(line => line
        .split('')))

const findEvenLineIndexes = (pattern: string[][]): number[] => {
  const lines = pattern.map(l => l.join(''))
  const evenLineIndexes = []
  for (let index = 0; index < lines.length - 1; index++) {
    if (lines[index] === lines[index + 1]) {
      evenLineIndexes.push(index)
    }
  }
  return evenLineIndexes
}

const checkIfPerfectRowReflections = (pattern: string[][], rowStart: number) => {
  const lines = pattern.map(l => l.join(''))
  const top = lines.slice(0, rowStart + 1).reverse()
  const bottom = lines.slice(rowStart + 1)
  const len = Math.min(top.length, bottom.length)
  const str1 = top.slice(0, len).join('\n')
  const str2 = bottom.slice(0, len).join('\n')
  return str1 === str2
}

const lookForPerfectRowReflection = (pattern: string[][], excludeIndex = -1) => {
  const evenLineIndexes = findEvenLineIndexes(pattern)
  const reflections = evenLineIndexes.map(index => ({
    index,
    isPerfectReflection: checkIfPerfectRowReflections(pattern, index)
  }))
  return reflections
    .filter(r => r.index !== excludeIndex)
    .find(r => r.isPerfectReflection)
}
const lookForPerfectColumnReflection = (pattern: string[][], exclude?: number) => {
  const transposed = transpose(pattern)
  return lookForPerfectRowReflection(transposed, exclude)
}

const solve = (input: string) => {
  const patterns = parse(input)

  const rowReflections = patterns.map(p => lookForPerfectRowReflection(p)).map(r => r?.index)
  const columnReflections = patterns.map(p => lookForPerfectColumnReflection(p)).map(r => r?.index)

  const horizontalReflectionRowIndexes = rowReflections.filter(isDefined)
  const verticalReflectionColumnIndexes = columnReflections.filter(isDefined)
  const rowsAboveCount = horizontalReflectionRowIndexes.map(n => n + 1)
  const columnsToTheLeft = verticalReflectionColumnIndexes.map(n => n + 1)

  return sum(rowsAboveCount.map(n => n * 100)) + sum(columnsToTheLeft)
}

expect(solve(testData)).to.equal(405)
expect(solve(taskInput)).to.equal(27664)

// Part 2

const cleanSmudge: Record<string, string> = {
  '#': '.',
  '.': '#'
}

const solve2 = (input: string) => {
  const patterns = parse(input)
  const adjustedReflections = patterns.map((pattern, patternIndex) => {
    const rowReflection = lookForPerfectRowReflection(pattern)
    const columnReflection = lookForPerfectColumnReflection(pattern)

    for (let l = 0; l < pattern.length; l++) {
      const line = pattern[l]
      for (let c = 0; c < line.length; c++) {
        const symbol = line[c]
        const newPattern = cloneDeep(pattern)
        newPattern[l][c] = cleanSmudge[symbol]

        const newRowReflection = lookForPerfectRowReflection(newPattern, rowReflection?.index)
        const newColumnReflection = lookForPerfectColumnReflection(newPattern, columnReflection?.index)

        const newResult = {
          rowReflection: newRowReflection,
          columnReflection: newColumnReflection,
          smudge: { l, c }
        }

        const a = isDefined(newRowReflection?.index)
        const b = isDefined(newColumnReflection?.index)
        const aChanged = newRowReflection?.index !== rowReflection?.index
        const bChanged = newColumnReflection?.index !== columnReflection?.index

        if ((a || b) && (aChanged || bChanged)) return newResult
      }
    }
    throw new Error(`did not find smudge for patternIndex: ${patternIndex}`)
  })

  const reflections = adjustedReflections
    .map(r => isDefined(r.rowReflection)
      ? { rowReflection: r.rowReflection }
      : { columnReflection: r.columnReflection })

  const rowReflections = reflections.map(r => r.rowReflection).filter(isDefined)
  const columnReflections = reflections.map(r => r.columnReflection).filter(isDefined)

  const rowReflectionIndexes = rowReflections.map(r => r.index)
  const columnReflectionIndexes = columnReflections.map(r => r.index)
  const rowsAboveCount = rowReflectionIndexes.map(n => n + 1)
  const columnsToTheLeft = columnReflectionIndexes.map(n => n + 1)

  return sum(rowsAboveCount.map(n => n * 100)) + sum(columnsToTheLeft)
}

expect(solve2(testData)).to.equal(400)
expect(solve2(taskInput)).to.equal(33991)

// npx ts-node 2023/13/index.ts
