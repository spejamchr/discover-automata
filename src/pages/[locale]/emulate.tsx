import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import Emulator from '../../components/Emulator';
import LanguagePicker from '../../components/LanguagePicker';
import LocaleLink from '../../components/LocaleLink';
import LocaleContextProvider from '../../utils/Locales/LocaleContextProvider';
import T from '../../utils/Locales/T';
import { constrainToLocale, Locale, locales } from '../../utils/Locales/Types';
import WithTFns from '../../utils/Locales/WithTFns';

export interface Props {
  locale: Locale;
}

const Emulate: NextPage<Props> = ({ locale }) => {
  return (
    <LocaleContextProvider locale={locale}>
      <div className={`mb-72 mt-10 min-h-screen w-full bg-slate-100 px-2 text-slate-700`}>
        <div>
          <WithTFns>
            {({ t }) => (
              <Head>
                <title>{t('One-dimensional Cellular Automata')}</title>
                <meta
                  name="description"
                  content={t('Emulate 1D cellular automata in the browser')}
                />
                <link rel="icon" href="/favicon.ico" />
              </Head>
            )}
          </WithTFns>

          <main>
            <span className="flex flex-wrap items-start justify-between">
              <h1 className={`pb-2 pr-4 text-lg`}>
                <T kind={'One-dimensional Cellular Automata'} />
              </h1>
              <LanguagePicker currentPath="/emulate" />
            </span>
            <div className="pb-4">
              <LocaleLink href="/">
                <T kind="What's this all about?" />
              </LocaleLink>
            </div>
            <Emulator />
          </main>
        </div>
      </div>
    </LocaleContextProvider>
  );
};

export default Emulate;

export const getStaticPaths: GetStaticPaths = () => {
  const paths = locales.map((locale) => ({ params: { locale } }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props> = (context) => {
  const locale = constrainToLocale(context.params?.locale);
  return { props: { locale } };
};
