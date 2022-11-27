import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import Footer from '../../components/Footer';
import TitleBar from '../../components/TitleBar';
import WhatAreCellularAutomata from '../../components/WhatAreCellularAutomata';
import LocaleContextProvider from '../../utils/Locales/LocaleContextProvider';
import { constrainToLocale, Locale, locales } from '../../utils/Locales/Types';
import WithTFns from '../../utils/Locales/WithTFns';

export interface Props {
  locale: Locale;
}

const Home: NextPage<Props> = ({ locale }) => {
  return (
    <LocaleContextProvider locale={locale}>
      <WithTFns>
        {({ t }) => (
          <Head>
            <title>{t('One-dimensional Cellular Automata')}</title>
            <meta name="description" content={t('Emulate 1D cellular automata in the browser')} />
            <link rel="icon" href="/favicon.ico" />
          </Head>
        )}
      </WithTFns>

      <TitleBar />

      <main>
        <WhatAreCellularAutomata />
      </main>

      <Footer />
    </LocaleContextProvider>
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

