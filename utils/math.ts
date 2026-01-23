export const gcd = (a: number, b: number): number => a ? gcd(b % a, a) : b

export const lcm = (a: number, b: number) => a * b / gcd(a, b)

export const square = (a: number) => a * a
