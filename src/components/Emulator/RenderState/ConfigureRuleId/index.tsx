import { always } from '@kofno/piper';
import { observer } from 'mobx-react';
import * as React from 'react';
import { whenLER } from '../../../../utils/Extensions';
import T from '../../../../utils/Locales/T';
import Button from '../../../Button';
import Store from '../../Store';
import RuleIdSize from './RuleIdSize';

interface Props {
  store: Store;
}

const ConfigureRuleId: React.FC<Props> = ({ store }) => (
  <span>
    <label className={`block`}>
      <span className={`block text-sm font-medium`}>
        <T kind="Rule" /> <RuleIdSize store={store} />
      </span>
      <input
        className={`min-w-[248px] max-w-full font-mono transition-all duration-500 ease-in-out`}
        style={{
          width: `${Math.max(
            24,
            store.maxRuleId.map((r) => r.toString().length).getOrElseValue(12) + 6,
            store.userRuleId.length + 6,
          )}ch`,
        }}
        type={store.maxRuleId
          .andThen(whenLER(BigInt(Number.MAX_SAFE_INTEGER)))
          .map(always('number'))
          .getOrElseValue('text')}
        min={String(store.minRuleId)}
        max={store.maxRuleId.map(String).getOrElseValue('')}
        step="1"
        value={store.userRuleId}
        onChange={(e) => store.setRuleId(e.target.value)}
      />
      <Button onClick={store.randomizeRules}>
        <T kind="Randomize" />
      </Button>
      {store.ruleId.cata({
        Ok: () => <></>,
        Err: (e) => <span>{JSON.stringify(e)}</span>,
      })}
    </label>
  </span>
);

export default observer(ConfigureRuleId);
