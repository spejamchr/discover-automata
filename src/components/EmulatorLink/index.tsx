import { observer } from 'mobx-react-lite';
import * as React from 'react';
import LinkTo from '../LocaleLink/LinkTo';

interface Props {
  color: string;
  backgroundColor: string;
  children: React.ReactNode;
}

const EmulatorLink: React.FC<Props> = ({ color, backgroundColor, children }) => (
  <>
    <span className="relative hidden dark:inline dark:hue-rotate-[180deg] dark:invert">
      <span
        style={{ backgroundColor: color }}
        className="absolute -inset-1 mx-0.5 block -skew-y-[2deg] -skew-x-12 transition-colors duration-500"
        aria-hidden
      />
      <LinkTo
        style={{ color: backgroundColor }}
        className="relative transition-colors duration-500 "
        href="/emulate"
      >
        {children}
      </LinkTo>
    </span>
    <span className="relative dark:hidden">
      <span
        style={{ backgroundColor }}
        className="absolute -inset-1 mx-0.5 block -skew-y-[1deg] -skew-x-12 transition-colors duration-500"
        aria-hidden
      />
      <LinkTo
        style={{ color }}
        className="relative transition-colors duration-500 "
        href="/emulate"
      >
        {children}
      </LinkTo>
    </span>
  </>
);

export default observer(EmulatorLink);
