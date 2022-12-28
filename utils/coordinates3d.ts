export type Coordinates3D = number[];

export const left = ([x, y, z]: Coordinates3D) => [x - 1, y, z];
export const right = ([x, y, z]: Coordinates3D) => [x + 1, y, z];
export const down = ([x, y, z]: Coordinates3D) => [x, y - 1, z];
export const up = ([x, y, z]: Coordinates3D) => [x, y + 1, z];
export const front = ([x, y, z]: Coordinates3D) => [x, y, z + 1];
export const back = ([x, y, z]: Coordinates3D) => [x, y, z - 1];

export const get6Sides =  (c: Coordinates3D) => [
    left(c),
    right(c),
    down(c),
    up(c),
    front(c),
    back(c)
]