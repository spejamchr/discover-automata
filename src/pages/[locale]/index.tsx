import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Emulator from '../../components/Emulator';
import { constrainToLocale, Locale, locales } from '../../utils/Locales/Types';

export interface Props {
  locale: Locale;
}

const Home: NextPage<Props> = ({ locale }) => {
  return (
    <div className={`min-h-screen w-full bg-slate-100 p-6 text-slate-700`}>
      <Head>
        <title>One-dimensional Cellular Automata</title>
        <meta name="description" content="Emulate 1-D cellular automata in the browser" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={`pb-2 text-lg`}>One-dimensional Cellular Automata</h1>
        <Emulator />
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
