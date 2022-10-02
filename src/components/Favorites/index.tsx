import { observer } from 'mobx-react';
import React from 'react';
import EmulatorStore from '../Emulator/Store';
import RenderState from './RenderState';
import Store from './Store';

interface Props {
  store: Store;
  emulatorStore: EmulatorStore;
}

class Favorites extends React.Component<Props> {
  componentDidMount(): void {
    this.props.store.loadingStoredFavorites();
  }
  render(): React.ReactNode {
    const { store, emulatorStore } = this.props;
    return (
      <div className="mb-2">
        <RenderState store={store} emulatorStore={emulatorStore} />
      </div>
    );
  }
}

export default observer(Favorites);
