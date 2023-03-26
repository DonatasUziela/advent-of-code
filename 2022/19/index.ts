import { expect } from 'chai';
import { readFileSync } from 'fs';
import { map } from 'lodash';
import { resolve } from 'path';

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8');
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8');

type ResourceType = 'ore' | 'clay' | 'obsidian' | 'geode'
type Resources = Record<ResourceType, number>
type Cost = Partial<Record<ResourceType, number>>;
type RobotCosts = Record<ResourceType, Cost>
type Robots = Record<ResourceType, number>;

interface BluePrint extends RobotCosts {
    id: number;
}

const extractCost = (input: string) => input
    .split('costs ')[1]
    .split('and ')
    .reduce<Cost>((cost, l) => {
        const [amount, resource] = l.split(' ');
        cost[resource as ResourceType] = parseInt(amount);
        return cost;
    }, {})

const parseBlueprints = (input: string): BluePrint[] => input
    .split('\r\n')
    .map<BluePrint>(blueprint => {
        const [ore, clay, obsidian, geode] = blueprint
            .split('.')
            .slice(0, -1)
            .map(extractCost);

        return {
            id: parseInt(blueprint
                .split(':')[0]
                .split(' ')
                .pop() || '0'
            ),
            ore,
            clay,
            obsidian,
            geode
        };
    })

const canAfford = (cost: Cost, resources: Resources) => Object.entries(cost)
    .every(([resource, amount]) =>
        resources[resource as ResourceType] >= amount
    )

const deductImmutable = (cost: Cost, resources: Resources) => {
    const newResources = { ...resources }
    Object.entries(cost).forEach(([resource, amount]) => {
        newResources[resource as ResourceType] -= amount
    })
    return newResources
}

const decide2 = (blueprint: BluePrint, resources: Resources): ResourceType | undefined => {
    if (canAfford(blueprint.geode, resources)) {
        return 'geode'
    }

    if (canAfford(blueprint.obsidian, resources)) {
        return 'obsidian'
    }

    if (canAfford(blueprint.clay, resources) && Math.random() > 0.5) {
        return 'clay'
    }

    if (canAfford(blueprint.ore, resources) && Math.random() > 0.5) {
        return 'ore'
    }
}


const addResources = (resources: Resources, robots: Robots) => {
    const newResources = { ...resources }
    Object.entries(robots).forEach(([resource, count]) => {
        if (count > 0) {
            newResources[resource as ResourceType] += count;
        }
    })
    return newResources;
}

const solve = (input: string) => {
    const blueprints = parseBlueprints(input);
    const MAX_MINUTES = 24;

    const takeTurn = (turn: number, blueprint: BluePrint, resources: Resources, robots: Robots): number => {
        let newRobots = robots;
        let newResources = resources;
        const type = decide2(blueprint, resources)

        if (type) {
            newRobots = {
                ...robots,
                [type]: robots[type] + 1
            }
            newResources = deductImmutable(blueprint[type], resources);
        }

        newResources = addResources(newResources, robots);

        if (turn === MAX_MINUTES) return newResources.geode;

        return takeTurn(turn + 1, blueprint, newResources, newRobots);
    }

    const initialResources = { ore: 0, clay: 0, obsidian: 0, geode: 0 };
    const initialRobots = { ore: 1, clay: 0, obsidian: 0, geode: 0 }

    const solveBlueprintMultipleTimes = (blueprint: BluePrint) => {
        let bestResult = 0;
        for (let i = 0; i < 5000; i++) {
            let result = takeTurn(1, blueprint, initialResources, initialRobots);
            bestResult = Math.max(result, bestResult)
        }
        console.log({ id: blueprint.id, bestResult })

        return bestResult
    }

    return blueprints
        .map(blueprint => {
            return blueprint.id * solveBlueprintMultipleTimes(blueprint)
        } )
        .reduce((sum, item) => sum + item)
}

expect(solve(testData)).to.equal(33)
expect(solve(taskInput)).to.equal(1382)

// Part 2

const solve2 = (input: string) => {
    const MAX_MINUTES = 32;
}

expect(solve2(testData)).to.equal(undefined)
expect(solve2(taskInput)).to.equal(undefined);

// npx ts-node 2022/19/index.ts