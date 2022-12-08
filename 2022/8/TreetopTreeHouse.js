const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const { transpose } = require('../../utils');

const taskInput = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf-8');
const testData = fs.readFileSync(path.resolve(__dirname, 'testData.txt'), 'utf-8');
const testData2 = fs.readFileSync(path.resolve(__dirname, 'testData2.txt'), 'utf-8');

/**
 * @param {string} input
 */
const countVisibleTree = (input) => {
    const forest = input
        .split('\n')
        .map(r => r.split(''))
        .map(r => r.map(c => parseInt(c, 10)));

    const transposed = forest.reduce(transpose, []);

    const rowCount = forest.length;
    const columnCount = forest[0].length;
    const edgeTreesCount = (rowCount * 2) + (columnCount * 2) - 4;

    /**
    *  @param {number} row
    *  @param {number} column
    */
    const isTreeVisible = (row, column) => {
        const size = forest[row][column]
        const isBigger = tree => tree >= size
    
        const left = forest[row].slice(0, column)
        if (left.find(isBigger) === undefined) {
            return true
        }

        const right = forest[row].slice(column + 1, columnCount)
        if (right.find(isBigger) === undefined) {
            return true
        }
        
        const columnAbove = transposed[column].slice(0, row);
        if (columnAbove.find(isBigger) === undefined) {
            return true
        }

        const columnBelow = transposed[column].slice(row + 1, rowCount);
        if (columnBelow.find(isBigger) === undefined) {
            return true
        }
        
        return false
    }

    let internalVisibleTreesCount = 0;

    for (let row = 1; row < rowCount - 1; row++) {
        for (let column = 1; column < columnCount - 1; column++) {
            if (isTreeVisible(row, column)) {
                internalVisibleTreesCount++
            }
        }
    }

    return edgeTreesCount + internalVisibleTreesCount;
}

expect(countVisibleTree(testData)).to.equal(21)
expect(countVisibleTree(testData2)).to.equal(18)
expect(countVisibleTree(taskInput)).to.equal(1662)

// Part 2: highest scenic score

/**
 * @param {string} input
 */
const countHighestScenicScore = (input) => {
    const forest = input
        .split('\n')
        .map(r => r.split(''))
        .map(r => r.map(c => parseInt(c, 10)));

    const transposed = forest.reduce(transpose, []);

    const forestSize = forest.length;

    /**
    *  @param {number} row
    *  @param {number} column
    */
    const getScore = (row, column) => {
        const size = forest[row][column]
        const isBigger = tree => tree >= size
    
        const left = forest[row].slice(0, column).reverse();
        const higherIndexLeft = left.findIndex(isBigger);
        const leftScore = higherIndexLeft === -1 ? column : higherIndexLeft + 1;

        const right = forest[row].slice(column + 1, forestSize)
        const higherIndexRight = right.findIndex(isBigger);
        const rightScore = higherIndexRight === -1 ? forestSize - column - 1 : higherIndexRight + 1;
        
        const columnAbove = transposed[column].slice(0, row).reverse();
        const higherIndexAbove = columnAbove.findIndex(isBigger);
        const aboveScore = higherIndexAbove === -1 ? row : higherIndexAbove + 1;

        const columnBelow = transposed[column].slice(row + 1, forestSize);
        const higherIndexBelow = columnBelow.findIndex(isBigger);
        const belowScore = higherIndexBelow === -1 ? forestSize - row - 1 : higherIndexBelow + 1;
        
        return leftScore * rightScore * aboveScore * belowScore
    }

    const scores = [];

    for (let row = 1; row < forest.length - 1; row++) {
        for (let column = 1; column < forest.length - 1; column++) {
            scores.push(getScore(row, column));
        }
    }


    return Math.max(...scores)
}

expect(countHighestScenicScore(testData)).to.equal(8)
expect(countHighestScenicScore(taskInput)).to.equal(537600)

// node 2022/8/index.js
