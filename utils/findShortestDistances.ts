type Graph = Record<string, { nodeKeys: string [] }>

export const findShortestDistances = <TGrapth extends Graph>(from: string, graph: TGrapth) => {
  const distances = Object.keys(graph).reduce<Record<string, number>>((result, key) => {
    result[key] = Number.MAX_SAFE_INTEGER
    return result
  }, {})
  distances[from] = 0

  const visitedMap = {
    [from]: true
  }

  const queue = [from]

  while (queue.length) {
    const current = queue.shift()
    if (!current) throw new Error('Invalid Dijkstra algorythm')
    const distanceToCurrentNode = distances[current]
    const adjacentKeys = graph[current].nodeKeys.filter(key => !visitedMap[key])

    adjacentKeys.forEach(key => {
      const newDistanceToAdjacentNode = distanceToCurrentNode + 1
      distances[key] = Math.min(distances[key], newDistanceToAdjacentNode)
      visitedMap[key] = true
    })

    queue.push(...adjacentKeys)
  }

  return distances
}
