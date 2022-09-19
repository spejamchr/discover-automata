import clsx from 'clsx';
import { observer } from 'mobx-react';
import * as React from 'react';

interface Props {
  className?: string;
}

const EmptyCell: React.FC<Props> = ({ className }) => (
  <span
    className={clsx(
      className,
      'flex h-[1rem] w-[1rem] min-w-[1ch] items-center justify-center font-mono text-xs transition duration-500 ease-in-out',
    )}
  ></span>
);

export default observer(EmptyCell);
