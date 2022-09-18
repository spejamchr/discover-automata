import { TranslatorContext, TProps } from './Types';

const T: React.FC<TProps> = ({ kind }) => (
  <TranslatorContext.Consumer>
    {(Translator) => <Translator kind={kind} />}
  </TranslatorContext.Consumer>
);

export default T;
