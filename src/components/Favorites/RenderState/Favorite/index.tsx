import { just } from 'maybeasy';
import { observer } from 'mobx-react';
import React from 'react';
import { serialize } from '../../../../utils/CellularAutomata';
import { whenEQM } from '../../../../utils/Extensions';
import WithTFns from '../../../../utils/Locales/WithTFns';
import EmulatorStore from '../../../Emulator/Store';
import XFilled from '../../../svgs/XFilled';
import Store from '../../Store';
import { Favorite } from '../../Types';

interface Props {
  store: Store;
  emulatorStore: EmulatorStore;
  favorite: Favorite;
}

const RenderState: React.FC<Props> = ({ store, emulatorStore, favorite }) => {
  return (
    <div className="mb-2 flex w-full max-w-full">
      <button
        className="mr-4 max-w-full rounded-full fill-red-500 px-2 hover:fill-rose-600"
        onClick={() => store.removingFavorite(favorite)}
      >
        <XFilled className="h-4" />
      </button>
      {just(favorite.serialized)
        .andThen(whenEQM(serialize(emulatorStore.automata)))
        .map(() => (
          <span className="flex w-full max-w-full rounded-full bg-slate-200 py-1 px-2 transition duration-300 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600">
            <span className="grow">
              <WithTFns>
                {({ t }) => (
                  <input
                    className="w-full rounded py-0 px-1 dark:bg-slate-800"
                    value={favorite.name}
                    onChange={(e) =>
                      store.storingNewFavorite({ ...favorite, name: e.target.value })
                    }
                    placeholder={t('Description of the automaton...')}
                  />
                )}
              </WithTFns>
            </span>
            <span className="ml-1 max-w-[8rem] shrink overflow-hidden overflow-ellipsis">
              ({favorite.serialized})
            </span>
          </span>
        ))
        .getOrElse(() => (
          <button
            className="flex w-full max-w-full justify-between overflow-hidden overflow-ellipsis whitespace-nowrap rounded-full bg-slate-200 py-1 px-2 transition duration-300 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
            onClick={() => emulatorStore.setAutomata(favorite.automata)}
          >
            <span className="ml-1 inline-block max-w-full grow overflow-hidden overflow-ellipsis text-left">
              {favorite.name}
            </span>
            <span className="ml-2 max-w-[8rem] shrink overflow-hidden overflow-ellipsis">
              ({favorite.serialized})
            </span>
          </button>
        ))}
    </div>
  );
};

export default observer(RenderState);
