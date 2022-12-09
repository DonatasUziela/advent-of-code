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

const moveTail = ({ head, tail }) => {
    const xDiff = head.x - tail.x;
    const yDiff = head.y - tail.y;
    
    const absXDiff = Math.abs(xDiff);
    const absYDiff = Math.abs(yDiff);

    let newX = tail.x;
    let newY = tail.y;

    if (absXDiff === 2 || (absXDiff === 1 && absYDiff === 2)) newX += Math.sign(xDiff);

    if (absYDiff === 2 || (absYDiff === 1 && absXDiff === 2)) newY += Math.sign(yDiff)

    return { x: newX, y: newY };
}

/**
 * @param {string} input
 */


const solve = (input) => {
    let head = { x: 0, y: 0 };
    let tail = { x: 0, y: 0 };
    const tailVisitedPosition = [];

    input
        .split('\n')
        .map(l => l.split(' '))
        .map(([d, amount]) => [d, parseInt(amount, 10)])
        .forEach(([direction, amount]) => {
            for (let i = 0; i < amount; i++) {
                head = moveHeadMatchers[direction](head)
                tail = moveTail({ head, tail })
                tailVisitedPosition.push(serialseCoords(tail))
            }
        });

    return uniq(tailVisitedPosition).length
}

expect(solve(testData)).to.equal(13)
expect(solve(testData2)).to.equal(7)

expect(solve(taskInput)).to.equal(6037)

// Part 2

/**
 * @param {string} input
 */
const solvePart2 = (input) => {
    let head = { x: 0, y: 0 };
    let tails = [];
    const lastTailVisitedPositions = [];

    for (let i = 0; i < 9; i++) tails.push({ x: 0, y: 0 })

    input
        .split('\n')
        .map(l => l.split(' '))
        .map(([d, amount]) => [d, parseInt(amount, 10)])
        .forEach(([direction, amount]) => {
            for (let i = 0; i < amount; i++) {
                head = moveHeadMatchers[direction](head)

                tails = tails.reduce((updatedTails, tail, index) => {
                    const newPosition = moveTail({
                        head: index === 0 ? head : updatedTails[index - 1],
                        tail
                    });

                    return [...updatedTails, newPosition];
                }, [])

                lastTailVisitedPositions.push(serialseCoords(tails.at(-1)))
            }
        });

    return uniq(lastTailVisitedPositions).length
}

expect(solvePart2(testData)).to.equal(1)
expect(solvePart2(testData3)).to.equal(36)
expect(solvePart2(taskInput)).to.equal(2485)

// node 2022/9/RopeBridge.js
