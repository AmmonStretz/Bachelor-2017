import { Node } from './node';
import { Route } from './route';

export class BoundingBox {

  public static bboxSize = 0.02;

  public northEast: Node;
  public southWest: Node;

  public routes: Route[];

  public static getBoundigBoxFromCoord(x: number, y: number): BoundingBox {
    return new BoundingBox(
      new Node(null, (x + 1) * this.bboxSize, (y + 1) * this.bboxSize),
      new Node(null, x * this.bboxSize, y * this.bboxSize)
    );
  }

  constructor(northEast: Node, southWest: Node) {
    this.northEast = northEast;
    this.southWest = southWest;
    this.routes = [];
  }
  public toString(): string {
    return '(' + this.southWest.lat + ',' +
      this.southWest.lon + ',' +
      this.northEast.lat + ',' +
      this.northEast.lon + ');';
  }
}