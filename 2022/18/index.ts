import { expect } from 'chai';
import { readFileSync } from 'fs';
import { resolve }  from 'path';

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8');
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8');

type Coordinates3D = number[];
type BoolByKey = Record<string, boolean>

const getKey = (coords: Coordinates3D) => coords.join(':')

const get6Sides =  ([x, y, z]: Coordinates3D) => [
    [x + 1, y, z],
    [x - 1, y, z],
    [x, y + 1, z],
    [x, y - 1, z],
    [x, y, z + 1],
    [x, y, z - 1],
]

const solve = (input: string) => {
    const cubeCoordinates = input
        .split('\n')
        .map(l => l.split(','))
        .map(l => l.map(i => parseInt(i, 10)))
    
    const cubeExistsByKey = cubeCoordinates.reduce((result, coords) => {
        result[getKey(coords)] = true;
        return result
    }, {} as BoolByKey);

    const sides = cubeCoordinates
        .map(coords => get6Sides(coords)
            .filter(side => !cubeExistsByKey[getKey(side)])
            .length
        )
        .reduce((result, item) => result += item)
    
    return sides;    
}

expect(solve(testData)).to.equal(64)
expect(solve(taskInput)).to.equal(3396)

// Part 2

const solve2 = (input: string) => {
}

expect(solve2(testData)).to.equal(undefined)
expect(solve2(taskInput)).to.equal(undefined);

// npx ts-node 2022/18/index.ts