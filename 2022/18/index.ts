import { expect } from 'chai';
import { readFileSync, writeFileSync } from 'fs';
import { resolve }  from 'path';
import { back, Coordinates3D, down, front, get6Sides, left, right, up } from '../../utils/coordinates3d';

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8');
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8');

type BoolByKey = Record<string, boolean>

const getKey = (coords: Coordinates3D) => coords.join(':')

const parseCubes = (input: string) => input
    .split('\n')
    .map(l => l.split(','))
    .map(l => l.map(i => parseInt(i, 10)))

const solve = (input: string) => {
    const cubeCoordinates = parseCubes(input)
    
    const cubeExistsByKey = cubeCoordinates.reduce((result, coords) => {
        result[getKey(coords)] = true;
        return result
    }, {} as BoolByKey);

    const surfaceArea = cubeCoordinates
        .map(coords => get6Sides(coords)
            .filter(side => !cubeExistsByKey[getKey(side)])
            .length
        )
        .reduce((result, item) => result += item)
    
    return surfaceArea;    
}

expect(solve(testData)).to.equal(64)
expect(solve(taskInput)).to.equal(3396)



// Part 2

const solve2 = (input: string) => {
    const cubeCoordinates = parseCubes(input)

    writeFileSync(resolve(__dirname, 'testData.json'), JSON.stringify(cubeCoordinates), 'utf-8');

    const cubeExistsByKey = cubeCoordinates.reduce((result, coords) => {
        result[getKey(coords)] = true;
        return result
    }, {} as BoolByKey);

    const xs = cubeCoordinates.map(c => c[0]);
    const ys = cubeCoordinates.map(c => c[1]);
    const zs = cubeCoordinates.map(c => c[2]);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const minZ = Math.min(...zs);
    const maxZ = Math.max(...zs);

    const isDirectionBlocked = (
        coords: Coordinates3D,
        direction: (coords: Coordinates3D) => Coordinates3D,
        isEnd: (coords: Coordinates3D) => boolean
    ) => {
        do {
            coords = direction(coords)
            if (cubeExistsByKey[getKey(coords)]) return true
        } while (isEnd(coords))
        
        return false;
    }

    console.log({ minX, maxX, minY, maxY, minZ, maxZ })

    // TODO: overall min/max is not correct, should be "per-line"
    const isCubeTrapped = (coords: Coordinates3D) => {
        return isDirectionBlocked(coords, right, (c) => c[0] <= maxX) &&
            isDirectionBlocked(coords, left, (c) => c[0] >= minX) &&
            isDirectionBlocked(coords, down, (c) => c[1] >= minY) &&
            isDirectionBlocked(coords, up,  (c) => c[1] <= maxY) &&
            isDirectionBlocked(coords, front, (c) => c[2] <= maxZ) &&
            isDirectionBlocked(coords, back, (c) => c[2] >= minZ)
    }
    
    const surfaceArea = cubeCoordinates
        .map(coords => get6Sides(coords)
            .filter(side => !cubeExistsByKey[getKey(side)])
            .filter(side => !isCubeTrapped(side))
            .length
        )
        .reduce((result, item) => result + item)

    return surfaceArea
}

expect(solve2(testData)).to.equal(58)
// expect(solve2(taskInput)).to.be.above(2029); // higher than 2029

// npx ts-node 2022/18/index.ts