import { assertNever } from '@kofno/piper';
import { action, computed, makeObservable, observable } from 'mobx';
import {
  errorLoadingStoredFavorites,
  errorRemovingFavorite,
  errorResettingDefaultFavorites,
  errorStoringNewFavorite,
  Favorite,
  loadingStoredFavorites,
  LoadStoredFavoritesError,
  ready,
  RemoveFavoriteError,
  removingFavorite,
  ResetDefaultFavoritesError,
  resettingDefaultFavorites,
  State,
  StoreNewFavoriteError,
  storingNewFavorite,
  waiting,
} from './Types';

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

  ready = (favorites: ReadonlyArray<Favorite>): void => {
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

  get favorites(): ReadonlyArray<Favorite> {
    switch (this.state.kind) {
      case 'waiting':
      case 'resetting-default-favorites':
      case 'error-resetting-default-favorites':
      case 'loading-stored-favorites':
      case 'error-loading-stored-favorites':
      case 'removing-favorite':
      case 'error-removing-favorite':
        return [];
      case 'ready':
      case 'storing-new-favorite':
      case 'error-storing-new-favorite':
        return this.state.favorites;
    }
  }
}

export default Store;
