import { observer } from 'mobx-react';
import * as React from 'react';
import Store from '../../Store';
import T from '../../../../utils/Locales/T';
import AllRules from './AllRules';

interface Props {
  store: Store;
}

const Rules: React.FC<Props> = ({ store }) => {
  return (
    <details className="mb-2">
      <summary
        className={
          'mt-1 cursor-pointer rounded bg-slate-300 p-2 transition hover:bg-slate-400 hover:text-slate-800 active:bg-slate-500 active:text-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 dark:hover:text-slate-100 dark:active:bg-slate-500 dark:active:text-slate-50'
        }
      >
        <T kind={'Transition Rules'} />
      </summary>
      <AllRules store={store} />
    </details>
  );
};

export default observer(Rules);
