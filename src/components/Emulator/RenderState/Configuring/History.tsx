import { observer } from 'mobx-react';
import * as React from 'react';
import HistoryStore from '../../../../utils/CellularAutomata/HistoryStore';
import Reactions from '../../../../utils/CellularAutomata/HistoryStore/Reactions';
import { Automata } from '../../../../utils/CellularAutomata/Types';
import { makeColorPicker } from '../../../../utils/ColorPicker';
import Generations from '../../Generations';

interface Props {
  automata: Automata;
}

class History extends React.Component<Props> {
  historyStore = new HistoryStore(this.props.automata);

  componentDidMount() {
    this.historyStore.working();
  }

  render() {
    return (
      <div>
        <Reactions store={this.historyStore} debounceDelay={300} />
        <Generations
          historyStore={this.historyStore}
          colorPicker={makeColorPicker(this.historyStore.automata)}
        />
      </div>
    );
  }
}

export default observer(History);
