import { expect } from 'chai'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { lcm } from 'utils/math'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')

interface Node { left: string, right: string }
type NodeMap = Record<string, Node>

const parse = (input: string) => {
  const [instructionsString, nodesString] = input.split('\n\n')

  return {
    instructions: instructionsString.split(''),
    nodes: nodesString
      .split('\n')
      .map(l => l.split(' = '))
      .map(([node, leftRightString]) => {
        const [left, right] = leftRightString.split(', ').map(lr => lr.replace('(', '').replace(')', ''))
        return {
          node,
          left,
          right
        }
      })

  }
}
const solve = (input: string) => {
  const { instructions, nodes } = parse(input)
  const nodesMap = nodes.reduce<NodeMap>((acc, { node, ...rest }) => {
    acc[node] = rest
    return acc
  }, {})

  let currentNode = 'AAA'
  let i = 0
  let steps = 0
  while (currentNode !== 'ZZZ') {
    const instruction = instructions[i % instructions.length]
    if (instruction === 'L') {
      currentNode = nodesMap[currentNode].left
    } else {
      currentNode = nodesMap[currentNode].right
    }
    steps++
    i++
  }

  return steps
}

expect(solve(testData)).to.equal(6)
expect(solve(taskInput)).to.equal(22357)

// Part 2

const testData2 = readFileSync(resolve(__dirname, 'testData2.txt'), 'utf-8')

const solve2 = (input: string) => {
  const { instructions, nodes } = parse(input)

  const nodesMap = nodes.reduce<NodeMap>((acc, { node, ...rest }) => {
    acc[node] = rest
    return acc
  }, {})

  const startingNodes = nodes.filter(({ node }) => node[2] === 'A')

  const findStepCount = (start: string) => {
    let currentNode = start
    let i = 0
    let steps = 0

    while (currentNode[2] !== 'Z') {
      const instruction = instructions[i]
      if (instruction === 'L') {
        currentNode = nodesMap[currentNode].left
      } else {
        currentNode = nodesMap[currentNode].right
      }
      steps++

      i = (i + 1) % instructions.length
    }
    return steps
  }

  const stepCounts = startingNodes.map(({ node }) => findStepCount(node))

  return stepCounts.reduce(lcm)
}

expect(solve2(testData2)).to.equal(6)
expect(solve2(taskInput)).to.equal(10371555451871)

// npx ts-node 2023/8/index.ts
