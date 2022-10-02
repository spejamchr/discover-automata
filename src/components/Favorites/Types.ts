import { serialize } from '../../utils/CellularAutomata';
import { Automata } from '../../utils/CellularAutomata/Types';
import { GetObjectError, RemoveItemError, SetItemError } from '../../utils/Storage';

export interface Favorite {
  automata: Automata;
  serialized: string;
  name: string;
}

export const favorite = (automata: Automata, name: string): Favorite => ({
  automata,
  name,
  serialized: serialize(automata),
});

interface HasFavorites {
  favorites: ReadonlyArray<Favorite>;
}

export type ResetDefaultFavoritesError = RemoveItemError;

export type LoadStoredFavoritesError = GetObjectError;

export type StoreNewFavoriteError = SetItemError;

export type RemoveFavoriteError = SetItemError;

export interface Waiting {
  kind: 'waiting';
}

export interface ResettingDefaultFavorites {
  kind: 'resetting-default-favorites';
}

export interface ErrorResettingDefaultFavorites {
  kind: 'error-resetting-default-favorites';
  error: ResetDefaultFavoritesError;
}

export interface LoadingStoredFavorites {
  kind: 'loading-stored-favorites';
}

export interface ErrorLoadingStoredFavorites {
  kind: 'error-loading-stored-favorites';
  error: LoadStoredFavoritesError;
}

export interface Ready extends HasFavorites {
  kind: 'ready';
}

export interface StoringNewFavorite extends HasFavorites {
  kind: 'storing-new-favorite';
  favorite: Favorite;
}

export interface ErrorStoringNewFavorite extends HasFavorites {
  kind: 'error-storing-new-favorite';
  favorite: Favorite;
  error: StoreNewFavoriteError;
}

export interface RemovingFavorite extends HasFavorites {
  kind: 'removing-favorite';
  favorite: Favorite;
}

export interface ErrorRemovingFavorite extends HasFavorites {
  kind: 'error-removing-favorite';
  favorite: Favorite;
  error: RemoveFavoriteError;
}

export type State =
  | Waiting
  | ResettingDefaultFavorites
  | ErrorResettingDefaultFavorites
  | LoadingStoredFavorites
  | ErrorLoadingStoredFavorites
  | Ready
  | StoringNewFavorite
  | ErrorStoringNewFavorite
  | RemovingFavorite
  | ErrorRemovingFavorite;

export const waiting = (): Waiting => ({ kind: 'waiting' });

export const resettingDefaultFavorites = (): ResettingDefaultFavorites => ({
  kind: 'resetting-default-favorites',
});

export const errorResettingDefaultFavorites = (
  error: ResetDefaultFavoritesError,
): ErrorResettingDefaultFavorites => ({
  kind: 'error-resetting-default-favorites',
  error,
});

export const loadingStoredFavorites = (): LoadingStoredFavorites => ({
  kind: 'loading-stored-favorites',
});

export const errorLoadingStoredFavorites = (
  error: LoadStoredFavoritesError,
): ErrorLoadingStoredFavorites => ({ kind: 'error-loading-stored-favorites', error });

export const ready = (favorites: ReadonlyArray<Favorite>): Ready => ({
  kind: 'ready',
  favorites,
});

export const storingNewFavorite = (
  favorites: ReadonlyArray<Favorite>,
  favorite: Favorite,
): StoringNewFavorite => ({ kind: 'storing-new-favorite', favorites, favorite });

export const errorStoringNewFavorite = (
  favorites: ReadonlyArray<Favorite>,
  favorite: Favorite,
  error: StoreNewFavoriteError,
): ErrorStoringNewFavorite => ({ kind: 'error-storing-new-favorite', favorites, favorite, error });

export const removingFavorite = (
  favorites: ReadonlyArray<Favorite>,
  favorite: Favorite,
): RemovingFavorite => ({ kind: 'removing-favorite', favorites, favorite });

export const errorRemovingFavorite = (
  favorites: ReadonlyArray<Favorite>,
  favorite: Favorite,
  error: StoreNewFavoriteError,
): ErrorRemovingFavorite => ({ kind: 'error-removing-favorite', favorites, favorite, error });
