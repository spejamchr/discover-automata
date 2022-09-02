import type { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>One-dimensional Cellular Automata</title>
        <meta name="description" content="Emulate 1-D cellular automata in the browser" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>One-dimensional Cellular Automata</h1>
      </main>
    </div>
  );
};

export default Home;
