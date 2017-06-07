import { Node } from './node';
import { Route } from './route';

export class BoundingBox {

  public boxNodes: Node[];

  public static generateFromNode(center: Node, size: number): BoundingBox {
    return new BoundingBox(
      new Node(center.lon + 0.5 * size, center.lat + 0.5 * size),
      new Node(center.lon - 0.5 * size, center.lat - 0.5 * size)
    );
  }

  public static generateBBoxes(s: Node, g: Node, stepSize = 0.01): BoundingBox[] {
    const boxes: BoundingBox[] = [];
    const v = g.sub(s).mul(stepSize / s.getDistToPoint(g));
    let a = new Node(s.lon - v.lat - v.lon * 1.5, s.lat + v.lon - v.lat * 1.5);
    let d = new Node(s.lon + v.lat - v.lon * 1.5, s.lat - v.lon - v.lat * 1.5);
    let b = a.add(v);
    let c = d.add(v);
    boxes.push(new BoundingBox(a, b, c, d));
    for (let j = 0; j * stepSize < s.getDistToPoint(g) + 0.5 * stepSize; j++) {
      a = b;
      d = c;
      b = b.add(v);
      c = c.add(v);
      boxes.push(new BoundingBox(a, b, c, d));
    }
    return boxes;
  }

  constructor(...boxNodes: Node[]) {
    this.boxNodes = boxNodes;
  }

  public toString(): string {
    if (this.boxNodes.length > 2) {
      let s: string = '(poly:"';
      this.boxNodes.forEach(node => { s += ' ' + node.lat + ' ' + node.lon; });
      return s + '");';
    }
    return '(' + this.boxNodes[1].lat + ',' +
      this.boxNodes[1].lon + ',' +
      this.boxNodes[0].lat + ',' +
      this.boxNodes[0].lon + ');';
  }
}