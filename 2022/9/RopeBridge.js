const { expect } = require('chai');
const fs = require('fs');
const { uniq } = require('lodash');
const path = require('path');

const taskInput = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf-8');
const testData = fs.readFileSync(path.resolve(__dirname, 'testData.txt'), 'utf-8');
const testData2 = fs.readFileSync(path.resolve(__dirname, 'testData2.txt'), 'utf-8');
const testData3 = fs.readFileSync(path.resolve(__dirname, 'testData3.txt'), 'utf-8');

const serialseCoords = ({ x, y }) => `${x}:${y}`;

const moveHeadMatchers = {
    'R':  ({ x, y }) => ({ x: x + 1, y }),
    'U': ({ x, y }) => ({ x, y: y + 1 }),
    'L': ({ x, y }) => ({ x: x - 1, y }),
    'D': ({ x, y }) => ({ x, y: y - 1 }),
}

const moveTail = ({ headPosition, tailPosition }) => {
    const xDiff = headPosition.x - tailPosition.x;
    const yDiff = headPosition.y - tailPosition.y;

    let newX = tailPosition.x;
    let newY = tailPosition.y;

    if (xDiff === 2 || (xDiff === 1 && Math.abs(yDiff) === 2)) newX++;
    else if (xDiff === -2 || (xDiff === -1 && Math.abs(yDiff) === 2)) newX--;

    if (yDiff === 2 || (yDiff === 1 && Math.abs(xDiff) === 2)) newY++
    else if (yDiff === -2 || (yDiff === -1 && Math.abs(xDiff) === 2)) newY--

    return { x: newX, y: newY };
}

/**
 * @param {string} input
 */


const solve = (input) => {
    let headPosition = { x: 0, y: 0 };
    let tailPosition = { x: 0, y: 0 };
    const lastTailVisitedPositions = [];

    input
        .split('\n')
        .map(l => l.split(' '))
        .map(([d, amount]) => [d, parseInt(amount, 10)])
        .forEach(([direction, amount]) => {
            for (let i = 0; i < amount; i++) {
                headPosition = moveHeadMatchers[direction](headPosition)
                tailPosition = moveTail({ headPosition, tailPosition })
                lastTailVisitedPositions.push(serialseCoords(tailPosition))
            }
        });

    return uniq(lastTailVisitedPositions).length
}

expect(solve(testData)).to.equal(13)
expect(solve(testData2)).to.equal(7)

expect(solve(taskInput)).to.equal(6037)

// Part 2

/**
 * @param {string} input
 */
const solvePart2 = (input) => {
    let headPosition = { x: 0, y: 0 };
    let tailPositions = [];
    const lastTailVisitedPositions = [];

    for (let i = 0; i < 9; i++) tailPositions.push({ x: 0, y: 0 })

    input
        .split('\n')
        .map(l => l.split(' '))
        .map(([d, amount]) => [d, parseInt(amount, 10)])
        .forEach(([direction, amount]) => {
            for (let i = 0; i < amount; i++) {
                headPosition = moveHeadMatchers[direction](headPosition)

                tailPositions = tailPositions.reduce((result, tailPosition, index) => {
                    const newPosition = moveTail({
                        headPosition: index === 0 ? headPosition : result[index - 1],
                        tailPosition
                    });
                    return [...result, newPosition];
                }, [])

                lastTailVisitedPositions.push(serialseCoords(tailPositions.at(-1)))
            }
        });

    return uniq(lastTailVisitedPositions).length
}

expect(solvePart2(testData)).to.equal(1)
expect(solvePart2(testData3)).to.equal(36)
expect(solvePart2(taskInput)).to.equal(2485)

// node 2022/9/RopeBridge.js
