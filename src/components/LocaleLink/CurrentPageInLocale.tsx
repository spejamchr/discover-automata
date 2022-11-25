import { observer } from 'mobx-react-lite';
import { forwardRef } from 'react';
import { currentLocalePath, withLocale } from '../../utils/LocalePath';
import { Locale } from '../../utils/Locales/Types';
import TheLink from './TheLink';

export interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  locale: Locale;
}

const CurrentPageInLocale = forwardRef<HTMLAnchorElement, Props>((props, ref) => {
  const { locale, href, ...rest } = props;
  return currentLocalePath()
    .map(withLocale(locale))
    .map((path) => <TheLink path={path} {...rest} ref={ref} />)
    .getOrElse(() => <></>);
});

CurrentPageInLocale.displayName = 'CurrentPageInLocale';

export default observer(CurrentPageInLocale);
