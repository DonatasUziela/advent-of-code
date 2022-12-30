import { expect } from 'chai';
import { readFileSync } from 'fs';
import { sum } from 'lodash';
import { resolve } from 'path';
import { Coordinates } from 'utils/coordinates'
import { Polygon, Point, Line, intersections } from '@mathigon/euclid'

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8');
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8');

const calculateManhattanDistance = (c1: Coordinates, c2: Coordinates) => Math.abs(c2.x - c1.x) + Math.abs(c2.y - c1.y);

const merge = (ranges: number[][]) => {
    const result: number[][] = [];
    let last: number[] | undefined;

    ranges
        .sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]))
        .forEach((r) => {
            if (!last || r[0] > last[1])
                result.push(last = r);
            else if (r[1] > last[1])
                last[1] = r[1];
        })

    return result
}

const parseInput = (input: string) => input
    .split('\n')
    .map(l => l.split(':'))
    .map(([s, b]) => ({
        sensor: {
            x: parseInt(s.split('x=')[1].split(',')[0]),
            y: parseInt(s.split('y=')[1].split(',')[0])
        },
        beacon: {
            x: parseInt(b.split('x=')[1].split(',')[0]),
            y: parseInt(b.split('y=')[1].split(',')[0])
        }
    }))

const solve = (input: string, rowToCheck: number) => {
    const inputData = parseInput(input);

    const xCovered: number[][] = [];

    const line = new Line(
        new Point(Number.MIN_SAFE_INTEGER, rowToCheck),
        new Point(Number.MAX_SAFE_INTEGER, rowToCheck)
    )

    inputData.forEach(({ sensor, beacon }) => {
        const distanceToBeacon = calculateManhattanDistance(sensor, beacon);

        const diamond = new Polygon(
            new Point(sensor.x, sensor.y + distanceToBeacon),
            new Point(sensor.x + distanceToBeacon, sensor.y),
            new Point(sensor.x, sensor.y - distanceToBeacon),
            new Point(sensor.x - distanceToBeacon, sensor.y),
        );

        const intersect = intersections(diamond, line);

        if (!intersect.length) return;

        const normalized = intersect
            .map(p => Math.round(p.x))
            .sort((a, b) => a - b)
        
        xCovered.push(normalized.length === 1 ? [normalized[0], normalized[0]] : normalized)
    });

    const result = sum(merge(xCovered)
        .map(([start, end]) => end - start));

    return result
}

expect(solve(testData, 10)).to.equal(26)
expect(solve(taskInput, 2000000)).to.equal(5073496)

// Part 2

const solve2 = (input: string, size: number) => {
    const inputData = parseInput(input);

    const searchArea = new Polygon(
        new Point(0, 0),
        new Point(size, 0),
        new Point(size, size),
        new Point(0, size)
    );

    const diamonds = inputData
        .map(({ sensor, beacon }) => {
            const distanceToBeacon = calculateManhattanDistance(sensor, beacon);
            return new Polygon(
                new Point(sensor.x, sensor.y + distanceToBeacon),
                new Point(sensor.x + distanceToBeacon, sensor.y),
                new Point(sensor.x, sensor.y - distanceToBeacon),
                new Point(sensor.x - distanceToBeacon, sensor.y),
            );
        });

    const freeAreaPoints = Polygon
        .union(...diamonds)
        .flatMap(polygon => polygon.points)
        .filter(p => searchArea.contains(p));

    const freePoint = {
        x: freeAreaPoints.map(p => p.x).find((x, index, xs) => xs.indexOf(x) !== index),
        y: freeAreaPoints.map(p => p.y).find((y, index, ys) => ys.indexOf(y) !== index),
    }

    if (!freePoint.x || !freePoint.y) return 0;

    return freePoint.x * 4000000 + freePoint.y;
}

expect(solve2(testData, 20)).to.equal(56000011)
expect(solve2(taskInput, 4000000)).to.equal(13081194638237);

// npx ts-node 2022/15/BeaconExclusionZone.ts