import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { serialize } from '../../../utils/CellularAutomata';
import T from '../../../utils/Locales/T';
import Favorites from '../../Favorites';
import FavoritesStore from '../../Favorites/Store';
import { favorite } from '../../Favorites/Types';
import OnlyOnClient from '../../OnlyOnClient';
import HeartFilled from '../../svgs/HeartFilled';
import Store from '../Store';
import Togglers from '../Togglers';
import ConfigureRuleId from './ConfigureRuleId';
import Configuring from './Configuring';
import HistoryWithWidth from './HistoryWithWidth';
import Rules from './Rules';

interface Props {
  emulatorStore: Store;
  favoritesStore: FavoritesStore;
}

const RenderState: React.FC<Props> = ({ emulatorStore, favoritesStore }) => {
  const isFavorited = favoritesStore.favorites.some(
    (f) => f.serialized === serialize(emulatorStore.automata),
  );
  return (
    <OnlyOnClient>
      <Tab.Group>
        <Tab.List className="mb-2 flex h-6 w-fit justify-between">
          <Tab className="rounded-full px-2 transition ui-selected:bg-slate-300 ui-not-selected:hover:bg-slate-200 dark:ui-selected:bg-slate-600 dark:ui-not-selected:hover:bg-slate-700">
            <T kind="Automaton" />
          </Tab>
          <Tab className="ml-2 rounded-full px-2 transition ui-selected:bg-slate-300 ui-not-selected:hover:bg-slate-200 dark:ui-selected:bg-slate-600 dark:ui-not-selected:hover:bg-slate-700">
            <T kind="Settings" />
          </Tab>
          <Tab className="ml-2 rounded-full px-2 transition ui-selected:bg-slate-300 ui-not-selected:hover:bg-slate-200 dark:ui-selected:bg-slate-600 dark:ui-not-selected:hover:bg-slate-700">
            <T kind="Favorites" />
          </Tab>
          <button
            className={clsx('ml-2 rounded-full px-2 transition', {
              'fill-slate-700 hover:bg-slate-200 hover:fill-rose-900 dark:fill-slate-300 dark:hover:bg-slate-700 dark:hover:fill-rose-300':
                !isFavorited,
              'bg-slate-200 fill-rose-500 dark:bg-slate-600': isFavorited,
            })}
            onClick={() => favoritesStore.storingNewFavorite(favorite(emulatorStore.automata, ''))}
            disabled={isFavorited}
          >
            <HeartFilled className={clsx('mb-1 inline h-4', {})} />
          </button>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <>
              <Configuring store={emulatorStore} />
              <ConfigureRuleId store={emulatorStore} />
              <Rules store={emulatorStore} />
            </>
          </Tab.Panel>
          <Tab.Panel>
            <Togglers store={emulatorStore} />
          </Tab.Panel>
          <Tab.Panel>
            <Favorites store={favoritesStore} emulatorStore={emulatorStore} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      <HistoryWithWidth store={emulatorStore} />
    </OnlyOnClient>
  );
};

export default observer(RenderState);
