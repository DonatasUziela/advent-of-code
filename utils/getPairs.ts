export const getPairs = <T>(items: T[]) => {
    const result: T[][] = [];
    for (let i = 0; i < items.length - 2; i++) {
        for (let j = i + 1; j < items.length - 1; j++) {
            result.push([items[i], items[j]])
        }
    }
    return result;
}