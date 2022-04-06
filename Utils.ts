/// <reference lib="dom"/>

export default class Utils {
  static addChangeListener(
    selector: string,
    callback: (a: HTMLInputElement) => void,
  ): void {
    document.querySelector<HTMLInputElement>(selector)!.addEventListener(
      "change",
      function (ev: Event) {
        callback(ev.target as HTMLInputElement);
      },
    );
  }
  static canvasContext(selector: string): CanvasRenderingContext2D {
    return document.querySelector<HTMLCanvasElement>(selector)!.getContext(
      "2d",
    )!;
  }
}
