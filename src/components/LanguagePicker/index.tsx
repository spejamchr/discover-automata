import { observer } from 'mobx-react';
import { Menu } from '@headlessui/react';
import React from 'react';
import Picker from './Picker';

interface Props {
  currentPath: string;
}

const LanguagePicker: React.FC<Props> = ({ currentPath }) => (
  <span className="flex flex-col items-end">
    <Menu>
      <Menu.Button className="m-1 rounded bg-slate-300 p-2 text-sm transition hover:bg-slate-400 hover:text-slate-800 active:bg-slate-500 active:text-slate-900">
        ▼ Language
      </Menu.Button>
      <Picker currentPath={currentPath} />
    </Menu>
  </span>
);

export default observer(LanguagePicker);