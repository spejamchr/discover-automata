import Decoder, { field, string, succeed } from 'jsonous';
import { serializedAutomataDecoder } from '../../utils/CellularAutomata/Decoders';
import { Favorite } from './Types';

export const favoriteDecoder: Decoder<Favorite> = succeed({})
  .assign('name', field('n', string))
  .assign('serialized', field('a', string))
  .assign('automata', field('a', serializedAutomataDecoder));
