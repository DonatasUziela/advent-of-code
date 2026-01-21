export const isInRange = (n: number, range: number[]) => n >= range[0] && n <= range[1]

export const mergeRanges = (ranges: number[][]) => {
  const result: number[][] = []
  let last: number[] | undefined

  ranges
    .sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]))
    .forEach((r) => {
      if (!last || r[0] > last[1]) { result.push(last = r) } else if (r[1] > last[1]) { last[1] = r[1] }
    })

  return result
}
