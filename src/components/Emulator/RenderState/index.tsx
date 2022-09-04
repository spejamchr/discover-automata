import { observer } from 'mobx-react';
import * as React from 'react';
import Store from '../Store';
import Configuring from './Configuring';
import Ready from './Ready';

interface Props {
  store: Store;
}

const RenderState: React.FC<Props> = ({ store }) => {
  switch (store.state.kind) {
    case 'configuring':
      return <Configuring store={store} state={store.state} />;
    case 'ready':
      return <Ready store={store} state={store.state} />;
  }
};

export default observer(RenderState);
