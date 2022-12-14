import { expect } from 'chai';
import { readFileSync } from 'fs';
import { chunk, sum } from 'lodash';
import { resolve }  from 'path';

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8');
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8');

type Value = number | number[]

const compare = (left: Value[], right: Value[]): boolean | undefined => {
    for (let i = 0; i < Math.max(left.length, right.length); i++) {
        const [l, r] = [left[i], right[i]];

        if (typeof l === 'number' && typeof r === 'number') {
            if (l < r) return true
            if (l > r) return false
            continue
        }

        if (typeof l === 'undefined' && typeof r !== 'undefined') return true
        if (typeof l !== 'undefined' && typeof r === 'undefined') return false

        if (l instanceof Array && r instanceof Array) {
            const res = compare(l, r);
            if (typeof res === 'boolean') return res;
            continue
        }

        if (l instanceof Array && typeof r === 'number') {
            const res = compare(l, [r]);
            if (typeof res === 'boolean') return res;
            continue
        }
        if (typeof l === 'number' && r instanceof Array) {
            const res = compare([l], r);
            if (typeof res === 'boolean') return res;
            continue
        }

        throw new Error(`Unmaped types. l: ${typeof l}, r: ${typeof r}`)
    }

    return
}

const solve = (input: string) => {
    const pairs = chunk(
        input
            .split('\n')
            .filter(r => r)
            .map(r => JSON.parse(r) as Value[]),
        2
    );

    const indexesInOrder = pairs
        .map(([left, right]) => compare(left, right))
        .map((result, index) => result ? index + 1 : result)
        .filter(i => i)

    return sum(indexesInOrder)
}

expect(solve(testData)).to.equal(13)
expect(solve(taskInput)).to.equal(6086)

// Part 2

const solve2 = (input: string) => {
    const DIVIDER_1 = [[2]];
    const DIVIDER_2 = [[6]];

    const packets = input
        .split('\n')
        .filter(r => r)
        .map(r => JSON.parse(r))
        .concat([DIVIDER_1, DIVIDER_2])
        .sort((a, b) => compare(a, b) ? -1 : 1)
        .map(p => JSON.stringify(p));

    const firstDividerIndex = packets.indexOf(JSON.stringify(DIVIDER_1)) + 1
    const secondDividerIndex = packets.indexOf(JSON.stringify(DIVIDER_2)) + 1

    return firstDividerIndex * secondDividerIndex
}

expect(solve2(testData)).to.equal(140)
expect(solve2(taskInput)).to.equal(27930);

// npx ts-node 2022/13/DistressSignal.ts