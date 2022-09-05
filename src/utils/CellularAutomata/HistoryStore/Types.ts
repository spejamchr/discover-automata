import { Automata, Generation } from '../Types';

export interface Waiting {
  kind: 'waiting';
  automata: Automata;
}

export interface Working {
  kind: 'working';
  automata: Automata;
  previousGenerations: ReadonlyArray<Generation>;
}

export interface Ready {
  kind: 'ready';
  automata: Automata;
  generations: ReadonlyArray<Generation>;
}

export type State = Waiting | Ready | Working;

export const waiting = (automata: Automata): Waiting => ({
  kind: 'waiting',
  automata,
});

export const working = (
  automata: Automata,
  previousGenerations: ReadonlyArray<Generation>,
): Working => ({
  kind: 'working',
  automata,
  previousGenerations,
});

export const ready = (automata: Automata, generations: ReadonlyArray<Generation>): Ready => ({
  kind: 'ready',
  automata,
  generations,
});
