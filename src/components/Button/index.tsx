import { observer } from 'mobx-react';
import * as React from 'react';

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  children: React.ReactNode;
}

const Button: React.FC<Props> = ({ children, className, ...rest }) => (
  <button
    className={`m-1 rounded bg-slate-300 p-2 transition hover:bg-slate-400 hover:text-slate-800 active:bg-slate-500 active:text-slate-900 ${className}`}
    {...rest}
  >
    {children}
  </button>
);

export default observer(Button);
