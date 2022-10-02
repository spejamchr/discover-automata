import { observer } from 'mobx-react';
import { fromArrayMaybe } from 'nonempty-list';
import React from 'react';
import T from '../../../utils/Locales/T';
import Button from '../../Button';
import EmulatorStore from '../../Emulator/Store';
import Store from '../Store';
import Favorite from './Favorite';

interface Props {
  store: Store;
  emulatorStore: EmulatorStore;
}

const RenderState: React.FC<Props> = ({ store, emulatorStore }) => {
  switch (store.state.kind) {
    case 'waiting':
    case 'loading-stored-favorites':
    case 'resetting-default-favorites':
      return <div className="h-12"></div>;
    case 'error-loading-stored-favorites':
    case 'error-storing-new-favorite':
    case 'error-removing-favorite':
    case 'error-resetting-default-favorites':
      return (
        <div className="flex h-12 items-center">
          <T kind={'Something went wrong... Refresh to try again.'} />
        </div>
      );
    case 'ready':
    case 'storing-new-favorite':
    case 'removing-favorite':
      return (
        <>
          {fromArrayMaybe(store.state.favorites)
            .map((favorites) =>
              favorites
                .map((f) => (
                  <Favorite
                    key={f.serialized}
                    store={store}
                    emulatorStore={emulatorStore}
                    favorite={f}
                  />
                ))
                .toArray(),
            )
            .getOrElse(() => [
              <Button key="1" onClick={store.resetDefaultFavorites}>
                <T kind="Recreate Default Favorites" />
              </Button>,
            ])}
        </>
      );
  }
};

export default observer(RenderState);
