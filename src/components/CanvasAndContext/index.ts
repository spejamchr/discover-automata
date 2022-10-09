import { fromNullable, Maybe } from 'maybeasy';

export interface CanvasAndContext {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
}

const setCanvasScaling =
  (height: number, width: number) =>
  (canvas: HTMLCanvasElement): void => {
    canvas.height = height * window.devicePixelRatio;
    canvas.style.height = `${height}px`;

    canvas.width = width * window.devicePixelRatio;
    canvas.style.width = `${width}px`;
  };

export const canvasAndContext = (
  ref: React.RefObject<HTMLCanvasElement>,
  height: number,
  width: number,
): Maybe<CanvasAndContext> =>
  fromNullable(ref.current)
    .do(setCanvasScaling(height, width))
    .map((canvas) => ({ canvas }))
    .assign('context', ({ canvas }) => fromNullable(canvas.getContext('2d')))
    .do(({ context }) => context.scale(window.devicePixelRatio, window.devicePixelRatio));
