import { observer } from 'mobx-react-lite';
import React from 'react';
import { PlainTextKey } from '../../utils/Locales/Types';
import WithTFns from '../../utils/Locales/WithTFns';
import LinkTo from '../LocaleLink/LinkTo';

interface Props {
  kind: PlainTextKey;
  path?: string;
  children: React.ReactNode;
  className?: string;
}

export const textToId = (text: string): string => text.replaceAll(/\s+/g, '_').toLowerCase();

const LinkToSection: React.FC<Props> = ({ path, kind, children, className }) => (
  <WithTFns>
    {({ t }) => {
      const text = t(kind);
      const id = textToId(text);
      return (
        <LinkTo href={`${path || ''}#${id}`} className={className}>
          {children}
        </LinkTo>
      );
    }}
  </WithTFns>
);

export default observer(LinkToSection);
