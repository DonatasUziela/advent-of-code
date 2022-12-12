const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

const taskInput = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf-8');
const testData = fs.readFileSync(path.resolve(__dirname, 'testData.txt'), 'utf-8');

/**
 * @param {string} input
 */
const solve = (input) => {
}

expect(solve(testData)).to.equal(undefined)
expect(solve(taskInput)).to.equal(undefined)

// Part 2

/**
 * @param {string} input
 */
const solve2 = (input) => {
}

expect(solve2(testData)).to.equal(undefined)
expect(solve2(taskInput)).to.equal(undefined);

// node 2022/11/index.js 