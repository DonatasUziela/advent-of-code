import { expect } from "chai";
import { readFileSync } from "fs";
import { uniq, keyBy } from "lodash";
import { resolve } from "path";

const testData = readFileSync(resolve(__dirname, "testData.txt"), "utf-8");
const taskInput = readFileSync(resolve(__dirname, "input.txt"), "utf-8");

const parseInput = (input: string) =>
  input.split("\n").map((n) => parseInt(n, 10));

const generateIndexes = (amount: number) => {
  let result: Record<number, number> = {};
  for (let i = 0; i < amount; i++) {
    result[i] = i;
  }
  return result;
};

const move = (
  initialArrangement: number[],
  index: number,
  currentNumbers = initialArrangement,
  indexes = generateIndexes(initialArrangement.length),
  log = false
) => {
  //   const initialData = initialArrangement.map((value, index) => ({
  //     originalIndex: index,
  //     currentIndex: index,
  //     value,
  //   }));
  //   const initialMap = keyBy(initialData, "originalIndex");

  const numberToMove = initialArrangement[index];
  const len = initialArrangement.length;
  const currentIndex = indexes[index];

  const toMove = numberToMove % (len - 1);
  const toMove2 = currentIndex + toMove;
  const toMove3 =
    toMove2 < 0
      ? // wrap from start to end
        len + toMove2 - 1
      : toMove2 >= len
      ? // wrap from end to start
        toMove2 % (len - 1)
      : toMove2;

  const newIndex = toMove3;

  if (newIndex === index) {
    console.log(`${numberToMove} does not move:`);
    return {
      newNumbers: currentNumbers,
      newIndexes: indexes,
    };
  }

  // TODO: update many indexes. Keep original index;
  indexes[index] = newIndex;

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

  return {
    newNumbers,
    newIndexes: indexes,
  };
};

const test = () => {
  const initialArrangement = [1, 2, -3, 3, -2, 0, 4];

  const testCase1 = [4, 5, 6, 1, 7, 8, 9];
  const result1 = move(testCase1, 3);
  expect(result1.newNumbers).to.deep.eq([4, 5, 6, 7, 1, 8, 9]);

  const testCase2 = [4, -2, 5, 6, 7, 8, 9];
  const result2 = move(testCase2, 1);
  expect(result2.newNumbers).to.deep.eq([4, 5, 6, 7, 8, -2, 9]);

  const testCase3 = [1, -3, 2, 3, -2, 0, 4];
  expect(move(testCase3, 1).newNumbers).to.deep.equal([1, 2, 3, -2, -3, 0, 4]);

  const testCase4 = [2, 1, -3, 3, -2, 0, 4];
  const testCase4Indexes = {};
  expect(
    move(initialArrangement, 1, testCase4, testCase4Indexes).newNumbers
  ).to.deep.eq([1, -3, 2, 3, -2, 0, 4]);

  expect(move([1, 2, 3, -2, -3, 0, 4], 2).newNumbers).to.deep.eq([
    1, 2, -2, -3, 0, 3, 4,
  ]);
};

test();

const solve = (input: string, log = false) => {
  const numbers = parseInput(input);

  expect(uniq(numbers).length).to.eq(numbers.length);

  if (log) {
    console.log("Initial arrangement:");
    console.log(numbers.join(", "));
  }

  let result = numbers;
  let indexes;
  for (let i = 0; i < numbers.length; i++) {
    const { newNumbers, newIndexes } = move(numbers, i, result, indexes, log);
    result = newNumbers;
    indexes = newIndexes;
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

  if (log) console.log({ coord1, coord2, coord3 });

  return coord1 + coord2 + coord3;
};

expect(solve(testData)).to.equal(3);
expect(solve(taskInput)).not.to.equal(-3520);
expect(solve(taskInput)).not.to.equal(-6922);

// Part 2

const solve2 = (input: string) => {};

expect(solve2(testData)).to.equal(undefined);
expect(solve2(taskInput)).to.equal(undefined);

// npx ts-node 2022/20/index.ts
