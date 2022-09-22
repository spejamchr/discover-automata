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
    <div className={clsx(`flex shrink-0 flex-wrap items-center justify-between`)}>
      <span className={clsx(`flex`)}>
        <States className="min-w-[17rem]" store={store} />
        <Neighbors store={store} className="ml-12" />
      </span>

      <Togglers store={store} />
    </div>
  );
};

export default observer(Configuring);
