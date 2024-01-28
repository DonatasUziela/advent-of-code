import { expect } from 'chai'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { type Bounds } from 'utils/coordinates'

interface GraphNode {
  heat: number
  neighbors: Record<string, number>
}

type Graph = Record<string, GraphNode>

interface Traverse {
  neighbor: string
  heat: number
  graph: Graph
  bounds: Bounds
}

interface CreateGraph {
  bounds: Bounds
  grid: number[][]
  minMove: number
  maxMove: number
}

let globalResult = Number.MAX_SAFE_INTEGER

const taskInput = readFileSync(resolve(__dirname, 'input.txt'), 'utf-8')
const testData = readFileSync(resolve(__dirname, 'testData.txt'), 'utf-8')

const parse = (data: string): number[][] => data.split('\n').map(x => x.split('').map(y => parseInt(y)))

const createGraph = ({ bounds: { maxX, maxY }, grid, minMove, maxMove }: CreateGraph) => {
  const graph: Graph = {}

  for (let y = 0; y < maxY; y++) {
    for (let x = 0; x < maxX; x++) {
      const verticalNode: GraphNode = { heat: Number.MAX_SAFE_INTEGER, neighbors: {} }
      const horizontalNode: GraphNode = { heat: Number.MAX_SAFE_INTEGER, neighbors: {} }
      for (let i = minMove; i <= maxMove; i++) {
        if (y + i >= 0 && y + i < maxY) {
          verticalNode.neighbors[`horizontal(${x},${y + i})`] = Array(i).fill(0).reduce((a, _, j) => a + grid[y + j + 1][x], 0)
        }
        if (y - i >= 0 && y - i < maxY) {
          verticalNode.neighbors[`horizontal(${x},${y - i})`] = Array(i).fill(0).reduce((a, _, j) => a + grid[y - j - 1][x], 0)
        }
        if (x + i >= 0 && x + i < maxX) {
          horizontalNode.neighbors[`vertical(${x + i},${y})`] = Array(i).fill(0).reduce((a, _, j) => a + grid[y][x + j + 1], 0)
        }
        if (x - i >= 0 && x - i < maxX) {
          horizontalNode.neighbors[`vertical(${x - i},${y})`] = Array(i).fill(0).reduce((a, _, j) => a + grid[y][x - j - 1], 0)
        }
      }
      graph[`vertical(${x},${y})`] = verticalNode
      graph[`horizontal(${x},${y})`] = horizontalNode
    }
  }

  return graph
}

const traverse = ({ heat, graph, neighbor, bounds }: Traverse) => {
  const { maxX, maxY } = bounds
  if (heat >= Math.min(graph[neighbor].heat, globalResult)) return
  if (neighbor.split('l')[1] === `(${maxX - 1},${maxY - 1})`) {
    globalResult = heat
    return
  }
  graph[neighbor].heat = heat
  const neighbors = Object.keys(graph[neighbor].neighbors)
  for (const key of neighbors) {
    traverse({
      neighbor: key,
      heat: heat + graph[neighbor].neighbors[key],
      graph,
      bounds
    })
  }
}

const solve = (input: string) => {
  const grid = parse(input)
  const bounds = { maxX: grid[0].length, maxY: grid.length }
  const graph = createGraph({ bounds, grid, minMove: 1, maxMove: 3 })

  globalResult = Number.MAX_SAFE_INTEGER

  const startingNeighbors = { ...graph['horizontal(0,0)'].neighbors, ...graph['vertical(0,0)'].neighbors }
  for (const startingNeighbor of Object.keys(startingNeighbors)) {
    traverse({
      neighbor: startingNeighbor,
      heat: startingNeighbors[startingNeighbor],
      graph,
      bounds
    })
  }

  return globalResult
}

expect(solve(testData)).to.equal(102)
expect(solve(taskInput)).to.equal(851)

// Part 2

const solve2 = (input: string) => {
  const grid = parse(input)
  const bounds = { maxX: grid[0].length, maxY: grid.length }
  const graph = createGraph({ bounds, grid, minMove: 4, maxMove: 10 })

  globalResult = Number.MAX_SAFE_INTEGER

  const startingNeighbors = { ...graph['horizontal(0,0)'].neighbors, ...graph['vertical(0,0)'].neighbors }
  for (const startingNeighbor of Object.keys(startingNeighbors)) {
    traverse({
      neighbor: startingNeighbor,
      heat: startingNeighbors[startingNeighbor],
      graph,
      bounds
    })
  }

  return globalResult
}

console.log('PART 2')
expect(solve2(testData)).to.equal(94)
expect(solve2(taskInput)).to.equal(982)
