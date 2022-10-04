import { observer } from 'mobx-react-lite';
import { PlainTextKey } from '../../utils/Locales/Types';
import LinkToSection from '../LinkToSection';

interface Props {
  kind: PlainTextKey;
}

const HelpLink: React.FC<Props> = ({ kind }) => (
  <LinkToSection
    path="/"
    kind={kind}
    className="ml-2 rounded-full bg-slate-200 px-2 font-extralight no-underline dark:bg-slate-900"
  >
    ?
  </LinkToSection>
);

export default observer(HelpLink);
