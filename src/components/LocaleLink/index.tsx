import { observer } from 'mobx-react-lite';
import { forwardRef } from 'react';
import { localePathToString, stringToLocalePath, withLocale } from '../../utils/LocalePath';
import { Locale } from '../../utils/Locales/Types';
import TheLink from './TheLink';

export interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  locale: Locale;
  href: string;
}

const LocaleLink = forwardRef<HTMLAnchorElement, Props>((props, ref) => {
  const { locale, href, ...rest } = props;
  return stringToLocalePath(href)
    .map(withLocale(locale))
    .map((path) => <TheLink key={localePathToString(path)} path={path} {...rest} ref={ref} />)
    .getOrElse(() => <></>);
});

LocaleLink.displayName = 'LocaleLink';

export default observer(LocaleLink);
