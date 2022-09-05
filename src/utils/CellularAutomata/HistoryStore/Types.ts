import { Automata, Generation } from '../Types';

export interface Waiting {
  kind: 'waiting';
  automata: Automata;
}

export interface Working {
  kind: 'working';
  automata: Automata;
  first: Generation;
}

export interface Ready {
  kind: 'ready';
  automata: Automata;
  generations: ReadonlyArray<Generation>;
}

export type State = Waiting | Ready | Working;

export const waiting = (automata: Automata): Waiting => ({ kind: 'waiting', automata });

export const working = (automata: Automata, first: Generation): Working => ({
  kind: 'working',
  automata,
  first,
});

export const ready = (automata: Automata, generations: ReadonlyArray<Generation>): Ready => ({
  kind: 'ready',
  automata,
  generations,
});
