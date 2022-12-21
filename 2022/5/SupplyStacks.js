const fs = require('fs');
const { chunk } = require('lodash');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf-8');
const entries = input.split('\n');

const transpose = (result, row) => {
    row.forEach((item, i) => {
        if (!result[i]) result[i] = [];
        result[i].push(item)
    })
    return result;
}

const _stack = entries
    .slice(0, 8)
    .map(row => chunk(row, 4))
    .reverse()
    .reduce(transpose, [])    
    .map(c => c.map(i => i.join('')))
    .map(c => c.map(i => i.replace(/[ \]\[]/g, '')))
    .map(c => c.filter(i => i))

const stack2 = _stack.map(l => l.slice()); // deep close for part 2

const instructions = entries
    .slice(10)
    .map(i => i.split(' '))
    .map(l => l.map(i => parseInt(i, 10)))
    .map(l => l.filter(i => !isNaN(i)))
    .map(([amount, from, to]) => ({ amount, from: from - 1, to: to - 1 }))

const stack = _stack.slice();

instructions.forEach(({ amount, from, to }) => {
    for (let i = 0; i < amount; i++) {
        const item = stack[from].pop();
        stack[to].push(item)
    }
})

const result = stack
    .map(s => s[s.length - 1])
    .join('')
    .replace(/[\]\[]/g, '')

console.log({ result }) // SBPQRSCDF

// Part 2

instructions
    .forEach(({ amount, from, to }) => {
        const items = stack2[from].slice(-amount);
        stack2[from] = stack2[from].slice(0, stack2[from].length - amount)
        stack2[to].push(...items)
    })

const result2 = stack2
    .map(s => s[s.length - 1])
    .join('')
    .replace(/[\]\[]/g, '')

console.log({ result2 }) // RGLVRCQSB

// node 2022/5/SupplyStacks.js