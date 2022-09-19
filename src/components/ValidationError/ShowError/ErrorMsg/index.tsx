import { observer } from 'mobx-react-lite';

interface Props {
  children: React.ReactNode;
}

const ErrorMsg: React.FC<Props> = ({ children }) => (
  <div className={`text-sm text-rose-600 dark:text-rose-500`}>{children}</div>
);

export default observer(ErrorMsg);
