import { observer } from 'mobx-react-lite';
import { forwardRef } from 'react';
import LocaleLink from '.';
import { LocaleContext } from '../../utils/Locales/Types';

export interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

const LinkTo = forwardRef<HTMLAnchorElement, Props>((props, ref) => {
  const { href, ...rest } = props;
  return (
    <LocaleContext.Consumer>
      {({ locale }) => <LocaleLink href={href} locale={locale} {...rest} ref={ref} />}
    </LocaleContext.Consumer>
  );
});

LinkTo.displayName = 'LinkTo';

export default observer(LinkTo);
