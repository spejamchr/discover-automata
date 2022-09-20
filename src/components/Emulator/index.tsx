import { observer } from 'mobx-react';
import * as React from 'react';
import { windowGet } from '../../utils/WindowGet';
import Reactions from './Reactions';
import RenderState from './RenderState';
import Store from './Store';

interface Props {}

class Emulator extends React.Component<Props> {
  store = new Store();

  componentDidMount(): void {
    windowGet('addEventListener').do((fn) => fn('popstate', this.store.setAutomataFromUrl));
  }

  render() {
    return (
      <>
        <Reactions store={this.store} />
        <RenderState store={this.store} />
      </>
    );
  }
}

export default observer(Emulator);
