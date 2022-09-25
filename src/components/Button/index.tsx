import clsx from 'clsx';
import { observer } from 'mobx-react';
import * as React from 'react';

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {}

const Button: React.FC<Props> = ({ children, className, ...rest }) => (
  <button
    className={clsx(
      className,
      'rounded bg-slate-300 p-2 transition hover:bg-slate-400 hover:text-slate-800 active:bg-slate-500 active:text-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 dark:hover:text-slate-100 dark:active:bg-slate-500 dark:active:text-slate-50',
    )}
    {...rest}
  >
    {children}
  </button>
);

export default observer(Button);
