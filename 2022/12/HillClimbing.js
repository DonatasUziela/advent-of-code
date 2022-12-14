const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

const taskInput = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf-8');
const testData = fs.readFileSync(path.resolve(__dirname, 'testData.txt'), 'utf-8');

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

/**
 * @param {string[][]} heightmap
 */
const getMultipleSymbolCoordinates = (heightmap, symbol) => {
    let result = [];
    for (let y = 0; y < heightmap.length; y++) {
        for (let x = 0; x < heightmap[y].length; x++) {
            if (heightmap[y][x] === symbol) result.push({ x, y })
        }
    }
    return result;
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

const findShortestPath = (from, to, graph) => {
    const distances = Object.keys(graph).reduce((result, key) => {
        result[key] = Number.MAX_SAFE_INTEGER;
        return result
    }, {})
    distances[serializeCoords(from)] = 0;

    let visitedMap = {
        [serializeCoords(from)]: true
    }

    let queue = [serializeCoords(from)];

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

    return distances[serializeCoords(to)];
}

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

    return findShortestPath(start, end, graph)
}

expect(solve(testData)).to.equal(31);
expect(solve(taskInput)).to.equal(528);

// Part 2

/**
 * @param {string} input
 */
const solve2 = (input) => {
    const letters = input.split('\n').map(l => l.split(''))
    const end = { ...getSymbolCoordinates(letters, 'E'), symbol: 'E' }
    const lettersNoSpecials = letters.map(row => row.map(letter => letter === 'S' ? 'a' : letter === 'E' ? 'z' : letter));
    const starts = getMultipleSymbolCoordinates(lettersNoSpecials, 'a')

    const heightmap = lettersNoSpecials
        .map(row => row.map(letter => letter.charCodeAt(0) - 97))

    const boundsFilter = createBoundsFilter(letters[0].length, letters.length);

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

    const lengths = starts.map(start => findShortestPath(start, end, graph));

    return Math.min(...lengths)
}

expect(solve2(testData)).to.equal(29)
expect(solve2(taskInput)).to.equal(522);

// node 2022/12/HillClimbing.js 