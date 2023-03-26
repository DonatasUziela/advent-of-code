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

const deduct = (cost: Cost, resources: Resources) => {
    Object.entries(cost).forEach(([resource, amount]) => {
        resources[resource as ResourceType] -= amount
    })
}

const deductImmutable = (cost: Cost, resources: Resources) => {
    const newResources = { ...resources }
    Object.entries(cost).forEach(([resource, amount]) => {
        newResources[resource as ResourceType] -= amount
    })
    return newResources
}

const resourcePriority: ResourceType[] = ['geode', 'obsidian', 'clay', 'ore']

const decide = (blueprint: BluePrint, resources: Resources, robots: Robots): ResourceType[][] => {
    const affordableTypes = resourcePriority
        .filter(type => canAfford(blueprint[type], resources));
    const remainingScenarios = affordableTypes.flatMap(type => {
        const cost = blueprint[type];
        const remainingDecisions = decide(blueprint, deductImmutable(cost, resources), robots);
        return [
            ...remainingDecisions.map(decision => [type, ...decision]),
            [type]
        ]
    })

    return remainingScenarios
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
    const MAX_MINUTES = 20;

    let decisionCount = 0;

    const takeTurn = (turn: number, blueprint: BluePrint, resources: Resources, robots: Robots): number => {
        const decisions = resourcePriority
            .filter(type => canAfford(blueprint[type], resources))
            .map(type => ({
                newRobots: {
                    ...robots,
                    [type]: robots[type] + 1
                },
                newResources: deductImmutable(blueprint[type], resources)
            }))
            .concat({
                newResources: resources,
                newRobots: robots
            }) // don't buy anything


        if (turn === MAX_MINUTES) return resources.geode;

        const possibleScenarios = decisions.map(({ newResources, newRobots }) => {
            decisionCount++;
            return takeTurn(turn + 1, blueprint, addResources(newResources, robots), newRobots);
        })

        return Math.max(...possibleScenarios)

    }

    const findMaxGeodeCount = (blueprint: BluePrint): number => {
        const resources: Resources = { ore: 0, clay: 0, obsidian: 0, geode: 0 };
        const robots: Robots = { ore: 1, clay: 0, obsidian: 0, geode: 0 };

        const buildRobots = () => {
            const newRobots = { ore: 0, clay: 0, obsidian: 0, geode: 0 };

            // TODO: implement saving for resource logic

            resourcePriority.forEach(resource => {
                const cost = blueprint[resource];
                if (canAfford(cost, resources)) {
                    newRobots[resource] += 1
                    deduct(cost, resources)
                }
                // while (canAfford(cost, resources)) {
                // console.log('Can afford', resource, cost, resources)
                // console.log(`Spend ${JSON.stringify(cost)} to start building a ${resource}-collecting robot.`)
                // }
            })

            return newRobots
        }



        for (let minute = 1; minute <= MAX_MINUTES; minute++) {
            console.log(`== Minute ${minute} ==`)
            const affordableTypes = resourcePriority.filter(type => canAfford(blueprint[type], resources));
            const decisions = [...affordableTypes, 'save'];
            const newRobots = buildRobots();
            console.log({ decisions })
            // console.log({ minute, resources, robots, newRobots })


            robots.ore += newRobots.ore;
            robots.clay += newRobots.clay;
            robots.obsidian += newRobots.obsidian;
            robots.geode += newRobots.geode;
        }
        console.log(`===== MAX GEODE COUNT FOR BLUEPRINT ${blueprint.id} IS ${resources.geode} =====`)
        return resources.geode;
    }

    // const makeTurn = (resources: Resources, robots: Robots, minute = 1): number => {
    //     const decisions = decide(resources, robots)

    //     if (minute === 24) {
    //         return mine(resources, robots).geode;
    //     }

    //     return decisions.map(({ newRobots, remainingResources }) => {
    //         const nextResources = mine(remainingResources);
    //         const nextRobots = addRobots(robots, newRobots)
    //         return makeTurn(nextResources, nextRobots, minute + 1);
    //     })
    // }

    const initialResources = { ore: 0, clay: 0, obsidian: 0, geode: 0 };
    const initialRobots = { ore: 1, clay: 0, obsidian: 0, geode: 0 }

    return blueprints
        .slice(0, 1) // TODO: remove
        .map(blueprint => blueprint.id * takeTurn(1, blueprint, initialResources, initialRobots))
        .reduce((sum, item) => sum + item)
}

expect(solve(testData)).to.equal(33)
// expect(solve(taskInput)).to.equal(undefined)

// Part 2

const solve2 = (input: string) => {
}

expect(solve2(testData)).to.equal(undefined)
expect(solve2(taskInput)).to.equal(undefined);

// npx ts-node 2022/19/index.ts