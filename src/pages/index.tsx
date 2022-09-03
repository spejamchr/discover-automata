import { GetStaticProps } from 'next';
import Home, { Props, getStaticProps as getStaticPropsImpl } from './[locale]';

export default Home;

export const getStaticProps: GetStaticProps<Props> = () =>
  getStaticPropsImpl({ params: { locale: 'en' } });
