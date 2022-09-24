import clsx from 'clsx';
import { observer } from 'mobx-react';
import * as React from 'react';
import Store from '../../Store';
import Neighbors from './Neighbors';
import States from './States';

interface Props {
  store: Store;
}

const Configuring: React.FC<Props> = ({ store }) => {
  return (
    <span className={clsx(`mr-2 flex flex-col`)}>
      <States store={store} />
      <Neighbors store={store} />
    </span>
  );
};

export default observer(Configuring);
