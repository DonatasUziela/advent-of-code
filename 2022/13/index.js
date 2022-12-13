const { expect } = require('chai');
const fs = require('fs');
const { chunk, sum } = require('lodash');
const path = require('path');

const taskInput = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf-8');
const testData = fs.readFileSync(path.resolve(__dirname, 'testData.txt'), 'utf-8');

/**
 * @param {(number|number[])[]} left
 * @param {(number|number[])[]} right
 */
const compare = (left, right, depth = 0) => {
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
            const res = compare(l, r, depth++);
            if (typeof res === 'boolean') return res;
            continue
        }

        if (l instanceof Array && typeof r === 'number') {
            const res = compare(l, [r], depth++);
            if (typeof res === 'boolean') return res;
            continue
        }
        if (typeof l === 'number' && r instanceof Array) {
            const res = compare([l], r, depth++);
            if (typeof res === 'boolean') return res;
            continue
        }

        throw new Error(`Unmaped types. l: ${typeof l}, r: ${typeof r}`) 
    }
    
    return
}

/**
 * @param {string} input
 */
const solve = (input) => {
    const pairs = chunk(
        input
            .split('\n')
            .filter(r => r)
            .map(r => JSON.parse(r)), 2
    );

    const compared = pairs
        .map(([left, right]) => compare(left, right))

    // console.log(compared)

    const indexesInOrder = compared
        .map((result, index) => result ? index + 1 : result)
        .filter(i => i)

    return sum(indexesInOrder)
}

expect(solve(testData)).to.equal(13)
expect(solve(taskInput)).to.equal(6123)

// Part 2

/**
 * @param {string} input
 */
const solve2 = (input) => {
}

expect(solve2(testData)).to.equal(undefined)
expect(solve2(taskInput)).to.equal(undefined);

// node 2022/13/index.js 