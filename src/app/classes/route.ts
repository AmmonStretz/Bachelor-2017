import { Node } from './node';

export class Route {

  public startNode: Node;

  public routeNodes: Node[];

  public endNode: Node;

  constructor(startNode: Node, endNode: Node) {
    this.startNode = startNode;
    this.endNode = endNode;
    this.routeNodes = [];
  }



}