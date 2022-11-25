import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { forwardRef } from 'react';
import { LocalePath, localePathToString } from '../../utils/LocalePath';

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  path: LocalePath
}

const TheLink = forwardRef<HTMLAnchorElement, Props>((props, ref) => {
  const { path, children, className, ...rest } = props;
  const href = localePathToString(path)
  return (
    <Link href={href}>
      <a
        href={href}
        className={clsx(className, 'font-medium underline')}
        {...rest}
        ref={ref}
      >
        {children}
      </a>
    </Link>
  );
});

TheLink.displayName = 'TheLink';

export default observer(TheLink);
