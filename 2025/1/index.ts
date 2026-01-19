import { expect } from 'chai'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')
const testData2 = readFileSync(resolve(__dirname, 'testData2.txt'), 'utf-8')

const M = 100;
const modulus = (input: number) => ({
    result: ((input % M) + M) % M,
})

const rotate = (current: number, side: 'L' | 'R', amount: number, log?: boolean): { next: number; zeroCount: number } => {
    const sign = side === 'L' ? -1 : 1;
    const diff = amount * sign;
    const input = current + diff;
    let turnarounds = Math.floor(Math.abs(input) / M);
    if (input < 0 && current !== 0) turnarounds++

    const { result } = modulus(input)
    const zeroCount = turnarounds || (result === 0 ? 1 : 0)

    if (log) {
        console.log({ current, diff, input, whole: turnarounds, zeroCount })
    }

    return {
        next: result,
        zeroCount
    }
}

const solve = (input: string) => {
    const rotations = input.split('\n').map(rotation => ({
        side: rotation[0] as 'L' | 'R',
        amount: parseInt(rotation.slice(1), 10)
    }));
    let current = 50;
    let count = 0;
    for (let r of rotations) {
        const {next} = rotate(current, r.side, r.amount)
        current = next
        if (next === 0) count++
    }
    return count;
}

expect(solve(testData)).to.equal(3)
expect(solve(taskInput)).to.equal(1150)

// Part 2

expect(rotate(50, 'R', 1)).to.deep.equal({ next: 51, zeroCount: 0 })
expect(rotate(50, 'R', 50)).to.deep.equal({ next: 0, zeroCount: 1 })
expect(rotate(50, 'R', 51)).to.deep.equal({ next: 1, zeroCount: 1 })
expect(rotate(50, 'L', 50)).to.deep.equal({ next: 0, zeroCount: 1 })
expect(rotate(50, 'L', 51)).to.deep.equal({ next: 99, zeroCount: 1 })
expect(rotate(50, 'L', 1)).to.deep.equal({ next: 49, zeroCount: 0 })
expect(rotate(50, 'R', 200)).to.deep.equal({ next: 50, zeroCount: 2 })
expect(rotate(50, 'R', 150)).to.deep.equal({ next: 0, zeroCount: 2 })
expect(rotate(50, 'L', 150)).to.deep.equal({ next: 0, zeroCount: 2 })
expect(rotate(50, 'L', 200)).to.deep.equal({ next: 50, zeroCount: 2 })
expect(rotate(0, 'R', 5)).to.deep.equal({ next: 5, zeroCount: 0 })
expect(rotate(0, 'L', 5)).to.deep.equal({ next: 95, zeroCount: 0 })

const solve2 = (input: string) => {
    const rotations = input.split('\n').map(rotation => ({
        side: rotation[0] as 'L' | 'R',
        amount: parseInt(rotation.slice(1), 10)
    }));
    let current = 50;
    let count = 0;
    for (let r of rotations) {
        const {next, zeroCount} = rotate(current, r.side, r.amount)
        current = next
        count += zeroCount
    }
    return count;
}

expect(solve2(testData)).to.equal(6)
expect(solve2(testData2)).to.equal(10)
expect(solve2(taskInput)).to.equal(6738)

// npx ts-node 2025/1/index.ts
