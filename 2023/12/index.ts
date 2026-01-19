import { expect } from 'chai'
import { readFileSync } from 'fs'
import { memoize, sum } from 'lodash'
import { resolve } from 'path'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')

interface RowData {
  row: string
  groups: number[]
}

const findAllMatches = (target: string, search: string) => {
  const result: number[] = []

  for (let i = 0; i < target.length; i++) {
    const index = target.indexOf(search, i)

    if (index === -1) return result

    result.push(index)
  }

  return result
}

expect(findAllMatches('###', '#')).to.deep.equal([0, 1, 2])

const findAllMatchesMemoized = memoize(findAllMatches, (target, search) => `${target}/${search}`)

const createDamagedSpringsString = (l: number) => {
  const result = []
  for (let i = 0; i < l; i++) {
    result.push('#')
  }
  return result.join('')
}

const createDamagedSpringsStringMemoized = memoize(createDamagedSpringsString)

const findValidPathsForGroup = (group: number, row: string, path: number[]) => {
  const groupStr = createDamagedSpringsStringMemoized(group)
  const targetRow = row.replaceAll('?', '#')
  const matchIndexes = findAllMatchesMemoized(targetRow, groupStr)
  const validPaths = []
  for (const matchIndex of matchIndexes) {
    if (row.charAt(matchIndex + group) === '#' || row.charAt(matchIndex - 1) === '#') {
      continue
    }

    validPaths.push(path.concat(matchIndex))
  }

  return validPaths
}

const findValidPathsForGroupMemoized = memoize(findValidPathsForGroup, (group, row, path) => `${group}/${row}/${path.join('-')}`)

const checkIfValid = (groups: number[], path: number[], row: string) => {
  let replaced = row
  for (let p = 0; p < path.length; p++) {
    const index = path[p]
    const group = groups[p]
    const sub = replaced.substring(0, index)
    const sub2 = replaced.substring(index + group)
    replaced = sub + createDamagedSpringsStringMemoized(group).replaceAll('#', '-') + sub2
  }

  if (replaced.includes('#')) return false
  return true
}

const getKey = (path: number[]) => path.join('-')

const findMatchesCount = ({ groups, row }: RowData): number => {
  let validPlacements = [[] as number[]]
  let cache: Record<string, number[]> = {}

  const dateSectionA = new Date()
  for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
    const group = groups[groupIndex]
    const prevGroup = groups[groupIndex - 1] ?? 0

    // const newPlacements: number[][][] = []
    const validPlacementsDate = new Date()
    console.log({ row, group, validPlacements: validPlacements.length })

    validPlacements.forEach((prevPath) => {
      // const key = getKey(prevPath, group)
      // const cacheEntry = cache[key]
      // if (cacheEntry) return

      const validPaths = findValidPathsForGroupMemoized(group, row, prevPath)

      if (groupIndex === 0) {
        for (const path of validPaths) {
          const subKey = getKey(path)
          if (cache[subKey]) continue
          cache[subKey] = path
        }
        return
      }
      const nextIndexToStartFrom = prevPath[prevPath.length - 1] + prevGroup
      for (const path of validPaths) {
        const subKey = getKey(path)
        if (cache[subKey]) continue
        if (path[path.length - 1] <= nextIndexToStartFrom) continue
        cache[subKey] = path
      }
    })
    console.log('dateValidPathForGroup', (new Date().getTime() - validPlacementsDate.getTime()) / 1000)

    // console.log({
    //   // cache: Object.keys(cache).length,
    //   subCache: Object.keys(subCache).length
    // })

    validPlacements = Object.values(cache)
    // cache = {}
    cache = {}
  }

  console.log('Section A', (new Date().getTime() - dateSectionA.getTime()) / 1000)

  // console.log('validPlacements count', validPlacements.length)

  const validReplacedStrings = validPlacements.map(path => path.join('-'))

  const filterOutUnreplacedStuff = validReplacedStrings.filter(p => {
    const path = p.split('-').map(Number)
    return checkIfValid(groups, path, row)
  })

  // console.log('filterOutUnreplacedStuff count', filterOutUnreplacedStuff.length)

  return filterOutUnreplacedStuff.length
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
    .map((row, rowIndex) => {
      console.log({ rowIndex })
      return findMatchesCount(row)
    })

  return sum(matchCounts)
}

expect(solve('?###???????? 3,2,1')).to.equal(10)
expect(solve('?#?#?? 1,1')).to.equal(1)
expect(solve(testData)).to.equal(21)
expect(solve(taskInput)).to.equal(7541)

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

// optimizations:
// use indexes instead of replaced
// more memoization
// squeeze repeating '.'

const solve2 = (input: string) => {
  console.log('PART 2')
  const rows = parse(input).map(({ groups, row }) => ({ groups, row: row.replaceAll(/\.+/g, '.') }))
  const unfoldedRows = unfoldAll(rows)
  // const unfoldedRows1 = unfoldOnce(rows)
  // const unfoldedRows2 = unfoldTwice(rows)

  const matchCounts = unfoldedRows
    .map((row, rowIndex) => {
      console.log('ROW INDEX', { rowIndex })
      return findMatchesCount(row)
    })

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

expect(solve2(testData)).to.equal(525152)
// expect(solve2(taskInpuast)).to.equal(17485169859432)

// npx ts-node 2023/12/index.ts
