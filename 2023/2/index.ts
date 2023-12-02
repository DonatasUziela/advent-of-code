import { expect } from 'chai';
import { readFileSync } from 'fs';
import { sum } from 'lodash';
import { resolve } from 'path';

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8');
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8');

const parse = (entry: string) => {
    const [gameIdString, restString] = entry.split(':');
    const reachStrings = restString.split(';')
    const cubeStrings = reachStrings.map(s => s.split(','));
    const cubeValues = cubeStrings.map(r => {
        const values: Record<string, number> = {
            red: 0,
            green: 0,
            blue: 0
        }
        r.forEach(c => {
            const [numberText, color] = c.trim().split(' ');
            values[color] = parseInt(numberText, 10);
        });
        return values
    })

    return {
        gameId: parseInt(gameIdString.split('Game ').pop()!, 10),
        cubeValues
    }
}

const MAX_RED = 12;
const MAX_GREEN = 13;
const MAX_BLUE = 14;


const solve = (input: string) => {
    const entries = input.split('\r\n');
    const parsed = entries.map(parse)

    const validGames = parsed.filter(({ cubeValues }) =>
        cubeValues.every(reach =>
            reach.red <= MAX_RED && reach.green <= MAX_GREEN && reach.blue <= MAX_BLUE
        )
    )

    const gameIds = validGames.map(g => g.gameId);

    return sum(gameIds)
}

expect(solve(testData)).to.equal(8)
expect(solve(taskInput)).to.equal(2545)

// Part 2

const solve2 = (input: string) => {
    const entries = input.split('\r\n');
    const parsed = entries.map(parse)

    const fewestPossible = parsed.map(({ cubeValues }) => ({
        red: Math.max(...cubeValues.map(r => r.red)),
        green: Math.max(...cubeValues.map(r => r.green)),
        blue: Math.max(...cubeValues.map(r => r.blue))
    }))

    const powers = fewestPossible.map(g => g.red * g.green * g.blue)

    return sum(powers)
}

expect(solve2(testData)).to.equal(2286)
expect(solve2(taskInput)).to.equal(78111);

// npx ts-node 2023/2/index.ts