import { expect } from 'chai'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { transpose } from 'utils/transpose'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')

const parse = (input: string): string[][] =>
  input
    .split('\n')
    .map(line => line.split(''))

const getAllIndexes = (str: string, search: string) => {
  const indexes = []
  let index = str.indexOf(search)
  while (index !== -1) {
    indexes.push(index)
    index = str.indexOf(search, index + 1)
  }
  return indexes
}

const getAllDiagonals = (matrix: string[][]) => {
  const diagonals: string[] = []
  // left-top quadrant of the matrix
  for (let row = 0; row < matrix.length; row++) {
    let diagonal = ''
    for (let column = 0; column <= row; column++) {
      diagonal += matrix[row - column][column]
    }
    diagonals.push(diagonal)
  }
  // right-bottom quadrant of the matrix
  for (let column = 1; column < matrix[0].length; column++) {
    let diagonal = ''
    for (let row = matrix.length - 1; row >= column; row--) {
      diagonal += matrix[row][column + matrix.length - 1 - row]
    }
    diagonals.push(diagonal)
  }
  // right-top quadrant of the matrix
  for (let column = matrix[0].length - 1; column >= 0; column--) {
    let diagonal = ''
    for (let row = 0; row < matrix.length - column; row++) {
      diagonal += matrix[row][column + row]
    }
    diagonals.push(diagonal)
  }
  // left-bottom quadrant of the matrix
  for (let row = 1; row < matrix.length; row++) {
    let diagonal = ''
    for (let column = 0; row + column < matrix.length; column++) {
      diagonal += matrix[row + column][column]
    }
    diagonals.push(diagonal)
  }
  return diagonals
}

expect(getAllDiagonals([
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9']
])).to.deep.equal([
  '1', '42', '753', '86', '9',
  '3', '26', '159', '48', '7'])

const findTextInMatrix = (matrix: string[][], searchTerm: string) => {
  const searchTermReversed = searchTerm.split('').reverse().join('')
  const lines = matrix.map(line => line.join(''))
  const columns = transpose(matrix).map(line => line.join(''))
  const diagonals = getAllDiagonals(matrix)
  const searchData = [...lines, ...columns, ...diagonals]

  let count = 0

  searchData.forEach(line => {
    count += getAllIndexes(line, searchTerm).length + getAllIndexes(line, searchTermReversed).length
  })

  return count
}

const solve = (input: string) => {
  const parsed = parse(input)

  return findTextInMatrix(parsed, 'XMAS')
}

expect(solve(testData)).to.equal(18)
expect(solve(taskInput)).to.be.below(2661)
expect(solve(taskInput)).to.equal(2644)

// Part 2

const getMainDiagonals = (matrix: string[][]) => {
  let diagonal = ''
  for (let row = 0; row < matrix.length; row++) {
    diagonal += matrix[row][row]
  }
  let diagonal2 = ''
  for (let row = 0; row < matrix.length; row++) {
    diagonal2 += matrix[row][matrix.length - 1 - row]
  }
  return [diagonal, diagonal2]
}

expect(getMainDiagonals([
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9']
])).to.deep.equal(['159', '357'])

// eslint-disable-next-line @typescript-eslint/naming-convention
const hasX_MAS = (matrix: string[][]) => {
  const diagonals = getMainDiagonals(matrix)
  return (
    (diagonals[0] === 'MAS' || diagonals[0] === 'SAM') &&
    (diagonals[1] === 'MAS' || diagonals[1] === 'SAM')
  )
}

const solve2 = (input: string) => {
  const matrix = parse(input)
  let count = 0
  for (let row = 0; row < matrix.length - 2; row++) {
    for (let j = 0; j < matrix[0].length - 2; j++) {
      const subMatrix = matrix.slice(row, row + 3).map(line => line.slice(j, j + 3))
      if (hasX_MAS(subMatrix)) {
        count++
      }
    }
  }
  return count
}

expect(solve2(testData)).to.equal(9)
expect(solve2(taskInput)).to.equal(1952)

// npx ts-node 2024/4/index.ts
