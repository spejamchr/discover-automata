import { comparer, IReactionDisposer, IReactionOptions, IReactionPublic, reaction } from 'mobx';
import * as React from 'react';

export interface ReactState {}

export interface RCProps<Store> {
  store: Store;
  fireImmediately?: boolean;
  throttleDelay?: number;
  debounceDelay?: number;
}

export type ReactionComparer<ObservedState> = (
  prev: ObservedState,
  current: ObservedState,
) => boolean;

abstract class ReactionComponent<Store, ObservedState, P extends {} = {}> extends React.Component<
  RCProps<Store> & P,
  ReactState
> {
  protected abstract tester: (r?: IReactionPublic) => ObservedState;
  protected abstract effect: (
    arg: ObservedState,
    prev?: ObservedState,
    r?: IReactionPublic,
  ) => void;

  /**
   * Provides logic that determines if the watched value has changed. The default behavior
   * is to use mobx's default compare, which is a slighty enhanced identity compare.
   */
  protected comparer: ReactionComparer<ObservedState> = comparer.default;

  private running?: IReactionDisposer;

  private get options(): IReactionOptions<ObservedState, boolean> | undefined {
    return {
      fireImmediately: this.props.fireImmediately,
      delay: this.props.throttleDelay,
      equals: this.comparer,
    };
  }

  constructor(props: RCProps<Store> & P) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.running = this.run();
  }

  componentWillUnmount() {
    if (this.running) {
      this.running();
    }
  }

  render() {
    return <></>;
  }

  private debounceEffect(
    effect: (arg: ObservedState, prev?: ObservedState, r?: IReactionPublic) => void,
    debounceMs: number,
  ) {
    let timer: NodeJS.Timeout;
    return (arg: ObservedState, prev?: ObservedState, r?: IReactionPublic) => {
      clearTimeout(timer);
      timer = setTimeout(() => effect(arg, prev, r), debounceMs);
    };
  }

  private run(): IReactionDisposer {
    let effect = this.effect;
    const debounceDelay = this.props.debounceDelay;
    if (debounceDelay) {
      effect = this.debounceEffect(effect, debounceDelay);
    }
    return reaction(this.tester, effect, this.options);
  }
}

export default ReactionComponent;
