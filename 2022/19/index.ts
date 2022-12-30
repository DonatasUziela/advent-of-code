import { expect } from 'chai';
import { readFileSync } from 'fs';
import { resolve }  from 'path';

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8');
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8');

const solve = (input: string) => {
}

expect(solve(testData)).to.equal(undefined)
expect(solve(taskInput)).to.equal(undefined)

// Part 2

const solve2 = (input: string) => {
}

expect(solve2(testData)).to.equal(undefined)
expect(solve2(taskInput)).to.equal(undefined);

// npx ts-node 2022/13/index.ts