import { TranslationProps, LocaleContext } from './Types';

const T: React.FC<TranslationProps> = (arg) => (
  <LocaleContext.Consumer>{({ Translator }) => <Translator {...arg} />}</LocaleContext.Consumer>
);

export default T;
