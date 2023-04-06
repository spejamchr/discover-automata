import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import React from 'react';
import { assertResult } from '../../utils/Assert';
import { stringToLocalePath, withLocale } from '../../utils/LocalePath';
import T from '../../utils/Locales/T';
import { PlainTextKey } from '../../utils/Locales/Types';
import WithTFns from '../../utils/Locales/WithTFns';
import LinkToSection, { textToId } from '../LinkToSection';

type Heading = 'h1' | 'h2' | 'h3' | 'h4' | 'h5';

interface Props {
  h: Heading;
  kind: PlainTextKey;
}

export const LinkedSection: React.FC<Props> = ({ h, kind }) => {
  const { asPath } = useRouter();
  return (
    <WithTFns>
      {({ t, locale }) =>
        React.createElement(
          h,
          { id: textToId(t(kind)), className: 'group -ml-4 pl-4' },
          assertResult(
            stringToLocalePath(asPath)
              .map(withLocale(locale))
              .map((path) => (
                <>
                  <LinkToSection
                    path={path.path}
                    className={
                      'absolute -ml-[1.75ch] font-extrabold no-underline opacity-0 transition-opacity group-hover:opacity-100'
                    }
                    kind={kind}
                  >
                    &nbsp;{'#'}&nbsp;
                  </LinkToSection>
                  <T kind={kind} />
                </>
              )),
          ),
        )
      }
    </WithTFns>
  );
};

export default observer(LinkedSection);
