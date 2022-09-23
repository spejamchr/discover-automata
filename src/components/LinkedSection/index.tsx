import { observer } from 'mobx-react-lite';
import React from 'react';
import { PlainTextKey } from '../../utils/Locales/Types';
import WithTFns from '../../utils/Locales/WithTFns';
import LocaleLink from '../LocaleLink';

type Heading = 'h1' | 'h2' | 'h3' | 'h4' | 'h5';

interface Props {
  h: Heading;
  kind: PlainTextKey;
}

const textToId = (text: string): string => text.replaceAll(/\s+/g, '_').toLowerCase();

const LinkedSection: React.FC<Props> = ({ h, kind }) => (
  <WithTFns>
    {({ t }) => {
      const text = t(kind);
      const id = textToId(text);
      return React.createElement(
        h,
        { id, className: 'group -ml-4 pl-4' },
        <>
          <LocaleLink
            href={`#${id}`}
            className="absolute -ml-[1.75ch] cursor-pointer font-extrabold no-underline opacity-0 transition-opacity group-hover:opacity-100"
          >
            &nbsp;{'#'}&nbsp;
          </LocaleLink>
          {text}
        </>,
      );
    }}
  </WithTFns>
);

export default observer(LinkedSection);
