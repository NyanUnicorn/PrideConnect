interface DrawPlayer {
  (
    context: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    playerImageId: number,
    dir: string,
    currentFrame: number,
    x: number,
    y: number,
    width: number,
    height: number
  ): void;
}

interface DrawTextAbovePlayer {
  (
    context: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    fontSize: string,
    fontFace: string,
    fontColor: string
  ): void;
}
