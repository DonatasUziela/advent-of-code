export interface Coordinates { x: number, y: number }

export const serializeCoords = ({ x, y }: Coordinates) => `${x}:${y}`
export const parseCoords = (coordinates: string) => {
  const [x, y] = coordinates.split(':').map(s => parseInt(s, 10))
  return { x, y }
}
export const sameCoords = (a: Coordinates, b: Coordinates) => a.x === b.x && a.y === b.y

export const left = (c: Coordinates) => ({ x: c.x - 1, y: c.y })
export const right = (c: Coordinates) => ({ x: c.x + 1, y: c.y })
export const down = (c: Coordinates) => ({ x: c.x, y: c.y - 1 })
export const up = (c: Coordinates) => ({ x: c.x, y: c.y + 1 })

export const get4Directions = (c: Coordinates) => [right(c), left(c), up(c), down(c)]
export const get8Directions = (c: Coordinates) => [...get4Directions(c), up(left(c)), up(right(c)), down(left(c)), down(right(c))]

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
