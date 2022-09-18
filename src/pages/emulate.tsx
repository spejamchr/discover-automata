import { GetStaticProps } from 'next';
import Emulate, { Props, getStaticProps as getStaticPropsImpl } from './[locale]/emulate';

export default Emulate;

export const getStaticProps: GetStaticProps<Props> = () =>
  getStaticPropsImpl({ params: { locale: 'en' } });
