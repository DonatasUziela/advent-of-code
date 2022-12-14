const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

const taskInput = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf-8');
const testData = fs.readFileSync(path.resolve(__dirname, 'testData.txt'), 'utf-8');

const serializeCoords = ({ x, y }) => `${x}:${y}`

/**
 * @param {number[]} coords
 */
const normalize = ([x, y], minX) => [x - minX, y];

const symbolMatchers = [
    {
        match: ({ x, y }, { sandSource }) => sandSource.x === x && sandSource.y === y,
        symbol: '+'
    },
    {
        match: ({ x, y }, { sand }) => sand[serializeCoords({ x, y })],
        symbol: 'o'
    },
    {
        match: ({ x, y }, { rocks }) => rocks[serializeCoords({ x, y })],
        symbol: '#'
    },
    {
        match: () => true,
        symbol: '.'
    },
]

const render = ({ maxY, maxX, rocks, sandSource, sand }) => {
    const context = { rocks, sandSource, sand };
    const caveMap = [];

    for (let y = 0; y <= maxY; y++) {
        caveMap.push([]);
        for (let x = 0; x <= maxX; x++) {

            const { symbol } = symbolMatchers.find(({ match }) => match({ x, y }, context));

            caveMap[y][x] = symbol
        }
    }
    const screen = caveMap.map(l => l.join('')).join('\n');

    fs.writeFileSync(path.resolve(__dirname, 'cavemap.txt'), screen, 'utf-8');
}

/**
 * @param {{ x: number, y: number }[]} coords
 */
const linesToRocks = (coords) => coords.flatMap((c, index) => {
    const next = coords[index + 1];

    if (!next) return c;

    let result = [c];

    const diffX = next.x - c.x;
    const diffY = next.y - c.y;

    const signX = Math.sign(diffX);
    const signY = Math.sign(diffY);

    for (let x = c.x + signX; x !== next.x; x += signX)
        result.push({ x, y: c.y });
    for (let y = c.y + signY; y !== next.y; y += signY)
        result.push({ x: c.x, y });

    return result;
})

const sandFall = ({ sandUnit, maxY, rocks, sand }) => {
    const newY = sandUnit.y + 1;

    if (newY > maxY) return null; // no rest, abyss

    let coords = serializeCoords({ x: sandUnit.x, y: newY })

    // not blocked, fall down
    if (!rocks[coords] && !sand[coords]) {
        return {
            x: sandUnit.x,
            y: newY
        }
    }
    
    // blocked, try left
    let newX = sandUnit.x - 1;
    coords = serializeCoords({ x: newX, y: newY })

    if (!rocks[coords] && !sand[coords]) {
        return {
            x: newX,
            y: newY
        }
    }

    // blocked, try right
    newX = sandUnit.x + 1;
    coords = serializeCoords({ x: newX, y: newY })

    if (!rocks[coords] && !sand[coords]) {
        return {
            x: newX,
            y: newY
        }
    }

    return { ...sandUnit, rest: true }    
}

/**
 * @param {string} input
 */
const solve = (input) => {
    const linesData = input
        .split('\n')
        .map(l => l.split(' -> '))
        .map(l => l.map(c => c.split(',')))
        .map(l => l.map(c => c.map(d => parseInt(d))))

    const ys = linesData.flatMap(l => l.map(([_x, y]) => y))
    const xs = linesData.flatMap(l => l.map(([x, _y]) => x));

    const SAND_SOURCE_X = 500;
    const maxY = Math.max(...ys)
    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const normalizedMaxX = maxX - minX
    const sandSource = { x: SAND_SOURCE_X - minX, y: 0 };

    const normalized = linesData
        .map(l => l.map(c => normalize(c, minX)))
        .map(l => l.map(([x, y]) => ({ x, y })));

    const rocks = normalized
        .flatMap(linesToRocks)
        .reduce((result, c) => {
            result[serializeCoords(c)] = true;
            return result;
        }, {})

    const sand = {}

    let sandUnits = 0;
    let abyss = false;

    while (!abyss) {
        let sandUnit = sandSource;
        sandUnits++

        while (true) {
            sand[serializeCoords(sandUnit)] = false;
            sandUnit = sandFall({ sandUnit, maxY, rocks, sand })

            if (!sandUnit) {
                abyss = true;
                break;
            }

            sand[serializeCoords(sandUnit)] = true;
            if (sandUnit.rest) break;
        }
    }

    render({ maxX: normalizedMaxX, maxY, rocks, sandSource, sand })

    return --sandUnits;
}

expect(solve(testData)).to.equal(24)
expect(solve(taskInput)).to.equal(793)

// Part 2

/**
 * @param {string} input
 */
const solve2 = (input) => {
    const linesData = input
        .split('\n')
        .map(l => l.split(' -> '))
        .map(l => l.map(c => c.split(',')))
        .map(l => l.map(c => c.map(d => parseInt(d))))

    const ys = linesData.flatMap(l => l.map(([_x, y]) => y))

    const SAND_SOURCE_X = 500;
    const maxY = Math.max(...ys) + 2;
    const minX = 0
    const maxX = SAND_SOURCE_X * 2
    const sandSource = { x: SAND_SOURCE_X, y: 0 };

    const normalized = linesData
        .map(l => l.map(c => normalize(c, minX)))
        .map(l => l.map(([x, y]) => ({ x, y })));

    const bottomLine = []
    for (let x = 0; x <= maxX; x++) bottomLine.push({ x, y: maxY })

    const rocks = normalized
        .flatMap(linesToRocks)
        .concat(bottomLine)
        .reduce((result, c) => {
            result[serializeCoords(c)] = true;
            return result;
        }, {})

    const sand = {}
    let sandUnits = 0;

    while (true) {
        let sandUnit = sandSource;
        sandUnits++

        if (sand[serializeCoords(sandUnit)]) break;

        while (true) {
            sand[serializeCoords(sandUnit)] = false;
            sandUnit = sandFall({ sandUnit, maxY, rocks, sand })
            sand[serializeCoords(sandUnit)] = true;
            if (sandUnit.rest) break;
        }
    }

    render({ maxX, maxY, rocks, sandSource, sand })

    return --sandUnits;
}

expect(solve2(testData)).to.equal(93)
expect(solve2(taskInput)).to.equal(24166);

// node 2022/14/index.js 