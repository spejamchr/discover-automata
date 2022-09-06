import { toBase } from '../IntBase';

// Encode integers as positive integers
export const toZigZag = (num: number): number => (num < 0 ? -num * 2 - 1 : num * 2);

export const fromZigZag = (num: number): number => (num % 2 === 0 ? num / 2 : (num + 1) / -2);

export const toZigZagCollection = (nums: ReadonlySet<number>): number =>
  [...nums].map(toZigZag).reduce((result, exp) => (result += 1 << exp), 0);

export const fromZigZagCollection = (num: number): Array<number> =>
  toBase(2)(num)
    .digits.map((d, i) => [d, i])
    .filter(([d, _]) => d === 1)
    .map(([_, i]) => i)
    .map(fromZigZag)
    .sort((a, b) => a - b);
