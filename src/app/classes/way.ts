import {
  Geolocation, Map, View, Tile, layer,
  source, control, interaction, geom, proj, format, style, Feature, Coordinate
} from 'openlayers';

import { Node } from './node';
import { Constants } from './constants';

export class Way {

  public tags: Object[];
  public id: number;

  constructor(id?: number, tags?: Object[]) {
    this.tags = tags || [];
    this.id = id || null;
  }
}