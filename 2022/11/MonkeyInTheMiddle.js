const { expect } = require('chai');
const fs = require('fs');
const { chunk } = require('lodash');
const path = require('path');

const taskInput = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf-8');
const testData = fs.readFileSync(path.resolve(__dirname, 'testData.txt'), 'utf-8');

/**
 * @param {string} input
 */
const parseMonkeyData = (input, index) => {
    const divider = parseInt(input[3].split(' ').pop(), 10);
    const ifTrue = parseInt(input[4].split(' ').pop(), 10);
    const ifFalse = parseInt(input[5].split(' ').pop(), 10);

    const operationString = input[2].split('=').pop().slice(1);
    const amount = parseInt(operationString.split(' ').pop(), 10);
    const operator = operationString.split(' ')[1];
    const operation = operator === '*' ? (a, b) => a * b : (a, b) => a + b;
    return {
        index,
        items: input[1]
            .split(':')
            .pop()
            .split(/[ ,]/)
            .filter(i => i)
            .map(i => parseInt(i, 10)),
        operation: isNaN(amount) ? (l) => operation(l, l) : (l) => operation(l, amount),
        test: (n) => n % divider === 0 ? ifTrue : ifFalse,
        inspected: 0,
        divider
    }
}

/**
 * @param {string} input
 */
const solve = (input) => {
    const monkeyStrings = chunk(input.split('\n').filter(i => i), 6);
    const monkeys = monkeyStrings.map(parseMonkeyData);

    const doRound = () => {
        monkeys.forEach(monkey => {
            let worryLevel;
            while ((worryLevel = monkey.items.shift()) !== undefined) {
                monkey.inspected++;
                const increased = monkey.operation(worryLevel)
                const cooledDown = Math.floor(increased / 3);
                const throwToMonkey = monkey.test(cooledDown)
                monkeys[throwToMonkey].items.push(cooledDown)
            }
        })
    }

    for (let round = 0; round < 20; round++) {
        doRound();
    }

    const [mostActive, secondMostActive] = monkeys
        .map(m => m.inspected)
        .sort((a, b) => b - a);

    return mostActive * secondMostActive;
}

expect(solve(testData)).to.equal(10605)
expect(solve(taskInput)).to.equal(55930)

// Part 2

/**
 * @param {string} input
 */
const solve2 = (input) => {
    const monkeyStrings = chunk(input.split('\n').filter(i => i), 6);
    const monkeys = monkeyStrings.map(parseMonkeyData);
    const LCM = monkeys.reduce((result, monkey) => result * monkey.divider, 1);

    const doRound = () => {
        monkeys.forEach((monkey) => {
            let worryLevel;
            while (monkey.items.length) {
                worryLevel = monkey.items.shift()
                monkey.inspected++;
                const increased = monkey.operation(worryLevel) % LCM; // Main part -> reducing by common LargestCommonMultiple of all monkeys
                const throwToMonkey = monkey.test(increased)
                monkeys[throwToMonkey].items.push(increased)
            }
        })
    }

    for (let round = 0; round < 10000; round++) {
        doRound();
    }

    const [mostActive, secondMostActive] = monkeys
        .map(m => m.inspected)
        .sort((a, b) => b - a);

    return mostActive * secondMostActive;
}

expect(solve2(testData)).to.equal(2713310158)
expect(solve2(taskInput)).to.equal(14636993466);

// node 2022/11/MonkeyInTheMiddle.js 