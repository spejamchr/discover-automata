import { observer } from 'mobx-react-lite';
import React from 'react';
import T from '../../utils/Locales/T';
import { PlainTextKey } from '../../utils/Locales/Types';
import WithTFns from '../../utils/Locales/WithTFns';
import LinkToSection, { textToId } from '../LinkToSection';

type Heading = 'h1' | 'h2' | 'h3' | 'h4' | 'h5';

interface Props {
  h: Heading;
  kind: PlainTextKey;
}

export const LinkedSection: React.FC<Props> = ({ h, kind }) => (
  <WithTFns>
    {({ t }) =>
      React.createElement(
        h,
        { id: textToId(t(kind)), className: 'group -ml-4 pl-4' },
        <>
          <LinkToSection
            className={
              'absolute -ml-[1.75ch] font-extrabold no-underline opacity-0 transition-opacity group-hover:opacity-100'
            }
            kind={kind}
          >
            &nbsp;{'#'}&nbsp;
          </LinkToSection>
          <T kind={kind} />
        </>,
      )
    }
  </WithTFns>
);

export default observer(LinkedSection);
