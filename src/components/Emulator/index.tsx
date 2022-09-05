import { observer } from 'mobx-react';
import * as React from 'react';
import Reactions from './Reactions';
import RenderState from './RenderState';
import Store from './Store';

interface Props {}

class Emulator extends React.Component<Props> {
  store = new Store();

  render() {
    return (
      <>
        <Reactions store={this.store} fireImmediately />
        <RenderState store={this.store} />
      </>
    );
  }
}

export default observer(Emulator);