import { expect } from 'chai';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { findShortestDistances } from '../../utils/findShortestDistances';

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8');
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8');

type Node = { rate: number, nodeKeys: string[], valve: string }
type Graph = { [valve: string]: Node }

const parseInput = (input: string) => input
    .split('\r\n')
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
    const MAX_TIME = 30;
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
expect(solve(taskInput)).to.equal(2056)

// Part 2

const solve2 = (input: string) => {
    const MAX_TIME = 26;
    const graph = parseInput(input)
    const nonZeroNodes = Object.values(graph).filter(v => v.rate > 0);
    const nonZeroNodesKeys = nonZeroNodes.map(n => n.valve);
    const nonZeroNodeKeysAndStart = [START, ...nonZeroNodesKeys];
    const pairsDistances = calculatePairDistances(nonZeroNodeKeysAndStart, graph);

    const search = (
        currentValveMe: string,
        currentValveElephant: string,
        closedValves = nonZeroNodesKeys,
        remainingTime = MAX_TIME,
        pressurePerTurn = 0,
        pressure = 0,
    ): number => {
        if (remainingTime === 0) return pressure;

        const pressureFromRemainingTime = remainingTime * pressurePerTurn;
        const accumulatedPressure = pressure + pressureFromRemainingTime;

        if (!closedValves.length) return accumulatedPressure

        const searches = closedValves.map(myValve => {
            const remainingValves = closedValves.filter(v => v !== myValve);
            const myDistanceToValve = pairsDistances[getPairKey(currentValveMe, myValve)];
            const myRequiredTime = myDistanceToValve + 1;

            if (remainingTime < myRequiredTime) return accumulatedPressure;

            const myNewPressurePerTurn = pressurePerTurn + graph[myValve].rate

            const mySearch = search(
                myValve,
                currentValveElephant,
                remainingValves,
                remainingTime - myRequiredTime,
                myNewPressurePerTurn,
                pressure + (pressurePerTurn * myRequiredTime),
            );

            const elephantSearch = remainingValves.map((elephantValve => {
                const elephantDistanceToValve = pairsDistances[getPairKey(currentValveElephant, elephantValve)];
                const elephantRequiredTime = elephantDistanceToValve + 1;

                if (remainingTime < elephantRequiredTime) return accumulatedPressure; // TODO dont add same accumulated pressure

                return search(
                    myValve,
                    elephantValve,
                    remainingValves.filter(v => v !== elephantValve),
                    remainingTime - elephantRequiredTime,
                    pressurePerTurn + graph[elephantValve].rate,
                    pressure + (pressurePerTurn * elephantRequiredTime)
                )
            }))

            return elephantSearch
        })
        return 0
        // return Math.max(...searches)
    }

    return search('AA', 'AA');
}

expect(solve2(testData)).to.equal(1707)
expect(solve2(taskInput)).to.equal(undefined);

// npx ts-node 2022/16/ProboscideaVolcanium.ts