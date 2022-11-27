import { observer } from 'mobx-react';
import React from 'react';
import { LocaleContext, sortedLocales } from '../../utils/Locales/Types';
import CurrentPageInLocale from '../LocaleLink/CurrentPageInLocale';

interface Props {}

const LocaleLinks: React.FC<Props> = () => (
  <LocaleContext.Consumer>
    {({ locale: currentLocale }) =>
      sortedLocales.map(({ nativeLocale, locale }, i) => {
        const lang =
          locale === currentLocale ? (
            <span>{nativeLocale}</span>
          ) : (
            <CurrentPageInLocale locale={locale}>{nativeLocale}</CurrentPageInLocale>
          );
        const separator =
          i === sortedLocales.length - 1 ? <></> : <span className="mx-2"> - </span>;
        return (
          <React.Fragment key={locale}>
            {lang}
            {separator}
          </React.Fragment>
        );
      })
    }
  </LocaleContext.Consumer>
);

export default observer(LocaleLinks);
