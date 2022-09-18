import { NonEmptyList } from 'nonempty-list';
import { Automata, Generation } from '../Types';

export interface Waiting {
  kind: 'waiting';
  automata: Automata;
}

export interface Working {
  kind: 'working';
  automata: Automata;
  generations: NonEmptyList<Generation>;
}

export interface Ready {
  kind: 'ready';
  automata: Automata;
  generations: NonEmptyList<Generation>;
}

export type State = Waiting | Ready | Working;

export const waiting = (automata: Automata): Waiting => ({
  kind: 'waiting',
  automata,
});

export const working = (automata: Automata, generations: NonEmptyList<Generation>): Working => ({
  kind: 'working',
  automata,
  generations,
});

export const ready = (automata: Automata, generations: NonEmptyList<Generation>): Ready => ({
  kind: 'ready',
  automata,
  generations,
});
