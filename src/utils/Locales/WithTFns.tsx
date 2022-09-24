import { observer } from 'mobx-react-lite';
import { Locale, LocaleContext, ParameterizedProps, PlainTextKey, translate } from './Types';

interface ChildArgs {
  locale: Locale;
  t: (key: PlainTextKey) => string;
  p: (key: ParameterizedProps) => React.ReactNode;
}

interface Props {
  children: (args: ChildArgs) => React.ReactNode;
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
