export interface Coordinates { x: number, y: number }

export const serializeCoords = ({ x, y }: Coordinates) => `${x}:${y}`
export const parseCoords = (coordinates: string) => {
  const [x, y] = coordinates.split(':').map(s => parseInt(s, 10))
  return { x, y }
}
export const sameCoords = (a: Coordinates, b: Coordinates) => a.x === b.x && a.y === b.y

export enum Direction {
  North = 'N',
  East = 'E',
  South = 'S',
  West = 'W',
}
export type DirectionFunction = (c: Coordinates) => Coordinates

export const west = (c: Coordinates) => ({ x: c.x - 1, y: c.y })
export const east = (c: Coordinates) => ({ x: c.x + 1, y: c.y })
export const north = (c: Coordinates) => ({ x: c.x, y: c.y - 1 })
export const south = (c: Coordinates) => ({ x: c.x, y: c.y + 1 })

export const get4Directions = (c: Coordinates) => [east(c), west(c), south(c), north(c)]
export const get8Directions = (c: Coordinates) => [...get4Directions(c), south(west(c)), south(east(c)), north(west(c)), north(east(c))]

export interface Bounds {
  minX?: number
  minY?: number
  maxX: number
  maxY: number
}
export const isInBounds = (
  { x, y }: Coordinates,
  { minX = 0, minY = 0, maxX, maxY }: Bounds
) =>
  x >= minX && x < maxX && y >= minY && y < maxY

export type Symbols = Record<string, string>

interface Render {
  minX?: number
  minY?: number
  maxY: number
  maxX: number
  symbols: Symbols
  emptySymbol?: string
}

export const render = ({ minX = 0, minY = 0, maxY = 0, maxX = 0, symbols = {}, emptySymbol = '.' }: Render) => {
  const map = [] as string[][]

  for (let y = 0; y <= maxY - minY; y++) {
    map.push([])
    for (let x = 0; x <= maxX - minX; x++) {
      const symbol = symbols[serializeCoords({ x: x + minX, y: y + minY })]
      map[y][x] = symbol || emptySymbol
    }
  }
  const screen = map.map(l => l.join('')).join('\n')

  return screen
}
