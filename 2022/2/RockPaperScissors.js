const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf-8');
const plays = input.split('\n');

const scoreByPlay = {
    'A X': 4,
    'A Y': 8,
    'A Z': 3,
    'B X': 1,
    'B Y': 5,
    'B Z': 9,
    'C X': 7,
    'C Y': 2,
    'C Z': 6,
}

const result = plays
    .map(p => scoreByPlay[p])
    .reduce((sum, s) => sum += s)

console.log(result) // 11841

// Part 2

const scoreByPlay2 = {
    'A X': 3,
    'A Y': 4,
    'A Z': 8,
    'B X': 1,
    'B Y': 5,
    'B Z': 9,
    'C X': 2,
    'C Y': 6,
    'C Z': 7,
}

const result2 = plays
    .map(p => scoreByPlay2[p])
    .reduce((sum, s) => sum += s)

console.log(result2) // 13022

// node 2022/2/RockPaperScissors.js