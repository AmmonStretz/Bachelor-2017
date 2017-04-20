import { Node } from './node';
import { Route } from './route';

export class BoundingBox {

  public static bboxSize = 0.02;

  public northEast: Node;
  public southWest: Node;

  public routes: Route[];
  public nodes: Node[];

  public static generateFromCoord(x: number, y: number): BoundingBox {
    return new BoundingBox(
      new Node((x + 1) * this.bboxSize, (y + 1) * this.bboxSize),
      new Node(x * this.bboxSize, y * this.bboxSize)
    );
  }
  public static generateFromNode(center: Node, size: number): BoundingBox {
    return new BoundingBox(
      new Node(center.lon + 0.5 * size, center.lat + 0.5 * size),
      new Node(center.lon - 0.5 * size, center.lat - 0.5 * size)
    );
  }

  constructor(northEast: Node, southWest: Node) {
    this.northEast = northEast;
    this.southWest = southWest;
    this.routes = [];
    this.nodes = [];
  }
  public toString(): string {
    return '(' + this.southWest.lat + ',' +
      this.southWest.lon + ',' +
      this.northEast.lat + ',' +
      this.northEast.lon + ');';
  }
}