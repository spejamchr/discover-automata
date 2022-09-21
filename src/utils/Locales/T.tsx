import { TranslatorContext, TranslationProps } from './Types';

const T: React.FC<TranslationProps> = (arg) => (
  <TranslatorContext.Consumer>{(Translator) => <Translator {...arg} />}</TranslatorContext.Consumer>
);

export default T;
