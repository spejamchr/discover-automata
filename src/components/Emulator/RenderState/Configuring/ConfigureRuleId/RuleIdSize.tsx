import { observer } from 'mobx-react';
import * as React from 'react';
import T from '../../../../../utils/Locales/T';
import ErrorStyled from '../../../../ErrorStyled';
import Ranged from '../../../../Ranged';
import Store from '../../../Store';

interface Props {
  store: Store;
}

const RuleIdSize: React.FC<Props> = ({ store }) =>
  store.maxRuleId
    .map((max) =>
      max.toString().length > 24 ? (
        <>
          (<T kind="maximum digits:" /> {String(max).length})
        </>
      ) : (
        <>
          (
          <ErrorStyled result={store.validRule}>
            <Ranged low={store.minRuleId.toString()} high={max.toString()} />
          </ErrorStyled>
          )
        </>
      ),
    )
    .getOrElse(() => <></>);

export default observer(RuleIdSize);
