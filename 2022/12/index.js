const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

const taskInput = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf-8');
const testData = fs.readFileSync(path.resolve(__dirname, 'testData.txt'), 'utf-8');

const areCoordsEqual = (a, b) => a.x === b.x && a.y === b.y;

/**
 * @param {string[][]} heightmap
 */
const getSymbolCoordinates = (heightmap, symbol) => {
    for (let y = 0; y < heightmap.length; y++) {
        for (let x = 0; x < heightmap[y].length; x++) {
            if (heightmap[y][x] === symbol) return { x, y }
        }
    }
}

const get4Directions = ({ x, y }) => [
    {
        x: x + 1,
        y,
        symbol: 'r'
    },
    {
        x: x - 1,
        y,
        symbol: 'l'
    },
    {
        x,
        y: y + 1,
        symbol: 'd'
    },
    {
        x,
        y: y - 1,
        symbol: 'u'
    },
];

const createBoundsFilter = (width, height) => ({ x, y }) => x >= 0 && x < width && y >= 0 && y < height

const serializeCoords = ({ x, y }) => `${x}:${y}`
const serializePath = (coords) => coords.map(serializeCoords).join('-')

function Node(value, linkedNodes) {
    this.value = value;
    this.linkedNodes = linkedNodes;
}

// const root = {
//     '0:0': ['1:0', '0:1'],
//     '1:0': ['1:0', '0:1'],
// )

/**
 * @param {string} input
 */
const solve = (input) => {
    const letters = input.split('\n').map(l => l.split(''))
    const start = { ...getSymbolCoordinates(letters, 'S'), symbol: 'S' }
    const end = { ...getSymbolCoordinates(letters, 'E'), symbol: 'E' }

    const heightmap = letters
        .map(row => row.map(letter => letter === 'S' ? 'a' : letter === 'E' ? 'z' : letter))
        .map(row => row.map(letter => letter.charCodeAt(0) - 97))


    const boundsFilter = createBoundsFilter(letters[0].length, letters.length)

    const graph = letters
        .reduce((result, row, y) => {
            row.forEach((letter, x) => {
                const adjacent = get4Directions({ x, y })
                    .filter(boundsFilter)
                    .filter(d => heightmap[d.y][d.x] - heightmap[y][x] <= 1)

                result[serializeCoords({ x, y })] = adjacent.map(serializeCoords)
            }, {})
            return result
        } ,{})

    const distances = Object.keys(graph).reduce((result, key) => {
        result[key] = Number.MAX_SAFE_INTEGER;
        return result
    }, {})
    distances[serializeCoords(start)] = 0;

    let visitedMap = {
        [serializeCoords(start)]: true
    }

    let queue = [serializeCoords(start)];

    while (queue.length) {
        const current = queue.shift();
        const distanceToCurrentNode = distances[current];
        const adjacentKeys = graph[current].filter(key => !visitedMap[key])

        adjacentKeys.forEach(node => {
            let newDistanceToAdjacentNode = distanceToCurrentNode + 1;
            distances[node] = Math.min(distances[node], newDistanceToAdjacentNode)
            visitedMap[node] = true;
        })

        queue.push(...adjacentKeys)
        
    }

    const distanceToEnd = distances[serializeCoords(end)];

    return distanceToEnd
}

expect(solve(testData)).to.equal(31);
expect(solve(taskInput)).to.equal(528);

// Part 2

/**
 * @param {string} input
 */
const solve2 = (input) => {
}

expect(solve2(testData)).to.equal(undefined)
expect(solve2(taskInput)).to.equal(undefined);

// node 2022/12/index.js 