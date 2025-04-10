import { Container, Graphics, Ticker, Text } from "pixi.js";
import { drawDot } from "../functions";

export class Layout {
  public container = new Container();
  public bg = new Graphics();
  public ticker = new Ticker();
  public text = new Text();

  public A = { x: 0, y: 600 };
  public B = { x: 300, y: 0 };
  public C = { x: 600, y: 600 };

  public start = this.A;

  public maximumDots = 10000;
  public currentDots = 0;
  public started = false;

  init() {
    this.container.position.set(100, 30);
    this.drawInitialDots();
    this.drawText();

    this.currentDots = 0;
    this.start = this.A;

    this.ticker.add(this.tick, this);
  }

  private tick() {
    if (this.currentDots >= this.maximumDots) {
      this.ticker.stop();
      this.ticker.remove(this.tick, this);
      return;
    }

    const nextPoint = this.defineNewPoint();

    if (nextPoint) {
      this.drawNewPoint(this.start, nextPoint);
    }
    
    this.currentDots++;
  }

  drawInitialDots() {
    drawDot(this.container, this.A);
    drawDot(this.container, this.B);
    drawDot(this.container, this.C);
  }

  drawText() {
    this.text = new Text({
      text: `START`,
      style: {
        fontSize: 48,
        fill: "white",
      },
    });

    this.text.position.set(300, 680);
    this.text.anchor.set(0.5, 0.5);
    this.container.addChild(this.text);
    this.text.interactive = true;
    this.text.cursor = "pointer";
    this.text.resolution = 2;

    this.text.on("pointerdown", () => {
      this.started = !this.started;
      if (this.started) {
        this.ticker.start();
        this.text.text = `RESET`;
      } else {
        this.destroy();
        this.init();
        this.text.text = `START`;
      }
    });
  }

  defineNewPoint() {
    const randomNumber = Math.floor(Math.random() * 3) + 1;

    if (randomNumber === 1) {
      return this.A;
    } else if (randomNumber === 2) {
      return this.B;
    } else if (randomNumber === 3) {
      return this.C;
    }
  }

  drawNewPoint(
    startPoint: { x: number; y: number },
    endPoint: { x: number; y: number }
  ) {
    const x = (startPoint.x + endPoint.x) / 2;
    const y = (startPoint.y + endPoint.y) / 2;

    this.start = { x, y };
    drawDot(this.container, this.start);
  }

  destroy() {
    this.ticker.stop();
    this.ticker.remove(this.tick, this);
    this.container.removeChildren();
  }
}
