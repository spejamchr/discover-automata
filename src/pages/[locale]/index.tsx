import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import Explanation from '../../components/Explanation';
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
        <Explanation />
      </main>
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
