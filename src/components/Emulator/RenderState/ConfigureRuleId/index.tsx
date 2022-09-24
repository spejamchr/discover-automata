import { always } from '@kofno/piper';
import clsx from 'clsx';
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
    <label className={`block`} htmlFor="ruleInput">
      <span className={`block text-sm font-medium`}>
        <T kind="Rule Number" /> <RuleIdSize store={store} />
      </span>
    </label>
    <span className={`flex max-w-full items-start`}>
      <input
        id="ruleInput"
        className={clsx(
          `mr-1 mb-1 h-10 min-w-[12rem] rounded font-mono transition-all duration-500 ease-in-out`,
          {
            'border-rose-600 focus:border-rose-500 focus:ring focus:ring-rose-200': store.validRule
              .map(always(false))
              .getOrElseValue(true),
          },
        )}
        style={{
          width: `${Math.max(
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
    </span>
  </span>
);

export default observer(ConfigureRuleId);
