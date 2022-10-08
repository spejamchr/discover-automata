import { observer } from 'mobx-react';
import * as React from 'react';
import T from '../../utils/Locales/T';
import { windowGet } from '../../utils/WindowGet';
import FavoritesStore from '../Favorites/Store';
import FavoritesReactions from '../Favorites/Reactions';
import LocaleLink from '../LocaleLink';
import EmulatorReactions from './Reactions';
import RenderState from './RenderState';
import EmulatorStore from './Store';
import WithTFns from '../../utils/Locales/WithTFns';
import { displaySettings, randomCells } from './Types';

interface Props {}

class Emulator extends React.Component<Props> {
  emulatorStore = new EmulatorStore(displaySettings(false, true, randomCells()));
  favoritesStore = new FavoritesStore();

  componentDidMount(): void {
    windowGet('addEventListener').do((fn) => fn('popstate', this.emulatorStore.setAutomataFromUrl));
    this.favoritesStore.loadingStoredFavorites();
  }

  render() {
    return (
      <div className={`w-full px-2 text-slate-700 dark:text-slate-200 sm:px-12`}>
        <span className="flex flex-wrap items-start justify-between">
          <div className="prose flex w-full max-w-sm flex-wrap items-baseline justify-between pb-4 dark:prose-invert">
            <h1>
              <T kind="Emulator" />
            </h1>
            <LocaleLink className="text-sm" href="/">
              <T kind="What's this all about?" />
            </LocaleLink>
          </div>
        </span>
        <RenderState emulatorStore={this.emulatorStore} favoritesStore={this.favoritesStore} />

        <EmulatorReactions store={this.emulatorStore} />
        <WithTFns>{({ t }) => <FavoritesReactions store={this.favoritesStore} t={t} />}</WithTFns>
      </div>
    );
  }
}

export default observer(Emulator);
