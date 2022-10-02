import clsx from 'clsx';
import { observer } from 'mobx-react';
import * as React from 'react';

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {}

const Button: React.FC<Props> = ({ children, className, disabled, ...rest }) => (
  <button
    className={clsx(className, 'rounded p-2 transition', {
      'bg-slate-200 text-slate-400 dark:bg-slate-500 dark:text-slate-400': disabled,
      'bg-slate-300 hover:bg-slate-400 hover:text-slate-800 active:bg-slate-500 active:text-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 dark:hover:text-slate-100 dark:active:bg-slate-500 dark:active:text-slate-50':
        !disabled,
    })}
    {...rest}
    disabled={disabled}
  >
    {children}
  </button>
);

export default observer(Button);
