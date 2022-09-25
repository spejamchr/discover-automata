import { observer } from 'mobx-react';
import * as React from 'react';
import T from '../../utils/Locales/T';
import { windowGet } from '../../utils/WindowGet';
import LocaleLink from '../LocaleLink';
import Reactions from './Reactions';
import RenderState from './RenderState';
import Store from './Store';
import Togglers from './Togglers';

interface Props {}

class Emulator extends React.Component<Props> {
  store = new Store(false, true);

  componentDidMount(): void {
    windowGet('addEventListener').do((fn) => fn('popstate', this.store.setAutomataFromUrl));
  }

  render() {
    return (
      <div className={`mb-72 min-h-screen w-full px-2 text-slate-700 dark:text-slate-200 sm:px-12`}>
        <span className="flex items-start justify-between">
          <div className="prose pb-4 dark:prose-invert">
            <h1>
              <T kind="Emulator" />
            </h1>
            <LocaleLink href="/">
              <T kind="What's this all about?" />
            </LocaleLink>
          </div>
          <Togglers store={this.store} />
        </span>
        <Reactions store={this.store} />
        <RenderState store={this.store} />
      </div>
    );
  }
}

export default observer(Emulator);
