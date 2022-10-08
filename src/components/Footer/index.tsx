import { observer } from 'mobx-react-lite';
import Link from 'next/link';

interface Props {}

const Footer: React.FC<Props> = () => (
  <div className="mt-36 flex items-center justify-between bg-slate-200 px-2 py-8 text-slate-800 dark:bg-slate-900 dark:text-slate-300 sm:px-12">
    <span className="font-extralight">
      <Link href="https://github.com/spejamchr/discover-automata">
        <a>github.com/spejamchr/discover-automata</a>
      </Link>
    </span>
  </div>
);

export default observer(Footer);
