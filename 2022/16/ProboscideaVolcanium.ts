import { expect } from 'chai';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { findShortestDistances } from '../../utils/findShortestDistances';

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8');
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8');

type Node = { rate: number, nodeKeys: string[], valve: string }
type Graph = { [valve: string]: Node }

const parseInput = (input: string) => input
    .split('\n')
    .map(l => l.split(' '))
    .map(l => ({
        valve: l[1],
        rate: parseInt(l[4].split('=')[1].replace(';', '')),
        nodeKeys: l.slice(9).map(v => v.replace(',', ''))
    }))
    .reduce((result, { valve, rate, nodeKeys }) => {
        result[valve] = { valve, rate, nodeKeys }
        return result
    }, {} as Graph)

const MAX_TIME = 30;

const serializePair = ([first, second]: readonly [string, string]) => `${first}-${second}`

const getPairKey = (source: string, target: string) => {
    const pair = source > target ? [target, source] as const : [source, target] as const
    return serializePair(pair);
}

const START = 'AA';

const calculatePairDistances = (keys: string[], graph: Graph) => keys
    .reduce<Record<string, number>>((result, key) => {
        const distances = findShortestDistances(key, graph);

        Object
            .entries(distances)
            .forEach(([target, distance]) => {
                if (distance) {
                    result[getPairKey(key, target)] = distance;
                }
            });

        return result;
    }, {})

const solve = (input: string) => {
    const graph = parseInput(input)
    const nonZeroNodes = Object.values(graph).filter(v => v.rate > 0);
    const nonZeroNodesKeys = nonZeroNodes.map(n => n.valve);
    const nonZeroNodeKeysAndStart = [START, ...nonZeroNodesKeys];
    const pairsDistances = calculatePairDistances(nonZeroNodeKeysAndStart, graph);

    const search = (
        currentValve: string,
        closedValves = nonZeroNodesKeys,
        remainingTime = MAX_TIME,
        pressurePerTurn = 0,
        pressure = 0,
    ): number => {
        if (remainingTime === 0) return pressure;

        const pressureFromRemainingTime = remainingTime * pressurePerTurn;

        if (!closedValves.length) return pressure + pressureFromRemainingTime;

        const searches = closedValves.map(valve => {
            const distance = pairsDistances[getPairKey(currentValve, valve)];
            const requiredTime = distance + 1;

            if (remainingTime < requiredTime) return pressure + pressureFromRemainingTime

            return search(
                valve,
                closedValves.filter(v => v !== valve),
                remainingTime - requiredTime,
                pressurePerTurn + graph[valve].rate,
                pressure + (pressurePerTurn * requiredTime),
            );
        })

        return Math.max(...searches)
    }

    return search('AA');
}

expect(solve(testData)).to.equal(1651)
expect(solve(taskInput)).to.equal(2087)

// Part 2

const solve2 = (input: string) => {
}

expect(solve2(testData)).to.equal(1707)
expect(solve2(taskInput)).to.equal(undefined);

// npx ts-node 2022/16/ProboscideaVolcanium.ts