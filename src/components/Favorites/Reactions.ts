import { warn } from '@execonline-inc/logging';
import { always, assertNever } from '@kofno/piper';
import { array } from 'jsonous';
import { just } from 'maybeasy';
import Task from 'taskarian';
import { serialize } from '../../utils/CellularAutomata';
import { PlainTextTranslator } from '../../utils/Locales/Types';
import ReactionComponent from '../../utils/ReactionComponent';
import { getObjectT, removeItemT, SetItemError, setObjectT } from '../../utils/Storage';
import { favoriteDecoder } from './Decoders';
import Store from './Store';
import {
  Favorite,
  LoadStoredFavoritesError,
  RemoveFavoriteError,
  ResetDefaultFavoritesError,
  sortBySerialized,
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

const storeFavorites = (
  favorites: ReadonlyArray<Favorite>,
): Task<SetItemError, ReadonlyArray<Favorite>> => {
  const sortedFavorites = favorites.slice().sort(sortBySerialized);
  return setObjectT({
    key: favoritesKey,
    object: sortedFavorites.map((f) => ({ n: f.name, a: serialize(f.automata) })),
  }).map(always(sortedFavorites));
};

class Reactions extends ReactionComponent<Store, State, Props> {
  tester = () => this.props.store.state;
  effect = (state: State): void => {
    const { store, t } = this.props;
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
        getObjectT({ key: favoritesKey, decoder: array(favoriteDecoder) }).fork(
          store.errorLoadingStoredFavorites,
          store.ready,
        );
        break;
      case 'error-loading-stored-favorites':
        handleErrorLoadingStoredFavorites(state.error);
        break;
      case 'ready':
        break;
      case 'storing-new-favorite':
        storeFavorites([
          ...store.translatedFavorites(t).filter((f) => f.serialized !== state.favorite.serialized),
          state.favorite,
        ])
          .map(just)
          .fork(store.errorStoringNewFavorite, store.ready);
        break;
      case 'error-storing-new-favorite':
        handleErrorStoringNewFavorite(state.error);
        break;
      case 'removing-favorite':
        storeFavorites(
          store.translatedFavorites(t).filter((f) => f.serialized !== state.favorite.serialized),
        )
          .map(just)
          .fork(store.errorStoringNewFavorite, store.ready);
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
