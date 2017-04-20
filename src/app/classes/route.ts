import {
  Geolocation, Map, View, Tile, layer,
  source, control, interaction, geom, proj, format, style, Feature, Coordinate
} from 'openlayers';
import { Node } from './node';
import { Constants } from './constants';

export class Route {

  public routeNodes: Node[];
  public tags: Object[];
  public id: number;

  constructor(id?: number, tags?: Object[]) {
    this.routeNodes = [];
    this.tags = tags || [];
    this.id = id || null;
  }

  public addNode(node: Node) {
    this.routeNodes.push(node);
  }

  public generateLayer(): layer.Vector {
    let coords = [];
    this.routeNodes.forEach(node => {
      coords.push(proj.fromLonLat([node.lon, node.lat]));
    });
    return new layer.Vector({
      source: new source.Vector({
        features: [
          new Feature({
            geometry:  new geom.LineString(coords)
          })]
      }), style: Constants.pointStyle
    });
  }
}