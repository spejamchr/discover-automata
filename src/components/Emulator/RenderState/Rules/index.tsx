import { observer } from 'mobx-react';
import * as React from 'react';
import Store from '../../Store';
import Rule from './Rule';
import T from '../../../../utils/Locales/T';

interface Props {
  store: Store;
}

const Rules: React.FC<Props> = ({ store }) => {
  return (
    <details className="mb-2">
      <summary
        className={
          'mt-1 cursor-pointer rounded bg-slate-300 p-2 transition hover:bg-slate-400 hover:text-slate-800 active:bg-slate-500 active:text-slate-900'
        }
      >
        <T kind={'Transition Rules'} />
      </summary>
      <div className={`box-content flex flex-wrap content-start items-start justify-center`}>
        {store.automata.rules
          .map((r, i) => <Rule key={i} ruleIndex={i} state={r} store={store} />)
          .reverse()}
      </div>
    </details>
  );
};

export default observer(Rules);
