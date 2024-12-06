import { expect } from 'chai'
import { readFileSync } from 'fs'
import { sum } from 'lodash'
import { resolve } from 'path'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')

type Key = 'x' | 'm' | 'a' | 's'

interface Parsed {
  instructions: Array<{ name: string, expression: string, original: string }>
  parts: Array<Record<Key, number>>
}

const parse = (input: string): Parsed => {
  const [instructionStrings, partStrings] = input
    .split('\n\n')
    .map(s => s.split('\n'))

  const names = instructionStrings.map(s => s.split('{')[0])

  return {
    instructions: instructionStrings.map((s, i) => {
      const original = s.split('{')[1].replace('}', '')
      return {
        name: names[i],
        original,
        expression: // convert to valid js expression
          original
            .replaceAll(':', '?')
            .replaceAll(',', ':')
            .replaceAll(/\?([a-z]+):/g, '?"$1":') // replace ?name: with ?"name":
            .replace(/:([a-z]+)$/, ':"$1"') // replace :name with :"name"
            .replaceAll('A', '"A"')
            .replaceAll('R', '"R"')
      }
    }),
    parts: partStrings.map(s =>
      // eslint-disable-next-line no-eval
      eval('Object(' + s.replaceAll('=', ':') + ')')
    )
  }
}

const solve = (input: string) => {
  const { parts, instructions } = parse(input)

  let totalAccepted = 0

  for (const { x, m, a, s } of parts) {
    let next = 'in'
    while (true) {
      const nextInstruction = instructions.find(i => i.name === next)
      if (!nextInstruction) throw new Error(`did not find instruction named ${next}`)

      const { expression, original, name } = nextInstruction
      try {
        // eslint-disable-next-line no-eval
        next = eval(expression)
      } catch (e) {
        console.error(e)
        console.log({ expression, original, name })
        return
      }
      if (next === 'A') {
        totalAccepted += x + m + a + s
        break
      }

      if (next === 'R') break
    }
  }

  return totalAccepted
}

expect(solve(testData)).to.equal(19114)
expect(solve(taskInput)).to.equal(350678)

// Part 2

const mapToConditionalNode = (str: string, rest: string[]): ConditionNode => {
  const operator = str.includes('>') ? '>' : '<'
  const [key, valueStr] = str.split(operator)
  const [value, leftStr] = valueStr.split(':')
  const [rightStr, ...nextRest] = rest

  return {
    type: 'node',
    condition: {
      key: key as Key,
      operator,
      value: Number(value)
    },
    left: mapToNode(leftStr, rest),
    right: mapToNode(rightStr, nextRest)
  }
}

const mapToNode = (str: string, rest: string[]): Node => {
  if (str === 'A') return { type: 'A' }
  if (str === 'R') return { type: 'R' }

  if (!str.includes('>') && !str.includes('<')) {
    return {
      type: 'next',
      next: str
    }
  }

  return mapToConditionalNode(str, rest)
}

const mapToRule2 = (str: string): ConditionNode => {
  const [first, ...rest] = str.split(',')
  return mapToConditionalNode(first, rest)
}

type Node = ConditionNode | { type: 'A' } | { type: 'R' } | { type: 'next', next: string }

interface ConditionNode {
  type: 'node'
  condition: {
    key: Key
    operator: '<' | '>'
    value: number
  }
  right: Node
  left: Node
}

type Tree = Record<string, ConditionNode>

const parse3 = (input: string): Tree => {
  const tree: Tree = {}

  const [instructionStrings] = input
    .split('\n\n')
    .map(s => s.split('\n'))

  instructionStrings.forEach((s, i) => {
    let [name, rulesString] = s.split('{')
    rulesString = rulesString.replace('}', '')

    tree[name] = mapToRule2(rulesString)
  })

  return tree
}

interface Range { min: number, max: number }

const solve2 = (input: string) => {
  const tree = parse3(input)

  const startRanges = {
    x: { min: 1, max: 4000 },
    m: { min: 1, max: 4000 },
    a: { min: 1, max: 4000 },
    s: { min: 1, max: 4000 }
  }
  type XMASranges = typeof startRanges
  const acceptedRages: XMASranges[] = []

  const walkNode = (node: Node, ranges: XMASranges) => {
    if (node.type === 'A') {
      acceptedRages.push(ranges)
    } else if (node.type === 'R') {
      // Rejected
    } else if (node.type === 'next') {
      walkInstruct(node.next, ranges)
    } else {
      walkConditionNode(node, ranges)
    }
  }

  const walkConditionNode = (node: ConditionNode, ranges: XMASranges) => {
    const { condition: { key, operator, value } } = node
    const range = ranges[key]

    const leftRanges: XMASranges = {
      ...ranges,
      [key]: operator === '<'
        ? { min: range.min, max: Math.min(value - 1, range.max) }
        : { min: Math.max(value + 1, range.min), max: range.max }
    }

    // TODO: maybe wrong inverse logic?
    const rightRanges: XMASranges = {
      ...ranges,
      [key]: operator === '<'
        ? { min: Math.max(range.min, value), max: range.max }
        : { min: range.min, max: Math.min(range.max, value) }
    }

    walkNode(node.left, leftRanges)
    walkNode(node.right, rightRanges)
  }

  const walkInstruct = (name: string, ranges: XMASranges): void => {
    const node = tree[name]
    walkConditionNode(node, ranges)
  }

  walkInstruct('in', startRanges)

  // acceptedRages.reduce((acc, item) => {
  //   const xEs = acc.map(({ x}) => x);
  //   const xExclude = rangesExclude(item.x, ...xEs)
  //   const x = rangesUnion(...xEs, ...xExclude)

  //   const m = getRangeLength(acc.m) + getRangeLength(item.m) - getRangesOverlap(acc.m, item.m)
  //   const a = getRangeLength(acc.a) + getRangeLength(item.a) - getRangesOverlap(acc.a, item.a)
  //   const s = getRangeLength(acc.s) + getRangeLength(item.s) - getRangesOverlap(acc.s, item.s)
  //   something = something +
  //   return item
  // }, [startRanges])

  // TODO check if tree is built corrctly
  // TODO check if walking logic is correct
  // TODO check if condition walking is correct
  let total = 4000 * 4000 * 4000 * 1350
  total += 4000 * 4000 * 4000 * (4000 - 3449 + 1)
  total += 4000 * 4000 * 4000 * (3448 - 2771 + 1)
  total += 4000 * 1800 * 4000 * (2770 - 1351 + 1)

  const combinationCount = (key: Key) => {
    const acceptedKeyRanges = acceptedRages.map((r) => r[key])
    const merged = rangesUnion(...acceptedKeyRanges)
    const rangeLengths = merged.map(getRangeLength)
    // console.log({ key, merged })

    return sum(rangeLengths)
  }

  const x = combinationCount('x')
  const m = combinationCount('m')
  const a = combinationCount('a')
  const s = combinationCount('s')

  console.log(acceptedRages, { x, m, a, s })

  // return x * m * a * s
  return total
}

expect(solve2(testData)).to.equal(167409079868000)
expect(solve2(taskInput)).to.equal(undefined)

const getRangesOverlap = (a: Range, b: Range) => getRangeLength(rangesIntersection([a, b]))

function getRangeLength (range: Range) { return range.max - range.min + 1 }

function rangesExclude (a: Range, ...b: Range[]): Range[] {
  throw new Error('Not implemented')
}

function rangesIntersection (ranges: Range[]): Range {
  throw new Error('Not implemented')
}

function rangesUnion (...ranges: Range[]): Range[] {
  if (!ranges.length) return []

  const result: Range[] = []
  const sorted = ranges.slice().sort((a, b) => a.min - b.min)

  // Add first range to stack
  result.push(sorted[0])

  sorted.slice(1).forEach(function (range, i) {
    const top = result[result.length - 1]

    if (top.max < range.min) {
      // No overlap, push range onto stack
      result.push(range)
    } else if (top.max < range.max) {
      // Update previous range
      top.max = range.max
    }
  })

  return result
};
// npx ts-node 2023/19/index.ts
