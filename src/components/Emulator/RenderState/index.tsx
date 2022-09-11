import { observer } from 'mobx-react';
import * as React from 'react';
import OnlyOnClient from '../../OnlyOnClient';
import Store from '../Store';
import Configuring from './Configuring';
import History from './Configuring/History';
import Rules from './Rules';

interface Props {
  store: Store;
}

const RenderState: React.FC<Props> = ({ store }) => {
  return (
    <OnlyOnClient>
      <div className={`flex`}>
        <Configuring store={store} />
        <Rules store={store} />
      </div>
      <div className={`transition-all delay-150 duration-300 ease-in-out`}>
        <History emulatorStore={store} />
      </div>
    </OnlyOnClient>
  );
};

export default observer(RenderState);
