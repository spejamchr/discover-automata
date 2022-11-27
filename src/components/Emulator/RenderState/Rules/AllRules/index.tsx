import { observer } from 'mobx-react';
import * as React from 'react';
import Store from '../../../Store';
import Rule from '../Rule';

interface Props {
  store: Store;
}

const AllRules: React.FC<Props> = ({ store }) => (
  <div className={`box-content flex flex-wrap content-start items-start justify-center`}>
    {store.automata.rules
      .map((r, i) => <Rule key={i} ruleIndex={i} state={r} store={store} />)
      .reverse()}
  </div>
);

export default observer(AllRules);
