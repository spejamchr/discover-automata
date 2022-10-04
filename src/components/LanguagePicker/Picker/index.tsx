import { observer } from 'mobx-react-lite';
import { Menu } from '@headlessui/react';
import { LocaleContext, sortedLocales } from '../../../utils/Locales/Types';
import LocaleLink from '../../LocaleLink';
import clsx from 'clsx';
import { currentLocalePath, localePathToPath, withLocale } from '../../../utils/LocalePath';

interface Props {}

const Picker: React.FC<Props> = () => {
  return (
    <Menu.Items>
      <span className="relative">
        <div
          className={'absolute top-full right-0 w-fit rounded bg-slate-200 p-1 dark:bg-slate-600'}
        >
          <LocaleContext.Consumer>
            {({ locale: currentLocale }) =>
              sortedLocales.map(({ nativeLocale, locale }) =>
                locale === currentLocale ? (
                  <div key={locale}>
                    <Menu.Item key={locale} disabled>
                      <span className="flex w-full justify-between px-4 py-2 text-left text-sm leading-5 opacity-75">
                        {nativeLocale}
                      </span>
                    </Menu.Item>
                  </div>
                ) : (
                  <div key={locale}>
                    <Menu.Item key={locale}>
                      {({ active }) => (
                        <LocaleLink
                          locale={locale}
                          className={clsx(
                            'flex w-full justify-between rounded px-4 py-2 text-left text-sm leading-5 no-underline',
                            { 'bg-slate-300 dark:bg-slate-500': active },
                          )}
                          href={currentLocalePath()
                            .map(withLocale(locale))
                            .map(localePathToPath)
                            .getOrElseValue('/')}
                        >
                          {nativeLocale}
                        </LocaleLink>
                      )}
                    </Menu.Item>
                  </div>
                ),
              )
            }
          </LocaleContext.Consumer>
        </div>
      </span>
    </Menu.Items>
  );
};

export default observer(Picker);
