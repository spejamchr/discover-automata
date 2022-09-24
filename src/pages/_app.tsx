import '../styles/globals.css';
import type { AppProps } from 'next/app';
import TitleBar from '../components/TitleBar';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <TitleBar />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
