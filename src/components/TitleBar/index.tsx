import { observer } from 'mobx-react-lite';
import T from '../../utils/Locales/T';
import LanguagePicker from '../LanguagePicker';

interface Props {}

const TitleBar: React.FC<Props> = () => (
  <div className="mb-4 flex items-center justify-between bg-slate-200 px-12 py-2 text-slate-800 dark:bg-slate-700 dark:text-slate-100">
    <span className="text-xl font-extralight">
      <T kind="Discover Automata" />
    </span>
    <LanguagePicker />
  </div>
);

export default observer(TitleBar);
