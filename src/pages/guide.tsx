import { GetStaticProps } from 'next';
import { defaultLocale } from '../utils/Locales/Types';
import Guide, { Props, getStaticProps as getStaticPropsImpl } from './[locale]/guide';

export default Guide;

export const getStaticProps: GetStaticProps<Props> = () =>
  getStaticPropsImpl({ params: { locale: defaultLocale } });
