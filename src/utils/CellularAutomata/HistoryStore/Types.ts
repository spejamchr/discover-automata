import Task from 'taskarian';
import { nextCellsOnZero } from '..';
import { Automata, Generation } from '../Types';

export interface Waiting {
  kind: 'waiting';
  automata: Automata;
}

export interface Working {
  kind: 'working';
  automata: Automata;
  first: Generation;
  task: Task<string, ReadonlyArray<Generation>>;
  cancel?: () => void;
}

export interface Ready {
  kind: 'ready';
  automata: Automata;
  generations: ReadonlyArray<Generation>;
}

export type State = Waiting | Ready | Working;

export const waiting = (automata: Automata): Waiting => ({ kind: 'waiting', automata });

const createWorkingTask = (
  automata: Automata,
  first: Generation,
): Task<string, ReadonlyArray<Generation>> =>
  new Task((_reject, resolve) => {
    let cancelled = false;
    const calcNextGen = nextCellsOnZero(automata);

    new Promise(() => {
      const generations = [first];

      for (let i = 0; i < 100; i++) {
        if (cancelled) break;
        generations.push(calcNextGen(generations[i]));
      }
      resolve(generations);
    });

    return () => (cancelled = true);
  });

export const working = (automata: Automata, first: Generation): Working => ({
  kind: 'working',
  automata,
  first,
  task: createWorkingTask(automata, first),
});

export const ready = (automata: Automata, generations: ReadonlyArray<Generation>): Ready => ({
  kind: 'ready',
  automata,
  generations,
});
