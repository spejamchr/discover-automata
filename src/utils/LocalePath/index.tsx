import { drop, first } from '@execonline-inc/collections';
import { just, Maybe, nothing } from 'maybeasy';
import { Result } from 'resulty';
import { fromRaisableR } from '../Extensions';
import { defaultLocale, Locale, whenLocale } from '../Locales/Types';
import { WindowError, windowGet } from '../WindowGet';

type Path = `/${string}`;

type Search = '' | `?${string}`;

type Hash = '' | `#${string}`;

export interface LocalePath {
  locale: Locale;
  path: Path;
  search: Search;
  hash: Hash;
}

export const localePath = (
  locale: Locale,
  path: Path,
  search?: Search,
  hash?: Hash,
): LocalePath => ({
  locale,
  path,
  search: search ?? '',
  hash: hash ?? '',
});

const pathPieces = (pathname: string): ReadonlyArray<string> => drop(1, pathname.split('/'));

const isPath = (path: string): path is Path => path[0] === '/';

const whenPath = (path: string): Maybe<Path> => (isPath(path) ? just(path) : nothing());

const isSearch = (search: string): search is Search => search === '' || search[0] === '?';

const whenSearch = (search: string): Maybe<Search> => (isSearch(search) ? just(search) : nothing());

const isHash = (hash: string): hash is Hash => hash === '' || hash[0] === '#';

const whenHash = (hash: string): Maybe<Hash> => (isHash(hash) ? just(hash) : nothing());

export interface UrlIsh {
  pathname: string;
  search: string;
  hash: string;
}

export const toLocalePath = (urlIsh: UrlIsh): LocalePath => {
  const pathname = whenPath(urlIsh.pathname).getOrElseValue('/');
  const search = whenSearch(urlIsh.search).getOrElseValue('');
  const hash = whenHash(urlIsh.hash).getOrElseValue('');

  const { locale, path } = first(pathPieces(pathname))
    .andThen(whenLocale)
    .map((locale) => ({
      locale,
      path: `/${pathPieces(pathname).slice(1).join('/')}` as const,
    }))
    .getOrElseValue({
      locale: defaultLocale,
      path: pathname,
    });

  return localePath(locale, path, search, hash);
};

export interface InvalidUrlError {
  kind: 'invalid-url-error';
  url: string;
}

export const invalidUrlError = (url: string): InvalidUrlError => ({
  kind: 'invalid-url-error',
  url,
});

export const stringToLocalePath = (href: string): Result<InvalidUrlError, LocalePath> =>
  fromRaisableR(() => new URL(href, 'ignored-protocol:/'))
    .mapError(() => invalidUrlError(href))
    .map(toLocalePath);

export const currentLocalePath = (): Result<WindowError, LocalePath> =>
  windowGet('location').map(toLocalePath);

export const homeLocalePath = (locale: Locale) => localePath(locale, '/');

export const defaultHomeLocalePath = homeLocalePath(defaultLocale);

export const withLocale =
  (locale: Locale) =>
  (localePath: LocalePath): LocalePath => ({ ...localePath, locale });

export const withPath =
  (path: Path) =>
  (localePath: LocalePath): LocalePath => ({ ...localePath, path });

export const withSearch =
  (search: Search) =>
  (localePath: LocalePath): LocalePath => ({ ...localePath, search });

export const withHash =
  (hash: Hash) =>
  (localePath: LocalePath): LocalePath => ({ ...localePath, hash });

export const localePathToString = ({ locale, path, search, hash }: LocalePath): Path =>
  `/${locale}${path}${search}${hash}`;

export const localePathToPath = ({ path, search, hash }: LocalePath): Path =>
  `${path}${search}${hash}`;
