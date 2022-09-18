import { observer } from 'mobx-react';
import * as React from 'react';
import T from '../../../../utils/Locales/T';
import Store from '../../Store';

interface Props {
  store: Store;
}

const RuleIdSize: React.FC<Props> = ({ store }) =>
  store.maxRuleId
    .map((max) =>
      max > BigInt(Number.MAX_SAFE_INTEGER) ? (
        <>
          (<T kind="maximum digits:" /> {String(max).length})
        </>
      ) : (
        <>
          ({store.minRuleId.toString()} - {max.toString()})
        </>
      ),
    )
    .getOrElse(() => <></>);

export default observer(RuleIdSize);
