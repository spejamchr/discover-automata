import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { LocaleContext } from '../../utils/Locales/Types';

interface Props {
  href: string;
  children: React.ReactNode;
}

const LocaleLink: React.FC<Props> = ({ href, children }) => (
  <LocaleContext.Consumer>
    {({ locale }) => {
      const hrefWithLocale = href[0] === '/' ? `/${locale}${href}` : href;
      return (
        <Link href={hrefWithLocale}>
          <a>{children}</a>
        </Link>
      );
    }}
  </LocaleContext.Consumer>
);

export default observer(LocaleLink);
