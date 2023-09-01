import { expect } from 'chai';
import { readFileSync } from 'fs';
import { uniq } from 'lodash';
import { resolve } from 'path';

const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8');
const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8');

const parseInput = (input: string) => input.split('\n').map(n => parseInt(n, 10));

const move = (inputNumbers: number[], index: number, currentNumbers: number[]) => {
    const numberToMove = inputNumbers[index];
    const len = inputNumbers.length;
    const currentIndex = currentNumbers.indexOf(numberToMove)

    //TODO apply modulo math. Ex: [0 - 6]  2 - 3 = 5
    const toMove = (numberToMove % len)
    const toMove2 = currentIndex + toMove;
    const toMove3 = toMove2 > 0 ? toMove2 : len - toMove2;
    const newIndex = toMove3

    if (newIndex === index) {
        console.log(`${numberToMove} does not move:`)
        return currentNumbers;
    }

    const newNumbers = currentNumbers.slice(0);
    newNumbers.splice(index, 1);
    newNumbers.splice(newIndex, 0, numberToMove);
    console.log(`${numberToMove} moves between ${newNumbers[newIndex - 1]} and ${newNumbers[newIndex + 1]}:`)
    return newNumbers
}

const solve = (input: string) => {
    const numbers = parseInput(input);
    console.log('Initial arrangement:');
    console.log(numbers.join(', '));

    let result = numbers;
    for (let i = 0; i < numbers.length; i++) {
        result = move(numbers, i, result);
        console.log(result.join(', '));
    }
}

expect(solve(testData)).to.equal(undefined) // 3
// expect(solve(taskInput)).to.equal(undefined)

// Part 2

const solve2 = (input: string) => {
}

expect(solve2(testData)).to.equal(undefined)
expect(solve2(taskInput)).to.equal(undefined);

// npx ts-node 2022/20/index.ts