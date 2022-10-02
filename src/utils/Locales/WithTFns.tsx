import { observer } from 'mobx-react-lite';
import {
  Locale,
  LocaleContext,
  ParameterizedProps,
  PlainTextKey,
  PlainTextTranslator,
  translate,
} from './Types';

export interface TFns {
  locale: Locale;
  t: PlainTextTranslator;
  p: (key: ParameterizedProps) => React.ReactNode;
}

interface Props {
  children: (args: TFns) => React.ReactNode;
}

const WithTFns: React.FC<Props> = ({ children }) => {
  return (
    <LocaleContext.Consumer>
      {({ locale }) => {
        const t = (kind: PlainTextKey): string => translate(locale, { kind });
        const p = (arg: ParameterizedProps) => translate(locale, arg);
        return children({ locale, t, p });
      }}
    </LocaleContext.Consumer>
  );
};

export default observer(WithTFns);
