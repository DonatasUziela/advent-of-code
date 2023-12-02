import { expect } from 'chai';
import { readFileSync } from 'fs';
import { sum } from 'lodash';
import { resolve } from 'path';

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8');
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8');

const solve = (input: string) => {
    const numbers = input.split('\r\n')
        .map(e => e.replace(/\D/g, ''))
        .map(s => `${s[0]}${s[s.length - 1]}`)
        .map(n => parseInt(n, 10))

    return sum(numbers)
}

expect(solve(testData)).to.equal(142)
expect(solve(taskInput)).to.equal(56506)

// Part 2

const testData2 = readFileSync(resolve(__dirname, 'testData2.txt'), 'utf-8');

const digitByText: Record<string, string> = {
    'one': '1',
    'two': '2',
    'three': '3',
    'four': '4',
    'five': '5',
    'six': '6',
    'seven': '7',
    'eight': '8',
    'nine': '9',
}

const solve2 = (input: string) => {
    const entries = input.split('\r\n');
    const allDigits = [...Object.values(digitByText), ...Object.keys(digitByText)];

    const findFirstNumber = (entry: string) => {
        const matches = allDigits
            .map(textDigit => ({
                textDigit,
                index: entry.indexOf(textDigit)
            }))
            .filter(({ index }) => index > -1)
            .sort((a, b) => a.index - b.index)
        
        return matches[0].textDigit;
    }

    const findLastNumber = (entry: string) => {
        const matches = allDigits
            .map(textDigit => ({
                textDigit,
                index: entry.lastIndexOf(textDigit)
            }))
            .filter(({ index }) => index > -1)
            .sort((a, b) => b.index - a.index)
        
        return matches[0].textDigit;
    }

    const pairs = entries
        .map(e => [findFirstNumber(e), findLastNumber(e)])
        .map(p => p.map(i => digitByText[i] || i))
        .map(p => `${findFirstNumber(p[0])}${findLastNumber(p[1])}`)
        .map(p => parseInt(p, 10))

    return sum(pairs)
}

expect(solve2('threeight')).to.equal(38);
expect(solve2('jlzxqbsix4qsixtzrg')).to.equal(66)
expect(solve2('fnm3oneightsdn')).to.equal(38)

expect(solve2(testData2)).to.equal(281)
expect(solve2(taskInput)).to.equal(56017)

// npx ts-node 2023/1/index.ts