export const shuffle = <T>(a: ReadonlyArray<T>): Array<T> => {
  const shuffled = a.slice(0);
  const lastIndex = shuffled.length - 1;
  for (let i = 0; i < lastIndex; i++) {
    const j = Math.round(Math.random() * (lastIndex - i) + i);

    const tmp = shuffled[j];
    shuffled[j] = shuffled[i];
    shuffled[i] = tmp;
  }
  return shuffled;
};
