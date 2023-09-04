import { expect } from "chai";
import { readFileSync } from "fs";
import { resolve } from "path";

const testData = readFileSync(resolve(__dirname, "testData.txt"), "utf-8");
const taskInput = readFileSync(resolve(__dirname, "input.txt"), "utf-8");

const parseInput = (input: string) =>
  input.split("\n").map((n) => parseInt(n, 10));

const move = (
  numbers: { value: number; originalIndex: number }[],
  index: number,
  log = false
) => {
  const len = numbers.length;

  const currentIndex = numbers.findIndex(
    ({ originalIndex }) => originalIndex === index
  );
  if (currentIndex === -1) throw `Number with originalIndex ${index} not found`;
  const numberToMove = numbers[currentIndex].value;

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
    // console.log(`${numberToMove} does not move:`);
    return numbers;
  }

  const newNumbers = numbers.slice(0);
  const [removed] = newNumbers.splice(currentIndex, 1);
  newNumbers.splice(newIndex, 0, removed);

  if (log) {
    // console.log(
    //   `${numberToMove} moves between ${newNumbers[newIndex - 1].value} and ${
    //     newNumbers[newIndex + 1].value
    //   }:`
    // );
  }

  return newNumbers;
};

const test = () => {
  const initialArrangement = [1, 2, -3, 3, -2, 0, 4].map(
    (value, originalIndex) => ({ value, originalIndex })
  );

  const result1 = move(initialArrangement, 0);
  expect(result1.map(({ value }) => value)).to.deep.eq([2, 1, -3, 3, -2, 0, 4]);

  const result2 = move(result1, 1);
  expect(result2.map(({ value }) => value)).to.deep.eq([1, -3, 2, 3, -2, 0, 4]);

  const result3 = move(result2, 2);
  expect(result3.map(({ value }) => value)).to.deep.eq([1, 2, 3, -2, -3, 0, 4]);
};

test();

const solve = (input: string, log = false) => {
  const numbers = parseInput(input);
  const initialData = numbers.map((value, originalIndex) => ({
    value,
    originalIndex,
  }));

  if (log) {
    console.log("Initial arrangement:");
    console.log(numbers.join(", "));
  }

  let result = initialData;
  for (let i = 0; i < numbers.length; i++) {
    result = move(result, i, log);
    if (log) console.log(result.map(({ value }) => value).join(", "));
  }

  const indexOfZero = result.findIndex(({ value }) => value === 0);

  const findNth = (n: number) => {
    const toMove = n % numbers.length;
    const indexOfFoundNumber = (indexOfZero + toMove) % numbers.length;
    return result[indexOfFoundNumber];
  };

  const coord1 = findNth(1000).value;
  const coord2 = findNth(2000).value;
  const coord3 = findNth(3000).value;

  if (log) console.log({ coord1, coord2, coord3 });

  return coord1 + coord2 + coord3;
};

expect(solve(testData)).to.equal(3);
expect(solve(taskInput)).to.equal(2827);

// Part 2

const solve2 = (input: string, log = false) => {
  const numbers = parseInput(input);
  const decryptionKey = 811589153;
  const initialData = numbers.map((value, originalIndex) => ({
    value: value * decryptionKey,
    originalIndex,
  }));

  if (log) {
    console.log("Initial arrangement:");
    console.log(initialData.map(({ value }) => value).join(", "));
  }

  let result = initialData;
  for (let mixingRound = 1; mixingRound <= 10; mixingRound++) {
    for (let i = 0; i < numbers.length; i++) {
      result = move(result, i, log);
    }
    if (log) {
      console.log(`After ${mixingRound} of mixing:`);
      console.log(result.map(({ value }) => value).join(", "));
    }
  }

  const indexOfZero = result.findIndex(({ value }) => value === 0);

  const findNth = (n: number) => {
    const toMove = n % numbers.length;
    const indexOfFoundNumber = (indexOfZero + toMove) % numbers.length;
    return result[indexOfFoundNumber];
  };

  const coord1 = findNth(1000).value;
  const coord2 = findNth(2000).value;
  const coord3 = findNth(3000).value;

  if (log) console.log({ coord1, coord2, coord3 });

  return coord1 + coord2 + coord3;
};

expect(solve2(testData, true)).to.equal(1623178306);
expect(solve2(taskInput)).to.equal(undefined);

// npx ts-node 2022/20/index.ts
