const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf-8');
const pairs = input.split('\n').map(l => l.split(' '));

const [OPPONENT_ROCK, OPPONENT_PAPER, OPPONENT_SCISSORS] = ['A', 'B', 'C'];
const [MY_ROCK, MY_PAPER, MY_SCISSORS]  = ['X','Y','Z'];

const winingCombinations = {
    [OPPONENT_ROCK]: MY_PAPER,
    [OPPONENT_PAPER]: MY_SCISSORS,
    [OPPONENT_SCISSORS]: MY_ROCK
};
const drawCombinations = {
    [OPPONENT_ROCK]: MY_ROCK,
    [OPPONENT_PAPER]: MY_PAPER,
    [OPPONENT_SCISSORS]: MY_SCISSORS
};
const loosingCombintations = {
    [OPPONENT_ROCK]: MY_SCISSORS,
    [OPPONENT_PAPER]: MY_ROCK,
    [OPPONENT_SCISSORS]: MY_PAPER
}

const win = (opponentShape) => winingCombinations[opponentShape];
const draw = (opponentShape) => drawCombinations[opponentShape];
const loose = (opponentShape) => loosingCombintations[opponentShape];

const scoreByShape = {
    [MY_ROCK]: 1,
    [MY_PAPER]: 2,
    [MY_SCISSORS]: 3
};

// Part 1

const wonGamesScore = pairs
    .filter(([opponentShape, myShape]) => win(opponentShape) === myShape)
    .length * 6;

const drawGamesScore = pairs
    .filter(([opponentShape, myShape]) => draw(opponentShape) === myShape)
    .length * 3;

const shapeScore = pairs
    .map(([, myShape]) => scoreByShape[myShape])
    .reduce((result, score) => result += score)

const totalScore = wonGamesScore + drawGamesScore + shapeScore;

console.log({ wonGamesScore, drawGamesScore, shapeScore, totalScore })

// totalScore: 13526

// Part 2

const wonGamesScore2 = pairs
    .filter(([, result]) => result === 'Z')
    .length * 6;

const drawGamesScore2 = pairs
    .filter(([, result]) => result === 'Y')
    .length * 3;

const strategyBySymbol = {
    X: loose,
    Y: draw,
    Z: win
}

const shapeScore2 = pairs
    .map(([opponentShape, symbol]) => {
        const strategy = strategyBySymbol[symbol];
        const myShape = strategy(opponentShape);
        return scoreByShape[myShape]
    })
    .reduce((result, score) => result += score);

const totalScore2 = wonGamesScore2 + drawGamesScore2 + shapeScore2;

console.log({ wonGamesScore2, drawGamesScore2, shapeScore2, totalScore2 })

// totalScore2: 14204

// node 2022/2/RockPaperScissors.js