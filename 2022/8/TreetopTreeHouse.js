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
    const forestSize = forest.length;
    const edgeTreesCount = (forestSize * 4) - 4

    /**
    *  @param {number} row
    *  @param {number} column
    */
    const isTreeVisible = (row, column) => {
        const treeSize = forest[row][column]
        const isBigger = tree => tree >= treeSize
    
        const left = forest[row].slice(0, column)
        if (left.find(isBigger) === undefined) return true;

        const right = forest[row].slice(column + 1, forestSize)
        if (right.find(isBigger) === undefined) return true;
        
        const columnAbove = transposed[column].slice(0, row);
        if (columnAbove.find(isBigger) === undefined) return true;

        const columnBelow = transposed[column].slice(row + 1, forestSize);
        if (columnBelow.find(isBigger) === undefined) return true
        
        return false
    }

    let visibleInteriorTrees = 0;

    for (let row = 1; row < forestSize - 1; row++) {
        for (let column = 1; column < forestSize - 1; column++) {
            if (isTreeVisible(row, column)) visibleInteriorTrees++
        }
    }

    return edgeTreesCount + visibleInteriorTrees;
}

expect(countVisibleTree(testData)).to.equal(21)
expect(countVisibleTree(testData2)).to.equal(18)
expect(countVisibleTree(taskInput)).to.equal(1713)

// Part 2: highest scenic score

/**
 * @param {string} input
 */
const countHighestScenicScore = (input) => {
    const forest = input
        .split('\n')
        .map(r => r.split(''))
        .map(r => r.map(c => parseInt(c, 10)));

    const forestSize = forest.length;

    /**
    *  @param {number} row
    *  @param {number} column
    */
    const getScore = (row, column) => {
        const size = forest[row][column]
        const isBigger = tree => tree >= size
    
        let leftScore = 0;
        for (let c = column - 1; c >= 0; c--) {
            leftScore++;
            if (isBigger(forest[row][c])) break;
        }

        let rightScore = 0;
        for (let c = column + 1; c < forestSize; c++) {
            rightScore++;
            if (isBigger(forest[row][c])) break;
        }

        let aboveScore = 0;
        for (let r = row - 1; r >= 0; r--) {
            aboveScore++;
            if (isBigger(forest[r][column])) break;
        }

        let belowScore = 0;
        for (let r = row + 1; r < forestSize; r++) {
            belowScore++;
            if (isBigger(forest[r][column])) break;
        }

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
expect(countHighestScenicScore(taskInput)).to.equal(268464)

// node 2022/8/TreetopTreeHouse.js
