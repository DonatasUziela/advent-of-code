const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf-8');
const entries = input.split('\n');

const caloriesByElf = entries.reduce((result, entry) => {
    if (entry === '') return [...result, 0];
    
    const calories = parseInt(entry, 10);
    result[result.length - 1] += calories;

    return result;
}, [0]);

const sorted = caloriesByElf.sort().reverse();

const top3Total = sorted[0] + sorted[1] + sorted[2];

console.log(top3Total)

// node 2022/1/CalorieCounting.js;2D