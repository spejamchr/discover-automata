import { observer } from 'mobx-react';

interface Props {
  low: number | bigint | string;
  high: number | bigint | string;
}

const Ranged: React.FC<Props> = ({ low, high }) =>
  low === high ? (
    <>{low}</>
  ) : (
    <>
      {low} - {high}
    </>
  );

export default observer(Ranged);
