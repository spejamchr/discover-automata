import { observer } from 'mobx-react';
import * as React from 'react';
import { serialize } from '../../../utils/CellularAutomata';
import OnlyOnClient from '../../OnlyOnClient';
import Store from '../Store';
import ConfigureRuleId from './ConfigureRuleId';
import Configuring from './Configuring';
import History from './Configuring/History';
import Rules from './Rules';

interface Props {
  store: Store;
}

const RenderState: React.FC<Props> = ({ store }) => {
  return (
    <OnlyOnClient>
      <Configuring store={store} />
      <ConfigureRuleId store={store} />
      <Rules store={store} />
      <div className={`flex justify-center p-6 transition-all delay-150 duration-300 ease-in-out`}>
        <History key={serialize(store.automata)} emulatorStore={store} />
      </div>
    </OnlyOnClient>
  );
};

export default observer(RenderState);
