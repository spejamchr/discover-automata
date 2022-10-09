import { observer } from 'mobx-react';
import * as React from 'react';
import HistoryStore from '../../../../../utils/CellularAutomata/HistoryStore';
import Reactions from '../../../../../utils/CellularAutomata/HistoryStore/Reactions';
import Generations from '../../../Generations';
import Store from '../../../Store';
import EmulatorReactions from './EmulatorReactions';

interface Props {
  emulatorStore: Store;
  visibleEmulationWidth: number;
  height: number;
}

class History extends React.Component<Props> {
  historyStore = new HistoryStore(this.props.emulatorStore.automata, this.props.height);

  componentDidMount(): void {
    this.historyStore.setVisibleEmulationWidth(this.props.visibleEmulationWidth);
  }

  componentDidUpdate(): void {
    this.historyStore.setVisibleEmulationWidth(this.props.visibleEmulationWidth);
  }

  render() {
    return (
      <>
        <Reactions
          emulatorStore={this.props.emulatorStore}
          store={this.historyStore}
          fireImmediately
          visibleEmulationWidth={this.props.visibleEmulationWidth}
        />
        <EmulatorReactions store={this.props.emulatorStore} />
        <Generations
          historyStore={this.historyStore}
          colorPicker={this.props.emulatorStore.colorPicker}
        />
      </>
    );
  }
}

export default observer(History);
