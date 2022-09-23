import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { forwardRef } from 'react';
import { Locale } from '../../utils/Locales/Types';

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  locale: Locale;
  href: string;
}

const TheLink = forwardRef<HTMLAnchorElement, Props>((props, ref) => {
  const { locale, href, children, className, ...rest } = props;
  const hrefWithLocale = href[0] === '/' ? `/${locale}${href}` : href;
  return (
    <Link href={hrefWithLocale}>
      <a
        href={hrefWithLocale}
        className={clsx(className, 'font-medium underline')}
        {...rest}
        ref={ref}
      >
        {children}
      </a>
    </Link>
  );
});

export default observer(TheLink);
