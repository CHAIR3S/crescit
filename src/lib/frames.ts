/**
 * Secuencia de fotogramas con carga progresiva.
 *
 * Primero se cargan fotogramas muy espaciados (uno de cada 16) para que el
 * scroll funcione casi de inmediato; después se rellenan los huecos. Mientras
 * tanto se dibuja siempre el fotograma cargado más cercano al solicitado.
 */
export class FrameSequence {
  readonly frames: (HTMLImageElement | null)[];
  private aborted = false;
  private queue: number[] = [];
  private active = 0;

  constructor(
    private readonly dir: string,
    readonly count: number,
    private readonly onLoad: (index: number) => void,
    private readonly concurrency = 6,
  ) {
    this.frames = new Array(count).fill(null);
    const seen = new Set<number>();
    for (const stride of [16, 8, 4, 2, 1]) {
      for (let i = 0; i < count; i += stride) {
        if (!seen.has(i)) {
          seen.add(i);
          this.queue.push(i);
        }
      }
    }
    if (!seen.has(count - 1)) this.queue.splice(1, 0, count - 1);
  }

  src(i: number) {
    return `${this.dir}${String(i).padStart(3, "0")}.webp`;
  }

  start() {
    for (let k = 0; k < this.concurrency; k++) this.next();
  }

  private next() {
    if (this.aborted) return;
    const i = this.queue.shift();
    if (i === undefined) return;
    this.active++;
    const img = new Image();
    img.decoding = "async";
    img.src = this.src(i);
    const done = () => {
      this.active--;
      this.next();
    };
    img
      .decode()
      .then(() => {
        if (this.aborted) return;
        this.frames[i] = img;
        this.onLoad(i);
      })
      .catch(() => {})
      .finally(done);
  }

  /** Devuelve el fotograma cargado más cercano a `i`. */
  nearest(i: number): HTMLImageElement | null {
    const n = this.count;
    const t = Math.max(0, Math.min(n - 1, Math.round(i)));
    if (this.frames[t]) return this.frames[t];
    for (let d = 1; d < n; d++) {
      const a = this.frames[t - d];
      if (a) return a;
      const b = this.frames[t + d];
      if (b) return b;
    }
    return null;
  }

  destroy() {
    this.aborted = true;
    this.queue = [];
  }
}
