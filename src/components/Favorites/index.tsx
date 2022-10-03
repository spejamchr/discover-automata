import { observer } from 'mobx-react';
import React from 'react';
import EmulatorStore from '../Emulator/Store';
import RenderState from './RenderState';
import Store from './Store';

interface Props {
  store: Store;
  emulatorStore: EmulatorStore;
}

const Favorites: React.FC<Props> = ({ store, emulatorStore }) => (
  <div className="mb-2">
    <RenderState store={store} emulatorStore={emulatorStore} />
  </div>
);

export default observer(Favorites);
