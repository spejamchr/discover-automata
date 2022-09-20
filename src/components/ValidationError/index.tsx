import { always } from '@kofno/piper';
import { observer } from 'mobx-react';
import { ConfigResult } from '../Emulator/Types';
import ShowError from './ShowError';

interface Props {
  errorable: ConfigResult<unknown>;
}

const ValidationError: React.FC<Props> = ({ errorable }) =>
  errorable.cata({
    Ok: always(<div className={`text-sm`}>&#8203;</div>),
    Err: (error) => <ShowError error={error} />,
  });

export default observer(ValidationError);
