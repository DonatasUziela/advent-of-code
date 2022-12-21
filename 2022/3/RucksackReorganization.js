const fs = require('fs');
const path = require('path');
const { intersection, chunk } = require('lodash')

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf-8');
const rucksacks = input.split('\n');

const CHARCODE_a = 97;
const CHARCODE_A = 65;

const charToPriority = i => i.toLocaleLowerCase() === i ?
    i.charCodeAt(0) - CHARCODE_a + 1 :
    i.charCodeAt(0) - CHARCODE_A + 1 + 26

const result = rucksacks
    .map(r => [
        r.slice(0, r.length / 2),
        r.slice(r.length / 2),
    ])
    .map((c) => c.map(i => i.split('')))
    .map(([c1, c2]) => intersection(c1, c2)[0]) // find repeating item
    .map(charToPriority)
    .reduce((sum, i) => sum += i)

console.log(result) // 8349

// Part 2

const result2 = chunk(rucksacks, 3)
    .map(g => g.map(i => i.split('')))
    .map((g) => intersection(...g)[0])
    .map(charToPriority)
    .reduce((sum, i) => sum += i)

console.log(result2) // 2681

// node 2022/3/RucksackReorganization.js