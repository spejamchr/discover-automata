import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import { forwardRef } from 'react';
import { localePathToString, stringToLocalePath, withLocale } from '../../utils/LocalePath';
import { Locale } from '../../utils/Locales/Types';
import TheLink from './TheLink';

export interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  locale: Locale;
}

const CurrentPageInLocale = forwardRef<HTMLAnchorElement, Props>(({ locale, ...rest }, ref) => {
  const { asPath } = useRouter();

  return stringToLocalePath(asPath)
    .map(withLocale(locale))
    .map((path) => <TheLink key={localePathToString(path)} path={path} {...rest} ref={ref} />)
    .getOrElse(() => <></>);
});

CurrentPageInLocale.displayName = 'CurrentPageInLocale';

export default observer(CurrentPageInLocale);
