import { observer } from 'mobx-react-lite';
import { forwardRef } from 'react';
import { Locale, LocaleContext } from '../../utils/Locales/Types';
import TheLink from './TheLink';

export interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  locale?: Locale;
  href: string;
}

const LocaleLink = forwardRef<HTMLAnchorElement, Props>((props, ref) => {
  const { locale, href, ...rest } = props;
  return locale !== undefined ? (
    <TheLink locale={locale} href={href} {...rest} ref={ref} />
  ) : (
    <LocaleContext.Consumer>
      {({ locale }) => <TheLink locale={locale} href={href} {...rest} ref={ref} />}
    </LocaleContext.Consumer>
  );
});

export default observer(LocaleLink);
