import { square } from './math'

export type Coordinates3D = number[]

export const left = ([x, y, z]: Coordinates3D) => [x - 1, y, z]
export const right = ([x, y, z]: Coordinates3D) => [x + 1, y, z]
export const down = ([x, y, z]: Coordinates3D) => [x, y - 1, z]
export const up = ([x, y, z]: Coordinates3D) => [x, y + 1, z]
export const front = ([x, y, z]: Coordinates3D) => [x, y, z + 1]
export const back = ([x, y, z]: Coordinates3D) => [x, y, z - 1]

export const get6Sides = (c: Coordinates3D) => [
  left(c),
  right(c),
  down(c),
  up(c),
  front(c),
  back(c)
]

export const distance = (a: Coordinates3D, b: Coordinates3D) =>
  Math.sqrt(
    square(a[0] - b[0]) +
    square(a[1] - b[1]) +
    square(a[2] - b[2])
  )

export const serializeCoords = (coords: number[]) => coords.join(':')
