export const range = (min: number, max: number): Array<number> =>
  [...Array(max - min + 1)].map((_, i) => i + min);
