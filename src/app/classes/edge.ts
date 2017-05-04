import { Node } from './node';
import { Way } from './way';

export class Edge {
  public node: Node;
  public way: Way;

  constructor(node: Node, way: Way) {
    this.way = way;
    this.node = node;
  }
}