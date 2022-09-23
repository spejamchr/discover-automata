import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import React from 'react';
import { PlainTextKey, TranslatorContext } from '../../utils/Locales/Types';

type Heading = 'h1' | 'h2' | 'h3' | 'h4' | 'h5';

interface Props {
  h: Heading;
  kind: PlainTextKey;
}

const textToId = (text: string): string => text.replaceAll(/\s+/g, '_').toLowerCase();

const LinkedSection: React.FC<Props> = ({ h, kind }) => (
  <TranslatorContext.Consumer>
    {(T) => {
      const text = T.fn(kind);
      const id = textToId(text);
      return React.createElement(
        h,
        { id, className: 'group -ml-4 pl-4' },
        <>
          <Link href={`#${id}`}>
            <a className="absolute -ml-[1.75ch] cursor-pointer font-extrabold no-underline opacity-0 transition-opacity group-hover:opacity-100">
              &nbsp;{'#'}&nbsp;
            </a>
          </Link>
          {text}
        </>,
      );
    }}
  </TranslatorContext.Consumer>
);

export default observer(LinkedSection);
