import clsx from 'clsx';
import { observer } from 'mobx-react';
import * as React from 'react';
import HelpLink from '../../../HelpLink';
import Store from '../../Store';
import ConfigureRuleId from '../ConfigureRuleId';
import Rules from '../Rules';
import Neighbors from './Neighbors';
import States from './States';

interface Props {
  store: Store;
}

const Configuring: React.FC<Props> = ({ store }) => {
  return (
    <span className={clsx(`flex flex-col`)}>
      <span className="flex w-fit items-center">
        <States store={store} />
        <HelpLink kind="States" />
      </span>
      <span className="flex w-fit items-center">
        <Neighbors store={store} />
        <HelpLink kind="Neighbors" />
      </span>
      <ConfigureRuleId store={store} showHelp />
      <Rules store={store} />
    </span>
  );
};

export default observer(Configuring);
