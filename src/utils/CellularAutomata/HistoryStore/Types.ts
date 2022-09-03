import { Automata, Generation } from '../Types';

export interface Ready {
  kind: 'ready';
  automata: Automata;
  current: Generation;
  history: ReadonlyArray<Generation>;
}

export const ready = (
  automata: Automata,
  current: Generation,
  history: ReadonlyArray<Generation>,
): Ready => ({
  kind: 'ready',
  automata,
  current,
  history,
});

export interface Working {
  kind: 'progressing';
  automata: Automata;
  current: Generation;
  history: ReadonlyArray<Generation>;
}

export const progressing = (
  automata: Automata,
  current: Generation,
  history: ReadonlyArray<Generation>,
): Working => ({
  kind: 'progressing',
  automata,
  current,
  history,
});

export type State = Ready | Working;
