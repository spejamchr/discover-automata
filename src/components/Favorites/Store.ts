import { assertNever } from '@kofno/piper';
import { Maybe, nothing } from 'maybeasy';
import { action, computed, makeObservable, observable } from 'mobx';
import { automataCtor } from '../../utils/CellularAutomata';
import { PlainTextTranslator } from '../../utils/Locales/Types';
import {
  errorLoadingStoredFavorites,
  errorRemovingFavorite,
  errorResettingDefaultFavorites,
  errorStoringNewFavorite,
  favorite,
  Favorite,
  loadingStoredFavorites,
  LoadStoredFavoritesError,
  ready,
  RemoveFavoriteError,
  removingFavorite,
  ResetDefaultFavoritesError,
  resettingDefaultFavorites,
  sortBySerialized,
  State,
  StoreNewFavoriteError,
  storingNewFavorite,
  waiting,
} from './Types';

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

class Store {
  state: State = waiting();

  constructor() {
    makeObservable(this, {
      state: observable,
      loadingStoredFavorites: action,
      errorLoadingStoredFavorites: action,
      ready: action,
      storingNewFavorite: action,
      errorStoringNewFavorite: action,
      removingFavorite: action,
      errorRemovingFavorite: action,
      resetDefaultFavorites: action,
      favorites: computed,
    });
  }

  loadingStoredFavorites = (): void => {
    switch (this.state.kind) {
      case 'waiting':
      case 'resetting-default-favorites':
        this.state = loadingStoredFavorites();
        break;
      case 'error-resetting-default-favorites':
      case 'loading-stored-favorites':
      case 'error-loading-stored-favorites':
      case 'ready':
      case 'storing-new-favorite':
      case 'error-storing-new-favorite':
      case 'removing-favorite':
      case 'error-removing-favorite':
        break;
      default:
        assertNever(this.state);
    }
  };

  errorLoadingStoredFavorites = (error: LoadStoredFavoritesError): void => {
    switch (this.state.kind) {
      case 'loading-stored-favorites':
        this.state = errorLoadingStoredFavorites(error);
        break;
      case 'waiting':
      case 'resetting-default-favorites':
      case 'error-resetting-default-favorites':
      case 'error-loading-stored-favorites':
      case 'ready':
      case 'storing-new-favorite':
      case 'error-storing-new-favorite':
      case 'removing-favorite':
      case 'error-removing-favorite':
        break;
      default:
        assertNever(this.state);
    }
  };

  ready = (favorites: Maybe<ReadonlyArray<Favorite>>): void => {
    switch (this.state.kind) {
      case 'loading-stored-favorites':
      case 'storing-new-favorite':
      case 'removing-favorite':
        this.state = ready(favorites);
        break;
      case 'waiting':
      case 'resetting-default-favorites':
      case 'error-resetting-default-favorites':
      case 'error-loading-stored-favorites':
      case 'ready':
      case 'error-storing-new-favorite':
      case 'error-removing-favorite':
        break;
      default:
        assertNever(this.state);
    }
  };

  storingNewFavorite = (favorite: Favorite): void => {
    switch (this.state.kind) {
      case 'ready':
        this.state = storingNewFavorite(this.state.favorites, favorite);
        break;
      case 'waiting':
      case 'resetting-default-favorites':
      case 'error-resetting-default-favorites':
      case 'loading-stored-favorites':
      case 'error-loading-stored-favorites':
      case 'storing-new-favorite':
      case 'error-storing-new-favorite':
      case 'removing-favorite':
      case 'error-removing-favorite':
        break;
      default:
        assertNever(this.state);
    }
  };

  errorStoringNewFavorite = (error: StoreNewFavoriteError): void => {
    switch (this.state.kind) {
      case 'storing-new-favorite':
        this.state = errorStoringNewFavorite(this.state.favorites, this.state.favorite, error);
        break;
      case 'waiting':
      case 'resetting-default-favorites':
      case 'error-resetting-default-favorites':
      case 'loading-stored-favorites':
      case 'error-loading-stored-favorites':
      case 'ready':
      case 'error-storing-new-favorite':
      case 'removing-favorite':
      case 'error-removing-favorite':
        break;
      default:
        assertNever(this.state);
    }
  };

  removingFavorite = (favorite: Favorite): void => {
    switch (this.state.kind) {
      case 'ready':
        this.state = removingFavorite(this.state.favorites, favorite);
        break;
      case 'waiting':
      case 'resetting-default-favorites':
      case 'error-resetting-default-favorites':
      case 'loading-stored-favorites':
      case 'error-loading-stored-favorites':
      case 'storing-new-favorite':
      case 'error-storing-new-favorite':
      case 'removing-favorite':
      case 'error-removing-favorite':
        break;
      default:
        assertNever(this.state);
    }
  };

  errorRemovingFavorite = (error: RemoveFavoriteError): void => {
    switch (this.state.kind) {
      case 'removing-favorite':
        this.state = errorRemovingFavorite(this.state.favorites, this.state.favorite, error);
        break;
      case 'waiting':
      case 'resetting-default-favorites':
      case 'error-resetting-default-favorites':
      case 'loading-stored-favorites':
      case 'error-loading-stored-favorites':
      case 'ready':
      case 'storing-new-favorite':
      case 'error-storing-new-favorite':
      case 'error-removing-favorite':
        break;
      default:
        assertNever(this.state);
    }
  };

  resetDefaultFavorites = (): void => {
    switch (this.state.kind) {
      case 'ready':
      case 'storing-new-favorite':
      case 'removing-favorite':
        this.state = resettingDefaultFavorites();
        break;
      case 'waiting':
      case 'resetting-default-favorites':
      case 'error-resetting-default-favorites':
      case 'loading-stored-favorites':
      case 'error-loading-stored-favorites':
      case 'error-removing-favorite':
      case 'error-storing-new-favorite':
        break;
      default:
        assertNever(this.state);
    }
  };

  errorResettingDefaultFavorites = (error: ResetDefaultFavoritesError): void => {
    switch (this.state.kind) {
      case 'resetting-default-favorites':
        this.state = errorResettingDefaultFavorites(error);
        break;
      case 'waiting':
      case 'error-resetting-default-favorites':
      case 'loading-stored-favorites':
      case 'error-loading-stored-favorites':
      case 'ready':
      case 'storing-new-favorite':
      case 'error-storing-new-favorite':
      case 'removing-favorite':
      case 'error-removing-favorite':
        break;
      default:
        assertNever(this.state);
    }
  };

  get favorites(): Maybe<ReadonlyArray<Favorite>> {
    switch (this.state.kind) {
      case 'waiting':
      case 'resetting-default-favorites':
      case 'error-resetting-default-favorites':
      case 'loading-stored-favorites':
      case 'error-loading-stored-favorites':
        return nothing();
      case 'removing-favorite':
      case 'error-removing-favorite':
      case 'ready':
      case 'storing-new-favorite':
      case 'error-storing-new-favorite':
        return this.state.favorites;
    }
  }

  translatedFavorites = (t: PlainTextTranslator): ReadonlyArray<Favorite> =>
    this.favorites.getOrElse(() => defaultFavorites(t));
}

export default Store;
