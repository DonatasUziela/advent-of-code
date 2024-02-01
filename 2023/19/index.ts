import { expect } from 'chai'
import { readFileSync } from 'fs'
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

const solve2 = (input: string) => {
}

expect(solve2(testData)).to.equal(167409079868000)
expect(solve2(taskInput)).to.equal(undefined)

// npx ts-node 2023/19/index.ts
