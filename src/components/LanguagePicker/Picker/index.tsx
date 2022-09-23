import { observer } from 'mobx-react-lite';
import { Menu } from '@headlessui/react';
import { LocaleContext, locales } from '../../../utils/Locales/Types';
import LocaleLink from '../../LocaleLink';
import clsx from 'clsx';

interface Props {
  currentPath: string;
}

const Picker: React.FC<Props> = ({ currentPath }) => {
  return (
    <Menu.Items>
      <span className="relative">
        <div
          className={'absolute top-full right-0 m-1 w-fit min-w-[6rem] rounded bg-slate-200 p-2'}
        >
          <LocaleContext.Consumer>
            {({ locale: currentLocale }) =>
              locales
                .slice()
                .sort()
                .map((locale) =>
                  locale === currentLocale ? (
                    <div key={locale}>
                      <Menu.Item key={locale} disabled>
                        <span className="flex w-full justify-between px-4 py-2 text-left text-sm font-extrabold leading-5 opacity-50">
                          {locale}
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
                              'flex w-full justify-between px-4 py-2 text-left text-sm leading-5 no-underline',
                              { 'bg-slate-300': active },
                            )}
                            href={currentPath}
                          >
                            {locale}
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
