import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { LocaleContext } from '../../utils/Locales/Types';

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

const LocaleLink: React.FC<Props> = ({ href, children, className, ...rest }) => (
  <LocaleContext.Consumer>
    {({ locale }) => {
      const hrefWithLocale = href[0] === '/' ? `/${locale}${href}` : href;
      return (
        <Link href={hrefWithLocale}>
          <a className={clsx(className, 'font-medium underline')} {...rest}>
            {children}
          </a>
        </Link>
      );
    }}
  </LocaleContext.Consumer>
);

export default observer(LocaleLink);
