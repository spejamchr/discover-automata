import { observer } from 'mobx-react-lite';
import T from '../../../../utils/Locales/T';
import Store from '../../Store';

interface Props {
  store: Store;
}

const ColorPicker: React.FC<Props> = ({ store }) => {
  return (
    <span className="mb-2 flex w-full items-center justify-between px-1">
      <span className="mr-2">
        <T kind="Hue" />
      </span>
      <input
        className="grow"
        type="range"
        max={359}
        min={0}
        step={1}
        value={store.startingHue}
        onChange={(e) => store.setStartingHue(Number(e.target.value))}
      />
    </span>
  );
};

export default observer(ColorPicker);
