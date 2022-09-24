import { observer } from 'mobx-react-lite';
import LanguagePicker from '../LanguagePicker';

interface Props {}

const TitleBar: React.FC<Props> = () => (
  <div className="mb-4 flex items-center justify-between bg-slate-200 px-12 py-2">
    <span className="text-xl font-extralight">Discover Automata</span>
    <LanguagePicker />
  </div>
);

export default observer(TitleBar);
