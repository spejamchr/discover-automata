import { warn } from '@execonline-inc/logging';
import { always, assertNever } from '@kofno/piper';
import { array } from 'jsonous';
import Task from 'taskarian';
import { automataCtor, serialize } from '../../utils/CellularAutomata';
import { PlainTextTranslator } from '../../utils/Locales/Types';
import ReactionComponent from '../../utils/ReactionComponent';
import { getObjectT, removeItemT, SetItemError, setObjectT } from '../../utils/Storage';
import { favoriteDecoder } from './Decoders';
import Store from './Store';
import {
  favorite,
  Favorite,
  LoadStoredFavoritesError,
  RemoveFavoriteError,
  ResetDefaultFavoritesError,
  State,
  StoreNewFavoriteError,
} from './Types';

interface Props {
  t: PlainTextTranslator;
}

const favoritesKey = 'emu/favorites';

const handleErrorResettingDefaultFavorites = (error: ResetDefaultFavoritesError): void => {
  warn(`Could not remove Favorites at "${error.key}" from localstorage: ${error.error}`);
};

const handleErrorLoadingStoredFavorites = (error: LoadStoredFavoritesError): void => {
  if (typeof error === 'string') {
    warn(`Error loading stored favorites: ${error}`);
  } else {
    warn(`Could not read Favorites at "${error.key}" from localstorage: ${error.error}`);
  }
};

const handleErrorStoringNewFavorite = (error: StoreNewFavoriteError): void => {
  warn(`Could not set Favorites at "${error.key}" in localstorage: ${error.error}`);
};

const handleErrorRemovingFavorite = (error: RemoveFavoriteError): void => {
  warn(`Could not remove Favorite from localstorage: ${error.error}`);
};

const sortBySerialized = (a: Favorite, b: Favorite): number => {
  const aa = a.serialized.split('.').map(Number);
  const ba = b.serialized.split('.').map(Number);
  const index = aa[0] === ba[0] ? (aa[1] === ba[1] ? 2 : 1) : 0;
  return aa[index] - ba[index];
};

const storeFavorites = (
  favorites: ReadonlyArray<Favorite>,
): Task<SetItemError, ReadonlyArray<Favorite>> => {
  const sortedFavorites = favorites.slice().sort(sortBySerialized);
  return setObjectT({
    key: favoritesKey,
    object: sortedFavorites.map((f) => ({ n: f.name, a: serialize(f.automata) })),
  }).map(always(sortedFavorites));
};

const automata30 = () =>
  automataCtor({
    states: 2,
    neighbors: [-1, 0, 1],
    ruleId: BigInt(30),
  });

const automata90 = () =>
  automataCtor({
    states: 2,
    neighbors: [-1, 0, 1],
    ruleId: BigInt(90),
  });

const automata110 = () =>
  automataCtor({
    states: 2,
    neighbors: [-1, 0, 1],
    ruleId: BigInt(110),
  });

const automata184 = () =>
  automataCtor({
    states: 2,
    neighbors: [-1, 0, 1],
    ruleId: BigInt(184),
  });

const defaultFavorites = (t: PlainTextTranslator): Array<Favorite> =>
  [
    favorite(automata30(), t('Rule 30: Mathematica used this as an RNG')),
    favorite(automata90(), t('Rule 90: The exclusive-or function')),
    favorite(automata110(), t('Rule 110: Turing-complete!')),
    favorite(automata184(), t('Rule 184: The "traffic rule"')),
  ].sort(sortBySerialized);

class Reactions extends ReactionComponent<Store, State, Props> {
  tester = () => this.props.store.state;
  effect = (state: State): void => {
    const { store } = this.props;
    switch (state.kind) {
      case 'waiting':
        break;
      case 'resetting-default-favorites':
        removeItemT(favoritesKey).fork(() => {}, store.loadingStoredFavorites);
        break;
      case 'error-resetting-default-favorites':
        handleErrorResettingDefaultFavorites(state.error);
        break;
      case 'loading-stored-favorites':
        getObjectT({ key: favoritesKey, decoder: array(favoriteDecoder) })
          .map((m) => m.getOrElse(() => defaultFavorites(this.props.t)))
          .fork(store.errorLoadingStoredFavorites, store.ready);
        break;
      case 'error-loading-stored-favorites':
        handleErrorLoadingStoredFavorites(state.error);
        break;
      case 'ready':
        break;
      case 'storing-new-favorite':
        storeFavorites([
          ...state.favorites.filter((f) => f.serialized !== state.favorite.serialized),
          state.favorite,
        ]).fork(store.errorStoringNewFavorite, store.ready);
        break;
      case 'error-storing-new-favorite':
        handleErrorStoringNewFavorite(state.error);
        break;
      case 'removing-favorite':
        storeFavorites(
          state.favorites.filter((f) => f.serialized !== state.favorite.serialized),
        ).fork(store.errorStoringNewFavorite, store.ready);
        break;
      case 'error-removing-favorite':
        handleErrorRemovingFavorite(state.error);
        break;
      default:
        assertNever(state);
    }
  };
}

export default Reactions;
