const fs = require('fs');
const path = require('path');
const { uniq } = require('lodash');

const taskInput = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf-8');

const PACKET_START = 4;

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

// tests

const testData = [
    ['mjqjpqmgbljsphdztnvjfqwrcgsmlb', 7],
    ['bvwbjplbgvbhsrlpgdmjqwftvncz', 5],
    ['nppdvjthqldpwncqszvftbrmjlhg', 6],
    ['nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg', 10],
    ['zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw', 11]
]

testData.forEach(([testInput, expectedResult]) => {
    const result = findUniqueSymbolsMessage(testInput, PACKET_START);
    if (result !== expectedResult) {
        throw Error(`testInput: ${testInput} | expectedResult: ${expectedResult} | result: ${result}`)
    }
})

const result = findUniqueSymbolsMessage(taskInput, PACKET_START);

console.log(result) // 1538

// part 2

 const MESSAGE_START = 14;

const testData2 = [
    ['mjqjpqmgbljsphdztnvjfqwrcgsmlb', 19],
    ['bvwbjplbgvbhsrlpgdmjqwftvncz', 23],
    ['nppdvjthqldpwncqszvftbrmjlhg', 23],
    ['nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg', 29],
    ['zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw', 26]
]

testData2.forEach(([testInput, expectedResult]) => {
    const result = findUniqueSymbolsMessage(testInput, MESSAGE_START);
    if (result !== expectedResult) {
        throw Error(`testInput: ${testInput} | expectedResult: ${expectedResult} | result: ${result}`)
    }
})

const result2 = findUniqueSymbolsMessage(taskInput, MESSAGE_START)

console.log(result2) // 2315

// node 2022/6/TuningTrouble.js