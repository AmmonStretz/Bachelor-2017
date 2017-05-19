import { Node } from './node';
import { Route } from './route';

export class BoundingBox {

  public static bboxSize = 0.02;

  public boxNodes: Node[];
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

  constructor(...nds: Node[]) {
    this.boxNodes = [];
    nds.forEach(node => {
      this.boxNodes.push(node);
    });
    this.routes = [];
    this.nodes = [];
  }
  public toString(): string {
    if (this.boxNodes.length > 2) {
      let s: string = '(poly:"';
      this.boxNodes.forEach(node => {
        s += ' ' + node.lat + ' ' + node.lon;
      });
      return s + '");';
    }
    return '(' + this.boxNodes[1].lat + ',' +
      this.boxNodes[1].lon + ',' +
      this.boxNodes[0].lat + ',' +
      this.boxNodes[0].lon + ');';
  }
}