import {
  Geolocation, Map, View, Tile, layer,
  source, control, interaction, geom, proj, format, style, Feature, Coordinate
} from 'openlayers';

import { Node } from './node';
import { Constants } from './constants';

export class Way {

  public nodes: Node[];
  public tags: Object[];
  public id: number;

  constructor(id?: number, tags?: Object[]) {
    this.nodes = [];
    this.tags = tags || [];
    this.id = id || null;
  }

  public addNode(node: Node) {
    this.nodes.push(node);
  }

}