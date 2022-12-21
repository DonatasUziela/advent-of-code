import { expect } from 'chai';
import { readFileSync, appendFileSync, writeFileSync } from 'fs';
import { resolve }  from 'path';
import { Coordinates, down, left, render, right, serializeCoords, Symbols } from '../../utils/coordinates';
import { isDefined } from '../../utils/isDefined';

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8');
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8');

const WIDTH = 7;
const MAX_X = WIDTH - 1;
const START_X = 2;
const START_Y_DELTA = 4;

type Shape = Coordinates[];

const line = (top: number) => [
    { x: START_X, y: top },
    { x: START_X + 1, y: top },
    { x: START_X + 2, y: top },
    { x: START_X + 3, y: top }
];

const plus = (top: number) => [
    { x: START_X, y: top + 1 },
    { x: START_X + 1, y: top + 1 },
    { x: START_X + 1, y: top + 2 },
    { x: START_X + 1, y: top },
    { x: START_X + 2, y: top +1 }
]

const elShape = (top: number) => [
    { x: START_X, y: top },
    { x: START_X + 1, y: top },
    { x: START_X + 2, y: top },
    { x: START_X + 2, y: top + 1 },
    { x: START_X + 2, y: top + 2 }
]

const iShape = (top: number) => [
    { x: START_X, y: top },
    { x: START_X, y: top + 1 },
    { x: START_X, y: top + 2 },
    { x: START_X, y: top + 3 }
]

const square = (top: number) => [
    { x: START_X, y: top },
    { x: START_X + 1, y: top },
    { x: START_X, y: top + 1 },
    { x: START_X + 1, y: top + 1 }
]

const rockGenerators = [line, plus, elShape, iShape, square];

const shapeToSymbols = (shape: Coordinates[], symbol: string) =>
    shape.reduce((result, part) => {
        result[serializeCoords(part)] = symbol;
        return result;
    }, {} as Symbols)

const isShapeStoppped = (shape: Coordinates[], blocks: Coordinates[]) => {
    const blockedByOtherBlocks = !!shape.find((s) => blocks.find(b => areCoordinatesEqual(s, b)));
    const blockedByGround = shape.find(s => s.y < 1);
    return blockedByOtherBlocks || blockedByGround
}

const windAdjustment = (shape: Shape, step: number, winds: string[], blocks: Coordinates[]) => {
    const wind = winds[step % winds.length];
    const transform = wind === '>' ? right : left;
    const newShape = shape.map(transform);

    if (newShape.find(({ x }) => x < 0 || x > WIDTH - 1)) return shape;
    if (isShapeStoppped(newShape, blocks)) return shape // TODO: BET gali palisti "po" kitu shape

    return newShape
}

const findUniqPattern = (source: string, minLength: number) => {
    if (source.length < minLength) throw new Error('minLength should not be lower that length of string!')

    const max = Math.floor(source.length / 2);
    
    for (let i = minLength; i <= max; i++) {
        const subString = source.slice(0, i);
        const times = Math.floor(max / i) + 1;
        const testString = subString.repeat(times);

        if (source.indexOf(testString) === 0) return subString;
    }
}


const areCoordinatesEqual = (c1: Coordinates, c2: Coordinates) => c1.x === c2.x && c1.y === c2.y;

const solve = (input: string, maxRocks: number) => {
    const winds = input.split('');

    const minUniqPatternLength = Math.floor(winds.length / START_Y_DELTA) * rockGenerators.length;
    console.log({ windsLen: winds.length, minUniqPatternLength })

    // find initial offset
    // find how many blocks will it take for the pattern to repeat itself;
    // find remaining blocks without pattern

    let blocks: Coordinates[] = [];

    const getMaxY = () => blocks.length ? Math.max(...blocks.map(({ y }) => y)) : 0;

    const renderCurrent = (rock?: Shape) => {
        const symbols = {
            ...shapeToSymbols(blocks, '#'),
            ...rock ? shapeToSymbols(rock, '@') : {}
        }

        const screen = render({
            maxX: WIDTH - 1,
            maxY: getMaxY() + 3,
            symbols: symbols
        });
    
        console.log(screen)
    }

    let stepCount = 0;
    const xes = [0, 1, 2, 3, 4, 5, 6];

    const serializeGround = () => {
        const yS = xes.map(x => {
            const xBlocks = blocks.filter((b) => b.x === x);
            if (!xBlocks.length) return 0;
            return Math.max(...xBlocks.map((b) => b.y))
        })
        const minY = Math.min(...yS);
        return yS.map((y) => y - minY).join(' ');
    }

    const isBlockClosed = (b: Coordinates) => xes.every((x) => !!blocks.find((bb) => bb.x === x && bb.y > b.y + 2))

    const removeClosedShapes = () => {

        const filtered = blocks.filter(b => !isBlockClosed(b))

        if (filtered.length < blocks.length) {
            // console.log(`Removing ${ blocks.length - filtered.length} blocks`)
            blocks = filtered
        }
    }

    // const removeLine = (y: number) => {
    //     blocks = blocks
    //         .filter(b => b.y !== y)
    //         .map((b) => ({ x: b.x, y: b.y > y ? b.y - 1 : b.y }))
    // }

    // DEBUG: let numbersOfWindsUsed = [];

    let grounds: string[] = []
    let pattern: string[] | undefined;
    let patternStart: number | undefined;

    for (let rockCount = 0; rockCount <= maxRocks - 1; rockCount++) {
        const shapeIndex = rockCount % rockGenerators.length;
        let generator = rockGenerators[shapeIndex]
        let shape = generator(getMaxY() + START_Y_DELTA);

        // DEBUG: console.log(rockCount, blocks.length)
        // DEBUG: numbersOfWindsUsed.push(0);

        while (true) {
            // DEBUG: numbersOfWindsUsed[numbersOfWindsUsed.length - 1] += 1;
            shape = windAdjustment(shape, stepCount, winds, blocks);
            stepCount++;
            const movedDown = shape.map(down);
            if (isShapeStoppped(movedDown, blocks)) {
                blocks.push(...shape);
                removeClosedShapes(); 
                break;
            }
            shape = movedDown;
        }
        const ground = serializeGround();
        const firstGroundIndex = grounds.indexOf(ground)
        if (!isDefined(patternStart) && firstGroundIndex !== -1) {
            // starting pattern
            patternStart = firstGroundIndex;
            pattern = [ground]
        } else if (isDefined(patternStart)) {
            if (!isDefined(pattern)) throw new Error(`patternLength should be defined`)
            
            const comparingWith = grounds[patternStart + pattern.length];
            console.log({ comparingWith, patternStart, patternLeght: pattern.length })
            if (comparingWith === ground) { // TODO cut to find the SHORTEST repeating pattern
                // continuing pattern
                pattern.push(ground)
            } else {
                // stopping pattern
                if (pattern.length > 1) {
                    break
                }
                patternStart = undefined
                pattern = undefined
            }
        }
        grounds.push(ground);
    }

    console.log({ patternStart, patternLength: pattern?.length })

    // appendFileSync(resolve(__dirname, 'grounds.txt'), grounds.join('\n'), 'utf-8');
    writeFileSync(resolve(__dirname, 'grounds.txt'), grounds.join('\n'), 'utf-8');

    if (pattern) {
        // find shortest pattern length
        const paternString = pattern.join('\n');
        const splitLen = Math.floor(paternString.length / 2);
        const firstPart = paternString.slice(0, splitLen);
        const scndPart = paternString.slice(splitLen + 1);
        // if (scndPart.indexOf(firstPart) > -1)
    }

    // console.log(
    //     numbersOfWindsUsed.reduce((result, num) => {
    //         result[num] = (result[num] || 0) + 1
    //         return result;
    //     }, {} as Record<number, number>)
    // )

    // renderCurrent()

    return getMaxY();
}

expect(solve(testData, 2022)).to.equal(3068)
// expect(solve(taskInput, 2022)).to.equal(3159)

// Part 2

// expect(solve(testData, 1000_000_000_000)).to.equal(1514285714288)
// expect(solve(taskInput, 1000_000_000_000)).to.equal(undefined);

// npx ts-node 2022/17/index.ts