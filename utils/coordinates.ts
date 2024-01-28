export interface Coordinates { x: number, y: number }

export const serializeCoords = ({ x, y }: Coordinates) => `${x}:${y}`
export const parseCoords = (coordinates: string) => {
  const [x, y] = coordinates.split(':').map(s => parseInt(s, 10))
  return { x, y }
}
export const sameCoords = (a: Coordinates, b: Coordinates) => a.x === b.x && a.y === b.y

export enum Direction {
  South = 'S',
  East = 'E',
  West = 'W',
  North = 'N',
}
export type DirectionFunction = (c: Coordinates, step?: number) => Coordinates

export const west = (c: Coordinates, step = 1) => ({ x: c.x - step, y: c.y })
export const east = (c: Coordinates, step = 1) => ({ x: c.x + step, y: c.y })
export const north = (c: Coordinates, step = 1) => ({ x: c.x, y: c.y - step })
export const south = (c: Coordinates, step = 1) => ({ x: c.x, y: c.y + step })

export const directionByType = {
  [Direction.East]: east,
  [Direction.North]: north,
  [Direction.West]: west,
  [Direction.South]: south
}

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

export const floodFill = ({ minX = 0, minY = 0, maxX, maxY }: Bounds, blocked: Record<string, any>, start = { x: 0, y: 0 }) => {
  const visited: Record<string, boolean> = {}
  const toVisit = [start]

  while (toVisit.length) {
    const node = toVisit.pop()
    if (!node) throw new Error('Invalid loop')

    visited[serializeCoords(node)] = true

    const newNodes = get4Directions(node)
      .filter(({ x, y }) => x >= minX && x < maxX && y >= minY && y < maxY)
      .filter(c => !visited[serializeCoords(c)] && !blocked[serializeCoords(c)])

    toVisit.push(...newNodes)
  }

  return visited
}

export const calcPolygonArea = (vertices: Coordinates[]) => {
  let total = 0
  for (let i = 0; i < vertices.length; i++) {
    const x1 = vertices[i].x
    const y1 = vertices[i].y
    const x2 = vertices[i === vertices.length - 1 ? 0 : i + 1].x
    const y2 = vertices[i === vertices.length - 1 ? 0 : i + 1].y

    total += ((x1 * y2) - (x2 * y1)) / 2
  }

  return total
}

export const distance = (a: Coordinates, b: Coordinates) => Math.abs(b.y - a.y) + Math.abs(b.x - a.x)

export const calculatePerimeter = (coordinates: Coordinates[]) => {
  let total = 0
  for (let i = 0; i < coordinates.length - 1; i++) {
    total += distance(coordinates[i], coordinates[i + 1])
  }
  total += distance(coordinates[coordinates.length - 1], coordinates[0])
  return total
}
