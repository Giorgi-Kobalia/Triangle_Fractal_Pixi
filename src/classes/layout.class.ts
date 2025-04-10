import { Container, Graphics, Ticker, Text } from "pixi.js";
import { drawDot } from "../functions";

export class Layout {
  public container = new Container();
  public bg = new Graphics();
  public ticker = new Ticker();
  public btn = new Text();
  public amount = new Text();

  public A = { x: 0, y: 600 };
  public B = { x: 300, y: 0 };
  public C = { x: 600, y: 600 };

  public start = this.A;

  public maximumDots = 20000;
  public currentDots = 0;
  public started = false;

  init() {
    this.currentDots = 0;
    this.start = this.A;
    this.container.position.set(100, 30);

    this.drawInitialDots();
    this.drawText();
    this.drawAmount();


    this.ticker.add(this.tick, this);
  }

  private tick() {
    if (this.currentDots >= this.maximumDots) {
      this.ticker.stop();
      this.ticker.remove(this.tick, this);
      return;
    }

    const nextPoint = this.defineNewPoint();

    this.currentDots++;

    if (nextPoint) {
      this.drawNewPoint(this.start, nextPoint);
      this.updateAmount();
    }
  }

  drawInitialDots() {
    drawDot(this.container, this.A);
    drawDot(this.container, this.B);
    drawDot(this.container, this.C);
  }

  drawText() {
    this.btn = new Text({
      text: `START`,
      style: {
        fontSize: 48,
        fill: "gold",
      },
    });

    this.btn.position.set(300, 680);
    this.btn.anchor.set(0.5, 0.5);
    this.container.addChild(this.btn);
    this.btn.interactive = true;
    this.btn.cursor = "pointer";
    this.btn.resolution = 2;

    this.btn.on("pointerdown", () => {
      this.started = !this.started;
      if (this.started) {
        this.ticker.start();
        this.btn.text = `RESET`;
      } else {
        this.destroy();
        this.init();
        this.btn.text = `START`;
      }
    });
  }

  drawAmount() {
    this.amount = new Text({
      text: `${this.currentDots}/${this.maximumDots}`,
      style: {
        fontSize: 30,
        fill: "gold",
      },
    });

    this.amount.position.set(300, 730);
    this.amount.anchor.set(0.5, 0.5);
    this.container.addChild(this.amount);
    this.amount.resolution = 2;
  }

  updateAmount() {
    this.amount.text = `${this.currentDots}/${this.maximumDots}`;
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
