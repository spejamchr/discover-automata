import clsx from 'clsx';
import { observer } from 'mobx-react';
import * as React from 'react';
import Store from '../../Store';
import Togglers from '../../Togglers';
import Neighbors from './Neighbors';
import States from './States';

interface Props {
  store: Store;
}

const Configuring: React.FC<Props> = ({ store }) => {
  return (
    <div className={clsx(`flex shrink-0 flex-wrap-reverse items-center justify-between`)}>
      <span className={clsx(`mr-2 flex flex-col`)}>
        <States store={store} />
        <Neighbors store={store} />
      </span>

      <Togglers store={store} />
    </div>
  );
};

export default observer(Configuring);
