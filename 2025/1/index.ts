import { expect } from 'chai'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')

const modulusRange = (min: number, max: number, input: number) => {
    const lengthOfRange = max - min + 1;
    input = input % (lengthOfRange);
    if (input < min) {
        return max - Math.abs(min - input) + 1
    }

    if (input > max) {
        return min + Math.abs(input - max) - 1
    }

    return input
}

const solve = (input: string) => {
    const rotations = input.split('\n').map(rotation => ({
        side: rotation[0],
        amount: parseInt(rotation.slice(1), 10)
    }));
    let current = 50;
    let count = 0;
    for (let r of rotations) {
        const sign = r.side === 'L' ? -1 : 1;
        const diff = r.amount * sign;
        current = modulusRange(0, 99, current + diff)
        if (current === 0) count++
    }
    return count;
}

expect(solve(testData)).to.equal(3)
expect(solve(taskInput)).to.equal(1150)

// Part 2

const solve2 = (input: string) => {
}

expect(solve2(testData)).to.equal(undefined)
expect(solve2(taskInput)).to.equal(undefined)

// npx ts-node 2025/1/index.ts
