import { GetStaticProps } from 'next';
import { defaultLocale } from '../utils/Locales/Types';
import CellularAutomata, { Props, getStaticProps as getStaticPropsImpl } from './[locale]/CellularAutomata';

export default CellularAutomata;

export const getStaticProps: GetStaticProps<Props> = () =>
  getStaticPropsImpl({ params: { locale: defaultLocale } });

