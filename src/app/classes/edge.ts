import { Node } from './node';
import { Way } from './way';

export class Edge {
  public node: Node;
  public way: Way;
  public length: number;

  constructor(node: Node, way: Way) {
    this.way = way;
    this.node = node;
  }
}