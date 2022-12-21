const fs = require('fs');
const path = require('path');
const { uniq } = require('lodash');
const { expect } = require('chai');

const taskInput = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf-8');

/**
 * @param {string} input 
 * @param {number} size
 */
const findUniqueSymbolsMessage = (input, size) => {
    for (let i = 0; i < input.length - size; i++) {
        const scan = input
            .slice(i, i + size)
            .split('')

        if (uniq(scan).length === scan.length) return i + size
    }
}

const testData = [
    ['mjqjpqmgbljsphdztnvjfqwrcgsmlb', 7],
    ['bvwbjplbgvbhsrlpgdmjqwftvncz', 5],
    ['nppdvjthqldpwncqszvftbrmjlhg', 6],
    ['nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg', 10],
    ['zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw', 11],
    [taskInput, 1929]
]

const PACKET_START = 4;

testData.forEach(([testInput, expectedResult]) => {
    const result = findUniqueSymbolsMessage(testInput, PACKET_START);
    expect(result).to.equal(expectedResult, `Test input: "${testInput}"`);
})

// part 2

const testData2 = [
    ['mjqjpqmgbljsphdztnvjfqwrcgsmlb', 19],
    ['bvwbjplbgvbhsrlpgdmjqwftvncz', 23],
    ['nppdvjthqldpwncqszvftbrmjlhg', 23],
    ['nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg', 29],
    ['zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw', 26],
    [taskInput, 3298]
]

const MESSAGE_START = 14;

testData2.forEach(([testInput, expectedResult]) => {
    const result = findUniqueSymbolsMessage(testInput, MESSAGE_START);
    expect(result).to.equal(expectedResult, `Test input: "${testInput}"`);
})

// node 2022/6/TuningTrouble.js