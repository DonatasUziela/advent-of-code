const transposeReducer = <TItem>(result: TItem[][], row: TItem[]) => {
  row.forEach((item, i) => {
    if (!result[i]) result[i] = []
    result[i].push(item)
  })
  return result
}

export const transpose = <TItem>(grid: TItem[][]) => grid.reduce<TItem[][]>(transposeReducer, [])
