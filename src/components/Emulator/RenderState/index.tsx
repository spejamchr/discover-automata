import { observer } from 'mobx-react';
import * as React from 'react';
import OnlyOnClient from '../../OnlyOnClient';
import Store from '../Store';
import ConfigureRuleId from './ConfigureRuleId';
import Configuring from './Configuring';
import HistoryWithWidth from './HistoryWithWidth';
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
      <HistoryWithWidth store={store} />
    </OnlyOnClient>
  );
};

export default observer(RenderState);
