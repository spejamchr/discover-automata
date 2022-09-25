import '../styles/globals.css';
import type { AppProps } from 'next/app';
import TitleBar from '../components/TitleBar';
import { currentLocalePath } from '../utils/LocalePath';
import { defaultLocale } from '../utils/Locales/Types';
import LocaleContextProvider from '../utils/Locales/LocaleContextProvider';

function MyApp({ Component, pageProps }: AppProps) {
  const locale = currentLocalePath()
    .map(({ locale }) => locale)
    .getOrElseValue(defaultLocale);
  return (
    <>
      <LocaleContextProvider locale={locale}>
        <TitleBar />
      </LocaleContextProvider>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
