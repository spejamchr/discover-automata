import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import Emulator from '../../components/Emulator';
import T from '../../utils/Locales/T';
import {
  constrainToLocale,
  Locale,
  locales,
  makeTranslator,
  TranslatorContext,
} from '../../utils/Locales/Types';

export interface Props {
  locale: Locale;
}

const Emulate: NextPage<Props> = ({ locale }) => {
  return (
    <TranslatorContext.Provider value={makeTranslator(locale)}>
      <div className={`min-h-screen w-full bg-slate-100 p-6 text-slate-700`}>
        <TranslatorContext.Consumer>
          {(T) => (
            <Head>
              <title>{T.fn('One-dimensional Cellular Automata')}</title>
              <meta
                name="description"
                content={T.fn('Emulate 1D cellular automata in the browser')}
              />
              <link rel="icon" href="/favicon.ico" />
            </Head>
          )}
        </TranslatorContext.Consumer>

        <main>
          <span className="flex flex-wrap items-end justify-between">
            <h1 className={`pb-2 pr-4 text-lg`}>
              <T kind={'One-dimensional Cellular Automata'} />
            </h1>
            <Link href={`/${locale}`}>
              <a className="pb-2 font-medium underline">
                <T kind="What's this all about?" />
              </a>
            </Link>
          </span>
          <Emulator />
        </main>
      </div>
    </TranslatorContext.Provider>
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
