import { expect } from "chai";
import { readFileSync } from "fs";
import { resolve } from "path";

const testData = readFileSync(resolve(__dirname, "testData.txt"), "utf-8");
const taskInput = readFileSync(resolve(__dirname, "input.txt"), "utf-8");

const parseInput = (input: string) =>
  input.split("\n").map((n) => parseInt(n, 10));

const move = (
  initialArrangement: number[],
  index: number,
  currentNumbers = initialArrangement,
  log = false
) => {
  const numberToMove = initialArrangement[index];
  const len = initialArrangement.length;
  const currentIndex = currentNumbers.indexOf(numberToMove);

  //TODO apply modulo math. Ex: [0 - 6]  2 - 3 = 5
  const toMove = numberToMove % len;
  const toMove2 = currentIndex + toMove;
  const toMove3 =
    toMove2 < 0
      ? // wrap from start to end
        len + toMove2 - 1
      : toMove2 >= len
      ? // wrap from end to start
        toMove2 % len
      : toMove2;

  const newIndex = toMove3;

  if (newIndex === index) {
    console.log(`${numberToMove} does not move:`);
    return currentNumbers;
  }
  if (log) {
    console.log({
      index,
      currentIndex,
      newIndex,
      numberToMove,
      toMove,
      toMove2,
      toMove3,
      len,
    });
  }

  const newNumbers = currentNumbers.slice(0);
  newNumbers.splice(currentIndex, 1);
  newNumbers.splice(
    // newIndex > index ? newIndex - 1 : newIndex,
    newIndex,
    0,
    numberToMove
  );
  if (log) {
    console.log(
      `${numberToMove} moves between ${newNumbers[newIndex - 1]} and ${
        newNumbers[newIndex + 1]
      }:`
    );
  }

  return newNumbers;
};

const test = () => {
  const initialArrangement = [1, 2, -3, 3, -2, 0, 4];

  const testCase1 = [4, 5, 6, 1, 7, 8, 9];
  const result1 = move(testCase1, 3);
  expect(result1).to.deep.eq([4, 5, 6, 7, 1, 8, 9]);

  const testCase2 = [4, -2, 5, 6, 7, 8, 9];
  const result2 = move(testCase2, 1);
  expect(result2).to.deep.eq([4, 5, 6, 7, 8, -2, 9]);

  expect(move(initialArrangement, 1, [2, 1, -3, 3, -2, 0, 4])).to.deep.eq([
    1, -3, 2, 3, -2, 0, 4,
  ]);

  const testCase3 = [1, -3, 2, 3, -2, 0, 4];
  expect(move(testCase3, 1)).to.deep.equal([1, 2, 3, -2, -3, 0, 4]);

  expect(move([1, 2, 3, -2, -3, 0, 4], 2)).to.deep.eq([1, 2, -2, -3, 0, 3, 4]);
};

test();

const solve = (input: string, log = false) => {
  const numbers = parseInput(input);
  if (log) {
    console.log("Initial arrangement:");
    console.log(numbers.join(", "));
  }

  let result = numbers;
  for (let i = 0; i < numbers.length; i++) {
    result = move(numbers, i, result, log);
    if (log) {
      console.log(result.join(", "));
    }
  }

  const indexOfZero = result.indexOf(0);

  const findNth = (n: number) => {
    const toMove = n % numbers.length;
    const indexOfFoundNumber = (indexOfZero + toMove) % numbers.length;
    return result[indexOfFoundNumber];
  };

  const coord1 = findNth(1000);
  const coord2 = findNth(2000);
  const coord3 = findNth(3000);

  //   console.log({ coord1, coord2, coord3 });

  return coord1 + coord2 + coord3;
};

expect(solve(testData)).to.equal(3); // 3
expect(solve(taskInput)).to.equal(-3520);

// Part 2

const solve2 = (input: string) => {};

expect(solve2(testData)).to.equal(undefined);
expect(solve2(taskInput)).to.equal(undefined);

// npx ts-node 2022/20/index.ts
