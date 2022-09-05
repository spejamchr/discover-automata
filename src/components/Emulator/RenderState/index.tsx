import { observer } from 'mobx-react';
import * as React from 'react';
import Store from '../Store';
import Configuring from './Configuring';

interface Props {
  store: Store;
}

const RenderState: React.FC<Props> = ({ store }) => {
  return <Configuring store={store} state={store.state} />;
};

export default observer(RenderState);
