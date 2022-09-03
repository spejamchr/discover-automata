import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { constrainToLocale, Locale, locales } from '../../Locales/Types';

export interface Props {
  locale: Locale;
}

const Home: NextPage<Props> = ({ locale }) => {
  return (
    <div>
      <Head>
        <title>One-dimensional Cellular Automata</title>
        <meta name="description" content="Emulate 1-D cellular automata in the browser" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>One-dimensional Cellular Automata</h1>
        <p>In {locale}</p>
      </main>
    </div>
  );
};

export default Home;

export const getStaticPaths: GetStaticPaths = () => {
  const paths = locales.map((locale) => ({ params: { locale } }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props> = (context) => {
  const l = constrainToLocale(context.params?.locale);
  return { props: { locale: l } };
};
