import { GetStaticProps } from 'next';
import { defaultLocale } from '../utils/Locales/Types';
import Emulate, { Props, getStaticProps as getStaticPropsImpl } from './[locale]';

export default Emulate;

export const getStaticProps: GetStaticProps<Props> = () =>
  getStaticPropsImpl({ params: { locale: defaultLocale } });
