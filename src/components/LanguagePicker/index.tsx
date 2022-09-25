import { observer } from 'mobx-react';
import { Menu } from '@headlessui/react';
import React from 'react';
import Picker from './Picker';
import Globe from '../svgs/Globe';

interface Props {}

const LanguagePicker: React.FC<Props> = () => {
  return (
    <span className="float-right flex flex-col items-end">
      <Menu>
        <Menu.Button className="rounded bg-slate-300 p-2 transition hover:bg-slate-400 active:bg-slate-500 dark:bg-slate-600 dark:hover:bg-slate-500 dark:active:bg-slate-400">
          <Globe className="fill-slate-700 hover:fill-slate-800 active:fill-slate-900 dark:fill-slate-200 dark:hover:fill-slate-100 dark:active:fill-slate-50" />
        </Menu.Button>
        <Picker />
      </Menu>
    </span>
  );
};

export default observer(LanguagePicker);
