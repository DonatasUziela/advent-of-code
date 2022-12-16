export type Coordinates = { x: number, y: number };

export const serializeCoords = ({ x, y }: Coordinates) => `${x}:${y}`

export const get4Directions = ({ x, y }: Coordinates) => [
    {
        x: x + 1,
        y,
    },
    {
        x: x - 1,
        y,
    },
    {
        x,
        y: y + 1,
    },
    {
        x,
        y: y - 1,
    },
];

interface Render {
    minX?: number;
    minY?: number;
    maxY: number;
    maxX: number;
    symbols: { [coords: string]: string },
    emptySymbol?: string;
}

export const render = ({ minX = 0, minY = 0, maxY = 0, maxX = 0, symbols = {}, emptySymbol = '.' }: Render) => {
    const map = [] as string[][];

    for (let y = 0; y <= maxY - minY; y++) {
        map.push([]);
        for (let x = 0; x <= maxX - minX; x++) {
            const symbol = symbols[serializeCoords({ x: x + minX, y: y + minY })]
            map[y][x] = symbol || emptySymbol
        }
    }
    const screen = map.map(l => l.join('')).join('\n');

    return screen;
}