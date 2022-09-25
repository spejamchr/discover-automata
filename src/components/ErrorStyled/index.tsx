import { always } from '@kofno/piper';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { Result } from 'resulty';

interface Props {
  result: Result<unknown, unknown>;
  children: React.ReactNode;
  className?: string;
  okClass?: string;
  errClass?: string;
}

const ErrorStyled: React.FC<Props> = ({ result, children, className, okClass, errClass }) => (
  <span
    className={clsx(
      className,
      result.map(always(true)).getOrElseValue(false) && okClass,
      result.map(always(false)).getOrElseValue(true) &&
        `${errClass} text-rose-600 dark:text-rose-500`,
    )}
  >
    {children}
  </span>
);

export default observer(ErrorStyled);
