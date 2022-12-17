type Graph = Record<string, { nodeKeys: string [] }>

export const findShortestDistances = <TGrapth extends Graph>(from: string, graph: TGrapth) => {
    const distances = Object.keys(graph).reduce((result, key) => {
        result[key] = Number.MAX_SAFE_INTEGER;
        return result
    }, {} as Record<string, number>)
    distances[from] = 0;

    let visitedMap = {
        [from]: true
    }

    let queue = [from];

    while (queue.length) {
        const current = queue.shift();
        if (!current) throw new Error('Invalid Dijkstra algorythm')
        const distanceToCurrentNode = distances[current];
        const adjacentKeys = graph[current].nodeKeys.filter(key => !visitedMap[key])

        adjacentKeys.forEach(key => {
            let newDistanceToAdjacentNode = distanceToCurrentNode + 1;
            distances[key] = Math.min(distances[key], newDistanceToAdjacentNode)
            visitedMap[key] = true;
        })

        queue.push(...adjacentKeys)
    }

    return distances;
}