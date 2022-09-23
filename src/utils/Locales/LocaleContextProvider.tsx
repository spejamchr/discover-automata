import { observer } from 'mobx-react-lite';
import { Locale, LocaleContext, makeTranslator } from './Types';

interface Props {
  locale: Locale;
  children: React.ReactNode;
}

const LocaleContextProvider: React.FC<Props> = ({ locale, children }) => (
  <LocaleContext.Provider value={{ locale, Translator: makeTranslator(locale) }}>
    {children}
  </LocaleContext.Provider>
);

export default observer(LocaleContextProvider);
