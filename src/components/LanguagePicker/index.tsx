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
        <Menu.Button className="rounded bg-slate-300 p-2 text-sm transition hover:bg-slate-400 hover:text-slate-800 active:bg-slate-500 active:text-slate-900">
          <Globe />
        </Menu.Button>
        <Picker />
      </Menu>
    </span>
  );
};

export default observer(LanguagePicker);
