import { observer } from 'mobx-react';
import { ComparerError } from '../../../utils/Extensions';
import T from '../../../utils/Locales/T';
import { PlainTextKey } from '../../../utils/Locales/Types';
import { ConfigError } from '../../Emulator/Types';
import ErrorMsg from './ErrorMsg';

interface Props {
  error: ConfigError;
}

const comparerErrorMsg = (error: ComparerError): PlainTextKey => {
  switch (error.comparer) {
    case '<':
      return 'Value should be less than:';
    case '<=':
      return 'Value should be less than or equal to:';
    case '>':
      return 'Value should be greater than:';
    case '>=':
      return 'Value should be greater than or equal to:';
    case '===':
      return 'Value should be equal to:';
    case '!==':
      return 'Value must not be equal to:';
  }
};

const ShowError: React.FC<Props> = ({ error }) => {
  switch (error.kind) {
    case 'comparer-error':
      return (
        <ErrorMsg>
          <T kind={comparerErrorMsg(error)} /> {error.target}
        </ErrorMsg>
      );
    case 'overflow-error':
      return (
        <ErrorMsg>
          <T kind="Overflow Error: please use smaller numbers" />
        </ErrorMsg>
      );
    case 'number-parse-failure':
      return (
        <ErrorMsg>
          <T kind="Value must be a number" />
        </ErrorMsg>
      );
    case 'string-too-long-error':
      return (
        <ErrorMsg>
          <T kind="Value is too long to parse; character length must be less [...]" /> {error.max}
        </ErrorMsg>
      );
  }
};

export default observer(ShowError);
