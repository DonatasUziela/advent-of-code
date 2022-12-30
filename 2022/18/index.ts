import { expect } from 'chai';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { Coordinates3D, get6Sides } from 'utils/coordinates3d';

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

const solve2 = (input: string, write = false) => {
    const cubeCoordinates = parseCubes(input)

    if (write) writeFileSync(resolve(__dirname, 'input.json'), JSON.stringify(cubeCoordinates), 'utf-8');

    const cubeExistsByKey = cubeCoordinates.reduce((result, coords) => {
        result[getKey(coords)] = true;
        return result
    }, {} as BoolByKey);

    const xAxis = cubeCoordinates.map(c => c[0]);
    const yAxis = cubeCoordinates.map(c => c[1]);
    const zAxis = cubeCoordinates.map(c => c[2]);
    const minX = Math.min(...xAxis);
    const maxX = Math.max(...xAxis);
    const minY = Math.min(...yAxis);
    const maxY = Math.max(...yAxis);
    const minZ = Math.min(...zAxis);
    const maxZ = Math.max(...zAxis);

    const isOutOfBounds = ([x, y, z]: Coordinates3D) =>
        x > maxX + 1 || y > maxY + 1 || z > maxZ + 1 ||
        x < minX - 1 || y < minY -1 || z < minZ - 1

    const start = [minX, minY, minZ];
    const water: Record<string, Coordinates3D> = { [getKey(start)]: start };

    const expand = (coords: Coordinates3D, surfaceArea: number): number => {
        const sides = get6Sides(coords);
        const toVisit = sides.filter(side => {
            const key = getKey(side);
            return !water[key] &&
                !cubeExistsByKey[key] &&
                !isOutOfBounds(side)
        });

        toVisit.forEach(c => water[getKey(c)] = c)

        const current = sides
            .filter(side => cubeExistsByKey[getKey(side)])
            .length

        const others = toVisit.reduce((acc, side) => acc + expand(side, surfaceArea), surfaceArea);

        return current + others
    }

    const result = expand(start, 0)

    if (write) writeFileSync(resolve(__dirname, 'water.json'), JSON.stringify(Object.values(water)), 'utf-8');

    return result
}

expect(solve2(testData)).to.equal(58)
expect(solve2(taskInput)).to.equal(2044)

// npx ts-node 2022/18/index.ts