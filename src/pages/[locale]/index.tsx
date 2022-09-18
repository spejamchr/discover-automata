import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
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

const Home: NextPage<Props> = ({ locale }) => {
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
          <h1 className={`pb-2 text-lg`}>
            <T kind={'One-dimensional Cellular Automata'} />
          </h1>
          <Emulator />
        </main>
      </div>
    </TranslatorContext.Provider>
  );
};

export default Home;

export const getStaticPaths: GetStaticPaths = () => {
  const paths = locales.map((locale) => ({ params: { locale } }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props> = (context) => {
  const locale = constrainToLocale(context.params?.locale);
  return { props: { locale } };
};
