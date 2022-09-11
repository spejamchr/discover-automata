import { observer } from 'mobx-react';
import * as React from 'react';
import HistoryStore from '../../../../../utils/CellularAutomata/HistoryStore';
import Reactions from '../../../../../utils/CellularAutomata/HistoryStore/Reactions';
import Generations from '../../../Generations';
import Store from '../../../Store';
import EmulatorReactions from './EmulatorReactions';

interface Props {
  emulatorStore: Store;
}

class History extends React.Component<Props> {
  historyStore = new HistoryStore(this.props.emulatorStore.automata);

  render() {
    return (
      <>
        <Reactions store={this.historyStore} fireImmediately debounceDelay={300} />
        <EmulatorReactions
          store={this.props.emulatorStore}
          historyStore={this.historyStore}
          debounceDelay={300}
        />
        <Generations
          historyStore={this.historyStore}
          colorPicker={this.props.emulatorStore.colorPicker}
        />
      </>
    );
  }
}

export default observer(History);
