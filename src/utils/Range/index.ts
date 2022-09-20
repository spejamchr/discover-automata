export function range(min: number, max: number): Array<number>;
export function range(count: number): Array<number>;
export function range(minOrCount: number, max?: number) {
  if (typeof max === 'number') {
    return [...Array(max - minOrCount + 1)].map((_, i) => i + minOrCount);
  } else {
    return [...Array(minOrCount)].map((_, i) => i);
  }
}
