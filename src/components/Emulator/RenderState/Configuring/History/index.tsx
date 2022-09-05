import { observer } from 'mobx-react';
import * as React from 'react';
import HistoryStore from '../../../../../utils/CellularAutomata/HistoryStore';
import Reactions from '../../../../../utils/CellularAutomata/HistoryStore/Reactions';
import { makeColorPicker } from '../../../../../utils/ColorPicker';
import Generations from '../../../Generations';
import Store from '../../../Store';
import EmulatorReactions from './EmulatorReactions';

interface Props {
  emulatorStore: Store;
}

class History extends React.Component<Props> {
  historyStore = new HistoryStore(this.props.emulatorStore.automata);

  componentDidMount() {
    this.historyStore.working(this.props.emulatorStore.automata);
  }

  render() {
    return (
      <>
        <Reactions store={this.historyStore} debounceDelay={300} />
        <EmulatorReactions
          store={this.props.emulatorStore}
          historyStore={this.historyStore}
          debounceDelay={300}
        />
        <Generations
          historyStore={this.historyStore}
          colorPicker={makeColorPicker(this.historyStore.automata)}
        />
      </>
    );
  }
}

export default observer(History);
