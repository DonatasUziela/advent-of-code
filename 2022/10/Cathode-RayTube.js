const { expect } = require('chai');
const fs = require('fs');
const { sum } = require('lodash');
const path = require('path');

const taskInput = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf-8');
const testData = fs.readFileSync(path.resolve(__dirname, 'testData.txt'), 'utf-8');
const testResult = fs.readFileSync(path.resolve(__dirname, 'testResult.txt'), 'utf-8');
const part2result = fs.readFileSync(path.resolve(__dirname, 'part2result.txt'), 'utf-8');

/**
 * @param {string} input
 */
const solve = (input) => {
    let x = 1;
    let cycle = 0;
    let signalStrengths = [];

    input
        .split('\n')
        .map(c => c.split(' '))
        .map(([command, arg]) => [command, parseInt(arg, 10)])
        .flatMap(([command, arg]) => command === 'noop' ? [null] : [null, arg])
        .forEach((add) => {
            cycle++;
            // every 40 cycles, starting from 20
            if (((cycle - 20) % 40) === 0) signalStrengths.push(cycle * x)
            if (add) x += add;
        })

    return sum(signalStrengths)
}

expect(solve(testData)).to.equal(13140)
expect(solve(taskInput)).to.equal(12640)

// Part 2

const CRT_WIDTH = 40;

/**
 * @param {string} input
 */
const solve2 = (input) => {
    let x = 1;
    let cycle = 0;
    let CRT = '';

    input
        .split('\n')
        .map(c => c.split(' '))
        .map(([command, arg]) => [command, parseInt(arg, 10)])
        .flatMap(([command, arg]) => command === 'noop' ? [null] : [null, arg])
        .forEach((add) => {
            cycle++;

            const position = ((cycle - 1) % CRT_WIDTH);
            const pixel = Math.abs(position - x) <= 1 ? '#' : '.'

            CRT += pixel;
            if (position === CRT_WIDTH - 1) CRT += '\n';
            if (add) x += add;
        })

    return CRT.slice(0, -1); // remove last new line
}

expect(solve2(testData)).to.equal(testResult)
expect(solve2(taskInput)).to.equal(part2result);

// fs.writeFileSync(path.resolve(__dirname, 'myResult.txt'), solve2(taskInput), 'utf-8') // EHBZLRJR

// node 2022/10/Cathode-RayTube.js