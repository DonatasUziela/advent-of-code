import { expect } from 'chai'
import { readFileSync } from 'fs'
import { last, memoize, sum, uniq } from 'lodash'
import { resolve } from 'path'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')

interface RowData {
  row: string
  groups: number[]
}

const findAllMatches = (target: string, search: string) => {
  const result: number[] = []
  let current = target

  for (let i = 0; i < target.length; i++) {
    const index = current.indexOf(search)

    if (index === -1) return result

    result.push(index + i)
    current = current.slice(1)
    if (i > 100) console.log({ i })
  }

  return result
}

const findAllMatchesMemoized = memoize(findAllMatches, (target, search) => `${target}/${search}`)

const createDamagedSpringsString = (l: number) => {
  const result = []
  for (let i = 0; i < l; i++) {
    result.push('#')
  }
  return result.join('')
}

const createDamagedSpringsStringMemoized = memoize(createDamagedSpringsString)

const findMatchesForGroup = (group: number, row: string, originalRow: string, lastIndex: number) => {
  const groupStr = createDamagedSpringsStringMemoized(group)
  const targetRow = originalRow.replaceAll('?', '#')
  // console.log({ group, lastIndex })
  const matchIndexes = findAllMatchesMemoized(targetRow, groupStr).filter((index) => index > lastIndex)
  if (matchIndexes.length > 100) console.log({ len: matchIndexes })
  const validPlacements = []
  for (const matchIndex of matchIndexes) {
    if (lastIndex === matchIndex) throw new Error('oops')

    const sub = row.substring(0, matchIndex)
    const sub2 = row.substring(matchIndex + group)
    const replaced = sub + groupStr.replaceAll('#', '-') + sub2

    if (replaced.match('-#') ?? replaced.match('#-')) {
      continue
    }

    const replaced2 = replaced.replace('-?', '-.').replace('?-', '.-')
    validPlacements.push({ replaced: replaced2, index: matchIndex + group })
    if (validPlacements.length % 10000 === 0) console.log(validPlacements.length)
  }

  return validPlacements
}

const findMatches = ({ groups, row }: RowData, print: boolean): string[] => {
  let validPlacements = [{ replaced: row, index: -1 }]
  if (print) console.log('----', { row, groups })

  for (const group of groups) {
    validPlacements = validPlacements.flatMap(({ replaced, index }) => findMatchesForGroup(group, replaced, row, index))
    // if (print) console.log(validPlacements)
  }

  const uniqPlacements = uniq(validPlacements.map(p => p.replaced))
  const filterOutUnreplacedStuff = uniqPlacements.filter(p => !p.includes('#'))

  return filterOutUnreplacedStuff
}

const parse = (input: string) => input
  .split('\n')
  .map(line => line.split(' '))
  .map(([row, groups]) => ({
    row,
    groups: groups.split(',').map(Number)
  }))

const solve = (input: string, print = false) => {
  const rows = parse(input)

  const matchCounts = rows
    .map(row => findMatches(row, print))
    .map(matches => matches.length)

  // console.log({ matchCounts })

  return sum(matchCounts)
}

expect(solve('?###???????? 3,2,1')).to.equal(10)
expect(solve('?#?#?? 1,1')).to.equal(1)
expect(solve(testData)).to.equal(21)
expect(solve(taskInput, true)).to.equal(7541)

// Part 2

const unfoldAll = (rows: RowData[]) => rows.map(({ row, groups }) => ({
  row: [row, row, row, row, row].join('?'),
  groups: [...groups, ...groups, ...groups, ...groups, ...groups]
}))

// const unfoldTwice = (rows: RowData[]) => rows.map(({ row, groups }) => ({
//   row: [row, '?', row, '?'].join(''),
//   groups: [...groups, ...groups]
// }))

// const unfoldOnce = (rows: RowData[]) => rows.map(({ row, groups }) => ({
//   row: row + '?',
//   groups
// }))

const solve2 = (input: string, print = false) => {
  const rows = parse(input)
  const unfoldedRows = unfoldAll(rows)
  // const unfoldedRows1 = unfoldOnce(rows)
  // const unfoldedRows2 = unfoldTwice(rows)

  const matchCounts = unfoldedRows
    .map(row => findMatches(row, print))
    .map(matches => matches.length)

  // const matchCount = sum(matchCounts)

  // const matchCountsUnfolded1 = unfoldedRows1
  //   .map(row => findMatches(row, print))
  //   .map(matches => matches.length)

  // const matchCount1 = sum(matchCountsUnfolded1)

  // const matchCountsUnfolded2 = unfoldedRows2
  //   .map(row => findMatches(row, print))
  //   .map(matches => matches.length)
  // const matchCount2 = sum(matchCountsUnfolded1)

  // const result = matchCounts.map((count, index) => {
  //   return count * Math.pow(matchCountsUnfolded2[index], 2)
  // })
  // console.log({
  //   matchCount,
  //   matchCount1,
  //   matchCount2,
  //   a: matchCount * Math.pow(matchCount2, 2)
  // })

  return sum(matchCounts)
}

expect(solve2(testData, true)).to.equal(525152)
// expect(solve2(taskInput)).to.equal(undefined)

// npx ts-node 2023/12/index.ts
