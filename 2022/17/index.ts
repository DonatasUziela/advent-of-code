import { expect } from 'chai';
import { readFileSync, appendFileSync, writeFileSync } from 'fs';
import { resolve }  from 'path';
import { Coordinates, down, left, render, right, serializeCoords, Symbols } from '../../utils/coordinates';
import { isDefined } from '../../utils/isDefined';
import { kmpMatching } from './kmp';

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8');
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8');
const GROUNDS_FILE = 'grounds.txt';

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


const areCoordinatesEqual = (c1: Coordinates, c2: Coordinates) => c1.x === c2.x && c1.y === c2.y;

const solve = (input: string, maxRocks: number, write?: boolean, append?: boolean) => {
    const winds = input.split('');

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

    let grounds: string[] = []

    for (let rockCount = 0; rockCount <= maxRocks - 1; rockCount++) {
        const shapeIndex = rockCount % rockGenerators.length;
        let generator = rockGenerators[shapeIndex]
        let shape = generator(getMaxY() + START_Y_DELTA);

        while (true) {
            shape = windAdjustment(shape, stepCount, winds, blocks);
            stepCount++;
            const movedDown = shape.map(down);
            if (isShapeStoppped(movedDown, blocks)) {
                blocks.push(...shape);
                break;
            }
            shape = movedDown;
        }
        const ground = serializeGround();
        grounds.push(ground);
    }

    if (append) appendFileSync(resolve(__dirname, GROUNDS_FILE), grounds.join('\n'), 'utf-8');
    if (write) writeFileSync(resolve(__dirname, GROUNDS_FILE), grounds.join('\n'), 'utf-8');

    return {
        grounds,
        maxY: getMaxY()
    }
}

expect(solve(testData, 2022).maxY).to.equal(3068)
expect(solve(taskInput, 2022).maxY).to.equal(3114)

// Part 2

const ROCKS_COUNT = 1000_000_000_000;

const findRepeatingPattern = (grounds: string[]) => {
    const groundAsString = grounds.join('\n');
    const repeatingPatternsMap = grounds.reduce((result, ground, index) => {
        result.set(ground, (result.get(ground) || 0) + 1)
        return result;
    }, new Map() as Map<string, number>)


    let pattern = '';
    let patternLength = 0;

    for (const [ground, times] of repeatingPatternsMap) {
        if (times === 1) repeatingPatternsMap.delete(ground)
    }
    pattern = pattern.slice(0, -1);

    const firstPattern = repeatingPatternsMap.entries().next().value[0];
    const matches = kmpMatching(groundAsString, firstPattern);

    console.log({ matches })

    return {
        startIndex: grounds.indexOf(firstPattern),
        patternLength,
        pattern,
        repeatingPatternsMap
    }
}

const solve2 = (input: string) => {
    const { grounds } = solve(input, 6000, true)
    const { startIndex, patternLength, pattern, repeatingPatternsMap } = findRepeatingPattern(grounds);

    // let pattern = '';
    // for (const [ground] of repeatingPatternsMap) {
    //     pattern += ground
    //     pattern += '\n'
    // }
    console.log('------')
    console.log(pattern)

    const yBeforePatternStarts = solve(input, startIndex - 1).maxY;
    const yAfterFirstPatternEnds = solve(input, startIndex + patternLength - 1).maxY;
    const patternY = yAfterFirstPatternEnds - yBeforePatternStarts;
    const patternRepeats = Math.floor((ROCKS_COUNT - startIndex - 1) / patternLength)
    const remainingGroundsCount = (ROCKS_COUNT - startIndex - 1) % patternLength
    const yOfStartingAndEndingPartsNotInFullPattern = solve(input, startIndex + remainingGroundsCount - 1).maxY
    const yAfterAllPatterns = yOfStartingAndEndingPartsNotInFullPattern - yBeforePatternStarts;
    
    return yBeforePatternStarts + (patternY * patternRepeats) + yAfterAllPatterns;
}


expect(solve2(testData)).to.equal(1514285714288)
expect(solve2(taskInput)).to.equal(1540317460306);

// npx ts-node 2022/17/index.ts